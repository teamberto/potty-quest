// Walks every screen and menu option, stepping the real game loop, and reports
// exceptions, dead ends and stuck screens.
function boot(opts){
  for(const k of Object.keys(require.cache)) delete require.cache[k];
  process.env.__SEED=JSON.stringify(opts||{});
  return require('./harness.js');
}
const PANELS=['menu','overlay','my-levels','editor','level-select','sticker-book',
              'parent-gate','paywall','howtoplay','build-howto','dash-howto','bonus-howto'];
const g=(h,id)=>h.registry[id];
const hid=(h,id)=>{const e=g(h,id); return !e || e._cls.has('hidden');};
const visible=(h)=>PANELS.filter(p=>!hid(h,p));

let issues=[], checks=0;
function note(where,problem,at){ issues.push({where,problem,at}); console.log(`  \x1b[31m✗\x1b[0m ${where} — ${problem}`); }
function ok(msg,extra){ console.log(`  \x1b[32m✓\x1b[0m ${msg}${extra?'  ['+extra+']':''}`); }

function fire(h,el,type,ev){
  try{ el.dispatch(type,Object.assign({preventDefault(){},stopPropagation(){},target:el,clientX:200,clientY:150,pointerId:1},ev)); }
  catch(e){ return e; }
  return h.ctx.__tick(6);
}
function tap(h,id,label,canvasOK){
  checks++;
  const el=g(h,id);
  if(!el){ note(label,'no such element: '+id); return false; }
  const e=fire(h,el,'click');
  if(e){ note(label,e.name+': '+e.message,(e.stack||'').split('\n')[1]); return false; }
  const vis=visible(h);
  if(!vis.length && !canvasOK){ note(label,'no panel on screen — would look frozen'); return false; }
  ok(label, vis.join('+')||'canvas');
  return true;
}
function canvasTap(h){ const c=g(h,'game'); fire(h,c,'pointerdown'); h.ctx.__tick(6); }

// splash -> (intro) -> menu, dismissing whatever stands in the way
function toMenu(h){
  h.ctx.__tick(6);
  if(!hid(h,'overlay')) fire(h,g(h,'overlay-button'),'click');
  h.ctx.__tick(30);
  for(let i=0;i<6 && hid(h,'menu');i++){ canvasTap(h); h.ctx.__tick(40); }
  return !hid(h,'menu');
}
function section(t){ console.log(`\n\x1b[1m--- ${t} ---\x1b[0m`); }

// ---------------- boot path ----------------
section('boot: splash -> intro -> menu');
{
  const h=boot({}); h.ctx.__tick(6); checks++;
  visible(h).includes('overlay') ? ok('splash overlay shows') : note('boot','no splash overlay');
  checks++;
  toMenu(h) ? ok('reaches the main menu') : note('boot','never reaches the menu — STUCK');
}

// ---------------- every menu entry ----------------
const ENTRIES=[
  ['menu-start','Story Mode',['htp-start'],true],
  ['menu-levels','Choose Level',['ls-back'],false],
  ['menu-dash','Potty Dash',['dash-howto-start'],true],
  ['menu-mayhem','Potty Mayhem',[],true],
  ['menu-daily','Daily Challenge',[],true],
  ['menu-build','Level Builder',['build-howto-start','ed-back','ml-back'],false],
  ['menu-gift','Daily Surprise',['overlay-button'],false],
  ['menu-stickers','Sticker Book',['sb-back'],false],
  ['menu-howtoplay','How to Play',['htp-start'],false],
  ['menu-intro','Replay Intro',[],true],
  ['menu-cap','Cap Color',[],false],
  ['menu-endless','Endless Mode',[],true],
  ['menu-unlock','Unlock Everything',[],false],
];
for(const premium of [false,true]){
  section(`every menu button — ${premium?'PREMIUM':'free'} player`);
  for(const [id,name,exits,canvasOK] of ENTRIES){
    const h=boot(premium?{premium:true}:{});
    if(!toMenu(h)){ note(name,'could not reach menu'); continue; }
    const el=g(h,id);
    if(!el || el._cls.has('hidden')){ console.log(`  \x1b[90m·\x1b[0m ${name} — not offered right now`); continue; }
    if(!tap(h,id,name,canvasOK)) continue;
    for(const x of exits){
      const xe=g(h,x);
      if(!xe || xe._cls.has('hidden')) continue;
      tap(h,x,`   ${name} -> ${x}`,canvasOK);
    }
  }
}

// ---------------- gameplay ----------------
section('story: play 600 frames, pause, resume, quit');
{
  const h=boot({premium:true}); toMenu(h);
  tap(h,'menu-start','start story',true);
  if(!hid(h,'howtoplay')) tap(h,'htp-start','dismiss how-to-play',true);
  checks++;
  const e=h.ctx.__tick(600);
  e ? note('600 frames of story',e.name+': '+e.message,(e.stack||'').split('\n')[1]) : ok('600 frames of story ran clean');
  tap(h,'btn-pause','pause');
  tap(h,'overlay-button','resume',true);
  tap(h,'btn-pause','pause again');
  tap(h,'overlay-quit','quit to menu');
  checks++;
  hid(h,'menu') ? note('quit','did not land back on the menu') : ok('landed back on the menu');
}

