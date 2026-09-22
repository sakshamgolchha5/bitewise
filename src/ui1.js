'use strict';
/* ============ ICONS ============ */
const IC={home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',add:'<path d="M12 5v14M5 12h14"/>',scan:'<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10"/>',
photo:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',hist:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',ins:'<path d="M5 20V11M12 20V4M19 20v-6"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',mic:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
left:'<path d="M15 5l-7 7 7 7"/>',right:'<path d="M9 5l7 7-7 7"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',flame:'<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"/>',
trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.500 6-11 6-11z"/>',run:'<circle cx="14" cy="4" r="2"/><path d="M8 21l3-6-2-3 3-4 3 3h3M11 15l4 2 1 4"/>',
moon:'<path d="M20 14A8 8 0 1 1 10 4a6.500 6.500 0 0 0 10 10z"/>',check:'<path d="M5 12l5 5 9-10"/>',plus:'<path d="M12 5v14M5 12h14"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',bowl:'<path d="M3 11h18a9 9 0 0 1-18 0zM8 21h8"/>'};
const ic=(n,s=20)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const LOGO='<svg viewBox="0 0 32 32"><path d="M3 12h26a13 13 0 0 1-26 0z" fill="var(--haldi)"/><ellipse cx="16" cy="12" rx="13" ry="3.500" fill="var(--cal)"/><path d="M10 27h12" stroke="var(--cal)" stroke-width="2.500" stroke-linecap="round"/></svg>';

/* ============ SHELL STATE ============ */
const today=()=>ymd(new Date());
let route='home',vd=today(),animate=true,LOG=null,PL=null,PICK=null;
const UI={q:'',fl:new Set(),seg:'foods',cat:null,hq:'',hm:today().slice(0,7),hmetric:'kcal',hseg:'month',insSeg:'week'};
const ACT={},INP={},CHG={};
const TABS=[['home','Home','home'],['add','Add','add'],['scan','Scan','scan'],['photo','Photo','photo'],['history','History','hist'],['insights','Insights','ins'],['profile','Profile','user']];
function go(r){if(r!=='add')UI.mealCtx=null;scanStop();route=r;closeSheet();render();window.scrollTo(0,0)}
function render(){const v=$('#view');v.innerHTML=({home:vHome,add:vAdd,scan:vScan,photo:vPhoto,history:vHistory,insights:vInsights,profile:vProfile})[route]();animate=false;
 $('#tabs').innerHTML='<div class="in">'+TABS.map(t=>`<button data-act="go" data-r="${t[0]}" class="${route===t[0]?'on':''}${t[0]==='add'?' add':''}" aria-label="${t[1]}" ${route===t[0]?'aria-current="page"':''}>${t[0]==='add'?`<span class="ic">${ic(t[2],22)}</span>`:ic(t[2],22)}<span>${t[1]}</span></button>`).join('')+'</div>';
 drawPlateBar();if(route==='scan')scanMount?.();}
function drawPlateBar(){let b=$('#pbar');const n=PL&&PL.items.length&&!$('#ov').classList.contains('on');if(!n){b.innerHTML='';b.style.display='none';return}
 const t=sumN(PL.items.map(i=>plateItemN(i)));b.style.display='flex';b.className='platebar';b.innerHTML=`<span style="flex:1"><b>Plate · ${PL.items.length} item${PL.items.length>1?'s':''}</b><br><span class="xs" style="opacity:.75">${fmt(t.kcal)} kcal · ${r0(t.p)} g protein</span></span><button class="btn ghost sm" style="color:inherit;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.35)" data-act="plClear">Clear</button><button class="btn hal sm" data-act="plOpen">Review</button>`}
/* sheets */
function openSheet(title,body,foot,cls){const ov=$('#ov');ov.classList.add('on');ov.innerHTML=`<div class="sheet ${cls||''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="sh-h"><h2>${title}</h2><button class="iconbtn" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div><div class="sh-b" id="shb">${body}</div>${foot?`<div class="sh-f" id="shf">${foot}</div>`:''}</div>`;drawPlateBar()}
function closeSheet(){const ov=$('#ov');ov.classList.remove('on');ov.innerHTML='';LOG=null;PICK=null;stopVoice?.();drawPlateBar()}
ACT.closeSheet=()=>{if(PICK&&PICK.back){const b=PICK.back;PICK=null;b()}else closeSheet()};
function toast(msg,undo){const o=$('#toast');clearTimeout(toast.t);o.innerHTML=`<div class="toast" role="status">${esc(msg)}${undo?'<button data-act="undo">Undo</button>':''}</div>`;toast.undo=undo;toast.t=setTimeout(()=>o.innerHTML='',undo?6000:2600)}
ACT.undo=()=>{toast.undo?.();$('#toast').innerHTML='';render()};

