// Mock Gemini + Open Food Facts for local testing (no real keys, no network)
const http=require('http');
const reply=o=>({candidates:[{content:{parts:[{text:'```json\n'+JSON.stringify(o)+'\n```'}]}}]});
http.createServer((req,res)=>{let b='';req.on('data',c=>b+=c);req.on('end',()=>{
  const j=JSON.parse(b||'{}');const parts=j.contents?.[0]?.parts||[];const txt=parts.map(c=>c.text||'').join(' ');const hasImg=parts.some(c=>c.inlineData);
  if(req.headers['x-goog-api-key']!=='test-key'){res.writeHead(401);return res.end('{}')}
  let out={};
  if(txt.includes('nutrition label'))out={product:'Test Bar',brand:'Acme',servingG:30,basis:'perServing',values:{kcal:140,p:6,c:18,f:5,fib:2,sug:7,na:120},ingredients:'oats, jaggery',confidence:'high',notes:''};
  else if(txt.includes('food-photo analyst'))out={items:[{name:'roti',dbId:'roti',grams:80,confidence:'high',note:''},{name:'dal',dbId:'dtadka',grams:150,confidence:'medium',note:'yellow and thin'}],caveat:'Oil is hard to judge from a photo.',_img:hasImg};
  else if(txt.includes('Estimate the nutrition of'))out={name:'Homemade paneer tikka',grams:150,veg:'V',values:{kcal:330,p:22,c:10,f:23,fib:1,sug:2,na:600},micros:{fe:1,ca:400,vA:100,b12:.5,vC:5,vD:.3,fol:20,mg:30,k:150,zn:2},basis:'Used database record [0] adjusted for oil.',confidence:'medium',usedRefs:[0],_sawRefs:txt.includes('Open Food Facts')};
  else if(txt.includes('Parse this food-log'))out={items:[{name:'jam toast',dbId:'brjam',qty:1,unit:null,grams:null}]};
  res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify(reply(out)));})}).listen(4001);
http.createServer((req,res)=>{res.setHeader('content-type','application/json');
  if(req.url.startsWith('/api/v2/product/8901234567890')){return res.end(JSON.stringify({status:1,product:{product_name:'Masala Oats',brands:'Saffola',serving_quantity:40,ingredients_text:'oats, spices',nutriments:{'energy-kcal_100g':390,proteins_100g:11,carbohydrates_100g:65,fat_100g:8,fiber_100g:9,sugars_100g:3,sodium_100g:1.2}}}))}
  if(req.url.startsWith('/api/v2/product/'))return res.end(JSON.stringify({status:0}));
  if(req.url.startsWith('/cgi/search.pl'))return res.end(JSON.stringify({products:[{product_name:'Paneer tikka',brands:'Generic',nutriments:{'energy-kcal_100g':220,proteins_100g:15,carbohydrates_100g:5,fat_100g:16}}]}));
  res.statusCode=404;res.end('{}')}).listen(4002);
console.log('mocks up');
