'use strict';
/* Bitewise server — zero dependencies (Node 18+).
   - serves the web app from ./public
   - POST /api/ai        → Gemini multimodal AI; key stays on the server
   - POST /api/estimate  → Open Food Facts + Gemini + optional Google Search grounding
   - GET  /api/barcode/:code → Open Food Facts product lookup
   - GET  /api/health    → which integrations are configured
   Images/prompts are never written to disk or logged.
*/
const http = require('http'), fs = require('fs'), path = require('path');
const env = process.env;
const PORT = +env.PORT || 3000;
const KEY = env.GEMINI_API_KEY || '';
const GBASE = (env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
const OFF = (env.OFF_BASE_URL || 'https://world.openfoodfacts.org').replace(/\/$/, '');
const MODEL = {
  default: env.MODEL_VISION || 'gemini-2.5-flash-lite',
  quick: env.MODEL_FAST || 'gemini-2.5-flash-lite'
};
const ORIGINS = (env.ALLOWED_ORIGINS || 'capacitor://localhost,https://localhost,http://localhost').split(',').map(s => s.trim()).filter(Boolean);
// Conservative per-IP protection for a small 20–30 person test. Gemini free-tier quotas are project-wide.
const DAILY = +env.AI_LIMIT_PER_IP_PER_DAY || 15, BURST = +env.AI_LIMIT_PER_IP_PER_MIN || 3;
const UA = 'BitewiseApp/1.0 (' + (env.CONTACT_EMAIL || 'contact-not-set') + ')';
const PUB = path.join(__dirname, 'public');
const MAX_BODY = 8 * 1024 * 1024;

/* ---------- helpers ---------- */
const buckets = new Map();
setInterval(() => { const t = Date.now(); for (const [k, v] of buckets) if (t - v.day > 864e5) buckets.delete(k); }, 36e5).unref();
function limited(ip) {
  const t = Date.now(); let b = buckets.get(ip);
  if (!b || t - b.day > 864e5) b = { day: t, n: 0, recent: [] };
  b.recent = b.recent.filter(x => t - x < 6e4);
  if (b.n >= DAILY || b.recent.length >= BURST) { buckets.set(ip, b); return true; }
  b.n++; b.recent.push(t); buckets.set(ip, b); return false;
}
const ipOf = req => (env.TRUST_PROXY !== '0' && (req.headers['x-forwarded-for'] || '').split(',')[0].trim()) || req.socket.remoteAddress || 'unknown';
function readBody(req) {
  return new Promise((res, rej) => {
    let n = 0; const ch = [];
    req.on('data', c => { n += c.length; if (n > MAX_BODY) { rej({ status: 413, error: 'Image too large' }); req.destroy(); } else ch.push(c); });
    req.on('end', () => { try { res(JSON.parse(Buffer.concat(ch).toString('utf8') || '{}')); } catch (e) { rej({ status: 400, error: 'Invalid JSON' }); } });
    req.on('error', () => rej({ status: 400, error: 'Bad request' }));
  });
}
function baseHeaders(req) {
  const h = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(self), microphone=(self), geolocation=()',
  };
  const o = req.headers.origin;
  if (o && (ORIGINS.includes(o) || o === 'http://' + req.headers.host || o === 'https://' + req.headers.host)) {
    h['Access-Control-Allow-Origin'] = o; h['Vary'] = 'Origin';
    h['Access-Control-Allow-Headers'] = 'Content-Type'; h['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS';
  }
  return h;
}
function send(req, res, status, obj, extra = {}) {
  const body = typeof obj === 'string' ? obj : JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...baseHeaders(req), ...extra });
  res.end(body);
}
function extractJson(text) {
  text = String(text || '').replace(/```json|```/g, '').trim();
  try { return JSON.parse(text); } catch (e) { }
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(text.slice(a, b + 1)); } catch (e) { } }
  const aa = text.indexOf('['), bb = text.lastIndexOf(']');
  if (aa >= 0 && bb > aa) { try { return JSON.parse(text.slice(aa, bb + 1)); } catch (e) { } }
  throw { status: 502, error: 'The AI reply could not be read. Please try again.' };
}
const num = v => { v = +v; return isFinite(v) ? v : 0; };
async function timedFetch(url, opts = {}, ms = 8000) {
  const c = new AbortController(), t = setTimeout(() => c.abort(), ms);
  try { return await fetch(url, { ...opts, signal: c.signal, headers: { 'User-Agent': UA, ...(opts.headers || {}) } }); }
  finally { clearTimeout(t); }
}

