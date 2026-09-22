'use strict';
/* ============ FOOD ART (illustrations, not photos) ============ */
const hsh=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h};
function shade(hex,a){const n=parseInt(hex,16);const f=x=>Math.max(0,Math.min(255,Math.round(a<0?x*(1+a):x+(255-x)*a)));return'#'+[n>>16,(n>>8)&255,n&255].map(f).map(x=>x.toString(16).padStart(2,'0')).join('')}
const DISCS=new Set(['dosa','mdosa','rdosa','utta','appam','pesar','besanc','moongc','omlet','momlet','pizzav','pizzan','lachha','paratha','alup','panp','gobp','moolip','methip','roti','tand','missi','rumali','bajra','jowar','makki','naan','bnaan','gnaan','puri','bhat','dhokla','idli','papad','alutikki']);
const BREADS=new Set(['wbread','bbread','mgbread','pav','bun','rusk','vsand','csand','esand','brbutter','bbbutter','brpb','bbpb','brjam','brom']);
function shapeOf(f){const c=f.cat,i=f.id;if(c==='bev')return'glass';if(c==='fru')return'fruit';if(['egg','eggw','fegg'].includes(i))return'egg';if(BREADS.has(i))return'bread';if(DISCS.has(i))return'disc';
 if(c==='pkg')return'pack';if(c==='ric'||['poha','upma','sevai','oats','cflakes','chocos','muesli','sprts','sprch'].includes(i))return'mound';if(c==='thl'||f.parts)return'plate';
 if(['snk','str','swt','nut','fat','rst','chn'].includes(c)&&!['vmanch','tsoup','scsoup','pastaw','pastar','chowv','chowc','vfried','cfried','bhaji','ghee','jam','oil','sugar'].includes(i))return'piece';return'bowl'}
function art(f,sz=44){if(!f)return'';const col=f.col||'B0B4C8',s=hsh(f.id),sh=shapeOf(f),c='#'+col,dk=shade(col,-.22),lt=shade(col,.35);let g='';
 const rim='<circle cx="30" cy="30" r="28" fill="var(--steel1)" stroke="var(--steel2)" stroke-width="1.6"/>';
 const dots=(n,fill,r=1.7,R=13)=>Array.from({length:n},(_,k)=>{const a=((s>>k)%360)*Math.PI/180+k*2.4,d=R*(.35+((s>>(k+3))%10)/16);return`<circle cx="${30+Math.cos(a)*d}" cy="${30+Math.sin(a)*d}" r="${r}" fill="${fill}"/>`}).join('');
 if(sh==='bowl')g=rim+`<circle cx="30" cy="30" r="21" fill="${c}"/><path d="M14 26 Q30 12 46 26" stroke="${lt}" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>${dots(4,dk,2.2)}${dots(3,'#4f9a4b',1.5,12)}<circle cx="30" cy="30" r="21" fill="none" stroke="${dk}" stroke-width="1" opacity=".5"/>`;
 else if(sh==='disc')g=`<circle cx="30" cy="31" r="25" fill="${dk}" opacity=".35"/><circle cx="30" cy="30" r="25" fill="${c}"/><circle cx="30" cy="30" r="25" fill="none" stroke="${dk}" stroke-width="1.5"/>${dots(6,dk,2.4,18)}${dots(3,lt,1.8,15)}`;
 else if(sh==='mound')g=rim+`<ellipse cx="30" cy="34" rx="20" ry="9" fill="${dk}" opacity=".3"/><path d="M11 34 Q14 14 30 13 Q46 14 49 34 Q30 40 11 34Z" fill="${c}"/>${dots(9,lt,1.3,14)}${dots(3,dk,1.2,12)}`;
 else if(sh==='glass')g=`<path d="M17 8 H43 L40 52 Q40 55 37 55 H23 Q20 55 20 52Z" fill="var(--surf)" stroke="var(--steel2)" stroke-width="1.6"/><path d="M19 22 H41 L39.6 51 Q39.4 53.5 37 53.5 H23 Q20.6 53.5 20.4 51Z" fill="${c}"/><path d="M19 22 H41" stroke="${lt}" stroke-width="3"/><path d="M38 4 L33 26" stroke="#d9d9e6" stroke-width="2" stroke-linecap="round" opacity=".8"/>`;
 else if(sh==='fruit')g=`<circle cx="30" cy="33" r="21" fill="${c}"/><circle cx="24" cy="26" r="6" fill="${lt}" opacity=".5"/><path d="M30 13 Q30 7 34 5" stroke="#4d7a34" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M31 11 Q40 5 45 11 Q38 15 31 11Z" fill="#5c9a3c"/>`;
 else if(sh==='egg')g=rim+`<ellipse cx="30" cy="30" rx="18" ry="21" fill="#fbf8ef" stroke="#e4dcc6" stroke-width="1.2"/><circle cx="30" cy="31" r="8" fill="#f4b73a"/><circle cx="27.5" cy="28.5" r="2.2" fill="#fbd777"/>`;
 else if(sh==='bread')g=`<rect x="8" y="10" width="44" height="42" rx="10" fill="${c}"/><rect x="13" y="15" width="34" height="32" rx="7" fill="${lt}" opacity=".7"/>${dots(4,dk,1.2,10)}`;
 else if(sh==='pack')g=`<path d="M12 8 H48 L46 54 H14Z" fill="${c}"/><path d="M12 8 H48 L47.7 13 H12.3Z" fill="${dk}"/><path d="M13.6 47 H46.4 L46 54 H14Z" fill="${dk}"/><circle cx="30" cy="30" r="9" fill="${lt}" opacity=".9"/><path d="M25 30 h10 M30 25 v10" stroke="${dk}" stroke-width="2" opacity=".6"/>`;
 else if(sh==='plate')g=rim+`<circle cx="30" cy="30" r="21" fill="none" stroke="var(--steel2)" stroke-width="1"/><circle cx="20" cy="22" r="7" fill="${c}"/><circle cx="41" cy="22" r="7" fill="${dk}"/><circle cx="30" cy="41" r="8" fill="${lt}"/><circle cx="43" cy="39" r="4" fill="#e9d9a8"/>`;
 else g=`<path d="M8 44 Q10 14 30 12 Q50 14 52 44 Q30 52 8 44Z" fill="${c}"/><path d="M8 44 Q10 14 30 12 Q50 14 52 44 Q30 52 8 44Z" fill="none" stroke="${dk}" stroke-width="1.5"/><path d="M15 24 Q30 14 45 24" stroke="${lt}" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>${dots(5,dk,1.6,12)}`;
 return`<svg class="art" viewBox="0 0 60 60" width="${sz}" height="${sz}" aria-hidden="true">${g}</svg>`}
