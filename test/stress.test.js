// Long-run and random-input stress: forces timeouts, game-overs, and hammers
// the UI with random taps looking for anything that throws.
function boot(opts){
  for(const k of Object.keys(require.cache)) delete require.cache[k];
  process.env.__SEED=JSON.stringify(opts||{});
  return require('./harness.js');
}
const PANELS=['menu','overlay','my-levels','editor','level-select','sticker-book',
              'parent-gate','paywall','howtoplay','build-howto','dash-howto','bonus-howto'];
const g=(h,id)=>h.registry[id];
const hid=(h,id)=>{const e=g(h,id); return !e||e._cls.has('hidden');};
const visible=(h)=>PANELS.filter(p=>!hid(h,p));
let issues=[],checks=0;
const note=(w,p,a)=>{issues.push({w,p,a});console.log(`  \x1b[31m✗\x1b[0m ${w} — ${p}`);};
const ok=(m)=>console.log(`  \x1b[32m✓\x1b[0m ${m}`);
function fire(h,el,type,ev){
  try{ el.dispatch(type,Object.assign({preventDefault(){},stopPropagation(){},target:el,clientX:1+((Math.random()*700)|0),clientY:1+((Math.random()*400)|0),pointerId:1},ev)); }
  catch(e){ return e; }
  return h.ctx.__tick(3);
}
function toMenu(h){
  h.ctx.__tick(6);
  if(!hid(h,'overlay')) fire(h,g(h,'overlay-button'),'click');
  h.ctx.__tick(30);
  for(let i=0;i<6&&hid(h,'menu');i++){ fire(h,g(h,'game'),'pointerdown'); h.ctx.__tick(40); }
  return !hid(h,'menu');
}
const section=(t)=>console.log(`\n\x1b[1m--- ${t} ---\x1b[0m`);

section('story level run to the timer expiring (~10,000 frames)');
{
  const h=boot({premium:true}); toMenu(h);
  fire(h,g(h,'menu-start'),'click');
  if(!hid(h,'howtoplay')) fire(h,g(h,'htp-start'),'click');
  checks++;
  const t=h.ctx.__tick(11000);
  if(t) note('long story run',t.name+': '+t.message,(t.stack||'').split('\n')[1]);
  else{
    ok('11,000 frames ran clean');
    checks++;
    const vis=visible(h);
    vis.includes('overlay') ? ok('timer ran out -> result overlay shown') : note('timer expiry','no overlay after the clock ran out — '+(vis.join('+')||'blank screen'));
    checks++;
    const e=fire(h,g(h,'overlay-button'),'click');
    e ? note('post-timeout button',e.name+': '+e.message) : ok('post-timeout button works');
    checks++;
    // a blank panel list is CORRECT during gameplay — ask the game, not the DOM
    const st=h.ctx.__peek().gameState;
    ['playing','menu','levelComplete','gameOver','bonusRound'].includes(st)
      ? ok(`recovered into a real state (${st})`)
      : note('post-timeout',`stuck in state "${st}" with nothing on screen`);
  }
}

section('dash run to the end (~8,000 frames)');
{
  const h=boot({premium:true}); toMenu(h);
  fire(h,g(h,'menu-dash'),'click');
  if(!hid(h,'dash-howto')) fire(h,g(h,'dash-howto-start'),'click');
  checks++;
  const t=h.ctx.__tick(8000);
  t ? note('long dash run',t.name+': '+t.message,(t.stack||'').split('\n')[1]) : ok('8,000 frames of dash ran clean');
  checks++;
  const e=fire(h,g(h,'overlay-button'),'click');
  e ? note('dash result button',e.name+': '+e.message) : ok('dash result button works');
}

section('mayhem run to the end (~8,000 frames)');
{
  const h=boot({premium:true}); toMenu(h);
  fire(h,g(h,'menu-mayhem'),'click');
  checks++;
  const t=h.ctx.__tick(8000);
  t ? note('long mayhem run',t.name+': '+t.message,(t.stack||'').split('\n')[1]) : ok('8,000 frames of mayhem ran clean');
  checks++;
  const e=fire(h,g(h,'overlay-button'),'click');
  e ? note('mayhem result button',e.name+': '+e.message) : ok('mayhem result button works');
}