/* ---------- Gemini ---------- */
async function geminiJson({ prompt, image, tier, webSearch = false }) {
  if (!KEY) throw { status: 503, error: 'AI is not configured on this server yet (missing GEMINI_API_KEY).' };
  const parts = [];
  if (image) parts.push({ inlineData: { mimeType: image.media_type, data: image.data } });
  parts.push({ text: prompt + '\n\nRespond with one JSON object and nothing else.' });
  const model = MODEL[tier] || MODEL.default;
  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2500,
      responseMimeType: 'application/json'
    }
  };
  // Google Search is enabled only for custom-food estimates, where fresh nutrition/product
  // information can help. Gemini 2.5 Flash-Lite supports this tool.
  if (webSearch) body.tools = [{ google_search: {} }];
  let r;
  try {
    r = await timedFetch(`${GBASE}/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY },
      body: JSON.stringify(body),
    }, 75000);
  } catch (e) { throw { status: 504, error: 'The AI service timed out. Please try again.' }; }
  let j = {};
  try { j = await r.json(); } catch (e) {}
  if (!r.ok) {
    const msg = String(j?.error?.message || '');
    console.error('gemini error', r.status, msg.slice(0, 180));
    if (r.status === 429) throw { status: 429, error: 'The AI free-tier limit is busy. Please try again later.' };
    if (r.status === 401 || r.status === 403) throw { status: 502, error: 'The Gemini API key is invalid or does not have Gemini API access.' };
    throw { status: 502, error: 'The Gemini AI service returned an error.' };
  }
  const text = (j.candidates || []).flatMap(c => c.content?.parts || []).filter(p => typeof p.text === 'string').map(p => p.text).join('');
  if (!text) throw { status: 502, error: 'Gemini returned no usable answer. Please try again.' };
  const data = extractJson(text);
  const gm = j.candidates?.[0]?.groundingMetadata || null;
  return { data, grounding: gm };
}
function groundingRefs(gm) {
  const chunks = Array.isArray(gm?.groundingChunks) ? gm.groundingChunks : [];
  return chunks.map(c => c?.web).filter(x => x?.uri || x?.title).slice(0, 6).map(x => ({ name: x.title || x.uri, source: 'Google Search', url: x.uri || '' }));
}

/* ---------- nutrition references ---------- */
const OFF_FIELDS = 'code,product_name,brands,nutriments,serving_quantity,ingredients_text';
function offNorm(p) {
  const n = p.nutriments || {};
  return {
    kcal: n['energy-kcal_100g'] ?? (n.energy_100g ? n.energy_100g / 4.184 : 0),
    p: n.proteins_100g, c: n.carbohydrates_100g, f: n.fat_100g,
    fib: n.fiber_100g, sug: n.sugars_100g, na: (n.sodium_100g ?? (n.salt_100g ? n.salt_100g / 2.5 : 0)) * 1000,
  };
}
const round1 = v => Math.round(num(v) * 10) / 10;
async function offSearch(q) {
  try {
    const r = await timedFetch(`${OFF}/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=6&fields=${OFF_FIELDS}`, {}, 7000);
    if (!r.ok) return [];
    const j = await r.json();
    return (j.products || []).filter(p => p.product_name && p.nutriments && (p.nutriments['energy-kcal_100g'] != null || p.nutriments.energy_100g != null)).slice(0, 4)
      .map(p => ({ source: 'Open Food Facts', name: ((p.brands || '').split(',')[0] + ' ' + p.product_name).trim(), per100: Object.fromEntries(Object.entries(offNorm(p)).map(([k, v]) => [k, round1(v)])) }));
  } catch (e) { return []; }
}

/* ---------- routes ---------- */
async function api(req, res, url) {
  const p = url.pathname;
  if (req.method === 'OPTIONS') { res.writeHead(204, baseHeaders(req)); return res.end(); }
  if (p === '/api/health' && req.method === 'GET') {
    return send(req, res, 200, { ok: true, ai: !!KEY, provider: 'Gemini', model: MODEL.default, off: true, webSearch: !!KEY });
  }

  if (p.startsWith('/api/barcode/') && req.method === 'GET') {
    const code = decodeURIComponent(p.slice(13));
    if (!/^\d{6,14}$/.test(code)) return send(req, res, 400, { error: 'Invalid barcode' });
    let r;
    try { r = await timedFetch(`${OFF}/api/v2/product/${code}.json?fields=${OFF_FIELDS}`, {}, 8000); }
    catch (e) { return send(req, res, 502, { error: 'Product database unreachable' }); }
    if (r.status === 404) return send(req, res, 200, { found: false });
    if (!r.ok) return send(req, res, 502, { error: 'Product database error' });
    const j = await r.json();
    if (j.status !== 1 || !j.product) return send(req, res, 200, { found: false });
    const pr = j.product;
    return send(req, res, 200, {
      found: true, barcode: code, name: ((pr.brands || '').split(',')[0] + ' ' + (pr.product_name || '')).trim() || 'Product ' + code,
      per100: Object.fromEntries(Object.entries(offNorm(pr)).map(([k, v]) => [k, round1(v)])),
      serving: num(pr.serving_quantity) || null, ing: pr.ingredients_text || '',
    }, { 'Cache-Control': 'public, max-age=86400' });
  }

  if (req.method !== 'POST') return send(req, res, 404, { error: 'Not found' });
  if (p !== '/api/ai' && p !== '/api/estimate') return send(req, res, 404, { error: 'Not found' });
  if (limited(ipOf(req))) return send(req, res, 429, { error: 'Bitewise AI test limit reached for this IP. Please try again later.' });
  const body = await readBody(req);

  if (p === '/api/ai') {
    if (typeof body.prompt !== 'string' || !body.prompt.trim() || body.prompt.length > 60000) return send(req, res, 400, { error: 'Invalid prompt' });
    let image = null;
    if (body.image) {
      const im = body.image;
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(im.media_type) || typeof im.data !== 'string' || im.data.length > 7.2e6) return send(req, res, 413, { error: 'Unsupported or too large image' });
      image = { media_type: im.media_type, data: im.data };
    }
    const result = await geminiJson({ prompt: body.prompt, image, tier: body.tier === 'quick' ? 'quick' : 'default' });
    return send(req, res, 200, { data: result.data });
  }

  /* /api/estimate — grounded in Open Food Facts + Google Search when available. */
  const text = String(body.text || '').trim().slice(0, 200);
  if (!text) return send(req, res, 400, { error: 'Describe the food first' });
  const q = text.replace(/\d+(\.\d+)?\s*(kg|g|gm|gms|grams?|ml|oz|cups?|katori|katoris|pieces?|pcs|tbsp|tsp)?/gi, ' ').replace(/\b(homemade|home made|of|with|and)\b/gi, ' ').replace(/\s+/g, ' ').trim() || text;
  const refs = await offSearch(q);
  const refText = refs.length ? refs.map((r, i) => `[${i}] ${r.name} — ${r.source} (per 100 g): ` + Object.entries(r.per100).map(([k, v]) => k + '=' + v).join(', ')).join('\n') : '(no matching Open Food Facts records were found)';
  const result = await geminiJson({
    tier: 'quick', webSearch: true,
    prompt: `You are Bitewise, a nutrition assistant for Indian food. Estimate the nutrition of: "${text.replace(/"/g, "'")}".