/* ============ HOME ============ */
const pctOf=(v,t)=>t?v/t:0;
function vHome(){const es=entriesOn(vd),T=sumN(es.map(e=>e.n)),tg=S.tg,al=allowance(vd),ex=exKcal(vd),isT=vd===today(),gm=groupMeals(es);
 const left=al-T.kcal,pL=tg.p-T.p;
 const kt=(k,l,col,big)=>`<div class="kt ${big?'p':''}">${katori(pctOf(T[k],tg[k]),col,big)}<div class="v">${r0(T[k])}<small style="font-size:.55em">g</small></div><div class="l">${l}</div><div class="t">of ${tg[k]} g</div></div>`;
 return`<div class="top"><div class="brand">${LOGO}Bitewise</div><div class="row"><span class="streak" title="Days in a row with food logged"><span style="color:var(--fat)">${ic('flame',16)}</span>${streak()}</span><button class="iconbtn" data-act="theme" aria-label="Switch light or dark theme">${ic('moon')}</button></div></div>
 <div class="datebar"><button data-act="dprev" aria-label="Previous day">${ic('left')}</button><b>${isT?'Today':vd===addDays(today(),-1)?'Yesterday':dlabel(vd)}</b><button data-act="dnext" aria-label="Next day" ${vd>=today()?'disabled style="opacity:.3"':''}>${ic('right')}</button></div>
 ${installBanner()}
 <div class="hero" style="margin-top:8px">${plateSVG(T.kcal,al,animate)}
  <div class="eq"><div><b>${fmt(budgetFor(vd))}</b>Budget</div><div><b>−${fmt(T.kcal)}</b>Food</div><button data-act="addEx" class="b" style="text-align:center"><b>+${fmt(S.ui.exAdd?ex:0)}</b>Exercise ＋</button></div>
  <p class="sm mut" style="margin:2px 0 0">${left>=0?`${fmt(left)} kcal and ${pL>0?fmt(pL)+' g protein':'your protein target done'} to go.`:`${fmt(-left)} kcal over budget today — tomorrow is a fresh plate.`}</p>
  <div class="kats">${kt('p','Protein','var(--pro)',1)}${kt('c','Carbs','var(--carb)')}${kt('f','Fat','var(--fat)')}${kt('fib','Fibre','var(--fib)')}</div></div>
 <div class="qrow" style="margin-top:12px">${[['breakfast','Breakfast'],['lunch','Lunch'],['dinner','Dinner'],['snack','Snack']].map(m=>`<button class="chip" data-act="addMeal" data-m="${m[0]}">＋ ${m[1]}</button>`).join('')}</div>
 <div class="qa3"><button class="qa main" data-act="go" data-r="photo">${ic('photo',24)}Photo</button><button class="qa" data-act="voice">${ic('mic',24)}Speak</button><button class="qa" data-act="go" data-r="scan">${ic('scan',24)}Scan</button><button class="qa" data-act="go" data-r="add">${ic('search',24)}Search</button></div>
 ${logAgain()}
 <div class="sec"><h2>Meals <small>${fmt(T.kcal)} kcal · ${r0(T.p)} g protein</small></h2>${gm.length?gm.map(mealCard).join(''):`<div class="card empty">${art(F('nthali'),64)}<br><b>Nothing logged ${isT?'yet':'this day'}</b><br><span class="sm">Tap a meal above, say what you ate, or snap your thali.</span></div>`}</div>
 <div class="sec"><h2>Exercise <small><button data-act="addEx" class="b" style="color:var(--cal)">＋ Add</button></small></h2>${exOn(vd).length?`<div class="card">${exOn(vd).map(e=>`<div class="li"><span style="color:var(--fib)">${ic('run',22)}</span><div class="grow"><div class="nm">${esc(e.name)}</div><div class="sm mut">${e.min} min</div></div><div class="k">${e.kcal}<small style="color:var(--fib)">kcal</small></div><button class="iconbtn" data-act="delEx" data-id="${e.id}" aria-label="Delete">${ic('trash',18)}</button></div>`).join('')}</div>`:`<div class="card sm mut">No exercise logged. Burned calories are ${S.ui.exAdd?'added to':'shown next to'} your budget.</div>`}</div>
 ${S.ui.water?waterCard():''}${S.ui.fast?fastCard():''}
 <div class="sec"><h2>Micronutrients <small>approximate</small></h2><div class="card">${microPanel(T)}</div></div>`}
function logAgain(){const y=groupMeals(entriesOn(addDays(vd,-1))),rec=recentFoods(10);
 const rep=y.map(g=>`<button class="chip" data-act="repeat" data-k="${esc(g.key)}">↺ Yesterday’s ${esc(g.name.toLowerCase())} <span class="mut sm">${fmt(g.n.kcal)}</span></button>`).join('');
 const sv=S.meals.map(m=>`<button class="chip" style="background:color-mix(in srgb,var(--haldi) 22%,var(--surf))" data-act="quickMeal" data-id="${m.id}">★ ${esc(m.name)}</button>`).join('');
 const rc=rec.map(f=>`<button class="chip" data-act="openFood" data-id="${f.id}">${art(f,30)}${esc(f.name.split(' (')[0].split(' / ')[0])}</button>`).join('');
 if(!rep&&!sv&&!rc)return`<div class="sec"><div class="card note info sm">Foods you log will appear here for one-tap logging — plus “repeat yesterday’s meal” and your saved meals.</div></div>`;
 return`<div class="sec"><h2>Log again</h2><div class="chips">${rep}${sv}${rc}</div></div>`}
function mealCard(g){const t=g.es;return`<button class="mcard" data-act="openMeal" data-k="${esc(g.key)}"><div class="mh"><b>${esc(g.name)} <span class="mut sm" style="font-family:var(--fb);font-weight:500">${t12(t[0].time)}${t.length>1&&t[t.length-1].time!==t[0].time?' – '+t12(t[t.length-1].time):''}</span></b><span class="num">${fmt(g.n.kcal)}<small class="sm mut" style="font-family:var(--fb);font-weight:500"> kcal</small></span></div>
 <div class="mac"><span class="p">Protein <b>${r0(g.n.p)} g</b></span><span>Carbs <b>${r0(g.n.c)} g</b></span><span>Fat <b>${r0(g.n.f)} g</b></span><span>Fibre <b>${r0(g.n.fib)} g</b></span></div>
 <div class="sm mut ell" style="margin-top:8px">${esc(t.map(e=>e.name.split(' (')[0]).join(' · '))}</div></button>`}
function waterCard(){const ml=S.water[vd]||0,tg=S.tg.water;return`<div class="sec"><h2>Water <small>${ml} / ${tg} ml</small></h2><div class="card"><div class="row"><span style="color:var(--cal)">${ic('drop',26)}</span><div class="grow"><div class="pbar"><i style="width:${Math.min(100,ml/tg*100)}%;background:var(--cal)"></i></div><div class="xs mut" style="margin-top:4px">${Math.floor(ml/250)} glasses of 250 ml</div></div><button class="btn sm" data-act="water" data-d="250">＋ Glass</button><button class="btn ghost sm" data-act="water" data-d="-250" aria-label="Remove a glass">−</button></div></div></div>`}
function microPanel(T){const R=REF();return`<details class="dt" ${S.ui.microOpen?'open':''}><summary>${['fe','ca','vC','b12'].map(k=>MNAME[k][0]+' '+Math.min(999,Math.round(T[k]/R[k]*100))+'%').join(' · ')}</summary><div class="mic">${['fe','ca','vA','b12','vC','vD','fol','mg','k','zn','na'].map(k=>{const p=T[k]/R[k],lim=k==='na';return`<div class="r"><span>${MNAME[k][0]}</span><div class="pbar"><i style="width:${Math.min(100,p*100)}%;background:${lim?(p>1?'var(--bad)':'var(--steel3)'):(p>=1?'var(--fib)':'var(--carb)')}"></i></div><span>${r1(T[k])} / ${lim?'<':''}${R[k]} ${MNAME[k][1]}</span></div>`}).join('')}<p class="xs mut" style="margin:6px 0 0">Micronutrients are approximate (based on each food’s main ingredients) and reference values are general adult figures, not medical advice. Sodium is a limit; the rest are daily targets.</p></div></details>`}
function fastCard(){const f=S.fast,now=Date.now();const[hf]=f.plan.split(':').map(Number);let body;if(f.start){const el=(now-f.start)/36e5,p=Math.min(1,el/hf);body=`<div class="row"><div class="grow"><div class="num" style="font-size:26px">${Math.floor(el)}h ${pad(Math.floor(el%1*60))}m</div><div class="sm mut">of ${hf}h fast · ${p>=1?'goal reached 🎉':Math.ceil(hf-el)+'h to go'}</div></div><button class="btn hal sm" data-act="fastEnd">End fast</button></div><div class="pbar" style="margin-top:10px"><i style="width:${p*100}%;background:var(--sug)"></i></div>`}else body=`<div class="row"><div class="grow sm">Plan <b>${f.plan}</b> — eat within a ${24-hf}-hour window.</div><button class="btn sm" data-act="fastStart">Start fast</button></div>`;
 return`<div class="sec"><h2>Fasting timer</h2><div class="card">${body}</div></div>`}
