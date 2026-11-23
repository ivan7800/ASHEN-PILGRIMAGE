import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {validateSave} from './save-manager.js';
const mode=process.argv[2];
if(!mode){
 for(const scenario of ['echo','sanctuary','mother']){
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
const enemies=Array.from({length:24},(_,i)=>({hp:i===8?180:i===16?0:i===21?420:i>=17?78:i>=12?64:i>=9?58:42,alive:i!==16}));
if(mode==='mother'){enemies[21]={hp:10,alive:true};for(let i=22;i<24;i++)enemies[i]={hp:0,alive:false}}
const positions={echo:11715,sanctuary:12140,mother:12580};
const stages={echo:3,sanctuary:3,mother:3};
const save={p:{x:positions[mode],hp:100,flasks:3,checkpoint:11320},enemies,secrets:[{taken:false},{taken:false}],phase:'playing',chapterClear:true,questStage:3,allegiance:'people',districtQuest:2,regionClear:true,forestStage:stages[mode],forestEchoes:mode==='echo'?[2,0]:[2,0,1]};
assert.ok(validateSave(save));const map=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(save)]]);
globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
const events={};globalThis.addEventListener=(k,f)=>events[k]=f;const frames=[];globalThis.requestAnimationFrame=f=>frames.push(f);
await import('./game.js');let clock=performance.now();const frame=()=>{clock+=16;const f=frames.shift();assert.ok(f);f(clock)};
const press=k=>{events.keydown({code:k,repeat:false,preventDefault:noop});frame();events.keyup({code:k})};
const buttons=()=>els.get('#menuEntries').children;
const go=buttons().find(x=>x.textContent==='Continuar');assert.ok(go);go.click();frame();
if(mode==='echo')press('KeyQ');
if(mode==='mother'){press('KeyJ');for(let i=0;i<35;i++)frame()}else press('KeyE');press('KeyP');
const result=JSON.parse(map.get('ashen-pilgrimage-save-v2-auto'));
if(mode==='echo')assert.deepEqual(result.forestEchoes,[2,0,1]);
if(mode==='sanctuary')assert.ok(result.p.x>=12200,`no sanctuary transition: ${result.p.x}`);
if(mode==='mother')assert.equal(result.forestClear,true);
console.log('OK',mode);
