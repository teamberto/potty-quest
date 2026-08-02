const fs=require('fs'), vm=require('vm'), path=require('path');
const {El,mkDoc,registry}=require('./dom-stub.js');
const ROOT=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const ids=[...new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]))];
// Carry each element's starting class over from the markup, so panels that
// ship as class="hidden" actually start hidden in the stub too.
const initialClasses={};
for(const m of html.matchAll(/<[a-z]+[^>]*>/g)){
  const tag=m[0];
  const id=(tag.match(/id="([^"]+)"/)||[])[1];
  const cls=(tag.match(/class="([^"]+)"/)||[])[1];
  if(id&&cls) initialClasses[id]=cls;
}
const doc=mkDoc(ids, initialClasses, html);

const store={};
const localStorage={getItem:k=>(k in store?store[k]:null),setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};

const seed=JSON.parse(process.env.__SEED||'{}');
if(seed.saved) store['pottychamp_custom_v1']=JSON.stringify(seed.saved);
if(seed.premium) store['pottychamp_progress_v1']=JSON.stringify({premium:true,stars:{},unlocked:{home:true}});
// Fire onload synchronously — a deferred timer never runs inside a synchronous
// test, which silently left the game loop unstarted.
class Img{
  constructor(){ this.width=24; this.height=24; this.complete=true; this.onload=null; this.onerror=null; }
  set src(v){ this._src=v; const f=()=>{ if(this.onload) this.onload(); };
    if(this.onload) f(); else this.__pending=true; }
  get src(){ return this._src; }
}
// game.js assigns onerror/onload BEFORE src, so the simple path above works;
// this guard covers the reverse order too.
Object.defineProperty(Img.prototype,'onload',{configurable:true,
  set(fn){ this._onload=fn; if(this.__pending){ this.__pending=false; fn&&fn(); } },
  get(){ return this._onload; }});

const errors=[];
const ctx={
  console, document:doc, localStorage, Image:Img,
  window:{addEventListener(){},removeEventListener(){},devicePixelRatio:2,innerWidth:800,innerHeight:500,
    location:{protocol:'file:',href:'file:///index.html'},localStorage,matchMedia:()=>({matches:false,addListener(){},addEventListener(){}})},
  navigator:{userAgent:'test',maxTouchPoints:5,language:'en'},
  requestAnimationFrame:(fn)=>{ ctx.__raf.push(fn); return ctx.__raf.length; },
  cancelAnimationFrame:()=>{},
  setTimeout, clearTimeout, setInterval:()=>0, clearInterval:()=>{},
  Date, Math, JSON, performance:{now:()=>ctx.__t},
  AudioContext:function(){return new Proxy({},{get:()=>()=>new Proxy({},{get:()=>()=>{}})})},
  Capacitor:undefined, __TAINTED:false, __err:errors, __raf:[], __t:0,
};
ctx.window.document=doc; ctx.globalThis=ctx; ctx.self=ctx;
vm.createContext(ctx);
global.__TAINTED=false;
Object.defineProperty(global,'__TAINTED',{get:()=>ctx.__TAINTED,configurable:true});

function load(f){
  let src=fs.readFileSync(path.join(ROOT,f),'utf8');
  if(f==='game.js'){
    // TEST ONLY: expose a read-only peek at internals from inside the IIFE.
    // The shipped file is never modified — this rewrite lives in the harness.
    const hook = "\n  globalThis.__peek = () => ({ gameState, hearts, level: level && level.label,"
      + " accidents: typeof accidentsThisLevel!=='undefined'?accidentsThisLevel:null,"
      + " alertCount: typeof alertCount!=='undefined'?alertCount:null,"
      + " toddlers: typeof toddlers!=='undefined'&&toddlers?toddlers.map(t=>({alert:t.alertActive,left:t.alertTimeRemaining,next:t.nextAlertIn,state:t.state})):null,"
      + " score: typeof scoreThisLevel!=='undefined'?scoreThisLevel:null,"
      + " customMode: typeof customMode!=='undefined'?customMode:null });\n";
    const i = src.lastIndexOf('})();');
    src = src.slice(0,i) + hook + src.slice(i);
  }
  vm.runInContext(src,ctx,{filename:f});
}
try{ load('levels.js'); } catch(e){ console.log('levels.js FAILED:',e.message); process.exit(1); }
try{ load('game.js'); } catch(e){ console.log('game.js FAILED to boot:',e.name,e.message,'\n',e.stack.split('\n')[1]); process.exit(1); }
// Step the real game loop. Returns the first exception thrown, or null.
ctx.__tick=function(frames,ms){
  ms=ms||16;
  for(let i=0;i<frames;i++){
    const q=ctx.__raf.splice(0,ctx.__raf.length);
    if(!q.length) return null;
    ctx.__t+=ms;
    for(const fn of q){ try{ fn(ctx.__t); }catch(e){ return e; } }
  }
  return null;
};
module.exports={ctx,registry,doc,store};