ACT.fastStart=()=>{S.fast.start=Date.now();save();render()};ACT.fastEnd=()=>{S.fast.hist.push({s:S.fast.start,e:Date.now()});S.fast.start=null;save();render()};
ACT.water=(t)=>{S.water[vd]=Math.max(0,(S.water[vd]||0)+ +t.dataset.d);save();render()};
ACT.go=t=>go(t.dataset.r);ACT.theme=()=>{const cur=document.documentElement.dataset.theme;const dark=cur==='dark'||(!cur&&matchMedia('(prefers-color-scheme:dark)').matches);setTheme(dark?'light':'dark')};
function setTheme(t){S.ui.theme=t;document.documentElement.dataset.theme=t;save()}
ACT.dprev=()=>{vd=addDays(vd,-1);render()};ACT.dnext=()=>{if(vd<today()){vd=addDays(vd,1);render()}};
ACT.addMeal=t=>{const m=t.dataset.m;UI.q='';go('add');UI.mealCtx=m;render();$('#q')?.focus();toast('Pick a food for '+MEALNAME[m].toLowerCase())};
ACT.openMeal=t=>openMeal(t.dataset.k);
ACT.repeat=t=>{const g=groupMeals(entriesOn(addDays(vd,-1))).find(x=>x.key===t.dataset.k);if(!g)return;const m=g.key.split(':')[0];
 openPlate({title:'Repeat yesterday’s '+g.name.toLowerCase(),items:g.es.map(e=>({fid:e.fid,qty:e.qty,unit:e.unit,mods:e.mods||{}})),meal:m==='custom'?'custom':m,cust:g.name,time:m==='custom'?null:MEALS.find(x=>x[0]===m)[4]})};
function openMeal(key){const g=groupMeals(entriesOn(vd)).find(x=>x.key===key);if(!g){closeSheet();return}const n=g.n;
 openSheet(esc(g.name),`<div class="card"><div class="row sp"><div><div class="num" style="font-size:38px">${fmt(n.kcal)}<small class="sm mut" style="font-family:var(--fb)"> kcal</small></div></div><div style="text-align:right"><div class="num" style="font-size:30px;color:var(--pro)">${r0(n.p)} g</div><span class="sm mut">protein</span></div></div>
 <div class="mac"><span>Carbs <b>${r0(n.c)} g</b></span><span>Fat <b>${r0(n.f)} g</b></span><span>Fibre <b>${r0(n.fib)} g</b></span><span>Sugar <b>${r0(n.sug)} g</b></span></div></div>
 <div class="card" style="padding:6px 12px">${g.es.map(e=>{const f=F(e.fid);return`<button class="li" data-act="editEntry" data-id="${e.id}">${art(f,44)}<div class="grow"><div class="nm">${esc(e.name)}</div><div class="sm mut">${esc(qtxt(f,e.qty,e.unit))} · ${r0(e.g)} g${modText(f,e.mods||{})?' · '+esc(modText(f,e.mods)):''} · ${t12(e.time)}</div></div><div class="k">${fmt(e.n.kcal)}<small>${r0(e.n.p)} g P</small></div></button>`}).join('')}</div>
 <details class="dt" style="margin-top:8px"><summary>Full nutrition breakdown</summary><table class="nt">${nutRows(n)}</table></details>`,
 `<button class="btn ghost" data-act="saveMealFrom" data-k="${esc(key)}">★ Save as meal</button><button class="btn" data-act="addToMeal" data-m="${g.key.split(':')[0]}">＋ Add food</button>`)}
const nutRows=n=>[['Calories',fmt(n.kcal)+' kcal'],['Protein',r1(n.p)+' g'],['Carbohydrates',r1(n.c)+' g'],['  of which sugar',r1(n.sug)+' g'],['Fat',r1(n.f)+' g'],['Fibre',r1(n.fib)+' g'],...Object.keys(MNAME).map(k=>[MNAME[k][0],r1(n[k])+' '+MNAME[k][1]])].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
ACT.addToMeal=t=>{closeSheet();UI.mealCtx=t.dataset.m;UI.q='';go('add')};
ACT.saveMealFrom=t=>{const g=groupMeals(entriesOn(vd)).find(x=>x.key===t.dataset.k);if(!g)return;const nm=prompt('Name this meal (e.g. “My usual dinner”)',g.name==='Custom'?'':'My usual '+g.name.toLowerCase());if(!nm)return;
 S.meals.push({id:uid(),name:nm.slice(0,40),items:g.es.map(e=>({fid:e.fid,qty:e.qty,unit:e.unit,mods:e.mods||{}}))});save();toast('Saved “'+nm+'”');render()};