section('level select: every world, first level of each');
{
  const h=boot({premium:true}); toMenu(h);
  tap(h,'menu-levels','open level select');
  const worlds=g(h,'ls-worlds').children;
  checks++; worlds.length ? ok(`${worlds.length} worlds listed`) : note('level select','no worlds rendered');
  for(let w=0;w<worlds.length;w++){
    checks++;
    let e=fire(h,worlds[w],'click');
    if(e){ note(`world tab ${w+1}`,e.name+': '+e.message); continue; }
    const tiles=g(h,'ls-levels').children;
    ok(`world ${w+1}: ${tiles.length} level tiles`);
    if(!tiles.length){ note(`world ${w+1}`,'world has no levels'); continue; }
    checks++;
    e=fire(h,tiles[0],'click');
    if(e){ note(`world ${w+1} level 1`,e.name+': '+e.message); continue; }
    if(!hid(h,'howtoplay')) fire(h,g(h,'htp-start'),'click');
    const t=h.ctx.__tick(120);
    t ? note(`world ${w+1} level 1`,'loop '+t.name+': '+t.message,(t.stack||'').split('\n')[1]) : ok(`world ${w+1} level 1 plays`);
    fire(h,g(h,'btn-pause'),'click'); fire(h,g(h,'overlay-quit'),'click');
    fire(h,g(h,'menu-levels'),'click');
  }
}

section('dash + mayhem + daily run for 400 frames');
for(const [id,name] of [['menu-dash','Potty Dash'],['menu-mayhem','Potty Mayhem'],['menu-daily','Daily Challenge']]){
  const h=boot({premium:true}); toMenu(h);
  fire(h,g(h,id),'click');
  if(!hid(h,'dash-howto')) fire(h,g(h,'dash-howto-start'),'click');
  if(!hid(h,'howtoplay')) fire(h,g(h,'htp-start'),'click');
  if(!hid(h,'overlay')) fire(h,g(h,'overlay-button'),'click');
  checks++;
  const t=h.ctx.__tick(400);
  t ? note(name,'loop '+t.name+': '+t.message,(t.stack||'').split('\n')[1]) : ok(`${name} ran 400 frames`);
}

section('parental gate + paywall');
{
  const h=boot({}); toMenu(h);
  tap(h,'menu-mayhem','locked mode opens the gate');
  const ans=g(h,'pg-answers').children;
  checks++;
  ans.length ? ok(`gate offers ${ans.length} answers`) : note('parental gate','no answer buttons');
  for(const a of ans){ checks++; const e=fire(h,a,'click'); if(e) note('gate answer',e.name+': '+e.message); }
  ok('every gate answer clickable', visible(h).join('+'));
  if(!hid(h,'paywall')){ tap(h,'pw-close','paywall close'); tap(h,'pw-restore','paywall restore'); }
  checks++;
  visible(h).length ? ok('still on a real screen after the gate') : note('gate exit','nothing visible — STUCK');
}

section('builder round trip');
{
  const h=boot({}); toMenu(h);
  tap(h,'menu-build','open My Levels');
  const first=g(h,'ml-grid').children[0];
  const btn=first && first.children.find(c=>c._cls.has('ml-row'))?.children[0];
  checks++;
  if(!btn){ note('builder','no Build button on the first slot'); }
  else{
    const e=fire(h,btn,'click');
    e ? note('open editor',e.name+': '+e.message) : ok('editor opened', visible(h).join('+'));
    if(!hid(h,'build-howto')) tap(h,'build-howto-start','dismiss build how-to');
    tap(h,'ed-help','? replays the how-to');
    tap(h,'build-howto-start','dismiss again');
    for(const t of ['room','place','floor','erase']){
      checks++;
      const tb=g(h,'ed-tools').children.find(b=>b.dataset.tool===t);
      if(!tb){ note('tool '+t,'button missing'); continue; }
      const er=fire(h,tb,'click');
      er ? note('tool '+t,er.name+': '+er.message) : ok('tool "'+t+'" selects');
    }
    tap(h,'ed-save','save the stage');
    if(!hid(h,'overlay')) tap(h,'overlay-quit','escape the unlock pitch');
    checks++;
    hid(h,'my-levels') ? note('after save','not back on My Levels') : ok('back on My Levels with a saved stage');
    tap(h,'ml-back','back to menu');
  }
}

console.log('\n================================================');
console.log(`  ${checks} interactions exercised`);
if(!issues.length) console.log('  \x1b[32mno errors, no freezes, no dead ends\x1b[0m');
else{
  console.log(`  \x1b[31m${issues.length} issue(s) found:\x1b[0m`);
  issues.forEach((x,i)=>console.log(`   ${i+1}. [${x.where}] ${x.problem}${x.at?'\n       '+String(x.at).trim():''}`));
}
console.log('================================================\n');
process.exit(issues.length?1:0);
