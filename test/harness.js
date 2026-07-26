const fs=require('fs'), vm=require('vm'), path=require('path');
const {El,mkDoc,registry}=require('./dom-stub.js');
const ROOT=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const ids=[...new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]))];
const doc=mkDoc(ids);

const store={};
const localStorage={getItem:k=>(k in store?store[k]:null),setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};

const seed=JSON.parse(process.env.__SEED||'{}');
if(seed.saved) store['pottychamp_custom_v1']=JSON.stringify(seed.saved);
if(seed.premium) store['pottychamp_progress_v1']=JSON.stringify({premium:true,stars:{},unlocked:{home:true}});
class Img{constructor(){this.width=24;this.height=24;this.complete=true;}
  set src(v){this._src=v; setTimeout(()=>this.onload&&this.onload(),0);} get src(){return this._src;}}

const errors=[];
const ctx={
  console, document:doc, localStorage, Image:Img,
  window:{addEventListener(){},removeEventListener(){},devicePixelRatio:2,innerWidth:800,innerHeight:500,
    location:{protocol:'file:',href:'file:///index.html'},localStorage,matchMedia:()=>({matches:false,addListener(){},addEventListener(){}})},
  navigator:{userAgent:'test',maxTouchPoints:5,language:'en'},
  requestAnimationFrame:()=>0, cancelAnimationFrame:()=>{},
  setTimeout, clearTimeout, setInterval:()=>0, clearInterval:()=>{},
  Date, Math, JSON, performance:{now:()=>0},
  AudioContext:function(){return new Proxy({},{get:()=>()=>new Proxy({},{get:()=>()=>{}})})},
  Capacitor:undefined, __TAINTED:false, __err:errors,
};
ctx.window.document=doc; ctx.globalThis=ctx; ctx.self=ctx;
vm.createContext(ctx);
global.__TAINTED=false;
Object.defineProperty(global,'__TAINTED',{get:()=>ctx.__TAINTED,configurable:true});

function load(f){ vm.runInContext(fs.readFileSync(path.join(ROOT,f),'utf8'),ctx,{filename:f}); }
try{ load('levels.js'); } catch(e){ console.log('levels.js FAILED:',e.message); process.exit(1); }
try{ load('game.js'); } catch(e){ console.log('game.js FAILED to boot:',e.name,e.message,'\n',e.stack.split('\n')[1]); process.exit(1); }
console.log('booted OK');
module.exports={ctx,registry,doc,store};