section('monkey test: 3,000 random taps everywhere');
{
  for(const premium of [false,true]){
    const h=boot(premium?{premium:true}:{}); toMenu(h);
    const all=Object.values(h.registry).filter(e=>['BUTTON','DIV','INPUT','IMG','CANVAS'].includes(e.tagName));
    let thrown=0, first=null, blank=0;
    for(let i=0;i<3000;i++){
      const el=all[(Math.random()*all.length)|0];
      const type=Math.random()<0.75?'click':(Math.random()<0.5?'pointerdown':'pointerup');
      const e=fire(h,el,type);
      if(e){ thrown++; if(!first) first=`${e.name}: ${e.message} @ ${(e.stack||'').split('\n')[1]||''}`.trim(); }
      if(i%250===0){ const t=h.ctx.__tick(40); if(t){ thrown++; if(!first) first=`LOOP ${t.name}: ${t.message} @ ${(t.stack||'').split('\n')[1]||''}`.trim(); }
        if(!visible(h).length && hid(h,'menu')) blank++; }
    }
    checks++;
    if(thrown) note(`monkey (${premium?'premium':'free'})`,`${thrown} exception(s); first: ${first}`);
    else ok(`monkey (${premium?'premium':'free'}): 3,000 random taps, no exceptions`);
    checks++;
    const t=h.ctx.__tick(200);
    t ? note(`monkey (${premium?'premium':'free'}) aftermath`,t.name+': '+t.message) : ok(`game still running afterwards`);
  }
}

section('save/load round trip with a real saved stage');
{
  const h=boot({premium:true}); toMenu(h);
  fire(h,g(h,'menu-build'),'click');
  const slot=g(h,'ml-grid').children[0];
  const b=slot.children.find(c=>c._cls.has('ml-row')).children[0];
  fire(h,b,'click');
  if(!hid(h,'build-howto')) fire(h,g(h,'build-howto-start'),'click');
  // draw a room by dragging on the canvas
  const cv=g(h,'game');
  fire(h,cv,'pointerdown',{clientX:120,clientY:120});
  fire(h,cv,'pointermove',{clientX:320,clientY:260});
  fire(h,cv,'pointerup',{clientX:320,clientY:260});
  fire(h,g(h,'ed-save'),'click');
  if(!hid(h,'overlay')) fire(h,g(h,'overlay-quit'),'click');
  checks++;
  const saved=JSON.parse(h.store['pottychamp_custom_v1']||'null');
  saved && saved[0] && (saved[0].rooms||[]).length ? ok(`stage persisted with ${saved[0].rooms.length} room(s)`) : note('save','stage did not persist');
  // reload from storage as a returning player
  const h2=boot({premium:true,saved:saved}); toMenu(h2);
  checks++;
  const e=fire(h2,g(h2,'menu-build'),'click');
  e ? note('reload saved stage',e.name+': '+e.message) : ok('saved stage reloads and renders');
  checks++;
  const card=g(h2,'ml-grid').children[0];
  card && card.className==='ml-card' ? ok('saved stage shows as a real card') : note('reload',`card class was "${card&&card.className}"`);
  checks++;
  const play=card.children.find(c=>c._cls.has('ml-row')).children[0];
  const pe=fire(h2,play,'click');
  if(pe) note('play saved stage',pe.name+': '+pe.message);
  else{ const t=h2.ctx.__tick(400); t ? note('playing saved stage',t.name+': '+t.message,(t.stack||'').split('\n')[1]) : ok('saved stage plays for 400 frames'); }
}

console.log('\n================================================');
console.log(`  ${checks} stress checks`);
if(!issues.length) console.log('  \x1b[32mall clean\x1b[0m');
else{ console.log(`  \x1b[31m${issues.length} issue(s):\x1b[0m`);
  issues.forEach((x,i)=>console.log(`   ${i+1}. [${x.w}] ${x.p}${x.a?'\n       '+String(x.a).trim():''}`)); }
console.log('================================================\n');
process.exit(issues.length?1:0);