/* exercise */
ACT.addEx=()=>{const st={a:0,m:30,k:null};const draw=()=>{const met=ACTS[st.a][1],k=st.k??exCalc(met,st.m);$('#shb').innerHTML=`<div class="opts">${ACTS.map((a,i)=>`<button class="opt ${i===st.a?'on':''}" data-act="exA" data-i="${i}">${a[0]}</button>`).join('')}</div>
 <label class="field"><span>Minutes</span><div class="stepper"><button data-act="exM" data-d="-5">−</button><input id="exm" type="number" inputmode="numeric" value="${st.m}" data-in="exm"><button data-act="exM" data-d="5">＋</button></div></label>
 <div class="card" style="margin-top:14px"><div class="row sp"><span class="mut">Estimated burn</span><span class="num" style="font-size:30px;color:var(--fib)">${k} kcal</span></div><p class="xs mut" style="margin:6px 0 0">Estimated from activity type, your weight and time. Real burn varies — edit if your watch says otherwise.</p><label class="field"><span>Override kcal (optional)</span><input class="inp" type="number" inputmode="numeric" placeholder="${exCalc(met,st.m)}" data-in="exk"></label></div>`};
 ACT.exA=t=>{st.a=+t.dataset.i;st.k=null;draw()};ACT.exM=t=>{st.m=Math.max(5,st.m+ +t.dataset.d);st.k=null;draw()};INP.exm=t=>{st.m=Math.max(1,+t.value||0);st.k=null};INP.exk=t=>{st.k=t.value?+t.value:null};
 ACT.exSave=()=>{S.exercise.push({id:uid(),date:vd,time:nowT(),name:ACTS[st.a][0],min:st.m,kcal:st.k??exCalc(ACTS[st.a][1],st.m)});save();closeSheet();render();toast('Exercise added')};
 openSheet('Add exercise','', `<button class="btn full" data-act="exSave">Add to today</button>`);draw()};
ACT.delEx=t=>{S.exercise=S.exercise.filter(e=>e.id!==t.dataset.id);save();render()};

/* ============ ADD FOOD SCREEN ============ */
const FILTERS=[['veg','Vegetarian'],['nv','Non-veg'],['b','Breakfast'],['l','Lunch'],['d','Dinner'],['s','Snacks'],['fru','Fruits'],['bev','Beverages'],['rest','Restaurant'],['pack','Packaged']];
function servTxt(f){const u=f.units[0],c=calc(f,f.def,u.l,defMods(f,f.def*u.g));return{t:`${f.def>1||f.def%1?f.def+' × ':'1 × '}${u.l} (${r0(c.g)} ${u.l==='ml'||f.cat==='bev'?'ml':'g'})`.replace('1 × g','g'),k:c.n.kcal,p:c.n.p}}
function foodRow(f){const s=servTxt(f);return`<div class="li" data-act="openFood" data-id="${f.id}" role="button" tabindex="0">${art(f,46)}<div class="grow"><div class="nm ell">${vegMark(f.veg)} ${esc(f.name)}</div><div class="sm mut ell">${esc(s.t)}${f.alias?' · '+esc(f.alias.split(' · ').slice(0,2).join(' · ')):''}</div></div><div class="k">${fmt(s.k)}<small>${r1(s.p)} g P</small></div><button class="plus" data-act="plateAdd" data-id="${f.id}" aria-label="Add ${esc(f.name)} to plate">＋</button></div>`}
function vAdd(){const seg=UI.seg;let body='';
 if(seg==='foods'){let list;const hasQ=UI.q.trim().length>0,fl=[...UI.fl];
  if(hasQ||fl.length||UI.cat){list=searchFoods(UI.q,fl,80);if(UI.cat)list=list.filter(f=>f.cat===UI.cat)}
  const chips=`<div class="chips">${UI.cat?`<button class="chip on" data-act="catClear">${esc(CATS[UI.cat][0])} ✕</button>`:''}${FILTERS.map(([k,l])=>`<button class="chip sm ${UI.fl.has(k)?'on':''}" data-act="flt" data-k="${k}">${l}</button>`).join('')}</div>`;
  if(list){body=chips+(list.length?`<div class="card" style="padding:4px 12px">${list.map(foodRow).join('')}</div>`:`<div class="card empty"><b>No match for “${esc(UI.q)}”</b><br><span class="sm">Describe it and let AI estimate the nutrition.</span></div>`)+
    `<div class="card" style="margin-top:12px"><div class="b">Can’t find it?</div><p class="sm mut" style="margin:4px 0 10px">Describe it (“homemade paneer tikka, 150 g”) — AI estimates it and you confirm before it’s added. Or enter values by hand.</p><button class="btn full" data-act="newFood">＋ Add food with AI</button></div>`}
  else{const rc=freqFoods(6);body=chips+(rc.length?`<div class="sec" style="margin-top:6px"><h2>Recent &amp; frequent</h2><div class="card" style="padding:4px 12px">${rc.map(foodRow).join('')}</div></div>`:'')+
   `<div class="sec"><h2>Browse <small>${FOODS.length} foods</small></h2><div class="grid3">${Object.entries(CATS).map(([k,c])=>`<button class="tile" data-act="cat" data-k="${k}">${art(FOOD[c[1]],48)}${c[0]}</button>`).join('')}</div></div><button class="btn ghost full" style="margin-top:14px" data-act="newFood">＋ Add a food that’s not here</button>`}}
 else if(seg==='mine'){body=S.foods.length?`<div class="card" style="padding:4px 12px">${S.foods.map(foodRow).join('')}</div>`:`<div class="card empty">${art(F('tofu'),56)}<br><b>No saved foods yet</b><br><span class="sm">Foods you add with AI, from a label scan, or by hand can be saved here.</span></div>`;body+=`<button class="btn full" style="margin-top:12px" data-act="newFood">＋ New food</button>`}
 else if(seg==='meals'){body=S.meals.length?S.meals.map(m=>{const n=mealN(m);return`<div class="card"><div class="row"><div class="grow" data-act="reviewMeal" data-id="${m.id}" role="button" tabindex="0"><div class="b">★ ${esc(m.name)}</div><div class="sm mut">${esc(m.items.map(i=>F(i.fid)?.name.split(' (')[0]).filter(Boolean).join(' + '))}</div><div class="sm" style="margin-top:4px"><b>${fmt(n.kcal)}</b> kcal · <b style="color:var(--pro)">${r0(n.p)} g</b> protein</div></div><button class="btn sm" data-act="quickMeal" data-id="${m.id}">Log</button><button class="iconbtn" data-act="delMeal" data-id="${m.id}" aria-label="Delete meal">${ic('trash',18)}</button></div></div>`}).join(''):`<div class="card empty">${art(F('nthali'),64)}<br><b>No saved meals yet</b><br><span class="sm">Save a combination like “My usual dinner” from any logged meal or from the plate, then log it in one tap.</span></div>`}
 else body=GUIDE.map(g=>`<div class="card"><h3>${g.t}</h3><div class="cmp" style="margin-top:10px">${g.ids.map(id=>{const f=FOOD[id],s=servTxt(f);return`<button data-act="openFood" data-id="${id}">${art(f,54)}<span>${esc(f.name.split(' (')[0])}</span><span class="mut xs">${fmt(s.k)} kcal · ${s.t.split(' (')[0]}</span></button>`}).join('')}</div><p class="sm mut" style="margin:10px 0 0"><b style="color:var(--ink)">How to tell:</b> ${esc(g.tip)}</p></div>`).join('')+`<p class="xs mut c">These are illustrations, not photos. The food record has a slot for real reference photos when you connect an image source.</p>`;
 return`<div class="top"><h1>Add food</h1>${UI.mealCtx?`<button class="chip sm on" data-act="ctxClear">for ${MEALNAME[UI.mealCtx]?.toLowerCase()} ✕</button>`:''}</div>
 <div class="search">${ic('search')}<input id="q" type="search" placeholder="Search roti, paneer, chai, biryani…" value="${esc(UI.q)}" data-in="q" autocomplete="off" enterkeyhint="search" aria-label="Search foods"><button class="micbtn" data-act="voice" aria-label="Search by voice">${ic('mic',22)}</button></div>
 <div class="seg" style="margin:12px 0"><button class="${seg==='foods'?'on':''}" data-act="seg" data-s="foods">Foods</button><button class="${seg==='mine'?'on':''}" data-act="seg" data-s="mine">My foods</button><button class="${seg==='meals'?'on':''}" data-act="seg" data-s="meals">Meals</button><button class="${seg==='guide'?'on':''}" data-act="seg" data-s="guide">Guide</button></div><div id="addBody">${body}</div>`}
