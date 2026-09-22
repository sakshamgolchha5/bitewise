'use strict';
/* ============ UTILS ============ */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const pd=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const addDays=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return ymd(d)};
const nowT=()=>{const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())};
const mins=t=>{const[h,m]=t.split(':').map(Number);return h*60+m};
const fromMins=m=>{m=((Math.round(m)%1440)+1440)%1440;return pad(Math.floor(m/60))+':'+pad(m%60)};
const r0=n=>Math.round(n||0),r1=n=>Math.round((n||0)*10)/10;
const fmt=n=>r0(n).toLocaleString('en-IN');
const uid=()=>Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-3);
const DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const dlabel=s=>{const d=pd(s);return DOW[d.getDay()]+', '+d.getDate()+' '+MON[d.getMonth()]};
const t12=t=>{const[h,m]=t.split(':').map(Number);return((h%12)||12)+':'+pad(m)+' '+(h<12?'am':'pm')};
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;

/* ============ FOOD DATABASE PARSE ============ */
const FOODS=[],FOOD={};
const parseUnits=s=>(s||'').split(';').filter(Boolean).map(u=>{const i=u.lastIndexOf(':');return{l:u.slice(0,i),g:+u.slice(i+1)}});
function addFood(f){FOODS.push(f);FOOD[f.id]=f}
DB.trim().split('\n').forEach(l=>{if(!l.trim())return;const a=l.split('|');const[id,name,alias,cat,v,kind,meals,kcal,p,c,f,fib,sug,na,mic,mods,units,def,col]=a;
  const m=MIC[mic]||MIC.zr;const n100={kcal:+kcal,p:+p,c:+c,f:+f,fib:+fib,sug:+sug,na:+na};MK.forEach((k,i)=>n100[k]=m[i]);
  addFood({id,name,alias,cat,veg:v,kind,meals,n100,mods:mods?mods.split(','):[],units:parseUnits(units),def:+def,col,src:kind==='p'?'pack':'ref'})});
const MT=[['Full-fat',{kcal:88,p:3.4,c:5,f:6,sug:5}],['Toned',{kcal:58,p:3,c:4.7,f:3,sug:4.7}],['Double toned',{kcal:45,p:3,c:4.9,f:1.5,sug:4.9}],['Skimmed',{kcal:34,p:3.4,c:5,f:.1,sug:5}]];
const sc=(n,g)=>{const o={};NK.forEach(k=>o[k]=(n[k]||0)*g/100);return o};
const addN=(a,b)=>{NK.forEach(k=>a[k]=(a[k]||0)+(b[k]||0));return a};
const zeroN=()=>Object.fromEntries(NK.map(k=>[k,0]));
const sumN=arr=>arr.reduce((t,n)=>addN(t,n),zeroN());
function compN100(f,mt){const t=zeroN();let tot=0;f.parts.forEach(([id,g])=>{let n=FOOD[id].n100;if(id==='milk'&&mt!=null)n={...n,...MT[mt][1]};addN(t,sc(n,g));tot+=g});const o={};NK.forEach(k=>o[k]=t[k]/tot*100);return o}
COMP.trim().split('\n').forEach(l=>{if(!l.trim())return;const[id,name,alias,cat,v,kind,meals,parts,mods,col]=l.split('|');
  const ps=parts.split(',').map(x=>{const[i,g]=x.split(':');return[i,+g]});const f={id,name,alias,cat,veg:v,kind,meals,parts:ps,mods:mods?mods.split(','):[],col,def:1,src:'ref'};
  f.n100=compN100(f,1);f.units=[{l:'serving',g:ps.reduce((a,p)=>a+p[1],0)}];addFood(f)});
FOODS.forEach(f=>{if(!f.units.some(u=>u.l==='g'||u.l==='ml'))f.units.push({l:'g',g:1})});

/* ============ STATE ============ */
const KEY='bitewise.v1';
// Migrate existing Bitewise/Katori data once so an upgrade does not erase a tester's local log.
try { if (!localStorage.getItem(KEY) && localStorage.getItem('katori.v1')) localStorage.setItem(KEY, localStorage.getItem('katori.v1')); } catch(e) {}
const defState=()=>({v:1,me:null,tg:{kcal:2000,p:60,c:250,f:60,fib:28,water:2500},sched:{on:false,extra:300},entries:[],exercise:[],meals:[],foods:[],tfoods:{},recent:{},weights:[],water:{},
  learn:{map:{},portions:{},hashes:[]},prods:[],fast:{on:false,plan:'16:8',start:null,hist:[]},ui:{theme:'auto',water:true,weight:true,fast:false,exAdd:true,voiceLang:'en-IN'}});
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
S=Object.assign(defState(),S||{});S.ui=Object.assign(defState().ui,S.ui||{});S.fast=Object.assign(defState().fast,S.fast||{});
let saveT;function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}},150)}
const F=id=>FOOD[id]||S.foods.find(f=>f.id===id)||S.tfoods[id]||null;
const ALLFOODS=()=>FOODS.concat(S.foods);

