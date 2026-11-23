import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {chambers,chamberAt,portalFor} from './chambers.js';
import {createSaveManager,validateSave} from './save-manager.js';
import {canEnterOssara,canRecoverInscription,ossaraDialogue,OSSARA_NPC,OSSARA_TABLET_X} from './ossara-region.js';
import {biomeFor,forestWarning,createSoundscape,cueNotes} from './soundscape.js';
import {enemyBehavior} from './combat.js';
const mode=process.argv[2];
if(mode){
 const noop=()=>{};
 const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
 class El{constructor(){this.children=[];this.textContent='';this.hidden=false;this.disabled=false;this.classList={add:noop,remove:noop};this.handlers={}}addEventListener(k,f){this.handlers[k]=f}appendChild(e){this.children.push(e)}replaceChildren(...xs){this.children=xs}querySelector(){return this.children.find(x=>!x.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
 const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(k=>[k,new El()]));els.get('#game').getContext=()=>ctx;
 globalThis.document={querySelector:k=>els.get(k),createElement:()=>new El(),body:new El()};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this._src=v}};
 globalThis.window={};globalThis.location={reload:noop};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
 const enemies=Array.from({length:26},(_,i)=>({hp:i===8?180:i===16?320:i===21?0:i>=24?85:i>=17?78:i>=12?64:i>=9?58:42,alive:i!==21}));
 if(mode!=='entry')for(let i=24;i<26;i++)enemies[i]={hp:0,alive:false};
 const positions={entry:13440,inscription:OSSARA_TABLET_X,velador:OSSARA_NPC.x};
 const stages={entry:0,inscription:1,velador:2};
 const save={p:{x:positions[mode],hp:100,flasks:3,checkpoint:11320},enemies,secrets:[{taken:false},{taken:false}],phase:'playing',chapterClear:true,questStage:3,allegiance:'people',districtQuest:2,regionClear:true,forestStage:3,forestEchoes:[2,0,1],forestClear:true,ossaraStage:stages[mode]};
 assert.ok(validateSave(save));const map=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(save)]]);
 globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const events={};globalThis.addEventListener=(k,f)=>events[k]=f;const frames=[];globalThis.requestAnimationFrame=f=>frames.push(f);
 await import('./game.js');let clock=performance.now();const frame=()=>{clock+=16;const f=frames.shift();assert.ok(f);f(clock)};
 const press=k=>{events.keydown({code:k,repeat:false,preventDefault:noop});frame();events.keyup({code:k})};
 const go=els.get('#menuEntries').children.find(x=>x.textContent==='Continuar');assert.ok(go);go.click();frame();
 if(mode==='inscription')press('KeyQ');press('KeyE');press('KeyP');
 const result=JSON.parse(map.get('ashen-pilgrimage-save-v2-auto'));
 if(mode==='entry')assert.equal(result.p.x>=13500,true,`door not crossed: ${result.p.x}`);
 if(mode==='inscription')assert.equal(result.ossaraStage,2);
 if(mode==='velador')assert.equal(result.ossaraStage,3);
 console.log('OK',mode);process.exit(0);
}
assert.ok(chambers.length>=22, 'La ampliación conserva las 22 cámaras anteriores');assert.equal(chamberAt(14630),12);
assert.equal(chamberAt(portalFor(13440,11).destination),12);
assert.ok(!canEnterOssara(false,false));assert.ok(!canEnterOssara(true,true));assert.ok(canEnterOssara(true,false));
assert.ok(!canRecoverInscription(1,false,true));assert.ok(!canRecoverInscription(1,true,false));assert.ok(canRecoverInscription(1,true,true));
assert.equal(ossaraDialogue(0).stage,1);assert.equal(ossaraDialogue(2).stage,3);
assert.notDeepEqual(enemyBehavior('bonekeeper'),enemyBehavior('rootguard'));
assert.equal(biomeFor(10),'forest');assert.equal(biomeFor(12),'ossara');assert.ok(cueNotes('echo').length>1);
assert.ok(forestWarning({x:100,w:30,windup:.56,phase:2}).ttl>=.5);
let contextCalls=0;const disabled={state:'running',createOscillator(){contextCalls++;throw Error('Should not start when disabled')}};
createSoundscape().step(10,10,disabled,false);assert.equal(contextCalls,0);
const enemies=Array.from({length:26},(_,i)=>({alive:i!==21,hp:i===8?180:i===16?320:i===21?0:i>=24?85:i>=17?78:i>=12?64:i>=9?58:42}));
const base={p:{x:14600,hp:100,flasks:3,checkpoint:13680},enemies,secrets:[{taken:false},{taken:false}],forestStage:3,forestEchoes:[2,0,1],forestClear:true,ossaraStage:2,visited:[11,12],phase:'playing'};
assert.ok(validateSave(base));assert.ok(!validateSave({...base,ossaraStage:7}));assert.ok(!validateSave({...base,p:{...base.p,x:46601}}));
const legacy={...base,enemies:enemies.slice(0,24),p:{...base.p,x:12700,checkpoint:11320},visited:[9,10,11]};
assert.ok(validateSave(legacy));
const storage=new Map();const manager=createSaveManager({getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)});
manager.write('slot1',legacy);manager.write('slot2',base);assert.equal(manager.read('slot1').enemies.length,24);assert.equal(manager.read('slot2').ossaraStage,2);
for(const scenario of ['entry','inscription','velador']){
 const run=spawnSync(process.execPath,[new URL(import.meta.url).pathname,scenario],{encoding:'utf8',timeout:12000});
 assert.equal(run.status,0,`${scenario}: ${run.stdout}\n${run.stderr}`);
}
console.log('OK: Ossara gate, mission, legacy save, soundscape rules, 3 runtime integration flows');