INP.q=t=>{UI.q=t.value;const b=$('#addBody');const s=t.selectionStart;const keep=document.activeElement===t;const html=vAdd();const tmp=document.createElement('div');tmp.innerHTML=html;b.innerHTML=tmp.querySelector('#addBody').innerHTML;if(keep){t.focus();try{t.setSelectionRange(s,s)}catch(e){}}};
ACT.seg=t=>{UI.seg=t.dataset.s;render()};ACT.flt=t=>{const k=t.dataset.k;UI.fl.has(k)?UI.fl.delete(k):UI.fl.add(k);render()};ACT.cat=t=>{UI.cat=t.dataset.k;render()};ACT.catClear=()=>{UI.cat=null;render()};ACT.ctxClear=()=>{UI.mealCtx=null;render()};
const mealN=m=>sumN(m.items.map(i=>plateItemN(i)));
function plateItemN(i){const f=F(i.fid);return f?calc(f,i.qty,i.unit,i.mods||{}).n:zeroN()}
ACT.quickMeal=t=>{const m=S.meals.find(x=>x.id===t.dataset.id);if(!m)return;const time=nowT(),meal=mealFor(time),gid=uid();const es=m.items.filter(i=>F(i.fid)).map(i=>mkEntry(F(i.fid),i.qty,i.unit,i.mods||{},vd,time,meal,'',{gid}));addEntries(es);
 toast('Logged “'+m.name+'” · '+fmt(sumN(es.map(e=>e.n)).kcal)+' kcal',()=>{S.entries=S.entries.filter(e=>e.gid!==gid);save()});render()};
ACT.reviewMeal=t=>{const m=S.meals.find(x=>x.id===t.dataset.id);if(m)openPlate({title:m.name,items:m.items.map(i=>({...i})),mealId:m.id})};
ACT.delMeal=t=>{if(confirm('Delete this saved meal?')){S.meals=S.meals.filter(m=>m.id!==t.dataset.id);save();render()}};

/* ============ LOG SHEET ============ */
const MODKEY={oil:'oil',ghee:'gh',spread:'sp',mtype:'mt',milk:'milk',cmilk:'cm',sugar:'sugar'};
function openLog(f,o={}){if(!f)return;const u=o.unit?unitOf(f,o.unit):f.units[0],pp=S.learn.portions[f.id];
 let time=o.time||nowT(),meal=o.meal||UI.mealCtx||null;if(meal&&!o.time&&meal!==mealFor(time)&&meal!=='custom')time=MEALS.find(m=>m[0]===meal)?.[4]||time;
 LOG={f,qty:o.qty??f.def,unit:u.l,mods:o.mods||defMods(f,(o.qty??f.def)*u.g),date:o.date||vd,time,meal:meal||mealFor(time),cust:o.cust||'',fixed:!!meal,edit:o.edit||null};
 openSheet(esc(o.edit?'Edit entry':'Log food'),'','');renderLog()}