/* ============ MEALS ============ */
const MEALS=[['breakfast','Breakfast',5,10,'08:30'],['mid','Mid-morning',10,12,'11:00'],['lunch','Lunch',12,15.5,'13:30'],['snack','Evening snack',15.5,19,'17:30'],['dinner','Dinner',19,22.5,'20:30'],['late','Late-night',22.5,29,'23:15'],['custom','Custom',0,0,'12:00']];
const MEALNAME=Object.fromEntries(MEALS.map(m=>[m[0],m[1]]));
function mealFor(t){let h=mins(t)/60;if(h<5)h+=24;for(const m of MEALS)if(m[0]!=='custom'&&h>=m[2]&&h<m[3])return m[0];return'late'}
const SRC={ref:['Database','Typical values for this food — actual portions and recipes vary'],pack:['Typical pack','Approximate pack values — scan or photograph your pack for exact numbers'],label:['From label','Read from a nutrition label you provided'],ai:['AI estimate','Estimated by AI — please check before relying on it'],user:['Yours','A food you created or edited'],saved:['Saved','']};

/* ============ NUTRITION CALC ============ */
const MODDEF={
 oil:{l:'Oil / ghee in it',o:[['Light',-3],['Normal',0],['Oily',4]],d:0},
 ghee:{l:'Ghee / butter on top',o:[['None',0],['1 tsp',5],['2 tsp',10],['3 tsp',15]],d:0},
 spread:{l:'Spread',o:[['None',null],['Butter 5 g',['butter',5]],['Butter 10 g',['butter',10]],['Peanut butter 1 tbsp',['pbutter',16]],['Peanut butter 2 tbsp',['pbutter',32]],['Jam 1 tsp',['jam',7]],['Cheese slice',['cheese',20]]],d:null},
 mtype:{l:'Milk type',o:MT.map((m,i)=>[m[0],i]),d:1},
 milk:{l:'Milk in it',o:[['None',0],['30 ml',30],['50 ml',50],['75 ml',75],['100 ml',100],['150 ml',150],['200 ml',200]]},
 cmilk:{l:'Milk',o:[['None',0],['100 ml',100],['150 ml',150],['200 ml',200],['250 ml',250]],d:150},
 sugar:{l:'Sugar',o:[['None',0],['½ tsp',.5],['1 tsp',1],['1½ tsp',1.5],['2 tsp',2],['3 tsp',3],['4 tsp',4]]}};
const unitOf=(f,l)=>f.units.find(u=>u.l===l)||f.units[0];
function defMods(f,g){const m={};(f.mods||[]).forEach(k=>{if(k==='milk'){const x=Math.round(g*.4/5)*5;m.milk=x}else if(k==='sugar')m.sugar=(f.id==='curd'||f.id==='bcoffee'||f.id==='gtea')?0:1;else if(MODDEF[k])m[k==='mtype'?'mt':k==='cmilk'?'cm':k==='ghee'?'gh':k==='spread'?'sp':k]=MODDEF[k].d});return m}
function calc(f,qty,ul,mods={}){
 const u=unitOf(f,ul),g=qty*u.g;let n100=f.n100;
 if(f.parts&&mods.mt!=null&&mods.mt!==1)n100=compN100(f,mods.mt);
 else if((f.id==='milk'||f.id==='curd')&&mods.mt!=null)n100={...n100,...MT[mods.mt][1]};
 if(mods.oil){n100={...n100};n100.f=Math.max(0,n100.f+mods.oil);n100.kcal=Math.max(0,n100.kcal+mods.oil*9)}
 const n=sc(n100,g),mt=mods.mt??1;
 const milkN=ml=>sc({...FOOD.milk.n100,...MT[mt][1]},ml);
 if(mods.milk)addN(n,milkN(mods.milk));if(mods.cm)addN(n,milkN(mods.cm));
 if(mods.sugar)addN(n,sc(FOOD.sugar.n100,mods.sugar*4));
 if(mods.gh)addN(n,sc(FOOD.ghee.n100,mods.gh));
 if(mods.sp)addN(n,sc(FOOD[mods.sp[0]].n100,mods.sp[1]));
 return{g,n,u}}
