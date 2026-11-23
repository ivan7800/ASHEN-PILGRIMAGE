import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {chambers,chamberAt,portalFor} from './chambers.js';
import {validateSave,createSaveManager} from './save-manager.js';
import {SALMUERA_NPC,TIDE_MEMORY_X,canEnterSalmuera,canRecoverTideMemory,talkToMarin} from './salmuera-region.js';
import {biomeFor,cueNotes} from './soundscape.js';
const mode=process.argv[2];
const enemies=Array.from({length:36},(_,i)=>({hp:i===8?180:i===16?320:i===21?420:i===31?0:i>=32?88:i>=26?95:i>=24?85:i>=17?78:i>=12?64:i>=9?58:42,alive:i!==31}));
const base={p:{x:18940,hp:100,flasks:3,checkpoint:17870},enemies,secrets:[{taken:false},{taken:false}],phase:'playing',chapterClear:true,questStage:3,allegiance:'people',districtQuest:2,regionClear:true,forestStage:3,forestEchoes:[2,0,1],forestClear:true,ossaraStage:3,ossaraNames:[1,0,2],ossaraClear:true,salmueraStage:0,visited:[15]};
if(mode){
 const noop=()=>{};const context=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
 class El{constructor(){this.children=[];this.textContent='';this.hidden=false;this.disabled=false;this.tagName='BUTTON';this.classList={add:noop,remove:noop};this.handlers={}}addEventListener(k,f){this.handlers[k]=f}appendChild(e){this.children.push(e)}replaceChildren(...xs){this.children=xs}querySelector(){return this.children.find(x=>!x.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
 const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(k=>[k,new El()]));els.get('#game').getContext=()=>context;
 globalThis.document={querySelector:k=>els.get(k),createElement:()=>new El(),body:new El()};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this._src=v}};
 globalThis.window={};globalThis.location={reload:noop};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
 const state=structuredClone(base);
 if(mode==='locked'){state.ossaraClear=false;state.enemies[31]={alive:true,hp:480}}
 if(mode==='talk'){state.p={...state.p,x:19240,checkpoint:19180}}
 if(mode==='relic'){state.p={...state.p,x:TIDE_MEMORY_X,checkpoint:20730};state.salmueraStage=1;state.enemies[34]={alive:false,hp:0};state.enemies[35]={alive:false,hp:0}}
 assert.ok(validateSave(state));const map=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(state)]]);
 globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const events={};globalThis.addEventListener=(k,f)=>events[k]=f;const frames=[];globalThis.requestAnimationFrame=f=>frames.push(f);
 await import('./game.js');let clock=performance.now();const frame=()=>{clock+=16;const f=frames.shift();assert.ok(f);f(clock)};
 const press=k=>{events.keydown({code:k,repeat:false,preventDefault:noop});frame();events.keyup({code:k})};
 const go=els.get('#menuEntries').children.find(x=>x.textContent==='Continuar');assert.ok(go);go.click();frame();frame();
 if(mode==='locked'||mode==='gate'){
  press('KeyE');press('KeyP');const x=JSON.parse(map.get('ashen-pilgrimage-save-v2-auto')).p.x;
  if(mode==='gate')assert.ok(x>19000,`expected portal open, x=${x}`);else assert.ok(x<19000,`expected portal locked, x=${x}`);
 }
 if(mode==='talk'){press('KeyE');assert.equal(JSON.parse(map.get('ashen-pilgrimage-save-v2-auto')).salmueraStage,1)}
 if(mode==='relic'){press('KeyQ');press('KeyE');assert.equal(JSON.parse(map.get('ashen-pilgrimage-save-v2-auto')).salmueraStage,2)}
 console.log('OK runtime',mode);process.exit(0);
}
assert.ok(chambers.length>=22, 'La ampliación conserva las 22 cámaras anteriores');assert.equal(chamberAt(19240),16);assert.equal(chamberAt(21410),17);
assert.equal(chamberAt(portalFor(18940,15).destination),16);
assert.equal(biomeFor(17),'salmuera');assert.ok(cueNotes('tide-memory').length);
assert.ok(!canEnterSalmuera(false,false));assert.ok(!canEnterSalmuera(true,true));assert.ok(canEnterSalmuera(true,false));
assert.ok(!canRecoverTideMemory(0,true,true));assert.ok(!canRecoverTideMemory(1,false,true));assert.ok(!canRecoverTideMemory(1,true,false));assert.ok(canRecoverTideMemory(1,true,true));
assert.equal(talkToMarin(0).stage,1);assert.equal(talkToMarin(2).stage,3);assert.equal(SALMUERA_NPC[0].id,'marin');
assert.ok(validateSave(base));assert.ok(validateSave({...base,enemies:enemies.slice(0,32),p:{...base.p,x:18000,checkpoint:17870}}));
assert.ok(!validateSave({...base,p:{...base.p,x:46601}}));assert.ok(!validateSave({...base,salmueraStage:4}));
const memory=new Map();const saves=createSaveManager({getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)});saves.write('slot1',base);assert.equal(saves.read('slot1').salmueraStage,0);
for(const file of ['room-harbor.webp','room-drowned.webp','marin-v24.png','saltguard-v24.png'])assert.ok(readFileSync('assets/'+file).length>1000,file);
for(const scenario of ['locked','gate','talk','relic']){const r=spawnSync(process.execPath,[new URL(import.meta.url).pathname,scenario],{encoding:'utf8',timeout:15000});assert.equal(r.status,0,`${scenario}: ${r.stdout}\n${r.stderr}`)}
console.log('OK Salmuera region, progression gates, memory, compatibility, runtime');