ACT.openFood=t=>openLog(F(t.dataset.id));
function renderLog(){const L=LOG,f=L.f,u=unitOf(f,L.unit),sim=GUIDE.find(g=>g.ids.includes(f.id));
 const modsHtml=f.mods.filter(k=>MODDEF[k]).map(k=>{const md=MODDEF[k],key=MODKEY[k],cur=JSON.stringify(L.mods[key]??null);return`<div class="field"><span>${md.l}</span><div class="opts">${md.o.map((o,i)=>`<button class="opt ${JSON.stringify(o[1])===cur?'on':''}" data-act="mod" data-c="${k}" data-i="${i}">${o[0]}</button>`).join('')}</div></div>`}).join('');
 const src=SRC[f.src||'ref'];
 $('#shb').innerHTML=`<div class="row" style="margin-bottom:6px">${art(f,64)}<div class="grow"><div class="b" style="font:700 19px var(--fd)">${vegMark(f.veg)} ${esc(f.name)}</div>${f.alias?`<div class="sm mut">${esc(f.alias.split(' · ').slice(0,3).join(' · '))}</div>`:''}<span class="badge ${f.src==='ai'?'ai':''}" title="${esc(src[1])}">${src[0]}</span></div></div>
 ${f.src==='ai'||f.src==='pack'?`<div class="note sm">${esc(src[1])}.</div>`:''}
 <div class="field"><span>How much?</span><div class="stepper"><button data-act="qty" data-d="-1" aria-label="Less">−</button><input id="lq" type="number" inputmode="decimal" step="any" value="${L.qty}" data-in="lq" aria-label="Quantity"><button data-act="qty" data-d="1" aria-label="More">＋</button></div></div>
 <div class="opts" style="margin-top:8px">${f.units.map(x=>`<button class="opt ${x.l===L.unit?'on':''}" data-act="unit" data-u="${esc(x.l)}">${esc(x.l)}</button>`).join('')}</div>${modsHtml}
 <div class="card" id="logNut" style="margin-top:16px"></div>
 <div class="field"><span>When</span><div class="grid2"><input class="inp" type="date" value="${L.date}" max="${today()}" data-ch="ldate" aria-label="Date"><input class="inp" type="time" value="${L.time}" data-ch="ltime" aria-label="Time eaten"></div></div>
 <div class="opts" style="margin-top:8px">${MEALS.map(m=>`<button class="opt ${L.meal===m[0]?'on':''}" data-act="lmeal" data-m="${m[0]}">${m[1]}</button>`).join('')}</div>${L.meal==='custom'?`<input class="inp" style="margin-top:8px" placeholder="Name this meal (e.g. Pre-workout)" value="${esc(L.cust)}" data-in="lcust">`:''}
 ${sim?`<div class="field"><span>Not quite it? Look-alikes</span><div class="chips">${sim.ids.filter(i=>i!==f.id).map(i=>`<button class="chip sm" data-act="swapFood" data-id="${i}">${art(FOOD[i],26)}${esc(FOOD[i].name.split(' (')[0])}</button>`).join('')}</div><p class="xs mut" style="margin:0">${esc(sim.tip)}</p></div>`:''}
 ${f.src==='user'||f.src==='ai'||f.src==='label'?`<div class="row" style="margin-top:12px"><button class="btn ghost sm" data-act="editFood" data-id="${f.id}">${ic('edit',16)} Edit food</button>${S.foods.some(x=>x.id===f.id)?`<button class="btn bad sm" data-act="delFood" data-id="${f.id}">Delete food</button>`:''}</div>`:''}`;
 $('#shf')?.remove();$('.sheet').insertAdjacentHTML('beforeend',`<div class="sh-f" id="shf">${L.edit?`<button class="btn bad" style="flex:0 0 auto" data-act="delEntry">${ic('trash',18)}</button><button class="btn" data-act="logGo">Save changes</button>`:`<button class="btn ghost" data-act="toPlateFromLog">＋ Add to plate</button><button class="btn" data-act="logGo">Log food</button>`}</div>`);updLog()}
function updLog(){const L=LOG,f=L.f,c=calc(f,L.qty,L.unit,L.mods),n=c.n,R=REF();
 $('#logNut').innerHTML=`<div class="xs mut b" style="letter-spacing:.05em;text-transform:uppercase">For ${L.qty} × ${esc(unitOf(f,L.unit).l)} · ${r0(c.g)} ${f.cat==='bev'||L.unit==='ml'?'ml':'g'}</div>
 <div class="row sp" style="margin:4px 0 8px"><div><span class="num" style="font-size:46px">${fmt(n.kcal)}</span><span class="mut"> kcal</span></div><div style="text-align:right"><span class="num" style="font-size:34px;color:var(--pro)">${r1(n.p)}</span><span class="mut"> g protein</span></div></div>
 <div class="mac" style="margin:0 0 6px"><span>Carbs <b>${r1(n.c)} g</b></span><span>Fat <b>${r1(n.f)} g</b></span><span>Fibre <b>${r1(n.fib)} g</b></span><span>Sugar <b>${r1(n.sug)} g</b></span></div>
 <details class="dt"><summary>All nutrients</summary><table class="nt">${nutRows(n)}</table><p class="xs mut" style="margin:6px 0 0">${f.src==='ai'||f.src==='label'||f.src==='user'?'Values as entered or estimated.':'Macros are typical values; vitamins and minerals are approximate.'}</p></details>`;}
INP.lq=t=>{LOG.qty=Math.max(0,+t.value||0);updLog()};INP.lcust=t=>{LOG.cust=t.value};
CHG.ldate=t=>{LOG.date=t.value||LOG.date};CHG.ltime=t=>{LOG.time=t.value||LOG.time;if(!LOG.fixed){LOG.meal=mealFor(LOG.time);renderLog()}};
ACT.qty=t=>{const u=unitOf(LOG.f,LOG.unit),s=stepFor(u);let q=LOG.qty+ +t.dataset.d*s;if(u.l==='g'||u.l==='ml')q=Math.round(q/5)*5;LOG.qty=Math.max(s>=1?s:.5,Math.round(q*100)/100);renderLog()};
ACT.unit=t=>{const f=LOG.f,g=LOG.qty*unitOf(f,LOG.unit).g,nu=unitOf(f,t.dataset.u);let q=g/nu.g;const s=stepFor(nu);q=nu.l==='g'||nu.l==='ml'?Math.round(q/5)*5:Math.max(s,Math.round(q/s)*s);LOG.unit=nu.l;LOG.qty=Math.round(q*100)/100;renderLog()};
ACT.mod=t=>{const k=t.dataset.c;LOG.mods[MODKEY[k]]=MODDEF[k].o[+t.dataset.i][1];updLog();$$('[data-act=mod]',$('#shb')).forEach(b=>{if(b.dataset.c===k)b.classList.toggle('on',b===t)})};
ACT.lmeal=t=>{LOG.meal=t.dataset.m;LOG.fixed=true;renderLog()};
ACT.swapFood=t=>{const f=FOOD[t.dataset.id];const o={date:LOG.date,time:LOG.time,meal:LOG.fixed?LOG.meal:null,edit:LOG.edit};LOG=null;openLog(f,o)};
ACT.logGo=()=>{const L=LOG;if(!(L.qty>0))return toast('Enter a quantity');keepFood(L.f);const e=mkEntry(L.f,L.qty,L.unit,L.mods,L.date,L.time,L.meal,L.cust);
 if(L.edit){const i=S.entries.findIndex(x=>x.id===L.edit.id);e.id=L.edit.id;if(L.edit.gid)e.gid=L.edit.gid;S.entries[i]=e;save()}else addEntries([e]);
 vd=L.date;const k=fmt(e.n.kcal);closeSheet();render();toast(`${L.edit?'Updated':'Logged'} ${e.name.split(' (')[0]} · ${k} kcal`)};