function modText(f,m){const t=[];if(m.cm)t.push(m.cm+' ml milk');if(m.milk)t.push(m.milk+' ml milk');if(m.sugar)t.push(m.sugar+' tsp sugar');if(m.gh)t.push(m.gh+' g ghee');if(m.sp)t.push(FOOD[m.sp[0]].name.split(' ')[0].toLowerCase()+' spread');if(m.oil>0)t.push('oily');if(m.oil<0)t.push('light oil');return t.join(', ')}
const qtxt=(f,q,ul)=>{const u=unitOf(f,ul);return(q%1?q:q)+' × '+u.l};
const stepFor=u=>u.l==='g'||u.l==='ml'?10:(/tsp|tbsp/.test(u.l)?.5:(u.g>=80?.5:1));
function mkEntry(f,qty,ul,mods,date,time,meal,cust,extra={}){const c=calc(f,qty,ul,mods);
 return{id:uid(),date,time,meal,cust:cust||'',fid:f.id,name:f.name,qty,unit:ul,mods,g:c.g,n:c.n,src:f.src||'ref',...extra}}
function bump(fid){const r=S.recent[fid]||(S.recent[fid]={n:0,last:0});r.n++;r.last=Date.now()}
function addEntries(list){list.forEach(e=>{if(!F(e.fid))return;S.entries.push(e);bump(e.fid)});save()}
const entriesOn=d=>S.entries.filter(e=>e.date===d).sort((a,b)=>a.time.localeCompare(b.time));
const dayN=d=>sumN(entriesOn(d).map(e=>e.n));
function groupMeals(es){const g={};es.forEach(e=>{const k=e.meal==='custom'?'custom:'+(e.cust||'Custom'):e.meal;(g[k]||(g[k]=[])).push(e)});
 const order=MEALS.map(m=>m[0]);return Object.entries(g).sort((a,b)=>order.indexOf(a[0].split(':')[0])-order.indexOf(b[0].split(':')[0])||a[1][0].time.localeCompare(b[1][0].time)).map(([k,v])=>({key:k,name:k.startsWith('custom:')?k.slice(7):MEALNAME[k],es:v,n:sumN(v.map(e=>e.n))}))}

/* ============ BUDGET / EXERCISE / STREAK ============ */
function budgetFor(d){let b=S.tg.kcal;const s=S.sched;if(s&&s.on){const w=pd(d).getDay();b=(w===0||w===6)?b+s.extra:b-Math.round(s.extra*2/5)}return b}
const exOn=d=>S.exercise.filter(e=>e.date===d);
const exKcal=d=>exOn(d).reduce((a,e)=>a+e.kcal,0);
const allowance=d=>budgetFor(d)+(S.ui.exAdd?exKcal(d):0);
const ACTS=[['Walking',3.5],['Brisk walk',4.3],['Running',9.8],['Cycling',7.5],['Yoga',3],['Gym / weights',5],['Swimming',6],['Badminton',5.5],['Cricket',4.8],['Dance / Zumba',6.5],['Stair climbing',8],['Household work',3.3]];
const exCalc=(met,m)=>Math.round(met*(S.me?.wt||65)*m/60);
function streak(){let d=ymd(new Date());if(!entriesOn(d).length)d=addDays(d,-1);let n=0;while(entriesOn(d).length){n++;d=addDays(d,-1)}return n}
function loggedDays(from,to){const out=[];for(let d=from;d<=to;d=addDays(d,1))if(entriesOn(d).length)out.push(d);return out}

/* ============ TARGETS ============ */
function calcTargets(me){const{age,sex,ht,wt,act,goal,pace}=me;
 const bmr=10*wt+6.25*ht-5*age+(sex==='m'?5:sex==='f'?-161:-78);const tdee=bmr*({s:1.2,l:1.375,m:1.55,v:1.725}[act]||1.375);
 const rate=(pace||.5)*7700/7;let k=goal==='lose'?tdee-rate:goal==='gain'?tdee+Math.min(rate,700):goal==='muscle'?tdee+250:tdee;
 k=Math.max(sex==='m'?1500:1200,Math.round(k/10)*10);
 const p=Math.round(wt*({lose:1.6,maintain:1.2,gain:1.4,muscle:1.8}[goal]||1.2));const f=Math.round(k*.27/9);const c=Math.max(0,Math.round((k-p*4-f*9)/4));
 return{kcal:k,p,c,f,fib:Math.round(Math.max(25,k/1000*14)),water:Math.round(wt*35/250)*250,tdee:Math.round(tdee)}}
