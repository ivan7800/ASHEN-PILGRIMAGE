import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {chambers,chamberAt,portalFor} from './chambers.js';
import {readForbiddenName,OSSARA_ORDER,OSSARA_SEALS,canEnterArchiveBoss,canEnterOssaraInterior,ARCHIVIST_MAX_HP} from './ossara-v22.js';
import {validateSave,createSaveManager} from './save-manager.js';
import {enemyBehavior} from './combat.js';
const mode=process.argv[2];
const all=Array.from({length:32},(_,i)=>({alive:i!==21,hp:i===8?180:i===16?320:i===21?0:i===31?ARCHIVIST_MAX_HP:i>=26?95:i>=24?85:i>=17?78:i>=12?64:i>=9?58:42}));
const base={p:{x:15240,hp:100,flasks:3,checkpoint:15220},enemies:all,secrets:[{taken:false},{taken:false}],phase:'playing',forestClear:true,ossaraStage:3,ossaraNames:[],ossaraClear:false};
if(mode){
 const noop=()=>{};const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
 class El{constructor(){this.children=[];this.textContent='';this.hidden=false;this.disabled=false;this.classList={add:noop,remove:noop};this.handlers={}}addEventListener(k,f){this.handlers[k]=f}appendChild(e){this.children.push(e)}replaceChildren(...xs){this.children=xs}querySelector(){return this.children.find(x=>!x.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
 const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(k=>[k,new El()]));els.get('#game').getContext=()=>ctx;
 globalThis.document={querySelector:k=>els.get(k),createElement:()=>new El(),body:new El()};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this._src=v}};
 globalThis.window={};globalThis.location={reload:noop};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
 const state=structuredClone(base);
 if(mode==='gate')state.p.x=17640;
 if(mode==='seal')state.p.x=OSSARA_SEALS[1].x;
 if(mode==='boss'){state.p.x=18506;state.ossaraNames=[1,0,2];for(let i=26;i<32;i++)state.enemies[i]={alive:i===31,hp:i===31?2:0}}
 assert.ok(validateSave(state));const map=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(state)]]);
 globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const events={};globalThis.addEventListener=(k,f)=>events[k]=f;const frames=[];globalThis.requestAnimationFrame=f=>frames.push(f);
 await import('./game.js');let clock=performance.now();const frame=()=>{clock+=16;const f=frames.shift();assert.ok(f);f(clock)};
 const press=k=>{events.keydown({code:k,repeat:false,preventDefault:noop});frame();events.keyup({code:k})};
 const go=els.get('#menuEntries').children.find(x=>x.textContent==='Continuar');assert.ok(go);go.click();frame();
 if(mode==='gate'){press('KeyE');assert.ok(JSON.parse(map.get('ashen-pilgrimage-save-v2-auto')).p.x<17700)}
 if(mode==='seal'){press('KeyQ');press('KeyE');assert.deepEqual(JSON.parse(map.get('ashen-pilgrimage-save-v2-auto')).ossaraNames,[1])}
 if(mode==='boss'){press('KeyJ');for(let j=0;j<30;j++)frame();const next=JSON.parse(map.get('ashen-pilgrimage-save-v2-auto'));assert.equal(next.ossaraClear,true,'Boss defeat must persist');assert.equal(next.enemies[31].alive,false)}
 console.log('OK runtime',mode);process.exit(0);
}
assert.ok(chambers.length>=22, 'La ampliación conserva las 22 cámaras anteriores');assert.equal(chamberAt(15300),13);assert.equal(chamberAt(16900),14);assert.equal(chamberAt(18250),15);
assert.equal(chamberAt(portalFor(16340,13).destination),14);
assert.ok(!canEnterOssaraInterior(2));assert.ok(canEnterOssaraInterior(3));
assert.ok(!canEnterArchiveBoss(3,[1,0]));assert.ok(canEnterArchiveBoss(3,[1,0,2]));
let names=[];for(const id of OSSARA_ORDER){let r=readForbiddenName(names,id,{desvelo:true,stage:3});assert.ok(r.changed);names=r.echoes}assert.deepEqual(names,[1,0,2]);
assert.deepEqual(readForbiddenName([1,0],0,{desvelo:true,stage:3}).echoes,[1,0]);
assert.deepEqual(readForbiddenName([1],2,{desvelo:true,stage:3}).echoes,[]);
assert.equal(readForbiddenName([],1,{desvelo:false,stage:3}).changed,false);
assert.notDeepEqual(enemyBehavior('archivist'),enemyBehavior('mother'));
assert.notDeepEqual(enemyBehavior('scriptor'),enemyBehavior('bonekeeper'));
for(const file of ['room-archive.webp','room-choir.webp','room-archivist.webp','archivist-v22.png','scriptor-v22.png','scribe-v22.png'])assert.ok(readFileSync('assets/'+file).length>1000);
const older=structuredClone(base);older.enemies=older.enemies.slice(0,26);delete older.ossaraNames;delete older.ossaraClear;assert.ok(validateSave(older));
const m=new Map();const store=createSaveManager({getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)});
store.write('slot1',older);store.write('slot2',{...base,ossaraNames:[1,0,2],ossaraClear:true});assert.equal(store.read('slot1').enemies.length,26);assert.equal(store.read('slot2').ossaraClear,true);
for(const scenario of ['gate','seal','boss']){const r=spawnSync(process.execPath,[new URL(import.meta.url).pathname,scenario],{encoding:'utf8',timeout:12000});assert.equal(r.status,0,`${scenario}: ${r.stdout}\n${r.stderr}`)}
console.log('OK: Ossara 3 new rooms, puzzle, stage gates, save migration, runtime boss defeat');