ACT.delEntry=()=>{const id=LOG.edit.id,old=LOG.edit;S.entries=S.entries.filter(e=>e.id!==id);save();closeSheet();render();toast('Entry deleted',()=>{S.entries.push(old);save()})};
ACT.editEntry=t=>{const e=S.entries.find(x=>x.id===t.dataset.id);if(!e)return;openLog(F(e.fid),{edit:e,qty:e.qty,unit:e.unit,mods:{...e.mods},date:e.date,time:e.time,meal:e.meal,cust:e.cust})};
function keepFood(f){if(!FOOD[f.id]&&!S.foods.some(x=>x.id===f.id))S.tfoods[f.id]=f}
ACT.delFood=t=>{if(confirm('Delete this saved food? Past log entries stay.')){const f=F(t.dataset.id);if(f)S.tfoods[f.id]=f;S.foods=S.foods.filter(x=>x.id!==t.dataset.id);save();closeSheet();render()}};

/* ============ PLATE (multi-item review) ============ */
ACT.plateAdd=t=>{const f=F(t.dataset.id);plateNew();const u=f.units[0],pp=S.learn.portions[f.id];PL.items.push({fid:f.id,qty:f.def,unit:u.l,mods:defMods(f,f.def*u.g)});drawPlateBar();toast(f.name.split(' (')[0]+' added to plate')};
ACT.toPlateFromLog=()=>{const L=LOG;keepFood(L.f);plateNew();PL.items.push({fid:L.f.id,qty:L.qty,unit:L.unit,mods:{...L.mods}});closeSheet();toast('Added to plate')};
function plateNew(){if(!PL)PL={items:[],date:vd,time:null,meal:null,title:'Your plate'}}
ACT.plClear=()=>{PL=null;drawPlateBar()};ACT.plOpen=()=>openPlate({});
function openPlate(o){if(o.items||!PL)PL={items:o.items||[],date:vd,time:o.time||null,meal:o.meal||null,cust:o.cust||'',title:o.title||'Your plate',photo:o.photo,ai:!!o.ai,note:o.note,hash:o.hash,thumb:o.thumb,mealId:o.mealId,save:false,saveName:''};
 else Object.assign(PL,o.title?{title:o.title}:{});if(!PL.time){PL.time=nowT();PL.meal=PL.meal||mealFor(PL.time)}else if(!PL.meal)PL.meal=mealFor(PL.time);
 PL.items.forEach(i=>i.mods=i.mods||{});openSheet(esc(PL.ai?'Is this correct?':PL.title),'','');renderPlate()}
function renderPlate(){const P=PL;
 const rows=P.items.map((it,i)=>{const f=F(it.fid);if(!f)return'';const u=unitOf(f,it.unit),n=calc(f,it.qty,it.unit,it.mods).n,lo=it.ai&&it.ai.conf==='low',mt=modText(f,it.mods||{});
 return`<div class="li" style="align-items:flex-start;flex-wrap:wrap">${art(f,48)}<div class="grow"><button class="nm b" style="text-align:left;text-decoration:underline dotted;text-underline-offset:3px" data-act="plChange" data-i="${i}">${esc(f.name)}</button>${it.ai?` <span class="badge ${lo?'warn':'ai'}">${lo?'check this':'AI · '+(it.ai.conf||'medium')}</span>`:''}
 <div class="row" style="margin-top:6px;gap:6px;flex-wrap:wrap"><button class="plus" style="width:34px;height:34px" data-act="plQ" data-i="${i}" data-d="-1" aria-label="Less">−</button><input class="inp" style="width:70px;min-height:36px;padding:4px 6px;text-align:center" type="number" inputmode="decimal" step="any" value="${it.qty}" data-in="plQty" data-i="${i}" aria-label="Quantity"><button class="plus" style="width:34px;height:34px" data-act="plQ" data-i="${i}" data-d="1" aria-label="More">＋</button>
 <select class="inp" style="min-height:36px;padding:4px 8px;width:auto;flex:1 1 120px;min-width:0" data-ch="plUnit" data-i="${i}" aria-label="Unit">${f.units.map(x=>`<option ${x.l===it.unit?'selected':''}>${esc(x.l)}</option>`).join('')}</select></div>
 <div class="xs mut" style="margin-top:4px">≈ ${r0(n.p*0+calc(f,it.qty,it.unit,it.mods).g)} g${mt?' · '+esc(mt):''}${it.ai&&it.ai.note?' · '+esc(it.ai.note):''}</div></div>
 <div class="k" id="pk${i}">${fmt(n.kcal)}<small>${r0(n.p)} g P</small></div><button class="iconbtn" style="width:34px;height:34px" data-act="plDel" data-i="${i}" aria-label="Remove ${esc(f.name)}">${ic('trash',16)}</button></div>`}).join('');
 $('#shb').innerHTML=`${P.photo?`<img class="prev" style="max-height:170px;margin-bottom:10px" src="${P.photo}" alt="Your meal photo">`:''}
 ${!P.ai&&P.note?`<div class="note sm">${esc(P.note)}</div>`:''}${P.ai?`<div class="note sm">AI made these guesses from your photo. <b>Nothing is logged until you confirm.</b> Tap a food name to change it, adjust the amounts, delete extras, or add what’s missing.${P.note?'<br><span class="mut">'+esc(P.note)+'</span>':''}</div>`:''}
 <div class="card" style="padding:4px 12px;margin-top:10px">${rows||'<div class="empty sm">Plate is empty — add a food.</div>'}</div>
 <button class="btn ghost full" style="margin-top:10px" data-act="plAdd">＋ Add missing food or ingredient</button>
 <div class="card" style="margin-top:12px" id="plTot"></div>
 <div class="field"><span>When</span><div class="grid2"><input class="inp" type="date" value="${P.date}" max="${today()}" data-ch="pdate"><input class="inp" type="time" value="${P.time}" data-ch="ptime"></div></div>
 <div class="opts" style="margin-top:8px">${MEALS.map(m=>`<button class="opt ${P.meal===m[0]?'on':''}" data-act="pmeal" data-m="${m[0]}">${m[1]}</button>`).join('')}</div>${P.meal==='custom'?`<input class="inp" style="margin-top:8px" placeholder="Meal name" value="${esc(P.cust||'')}" data-in="pcust">`:''}
 <label class="row" style="margin-top:14px"><input type="checkbox" ${P.save?'checked':''} data-ch="psave" style="width:22px;height:22px"><span class="b">Save as a meal for one-tap logging</span></label>${P.save?`<input class="inp" style="margin-top:8px" placeholder="e.g. My usual dinner" value="${esc(P.saveName||'')}" data-in="psname">`:''}`;
 $('#shf')?.remove();$('.sheet').insertAdjacentHTML('beforeend',`<div class="sh-f" id="shf"><button class="btn ghost" data-act="plDiscard">${P.ai?'Discard':'Close'}</button><button class="btn" data-act="plConfirm" ${P.items.length?'':'disabled'}>${P.ai?'Yes, log it':'Log meal'}</button></div>`);updPlate()}
