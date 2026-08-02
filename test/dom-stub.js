// Minimal DOM good enough to boot game.js headlessly.
function mkCtx(){
  const noop=()=>{};
  return new Proxy({
    canvas:null, imageSmoothingEnabled:false, fillStyle:'', strokeStyle:'', lineWidth:1, font:'',
    textAlign:'', textBaseline:'', globalAlpha:1, globalCompositeOperation:'',
    getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(Math.max(4,w*h*4))}),
    putImageData:noop, measureText:()=>({width:10}),
    createLinearGradient:()=>({addColorStop:noop}),
    createRadialGradient:()=>({addColorStop:noop}),
    setTransform:noop, drawImage:noop,
  },{get:(t,k)=> (k in t? t[k] : noop), set:(t,k,v)=>{t[k]=v;return true;}});
}
class El {
  constructor(tag){ this.tagName=(tag||'div').toUpperCase(); this.children=[]; this.style={};
    this._cls=new Set(); this.dataset={}; this._html=''; this.value=''; this.textContent='';
    this._listeners={}; this.width=0; this.height=0; this.parentNode=null; this.id=''; }
  get classList(){ const s=this._cls; return {
    add:(...c)=>c.forEach(x=>s.add(x)), remove:(...c)=>c.forEach(x=>s.delete(x)),
    toggle:(c,f)=>{ if(f===undefined){ s.has(c)?s.delete(c):s.add(c); } else { f?s.add(c):s.delete(c);} },
    contains:(c)=>s.has(c) }; }
  get className(){ return [...this._cls].join(' '); }
  set className(v){ this._cls=new Set(String(v).split(/\s+/).filter(Boolean)); }
  get innerHTML(){ return this._html; }
  set innerHTML(v){ this._html=String(v); this.children.length=0; }
  appendChild(c){ this.children.push(c); c.parentNode=this; return c; }
  addEventListener(t,f){ (this._listeners[t]=this._listeners[t]||[]).push(f); }
  removeEventListener(){}
  dispatch(t,ev){ (this._listeners[t]||[]).forEach(f=>f(ev||{preventDefault(){},stopPropagation(){}})); }
  querySelectorAll(sel){
    const want=sel.replace(/^[.#]/,''); const out=[];
    const walk=(n)=>n.children.forEach(c=>{
      if(sel.startsWith('.')&&c._cls.has(want))out.push(c);
      else if(sel.startsWith('#')&&c.id===want)out.push(c);
      else if(c.tagName===sel.toUpperCase())out.push(c);
      walk(c);});
    walk(this); return out; }
  querySelector(s){ return this.querySelectorAll(s)[0]||null; }
  closest(sel){ const want=sel.replace(/^[.#]/,''); let n=this;
    while(n){ if(sel.startsWith('.')&&n._cls&&n._cls.has(want))return n;
      if(sel.startsWith('#')&&n.id===want)return n; n=n.parentNode; } return null; }
  getContext(){ this._ctx=this._ctx||mkCtx(); this._ctx.canvas=this; return this._ctx; }
  toDataURL(){ if(global.__TAINTED) { const e=new Error("Tainted canvases may not be exported."); e.name='SecurityError'; throw e; } return 'data:image/png;base64,AAA'; }
  getBoundingClientRect(){ return {left:0,top:0,width:800,height:500}; }
  focus(){} blur(){} setPointerCapture(){} releasePointerCapture(){}
  get firstChild(){ return this.children[0]||null; }
  remove(){}
}

// --- tiny HTML parser: builds the real element tree so static children
// (tool buttons, seg buttons, etc.) exist just like in a browser ---
const VOID=new Set(['img','input','br','hr','meta','link','source']);
function parseHTML(html, registry){
  const body=html.slice(html.indexOf('<body')+html.indexOf('>',html.indexOf('<body'))-html.indexOf('<body')+1);
  const src=html.slice(html.indexOf('<body')).replace(/<script[\s\S]*?<\/script>/g,'');
  const root=new El('body');
  const stack=[root];
  const re=/<\/?([a-zA-Z0-9]+)((?:\s+[^>]*?)?)\/?>/g;
  let m;
  while((m=re.exec(src))){
    const [full,tag,attrs]=m;
    const close=full[1]==='/';
    const name=tag.toLowerCase();
    if(name==='body') { if(close) break; continue; }
    if(close){ if(stack.length>1) stack.pop(); continue; }
    const el=new El(name);
    const id=(attrs.match(/id="([^"]+)"/)||[])[1];
    const cls=(attrs.match(/class="([^"]+)"/)||[])[1];
    if(id){ el.id=id; registry[id]=el; }
    if(cls) el.className=cls;
    for(const a of attrs.matchAll(/data-([a-z-]+)="([^"]*)"/g)) el.dataset[a[1].replace(/-([a-z])/g,(x,c)=>c.toUpperCase())]=a[2];
    const srcAttr=(attrs.match(/src="([^"]+)"/)||[])[1]; if(srcAttr) el._src=srcAttr;
    stack[stack.length-1].appendChild(el);
    if(!VOID.has(name) && !full.endsWith('/>')) stack.push(el);
  }
  return root;
}

const registry={};
function mkDoc(ids, initialClasses, html){
  if(html) parseHTML(html, registry);
  ids.forEach(id=>{ if(registry[id]) return;
    const e=new El('div'); e.id=id;
    const c=initialClasses&&initialClasses[id];
    if(c) e.className=c;
    registry[id]=e; });
  return {
    getElementById:(id)=>registry[id]||null,
    createElement:(t)=>new El(t),
    addEventListener(){}, removeEventListener(){},
    body:new El('body'), documentElement:new El('html'),
    querySelector:()=>null, querySelectorAll:()=>[],
    visibilityState:'visible',
  };
}
module.exports={El,mkDoc,registry,mkCtx,parseHTML};
