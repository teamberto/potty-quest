const path=require('path');
function fresh(seed, tainted){
  for(const k of Object.keys(require.cache)) delete require.cache[k];
  const h=require('./harness.js');
  h.ctx.__TAINTED=!!tainted;
  if(seed) h.ctx.__seed=seed;
  return h;
}
function boot(saved, tainted, premium){
  for(const k of Object.keys(require.cache)) delete require.cache[k];
  // pre-seed localStorage before game.js reads it: patch harness via env
  process.env.__SEED = JSON.stringify({saved:saved||null, premium:!!premium});
  const h=require('./harness.js');
  h.ctx.__TAINTED=!!tainted;
  return h;
}
let pass=0, fail=0;
function check(name, cond, extra){
  if(cond){pass++; console.log('  \x1b[32mPASS\x1b[0m', name);}
  else {fail++; console.log('  \x1b[31mFAIL\x1b[0m', name, extra!==undefined?('-> '+JSON.stringify(extra)):'');}
}
function click(el){ try{ el.dispatch('click',{preventDefault(){},stopPropagation(){},target:el}); return null; }catch(e){ return e.name+': '+e.message; } }
const g=(h,id)=>h.registry[id];
const hid=(h,id)=>g(h,id)._cls.has('hidden');
const cards=(h)=>g(h,'ml-grid').children;
const rowBtns=(c)=>{const r=c.children.find(x=>x._cls.has('ml-row')); return r?r.children:[];};
const label=(b)=>b.innerHTML||b.textContent||'';

console.log('\n--- 1. fresh player opens My Levels ---');
{
  const h=boot(null,false,false);
  const err=click(g(h,'menu-build'));
  check('no exception', !err, err);
  check('screen visible', !hid(h,'my-levels'));
  check('shows 6 slots', cards(h).length===6, cards(h).length);
  const kinds=cards(h).map(c=>c.className);
  check('1 buildable', kinds.filter(k=>k.includes('empty')).length===1, kinds);
  check('5 locked', kinds.filter(k=>k.includes('locked')).length===5, kinds);
}

console.log('\n--- 2. build -> save -> pitch -> escape ---');
{
  const h=boot(null,false,false);
  click(g(h,'menu-build'));
  let err=click(rowBtns(cards(h)[0])[0]);
  check('editor opened', !err && !hid(h,'editor'), err);
  check('build tutorial shows first time', !hid(h,'build-howto'));
  click(g(h,'build-howto-start'));
  check('tutorial dismissed', hid(h,'build-howto'));
  err=click(g(h,'ed-save'));
  check('save no exception', !err, err);
  check('pitch overlay up', !hid(h,'overlay'));
  err=click(g(h,'overlay-quit'));
  check('Quit to Menu works (was the freeze)', !err, err);
  check('back on My Levels', !hid(h,'my-levels') && hid(h,'overlay'));
  check('stage card now present', cards(h)[0].className==='ml-card', cards(h)[0].className);
}

console.log('\n--- 3. tainted canvas (file:// / strict WebView) ---');
{
  const h=boot(null,true,false);
  click(g(h,'menu-build'));
  click(rowBtns(cards(h)[0])[0]);
  click(g(h,'build-howto-start'));
  click(g(h,'ed-save'));
  click(g(h,'overlay-quit'));
  const err=click(g(h,'ml-back')) || click(g(h,'menu-build'));
  check('re-open survives tainted canvas', !err, err);
  check('screen visible', !hid(h,'my-levels'));
  check('all 6 cards drawn', cards(h).length===6, cards(h).length);
}

console.log('\n--- 4. corrupt saves must not freeze ---');
const corrupt=[
  {name:'no rooms',      st:{name:'A', items:[], floors:{}}},
  {name:'no potty',      st:{name:'B', rooms:[{x:2,y:2,w:6,h:5}], items:[], floors:{}}},
  {name:'null rooms',    st:{name:'C', rooms:null, items:null, floors:null}},
  {name:'legacy w/ plan',st:{name:'D', plan:2, floors:{}, items:[], potty:{x:5,y:5}, bigStart:{x:2,y:2}, littleStart:{x:9,y:6}, kids:2, diff:2, goal:3}},
  {name:'garbage rooms', st:{name:'E', rooms:[{x:'x',y:null,w:undefined,h:NaN}], items:[], floors:{}}},
];
for(const c of corrupt){
  const h=boot([c.st],false,false);
  const err=click(g(h,'menu-build'));
  check(`${c.name}: no exception`, !err, err);
  check(`${c.name}: screen visible`, !hid(h,'my-levels'));
  check(`${c.name}: 6 cards`, cards(h).length===6, cards(h).length);
}

console.log('\n--- 5. premium player ---');
{
  const h=boot(null,false,true);
  click(g(h,'menu-build'));
  const kinds=cards(h).map(c=>c.className);
  check('no locked slots', kinds.filter(k=>k.includes('locked')).length===0, kinds);
  check('6 buildable', kinds.filter(k=>k.includes('empty')).length===6, kinds);
}

console.log('\n--- 6. navigation loop (no dead ends) ---');
{
  const h=boot(null,false,true);
  let err=null;
  err=click(g(h,'menu-build'));                        check('menu -> my levels', !err, err);
  err=click(rowBtns(cards(h)[0])[0]);                  check('my levels -> editor', !err, err);
  click(g(h,'build-howto-start'));
  err=click(g(h,'ed-back'));                           check('editor -> back', !err, err);
  check('my levels visible after back', !hid(h,'my-levels'));
  err=click(g(h,'ml-back'));                           check('my levels -> menu', !err, err);
  check('menu visible', !hid(h,'menu'));
  check('my levels hidden', hid(h,'my-levels'));
}

console.log(`\n================  ${pass} passed, ${fail} failed  ================\n`);
process.exit(fail?1:0);