function updPlate(){const t=sumN(PL.items.map(plateItemN));$('#plTot').innerHTML=`<div class="row sp"><div><span class="num" style="font-size:38px">${fmt(t.kcal)}</span><span class="mut"> kcal</span></div><div style="text-align:right"><span class="num" style="font-size:30px;color:var(--pro)">${r0(t.p)}</span><span class="mut"> g protein</span></div></div><div class="mac"><span>Carbs <b>${r0(t.c)} g</b></span><span>Fat <b>${r0(t.f)} g</b></span><span>Fibre <b>${r0(t.fib)} g</b></span></div>`;
 PL.items.forEach((it,i)=>{const f=F(it.fid),n=f&&calc(f,it.qty,it.unit,it.mods).n,e=$('#pk'+i);if(e&&n)e.innerHTML=fmt(n.kcal)+`<small>${r0(n.p)} g P</small>`})}
INP.plQty=t=>{PL.items[+t.dataset.i].qty=Math.max(0,+t.value||0);updPlate()};INP.pcust=t=>{PL.cust=t.value};INP.psname=t=>{PL.saveName=t.value};
CHG.plUnit=t=>{const it=PL.items[+t.dataset.i],f=F(it.fid),g=it.qty*unitOf(f,it.unit).g,nu=unitOf(f,t.value);it.unit=nu.l;const s=stepFor(nu);it.qty=nu.l==='g'||nu.l==='ml'?Math.round(g/5)*5:Math.max(s,Math.round(g/nu.g/s)*s);renderPlate()};
CHG.pdate=t=>{PL.date=t.value||PL.date};CHG.ptime=t=>{PL.time=t.value||PL.time;if(!PL.fixed){PL.meal=mealFor(PL.time);renderPlate()}};CHG.psave=t=>{PL.save=t.checked;renderPlate()};
ACT.pmeal=t=>{PL.meal=t.dataset.m;PL.fixed=true;renderPlate()};
ACT.plQ=t=>{const it=PL.items[+t.dataset.i],u=unitOf(F(it.fid),it.unit),s=stepFor(u);let q=it.qty+ +t.dataset.d*s;if(u.l==='g'||u.l==='ml')q=Math.round(q/5)*5;it.qty=Math.max(0,Math.round(q*100)/100);renderPlate()};
ACT.plDel=t=>{PL.items.splice(+t.dataset.i,1);renderPlate()};
ACT.plDiscard=()=>{if(PL&&PL.ai)PL=null;closeSheet()};
ACT.plChange=t=>{const i=+t.dataset.i;openPicker('Change food',f=>{const it=PL.items[i];const u=f.units[0];if(it.ai)it.ai.changedTo=f.id;const pp=S.learn.portions[f.id];it.fid=f.id;it.unit=u.l;it.qty=pp&&pp.n>=2?Math.max(.5,Math.round(pp.g/u.g*2)/2):f.def;it.mods=defMods(f,it.qty*u.g)})};
ACT.plAdd=()=>openPicker('Add food',f=>{const u=f.units[0];PL.items.push({fid:f.id,qty:f.def,unit:u.l,mods:defMods(f,f.def*u.g),added:true})});
ACT.plConfirm=()=>{const P=PL;if(!P.items.length)return;const gid=uid(),time=P.time,meal=P.meal;
 const es=P.items.filter(i=>F(i.fid)&&i.qty>0).map(i=>{keepFood(F(i.fid));return mkEntry(F(i.fid),i.qty,i.unit,i.mods||{},P.date,time,meal,P.cust,{gid,est:!!i.ai})});addEntries(es);
 if(P.ai){learnFrom(P.items.map(i=>({ai:i.ai,fid:i.fid,g:i.qty>0?calc(F(i.fid),i.qty,i.unit,i.mods).g:0})));if(P.hash){S.learn.hashes.unshift({h:P.hash,th:P.thumb,d:P.date,items:P.items.map(i=>({fid:i.fid,qty:i.qty,unit:i.unit,mods:i.mods||{}}))});S.learn.hashes=S.learn.hashes.slice(0,30)}}
 if(P.save&&P.saveName)S.meals.push({id:uid(),name:P.saveName.slice(0,40),items:P.items.map(i=>({fid:i.fid,qty:i.qty,unit:i.unit,mods:i.mods||{}}))});
 const tot=sumN(es.map(e=>e.n));vd=P.date;PL=null;save();closeSheet();if(route==='photo'||route==='scan'||route==='add')route='home';render();toast(`Logged ${es.length} item${es.length>1?'s':''} · ${fmt(tot.kcal)} kcal`,()=>{S.entries=S.entries.filter(e=>e.gid!==gid);save()})};
/* picker (search inside sheet) */
function openPicker(title,cb,q=''){const back=()=>{PICK=null;renderPlate?.();$('#shb')&&0};PICK={cb,back:()=>{$('.sheet .sh-h h2').textContent=PL.ai?'Is this correct?':PL.title;renderPlate()}};
 $('.sheet .sh-h h2').textContent=title;$('#shf')?.remove();$('#shb').innerHTML=`<div class="search">${ic('search')}<input id="pq" type="search" placeholder="Search foods…" value="${esc(q)}" data-in="pq" autocomplete="off"></div><div id="pres" class="card" style="margin-top:10px;padding:4px 12px"></div>`;pickList(q);$('#pq').focus()}
function pickList(q){const r=(q.trim()?searchFoods(q,[],40):freqFoods(8).concat(searchFoods('',[],20))).filter((f,i,a)=>a.indexOf(f)===i).slice(0,40);
 $('#pres').innerHTML=r.map(f=>{const s=servTxt(f);return`<button class="li" data-act="pick" data-id="${f.id}">${art(f,40)}<div class="grow"><div class="nm ell">${vegMark(f.veg)} ${esc(f.name)}</div><div class="sm mut">${esc(s.t)}</div></div><div class="k">${fmt(s.k)}<small>${r1(s.p)} g P</small></div></button>`}).join('')||'<div class="empty sm">No matches</div>'}
INP.pq=t=>pickList(t.value);
ACT.pick=t=>{const cb=PICK.cb,f=F(t.dataset.id);const b=PICK.back;cb(f);PICK=null;b()};