If a weight or volume is given, use it; otherwise assume one typical serving. Assume home-style Indian preparation unless a restaurant or packaged item is stated.
Use the real Open Food Facts records below when they truly match. You may use Google Search grounding to find current/reliable nutrition or product-label information. Prefer Indian government, manufacturer, or reputable nutrition sources when available. Do not pretend a search result is an exact match when it is not.
${refText}
Reply ONLY with JSON: {"name":string,"grams":number,"veg":"V"|"E"|"N","values":{"kcal":number,"p":number,"c":number,"f":number,"fib":number,"sug":number,"na":number},"micros":{"fe":number,"ca":number,"vA":number,"b12":number,"vC":number,"vD":number,"fol":number,"mg":number,"k":number,"zn":number},"basis":string,"confidence":"high"|"medium"|"low","usedRefs":number[]}
All values are for the whole stated serving; sodium and minerals in mg, vitamin A/B12/D/folate in µg, vitamin C in mg. The user will review and confirm before logging.`
  });
  const used = (Array.isArray(result.data.usedRefs) ? result.data.usedRefs : []).map(i => refs[i]).filter(Boolean).map(r => ({ name: r.name, source: r.source }));
  delete result.data.usedRefs;
  const webRefs = groundingRefs(result.grounding);
  return send(req, res, 200, { data: result.data, refs: [...used, ...webRefs] });
}

/* ---------- static ---------- */
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2' };
function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel.includes('\0')) { res.writeHead(400); return res.end(); }
  let file = path.normalize(path.join(PUB, rel));
  if (!file.startsWith(PUB)) { res.writeHead(403); return res.end(); }
  if (rel.endsWith('/') || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    if (path.extname(rel)) { res.writeHead(404, baseHeaders(req)); return res.end('Not found'); }
    file = path.join(PUB, 'index.html');
  }
  const ext = path.extname(file), noCache = ['.html', '.webmanifest'].includes(ext) || file.endsWith('sw.js') || file.endsWith('config.js');
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': noCache ? 'no-cache' : 'public, max-age=604800', ...baseHeaders(req), ...(file.endsWith('sw.js') ? { 'Service-Worker-Allowed': '/' } : {}) });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    return serveStatic(req, res, url);
  } catch (e) {
    if (e && e.status) return send(req, res, e.status, { error: e.error || 'Error' });
    console.error('server error', e && e.message);
    send(req, res, 500, { error: 'Something went wrong on the server.' });
  }
});
server.listen(PORT, '0.0.0.0', () => console.log(`Bitewise running on http://localhost:${PORT}  (AI: ${KEY ? 'configured' : 'NOT configured'}, model: ${MODEL.default})`));