function planWeeks(me){if(!me||!me.tw||me.goal==='maintain'||me.goal==='muscle')return null;const d=Math.abs(me.wt-me.tw);return d<.1?0:Math.ceil(d/(me.pace||.5))}
const REF=()=>{const f=S.me?.sex==='f';return{fib:S.tg.fib,na:2000,fe:f?19:17,ca:1000,vA:f?840:900,b12:2.2,vC:f?80:85,vD:15,fol:300,mg:f?370:440,k:3510,zn:f?10:12}};
const MNAME={fe:['Iron','mg'],ca:['Calcium','mg'],vA:['Vitamin A','µg'],b12:['Vitamin B12','µg'],vC:['Vitamin C','mg'],vD:['Vitamin D','µg'],fol:['Folate','µg'],mg:['Magnesium','mg'],k:['Potassium','mg'],zn:['Zinc','mg'],na:['Sodium','mg']};

/* ============ SEARCH ============ */
const norm=s=>s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\u0900-\u097f\s]/g,' ').replace(/\s+/g,' ').trim();
function passF(f,fl){for(const k of fl){if(k==='veg'&&f.veg!=='V')return false;if(k==='nv'&&f.veg==='V')return false;if(k==='b'&&!(f.meals||'').includes('b'))return false;if(k==='l'&&!(f.meals||'').includes('l'))return false;
 if(k==='d'&&!(f.meals||'').includes('d'))return false;if(k==='s'&&!((f.meals||'').includes('s')||f.cat==='snk'||f.cat==='str'))return false;if(k==='fru'&&f.cat!=='fru')return false;if(k==='bev'&&f.cat!=='bev')return false;
 if(k==='rest'&&f.kind!=='r')return false;if(k==='pack'&&!(f.kind==='p'||f.cat==='pkg'))return false}return true}
const STOP=new Set(['with','of','and','the','a','an','in']);
function searchFoods(q,fl=[],lim=60){q=norm(q||'');const toks=q.split(' ').filter(t=>t&&!STOP.has(t));const out=[];
 for(const f of ALLFOODS()){if(!passF(f,fl))continue;let s=0;if(toks.length){const nw=norm(f.name).split(' '),aw=norm((f.alias||'').replace(/·/g,' ')).split(' ');let ok=true;
   for(const t of toks){const pl=t.length>3&&t.endsWith('s')?t.slice(0,-1):t;
    if(nw.includes(t)||nw.includes(pl))s+=6;else if(t.length>=3&&nw.some(w=>w.startsWith(t)))s+=4;else if(aw.includes(t)||aw.includes(pl))s+=4;else if(t.length>=3&&aw.some(w=>w.startsWith(t)))s+=2.5;
    else if(t.length>=3&&(nw.some(w=>w.includes(t))||aw.some(w=>w.includes(t))))s+=1.2;else{ok=false;break}}
   if(!ok)continue;if(norm(f.name)===q)s+=8;if((f.alias||'').split('·').some(a=>{a=norm(a);return a===q||(q.length>3&&a===q.slice(0,-1))}))s+=7;if(nw[0]===toks[0])s+=1.5;s-=nw.length*.15}
  const r=S.recent[f.id];if(r)s+=Math.min(3,r.n*.4)+(Date.now()-r.last<6048e5?1:0);if(f.src==='user')s+=1;out.push([s,f])}
 out.sort((a,b)=>b[0]-a[0]||a[1].name.length-b[1].name.length);return out.slice(0,lim).map(x=>x[1])}
const recentFoods=n=>Object.entries(S.recent).filter(([id])=>F(id)).sort((a,b)=>b[1].last-a[1].last).slice(0,n).map(([id])=>F(id));
const freqFoods=n=>Object.entries(S.recent).filter(([id])=>F(id)).sort((a,b)=>b[1].n-a[1].n||b[1].last-a[1].last).slice(0,n).map(([id])=>F(id));

