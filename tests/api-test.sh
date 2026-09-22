#!/bin/bash
# Starts mock Gemini/OFF + the server, exercises every endpoint, then cleans up.
cd "$(dirname "$0")/.."
node tests/mocks.js >/dev/null 2>&1 & M=$!
GEMINI_API_KEY=test-key GEMINI_BASE_URL=http://127.0.0.1:4001 OFF_BASE_URL=http://127.0.0.1:4002 PORT=3100 AI_LIMIT_PER_IP_PER_MIN=6 node server.js >/dev/null 2>&1 & S=$!
sleep 1.2; C="curl -s -m 8"
echo '--- health'; $C localhost:3100/api/health
echo; echo '--- barcode found'; $C localhost:3100/api/barcode/8901234567890
echo; echo '--- barcode missing'; $C localhost:3100/api/barcode/1234567890123
echo; echo '--- barcode invalid'; $C -w ' [%{http_code}]' localhost:3100/api/barcode/abc
echo; echo '--- ai'; $C -X POST localhost:3100/api/ai -H 'content-type: application/json' -d '{"prompt":"You are Bitewise food-photo analyst","tier":"default"}' | head -c 260
echo; echo '--- estimate (grounded)'; $C -X POST localhost:3100/api/estimate -H 'content-type: application/json' -d '{"text":"homemade paneer tikka 150 grams"}' | head -c 700
echo; echo '--- empty prompt'; $C -w ' [%{http_code}]' -X POST localhost:3100/api/ai -H 'content-type: application/json' -d '{"prompt":""}'
echo; echo '--- headers'; $C -I localhost:3100/ | grep -i "permissions\|nosniff\|cache"
for u in sw.js manifest.webmanifest icons/icon-192.png nope.png some/route; do printf "%s -> " $u; $C -o /dev/null -w '%{http_code}\n' localhost:3100/$u; done
printf "traversal -> "; $C --path-as-is -o /dev/null -w '%{http_code}\n' 'localhost:3100/../server.js'
echo '--- rate limit (limit 6/min; 2 used above)'; for i in $(seq 1 6); do $C -o /dev/null -w '%{http_code} ' -X POST localhost:3100/api/ai -H 'content-type: application/json' -d '{"prompt":"x"}'; done; echo
kill $M $S 2>/dev/null
