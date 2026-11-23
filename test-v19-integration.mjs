import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {validateSave} from './save-manager.js';
const mode=process.argv[2];
if(!mode){
 for(const scenario of ['gateway','aina','memory','return']){
  const run=spawnSync(process.execPath,[new URL(import.meta.url).pathname,scenario],{encoding:'utf8',timeout:12000});
  assert.equal(run.status,0,`${scenario}: ${run.stdout}\n${run.stderr}`);
 }
 console.log('OK: portón del Rey, conversación de Aina, Desvelo y entrega de memoria por update()');
 process.exit(0);
}
const noop=()=>{};
const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
class El{constructor(){this.children=[];this.textContent='';this.hidden=false;this.disabled=false;this.classList={add:noop,remove:noop};this.handlers={}}addEventListener(k,f){this.handlers[k]=f}appendChild(e){this.children.push(e)}replaceChildren(...xs){this.children=xs}querySelector(){return this.children.find(x=>!x.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(k=>[k,new El()]));els.get('#game').getContext=()=>ctx;
globalThis.document={querySelector:k=>els.get(k),createElement:()=>new El(),body:new El()};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this._src=v}};
globalThis.window={};globalThis.location={reload:noop};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
const enemies=Array.from({length:21},(_,i)=>({hp:i===8?180:i===16?0:i>=17?78:i>=12?64:i>=9?58:42,alive:i!==16}));
if(mode==='memory'||mode==='return')for(let i=19;i<21;i++){enemies[i]={hp:0,alive:false}}
const positions={gateway:8737,aina:9120,memory:10025,return:9120};
const stages={gateway:0,aina:0,memory:1,return:2};
const save={p:{x:positions[mode],hp:100,flasks:3,checkpoint:mode==='gateway'?7580:9010},enemies,secrets:[{taken:false},{taken:false}],phase:'playing',chapterClear:true,questStage:3,allegiance:'people',districtQuest:2,regionClear:true,forestStage:stages[mode]};
assert.ok(validateSave(save));const map=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(save)]]);
globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
const events={};globalThis.addEventListener=(k,f)=>events[k]=f;const frames=[];globalThis.requestAnimationFrame=f=>frames.push(f);
await import('./game.js');let clock=performance.now();const frame=()=>{clock+=16;const f=frames.shift();assert.ok(f);f(clock)};
const press=k=>{events.keydown({code:k,repeat:false,preventDefault:noop});frame();events.keyup({code:k})};
const buttons=()=>els.get('#menuEntries').children;
const go=buttons().find(x=>x.textContent==='Continuar');assert.ok(go);go.click();frame();
if(mode==='memory')press('KeyQ');
press('KeyE');press('KeyP');
const result=JSON.parse(map.get('ashen-pilgrimage-save-v2-auto'));
if(mode==='gateway')assert.ok(result.p.x>=8800,`no forest transition: ${result.p.x}`);
else assert.equal(result.forestStage,mode==='aina'?1:mode==='memory'?2:3);
if(mode==='return'){press('KeyI');assert.ok(buttons().some(b=>b.textContent.includes('Memoria de Brezaluna')))}
console.log('OK',mode);