/* ============ SPEECH / TEXT PARSER (local, no AI) ============ */
const NUMW={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,ek:1,do:2,teen:3,char:4,paanch:5,chhe:6,half:.5,aadha:.5,a:1,an:1,couple:2};
const UNITW={katori:'katori',katoris:'katori',bowl:'bowl',bowls:'bowl',glass:'glass',glasses:'glass',cup:'cup',cups:'cup',piece:'piece',pieces:'piece',slice:'slice',slices:'slice',plate:'plate',plates:'plate',tsp:'tsp',teaspoon:'tsp',tbsp:'tbsp',tablespoon:'tbsp',g:'g',gm:'g',gram:'g',grams:'g',ml:'ml',spoon:'tbsp',scoop:'scoop',handful:'handful'};
function pickUnit(f,w){if(!w)return f.units[0].l;const u=f.units.find(u=>u.l.toLowerCase().startsWith(w))||f.units.find(u=>u.l.toLowerCase().includes(w));return u?u.l:f.units[0].l}
function matchOne(txt,loose){const t=norm(txt).replace(/^(of|the|some|my)\s+/,'');if(!t)return null;let r=searchFoods(t,[],3);
 if(!r.length&&loose&&t.includes(' ')){const w=t.split(' ');r=searchFoods(w.slice(-2).join(' '),[],3);if(!r.length)r=searchFoods(w[w.length-1],[],3)}return r[0]||null}
function parseSpeech(text){let t=' '+text.toLowerCase().replace(/[.!?]/g,',')+' ';t=t.replace(/\b(i had|i ate|i have had|i just had|for breakfast|for lunch|for dinner|maine|main ne|khaya|khayi|piya|piye)\b/g,',');
 const parts=t.split(/,|\band\b|\baur\b|\bplus\b/).map(s=>s.trim()).filter(Boolean);const out=[];
 parts.forEach(p=>{let q=1,rest=p;const m=p.match(/^(\d+(?:\.\d+)?|\d+\/\d+|[a-z]+)\s+(.*)$/);
  if(m){let n=/^\d+\/\d+$/.test(m[1])?m[1].split('/').reduce((a,b)=>a/b):/^\d/.test(m[1])?parseFloat(m[1]):NUMW[m[1]];if(n){q=n;rest=m[2]}}
  let uw=null;const um=rest.match(/^([a-z]+)\s+(?:of\s+)?(.*)$/);if(um&&UNITW[um[1]]){uw=UNITW[um[1]];rest=um[2]}
  let f=matchOne(rest),extra=null;if(!f&&/ with /.test(rest)){const[a,b]=rest.split(/ with /);f=matchOne(a);const f2=matchOne(b);if(f2)extra={f:f2}}if(!f)f=matchOne(rest,true)
  if(f){let unit=pickUnit(f,uw);if(uw&&!f.units.some(u=>u.l.toLowerCase().includes(uw))){}
   const u=unitOf(f,unit);let qty=q;if(u.l==='g'&&!uw&&q<10)qty=f.def;out.push({fid:f.id,qty,unit,text:p});if(extra)out.push({fid:extra.f.id,qty:extra.f.def,unit:extra.f.units[0].l,text:p})}
  else out.push({fid:null,text:p})});return out}

/* ============ LEARNING ============ */
function learnFrom(items){items.forEach(it=>{if(it.ai&&it.ai.name){const k=it.ai.name.toLowerCase().trim();if(it.fid&&it.fid!==it.ai.dbId&&(FOOD[it.fid]||S.foods.some(f=>f.id===it.fid))){const m=S.learn.map[k];if(m&&m.to===it.fid)m.n++;else S.learn.map[k]={to:it.fid,n:1}}}
 if(it.fid&&it.g&&FOOD[it.fid]){const p=S.learn.portions[it.fid]||(S.learn.portions[it.fid]={g:it.g,n:0});p.g=(p.g*p.n+it.g)/(p.n+1);p.n++}});save()}
function learnPrompt(){const m=Object.entries(S.learn.map).sort((a,b)=>b[1].n-a[1].n).slice(0,15).filter(([,v])=>F(v.to)).map(([k,v])=>`- when you would say "${k}", this user usually means "${F(v.to).name}" (id ${v.to}), corrected ${v.n}×`);
 const p=Object.entries(S.learn.portions).filter(([id,v])=>v.n>=2&&F(id)).sort((a,b)=>b[1].n-a[1].n).slice(0,15).map(([id,v])=>`- ${F(id).name}: usual portion ≈ ${Math.round(v.g)} g (${v.n} meals)`);
 return(m.length?'User corrections from earlier meals (apply when relevant):\n'+m.join('\n')+'\n':'')+(p.length?'Typical portions for this user:\n'+p.join('\n')+'\n':'')}

