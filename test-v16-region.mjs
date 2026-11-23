import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {chambers,portalFor,chamberAt} from './chambers.js';
import {validateSave} from './save-manager.js';
import {inventoryOf,regionGate,canFaceKing} from './valdren-region.js';
import {enemyBehavior} from './combat.js';
const mode=process.argv[2];
if(!mode){
 assert.ok(chambers.length>=10); // historical regions are preserved; newer regions may extend the map
 for(let i=0;i<chambers.length-1;i++)assert.equal(chamberAt(portalFor(chambers[i].end-60,i).destination),i+1);
 assert.equal(regionGate(2),false);assert.equal(regionGate(3),true);
 assert.equal(canFaceKing(3,'none'),false);assert.equal(canFaceKing(3,'people'),true);
 assert.ok(inventoryOf(3,'people',1).some(x=>x.name==='Sello de los Tizones'));
 assert.notDeepEqual(enemyBehavior('king'),enemyBehavior('warden'));
 for(const choice of ['people','crown'])for(const scenario of ['choice','gate','king']){
  const run=spawnSync(process.execPath,[new URL(import.meta.url).pathname,scenario,choice],{encoding:'utf8',timeout:14000});
  assert.equal(run.status,0,`${scenario}/${choice}: ${run.stdout}\n${run.stderr}`);
 }
 console.log('OK: 8 zonas, 2 promesas persistentes, inventario, puertas y derrota del Rey con actualización real.');
 process.exit(0);
}
const choice=process.argv[3];const noop=()=>{};
const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
class Element{constructor(){this.textContent='';this.children=[];this.hidden=false;this.disabled=false;this.onclick=null;this.handlers={};this.classList={add:noop,remove:noop}}addEventListener(k,f){this.handlers[k]=f}appendChild(el){this.children.push(el)}replaceChildren(...xs){this.children=xs}querySelector(){return this.children.find(x=>!x.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(id=>[id,new Element()]));els.get('#game').getContext=()=>ctx;
globalThis.document={querySelector:id=>els.get(id),createElement:()=>new Element(),body:new Element()};globalThis.window={};globalThis.location={reload:noop};globalThis.Image=class{complete=false;naturalWidth=0;naturalHeight=0;set src(v){this._src=v}};
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
const enemies=Array.from({length:17},(_,i)=>({hp:i===8?0:i===16?(mode==='king'?10:320):i>=12?64:i>=9?58:42,alive:i!==8}));
const xs={choice:6585,gate:7378,king:8220};
const state={p:{x:xs[mode],hp:100,flasks:3,checkpoint:mode==='choice'?6570:7580},enemies,secrets:[{taken:false},{taken:false}],phase:'playing',chapterClear:true,questStage:3,allegiance:mode==='choice'?'none':choice,districtQuest:1,regionClear:false};
assert.ok(validateSave(state));
const map=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(state)]]);
globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
const events={};globalThis.addEventListener=(k,cb)=>events[k]=cb;const frames=[];globalThis.requestAnimationFrame=cb=>frames.push(cb);
await import('./game.js');
let t=performance.now();const frame=()=>{t+=16;const cb=frames.shift();assert.ok(cb,'frame callback missing');cb(t)};
const buttons=()=>els.get('#menuEntries').children.map(b=>b.textContent);
const click=text=>{const b=els.get('#menuEntries').children.find(e=>e.textContent.startsWith(text));assert.ok(b,`missing ${text} in ${buttons()}`);b.click()};
const tap=key=>{events.keydown({code:key,repeat:false,preventDefault:noop});frame();events.keyup({code:key})};
click('Continuar');frame();
if(mode==='choice'){
 tap('KeyE');assert.ok(buttons().includes('Proteger a los exiliados'));
 click(choice==='people'?'Proteger a los exiliados':'Obedecer al Consejo');
 const d=JSON.parse(map.get('ashen-pilgrimage-save-v2-auto'));assert.equal(d.allegiance,choice);
 assert.equal(d.districtQuest,1);assert.equal(d.p.flasks,choice==='people'?4:3);
 tap('KeyI');assert.ok(buttons().some(x=>x.includes(choice==='people'?'Sello de los Tizones':'Salvoconducto real')));
}else if(mode==='gate'){
 tap('KeyE');tap('KeyP');const d=JSON.parse(map.get('ashen-pilgrimage-save-v2-auto'));assert.ok(d.p.x>=7450,`gate not opened ${d.p.x}`);
}else if(mode==='king'){
 for(let i=0;i<2;i++)frame();tap('KeyJ');for(let i=0;i<15;i++)frame();
 tap('KeyP');const d=JSON.parse(map.get('ashen-pilgrimage-save-v2-auto'));
 assert.equal(d.regionClear,true,`king not defeated: hp=${d.enemies[16].hp}`);
 assert.equal(d.enemies[16].alive,false);
}
console.log('OK '+mode+' / '+choice);