const vegMark=v=>`<span class="vm ${v==='V'?'v':v==='E'?'e':'n'}" title="${v==='V'?'Vegetarian':v==='E'?'Contains egg':'Non-vegetarian'}"></span>`;

/* ============ THALI PLATE (calorie ring) ============ */
function plateSVG(eaten,allow,animate){const cx=160,R=132,C=2*Math.PI*R,over=eaten>allow,pct=Math.min(1,allow>0?eaten/allow:0),left=allow-eaten;
 const extra=over?Math.min(1,(eaten-allow)/allow):0;
 return`<svg class="plate" viewBox="0 0 320 320" role="img" aria-label="${fmt(eaten)} of ${fmt(allow)} calories eaten">
 <defs><radialGradient id="stl" cx="38%" cy="32%" r="80%"><stop offset="0" stop-color="var(--steel1)"/><stop offset="1" stop-color="var(--steel2)"/></radialGradient></defs>
 <circle cx="${cx}" cy="${cx}" r="156" fill="url(#stl)"/><circle cx="${cx}" cy="${cx}" r="148" fill="none" stroke="var(--steel3)" stroke-width="1.5" opacity=".7"/>
 <circle cx="${cx}" cy="${cx}" r="${R}" fill="none" stroke="var(--track)" stroke-width="15"/>
 <circle class="${animate?'sweep':''}" cx="${cx}" cy="${cx}" r="${R}" fill="none" stroke="${over?'var(--bad)':'var(--cal)'}" stroke-width="15" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct)}" style="--full:${C};--to:${C*(1-pct)}" transform="rotate(-90 ${cx} ${cx})"/>
 ${over?`<circle cx="${cx}" cy="${cx}" r="${R}" fill="none" stroke="var(--bad2)" stroke-width="15" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-extra)}" transform="rotate(-90 ${cx} ${cx})" opacity=".8"/>`:''}
 <circle cx="${cx}" cy="${cx}" r="112" fill="var(--surf)"/><circle cx="${cx}" cy="${cx}" r="112" fill="none" stroke="var(--steel2)" stroke-width="1.5"/>
 <text x="${cx}" y="${cx-30}" text-anchor="middle" class="pl-k">${over?'over by':'left'}</text>
 <text x="${cx}" y="${cx+22}" text-anchor="middle" class="pl-n" fill="${over?'var(--bad)':'var(--ink)'}">${fmt(Math.abs(left))}</text>
 <text x="${cx}" y="${cx+48}" text-anchor="middle" class="pl-k">kcal</text>
 <text x="${cx}" y="${cx+78}" text-anchor="middle" class="pl-s">${fmt(eaten)} eaten of ${fmt(allow)}</text></svg>`}
let kid=0;
function katori(pct,color,big){const id='k'+(kid++),y=70-Math.min(1,pct)*50;
 return`<svg class="kat${big?' big':''}" viewBox="0 0 100 78" aria-hidden="true"><defs><clipPath id="${id}"><path d="M6 20 Q7 68 50 71 Q93 68 94 20Z"/></clipPath></defs>
 <path d="M6 20 Q7 68 50 71 Q93 68 94 20Z" fill="var(--surf2)"/><g clip-path="url(#${id})"><rect x="0" y="${y}" width="100" height="80" fill="${color}"/><ellipse cx="50" cy="${y}" rx="46" ry="6" fill="#fff" opacity=".22"/></g>
 <path d="M6 20 Q7 68 50 71 Q93 68 94 20Z" fill="none" stroke="var(--steel3)" stroke-width="2.4"/><ellipse cx="50" cy="20" rx="44" ry="8" fill="none" stroke="var(--steel3)" stroke-width="2.4"/></svg>`}
const ringSm=(pct,col,txt)=>{const R=22,C=2*Math.PI*R;return`<svg viewBox="0 0 56 56" class="rsm"><circle cx="28" cy="28" r="${R}" fill="none" stroke="var(--track)" stroke-width="6"/><circle cx="28" cy="28" r="${R}" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-Math.min(1,pct))}" transform="rotate(-90 28 28)"/><text x="28" y="32" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">${txt}</text></svg>`};

/* ============ CHARTS ============ */
function barsSVG(vals,{labels=[],target=0,color='var(--cal)',keys=[],h=190}={}){const W=360,pl=8,pr=8,pt=14,pb=22,n=vals.length,bw=(W-pl-pr)/n,mx=Math.max(...vals,target||0,1)*1.1,ch=h-pt-pb;
 let s=`<svg class="bars" viewBox="0 0 ${W} ${h}" preserveAspectRatio="none" role="img">`;
 [.5,1].forEach(f=>s+=`<line x1="${pl}" x2="${W-pr}" y1="${pt+ch*(1-f/1.1)}" y2="${pt+ch*(1-f/1.1)}" stroke="var(--line)" stroke-width=".8"/>`);
 vals.forEach((v,i)=>{const bh=v/mx*ch,x=pl+i*bw;s+=`<g data-act="openDay" data-d="${keys[i]}" class="bar"><rect x="${x}" y="0" width="${bw}" height="${h-pb}" fill="transparent"/><rect x="${x+bw*.16}" y="${pt+ch-bh}" width="${bw*.68}" height="${Math.max(bh,v?1.5:0)}" rx="2" fill="${color}" opacity="${v?1:.15}"/></g>`;
  if(labels[i])s+=`<text x="${x+bw/2}" y="${h-7}" text-anchor="middle" font-size="9" fill="var(--mut)">${labels[i]}</text>`});
 if(target)s+=`<line x1="${pl}" x2="${W-pr}" y1="${pt+ch*(1-target/mx)}" y2="${pt+ch*(1-target/mx)}" stroke="var(--pro)" stroke-width="1.3" stroke-dasharray="4 3"/>`;return s+'</svg>'}
function lineSVG(pts,{h=150,unit=''}={}){if(pts.length<1)return'';const W=340,pl=34,pr=10,pt=12,pb=20,xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);let x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys)-1,y1=Math.max(...ys)+1;if(x1===x0)x1=x0+1;
 const X=x=>pl+(x-x0)/(x1-x0)*(W-pl-pr),Y=y=>pt+(1-(y-y0)/(y1-y0))*(h-pt-pb);
 let s=`<svg class="line" viewBox="0 0 ${W} ${h}">`;[0,.5,1].forEach(f=>{const y=y0+(y1-y0)*f;s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(y)}" y2="${Y(y)}" stroke="var(--line)" stroke-width=".8"/><text x="${pl-4}" y="${Y(y)+3}" text-anchor="end" font-size="9" fill="var(--mut)">${r1(y)}</text>`});
 s+=`<polyline fill="none" stroke="var(--cal)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" points="${pts.map(p=>X(p.x)+','+Y(p.y)).join(' ')}"/>`;
 pts.forEach((p,i)=>{s+=`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="3.4" fill="var(--surf)" stroke="var(--cal)" stroke-width="2"/>`;if(i===0||i===pts.length-1||pts.length<6)s+=`<text x="${X(p.x)}" y="${h-5}" text-anchor="middle" font-size="9" fill="var(--mut)">${p.l}</text>`});return s+'</svg>'}
function hoursSVG(hrs){const W=360,h=120,pl=6,bw=(W-pl*2)/24,mx=Math.max(...hrs,1);let s=`<svg class="bars" viewBox="0 0 ${W} ${h}" preserveAspectRatio="none"><rect x="${pl+20*bw}" y="0" width="${4*bw}" height="${h-18}" fill="var(--bad)" opacity=".08"/>`;
 hrs.forEach((v,i)=>{const bh=v/mx*(h-34);s+=`<rect x="${pl+i*bw+bw*.15}" y="${h-18-bh}" width="${bw*.7}" height="${Math.max(bh,v?1.5:0)}" rx="2" fill="${i>=20?'var(--bad)':'var(--carb)'}" opacity="${v?1:.15}"/>`;if(i%3===0)s+=`<text x="${pl+i*bw+bw/2}" y="${h-5}" text-anchor="middle" font-size="9" fill="var(--mut)">${i%12||12}${i<12?'a':'p'}</text>`});return s+'</svg>'}