/* ============ INSIGHTS & SUGGESTIONS ============ */
function suggest(remK,remP){if(remK<60)return[];const snack=remK<420;const diet=S.me?.diet||'nv';const ok=c=>diet==='veg'?c[1]==='V':diet==='egg'?c[1]!=='N':true;
 const res=[];COMBOS.filter(c=>ok(c)&&(c[2]==='s')===snack).forEach(c=>{const n=sumN(c[3].map(([id,g])=>sc(FOOD[id].n100,g)));if(n.kcal>remK*1.12)return;
  const score=Math.abs(n.kcal-Math.min(remK,snack?250:600))/Math.max(remK,300)*.5+(1-Math.min(1,n.p/Math.max(10,Math.min(remP,snack?15:40))))*.8;res.push({name:c[0],n,items:c[3],score})});
 return res.sort((a,b)=>a.score-b.score).slice(0,4)}
function weekStats(end){const days=[];for(let i=6;i>=0;i--)days.push(addDays(end,-i));const rows=days.map(d=>({d,n:dayN(d),has:entriesOn(d).length>0}));const logged=rows.filter(r=>r.has);return{rows,logged}}
function insightLines(){const end=ymd(new Date()),{rows,logged}=weekStats(end);if(!logged.length)return[];const L=[];const ak=avg(logged.map(r=>r.n.kcal)),ap=avg(logged.map(r=>r.n.p));
 L.push(`You logged ${logged.length} of the last 7 days and averaged ${fmt(ak)} kcal a day.`);L.push(`Average protein was ${fmt(ap)} g a day${ap<S.tg.p*.8?` — about ${fmt(S.tg.p-ap)} g under your ${S.tg.p} g target`:ap>=S.tg.p?', on target':', close to target'}.`);
 const hi=logged.reduce((a,b)=>b.n.kcal>a.n.kcal?b:a),hp=logged.reduce((a,b)=>b.n.p>a.n.p?b:a);L.push(`Your highest-calorie day was ${DOW[pd(hi.d).getDay()]} (${fmt(hi.n.kcal)} kcal).`);
 if(logged.length>1)L.push(`Protein peaked on ${DOW[pd(hp.d).getDay()]} at ${fmt(hp.n.p)} g.`);
 const mk={};logged.forEach(r=>entriesOn(r.d).forEach(e=>{const k=e.meal==='custom'?e.cust||'Custom':MEALNAME[e.meal];mk[k]=(mk[k]||0)+e.n.kcal}));const top=Object.entries(mk).sort((a,b)=>b[1]-a[1])[0];
 if(top)L.push(`Most of your calories came at ${top[0].toLowerCase()} (${Math.round(top[1]/Object.values(mk).reduce((a,b)=>a+b,0)*100)}%).`);return L}
function timingStats(days=30){const end=ymd(new Date()),from=addDays(end,-days+1),ds=loggedDays(from,end);const first={breakfast:[],lunch:[],dinner:[]};let late=0,after8=0,tot=0;const hrs=Array(24).fill(0),snackH={};
 ds.forEach(d=>{const es=entriesOn(d);['breakfast','lunch','dinner'].forEach(m=>{const x=es.filter(e=>e.meal===m);if(x.length)first[m].push(mins(x[0].time))});
  if(es.some(e=>e.meal==='late'||mins(e.time)>=22*60))late++;es.forEach(e=>{const h=+e.time.slice(0,2);hrs[h]+=e.n.kcal;tot+=e.n.kcal;if(h>=20)after8+=e.n.kcal;if(e.meal==='snack'||e.meal==='mid')snackH[h]=(snackH[h]||0)+1})});
 const sn=Object.entries(snackH).sort((a,b)=>b[1]-a[1])[0];
 return{days:ds.length,avgT:Object.fromEntries(Object.entries(first).map(([k,v])=>[k,v.length?fromMins(avg(v)):null])),late,after8:ds.length?after8/ds.length:0,share8:tot?after8/tot:0,hrs:hrs.map(x=>ds.length?x/ds.length:0),snackHour:sn?+sn[0]:null}}
function proteinSources(days=7){const end=ymd(new Date()),from=addDays(end,-days+1),m={};S.entries.filter(e=>e.date>=from&&e.date<=end).forEach(e=>{m[e.name]=(m[e.name]||0)+e.n.p});return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,6)}
