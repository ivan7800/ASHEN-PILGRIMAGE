import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {chambers,chamberAt,portalFor} from './chambers.js';
import {validateSave,createSaveManager} from './save-manager.js';
import {ROOT_START,ROOT_END,ROOT_BOSS_INDEX,ROOT_BOSS_HP,ROOT_SIGILS,canEnterRoots,canCrossRootGate,hearRootName,rootDialogue,gardenerTiming,gardenerTelegraph,ROOT_THORNS,thornPhase,thornContact,thornWarningCrossed,THORN_TIP_HEIGHT} from './roots-v26.js';
import {enemyBehavior} from './combat.js';
import {biomeFor,cueNotes} from './soundscape.js';
const maxHP=i=>i===52?650:i===43?560:i===46||i===49?90:i>=44?110:i===38||i===41?74:i>=36?96:i===8?180:i===16?320:i===21?420:i===31?480:i>=32?88:i>=26?95:i>=24?85:i>=17?78:i>=12?64:i>=9?58:42;
const enemies=Array.from({length:53},(_,i)=>({hp:[8,16,21,31,43].includes(i)?0:maxHP(i),alive:![8,16,21,31,43].includes(i)}));
const base={p:{x:27500,hp:100,flasks:3,checkpoint:27810},enemies,secrets:[{taken:false},{taken:false}],phase:'playing',chapterClear:true,questStage:3,allegiance:'people',districtQuest:2,regionClear:true,forestStage:3,forestEchoes:[2,0,1],forestClear:true,ossaraStage:3,ossaraNames:[1,0,2],ossaraClear:true,salmueraStage:3,tideMode:'low',seaEchoes:[0,1,2],seaClear:true,rootStage:0,rootRites:[],rootClear:false,visited:[21,22]};
const scenarios={
 locked21:{x:27340,checkpoint:26650,seaClear:false,action:'KeyE',range:[26000,27400]},
 enter21:{x:27340,checkpoint:26650,action:'KeyE',range:[27400,28900]},
 talk:{x:29380,checkpoint:29620,action:'KeyE',stage:1},
 locked23:{x:30290,checkpoint:29620,rootStage:0,action:'KeyE',range:[28900,30350]},
 enter23:{x:30290,checkpoint:29620,rootStage:1,action:'KeyE',range:[30350,31750]},
 wrongRite:{x:31510,checkpoint:30820,rootStage:1,action:'KeyQ,KeyE',rites:[]},
 rite0:{x:30620,checkpoint:30820,rootStage:1,action:'KeyQ,KeyE',rites:[0]},
 rite1:{x:31080,checkpoint:30820,rootStage:1,rootRites:[0],action:'KeyQ,KeyE',rites:[0,1]},
 rite2:{x:31510,checkpoint:30820,rootStage:1,rootRites:[0,1],action:'KeyQ,KeyE',rites:[0,1,2],stage:2},
 locked24:{x:31690,checkpoint:30820,rootStage:1,rootRites:[0,1],action:'KeyE',range:[30350,31750]},
 enter24:{x:31690,checkpoint:30820,rootStage:2,rootRites:[0,1,2],action:'KeyE',range:[31750,33250]},
 gardener:{x:32645,checkpoint:32320,rootStage:2,rootRites:[0,1,2],bossHP:1,action:'KeyJ',clear:true},
 thorn:{x:30030,checkpoint:29620,rootStage:1,waitFrames:230,action:'KeyP',hurt:true},
 leapThorn:{x:30030,checkpoint:29620,rootStage:1,waitFrames:122,action:'KeyP',leapFrames:40,unharmed:true},
 epilogue:{x:29380,checkpoint:29620,rootStage:3,rootRites:[0,1,2],rootClear:true,action:'KeyE',stage:3}
};
const id=process.argv[2];
if(id){
 const q=scenarios[id];assert.ok(q,id);const state=structuredClone(base);state.p.x=q.x;state.p.checkpoint=q.checkpoint;
 for(const k of ['seaClear','rootStage','rootRites','rootClear'])if(k in q)state[k]=q[k];
 if(q.bossHP!==undefined)state.enemies[ROOT_BOSS_INDEX].hp=q.bossHP;
 assert.ok(validateSave(state),`invalid fixture ${id}`);
 const storage=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(state)]]);
 const noop=()=>{},ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
 class E{constructor(){this.children=[];this.textContent='';this.hidden=false;this.disabled=false;this.tagName='BUTTON';this.classList={add:noop,remove:noop};this.handlers={}}addEventListener(k,f){this.handlers[k]=f}appendChild(e){this.children.push(e)}replaceChildren(...v){this.children=v}querySelector(){return this.children.find(x=>!x.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
 const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(k=>[k,new E()]));els.get('#game').getContext=()=>ctx;
 globalThis.document={querySelector:k=>els.get(k),createElement:()=>new E(),body:new E()};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this.url=v}};
 globalThis.window={};globalThis.location={reload:noop};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
 globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 const events={};globalThis.addEventListener=(k,f)=>events[k]=f;let callbacks=[];globalThis.requestAnimationFrame=f=>callbacks.push(f);
 await import('./game.js');let now=performance.now();const frame=()=>{now+=16;const f=callbacks.shift();assert.ok(f);f(now)};
 const press=k=>{events.keydown({code:k,repeat:false,preventDefault:noop});frame();events.keyup({code:k})};
 const continueButton=els.get('#menuEntries').children.find(b=>b.textContent==='Continuar');assert.ok(continueButton);continueButton.click();frame();frame();
 for(let i=0;i<(q.waitFrames??0);i++)frame();
 if(q.leapFrames){events.keydown({code:'Space',repeat:false,preventDefault:noop});events.keydown({code:'KeyD',repeat:false,preventDefault:noop});for(let i=0;i<q.leapFrames;i++)frame();events.keyup({code:'Space'});events.keyup({code:'KeyD'});for(let i=0;i<50;i++)frame();}
 else for(const key of q.action.split(',')){press(key);for(let i=0;i<(key==='KeyJ'?23:3);i++)frame()}
 press('KeyP');const result=JSON.parse(storage.get('ashen-pilgrimage-save-v2-auto'));assert.ok(validateSave(result),`${id}: invalid autosave`);
 if(q.range)assert.ok(result.p.x>=q.range[0]&&result.p.x<q.range[1],`${id}: x=${result.p.x}`);
 if(q.stage!==undefined)assert.equal(result.rootStage,q.stage,id);
 if(q.rites)assert.deepEqual(result.rootRites,q.rites,id);
 if(q.hurt)assert.ok(result.p.hp<100,`${id}: spikes did not damage player`);
 if(q.unharmed)assert.equal(result.p.hp,100,`${id}: jumping through thorns should be safe`);
 if(q.clear){assert.equal(result.rootClear,true,id);assert.equal(result.rootStage,3,id);assert.equal(result.enemies[52].alive,false,id)}
 console.log('OK v2.6 runtime',id);process.exit(0);
}
assert.ok(chambers.length>=26);assert.equal(chambers[21].end,ROOT_START);assert.equal(chambers[25].end,ROOT_END);
assert.equal(chamberAt(28000),22);assert.equal(chamberAt(29400),23);assert.equal(chamberAt(31000),24);assert.equal(chamberAt(32700),25);
assert.equal(chamberAt(portalFor(27340,21).destination),22);
assert.equal(canEnterRoots(false,false),false);assert.equal(canEnterRoots(true,true),false);assert.equal(canEnterRoots(true,false),true);
assert.equal(canCrossRootGate(23,0,[]),false);assert.equal(canCrossRootGate(23,1,[]),true);
assert.equal(canCrossRootGate(24,1,[0,1,2]),false);assert.equal(canCrossRootGate(24,2,[0,1]),false);assert.equal(canCrossRootGate(24,2,[0,1,2]),true);
assert.deepEqual(hearRootName([],0,{desvelo:false,stage:1}).rites,[]);
assert.deepEqual(hearRootName([],0,{desvelo:true,stage:0}).rites,[]);
let r=[];for(const i of [0,1,2])r=hearRootName(r,i,{desvelo:true,stage:1}).rites;
assert.deepEqual(r,[0,1,2]);assert.deepEqual(hearRootName([0,1],0,{desvelo:true,stage:1}).rites,[0,1]);
assert.deepEqual(hearRootName([0,1],2,{desvelo:true,stage:1}).rites,[0,1,2]);
assert.deepEqual(hearRootName([0],2,{desvelo:true,stage:1}).rites,[]);
assert.equal(rootDialogue(0,false).stage,1);assert.equal(rootDialogue(2,true).stage,3);
assert.ok(gardenerTiming(1).windup>gardenerTiming(2).windup);assert.ok(gardenerTelegraph({alive:true,windup:.42,phase:2,x:32500,w:30,dir:-1}));
assert.equal(ROOT_THORNS.length,5);assert.equal(thornPhase(.2,0),'rest');assert.equal(thornPhase(2.2,0),'warning');assert.equal(thornPhase(2.8,0),'active');
assert.ok(THORN_TIP_HEIGHT>=40&&THORN_TIP_HEIGHT<=55);
const patch=ROOT_THORNS[2],standing={x:patch.x+10,y:370,w:29,h:68};
assert.equal(thornContact(standing,patch,438,2.2-patch.offset),false,'visible warning never damages');
assert.equal(thornContact(standing,patch,438,2.8-patch.offset),true,'standing on active thorns damages');
assert.equal(thornContact({...standing,y:438-THORN_TIP_HEIGHT-68},patch,438,2.8-patch.offset),false,'raised platform safe');
assert.equal(thornContact({...standing,y:300},patch,438,2.8-patch.offset),false,'jumped above thorn tips safe');
assert.equal(thornContact({...standing,x:patch.x+patch.width},patch,438,2.8-patch.offset),false,'no hit outside patch');
assert.equal(thornContact({...standing,x:patch.x-29},patch,438,2.8-patch.offset),false,'left edge does not count as overlap');
assert.equal(thornWarningCrossed(patch,1.85-patch.offset,1.92-patch.offset,patch.x),true,'warning produces a single cue at onset');
assert.equal(thornWarningCrossed(patch,2.2-patch.offset,2.3-patch.offset,patch.x),false,'warning does not repeat continuously');
assert.equal(thornWarningCrossed(patch,1.85-patch.offset,1.92-patch.offset,patch.x+600),false,'distant warning silent');
assert.equal(enemyBehavior('gardener').damage,36);assert.ok(enemyBehavior('sporeseer').projectile);assert.equal(biomeFor(24),'roots');assert.ok(cueNotes('gardener-defeat').length>0);
assert.ok(validateSave(base));assert.ok(validateSave({...base,enemies:base.enemies.slice(0,44),p:{...base.p,x:26900,checkpoint:26650},rootStage:undefined,rootRites:undefined,rootClear:undefined,visited:[20,21]}));
assert.ok(!validateSave({...base,p:{...base.p,x:46601}}));assert.ok(!validateSave({...base,rootRites:[0,2]}));assert.ok(!validateSave({...base,rootRites:[0,1,1]}));assert.ok(!validateSave({...base,rootStage:4}));
assert.ok(!validateSave({...base,visited:[35]}));
const memory=new Map();const manager=createSaveManager({getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)});manager.write('slot1',base);assert.equal(manager.read('slot1').rootStage,0);
for(const name of ['rootgate','hojaclara','injertos','gardener'])assert.ok(readFileSync(`assets/room-${name}.webp`).length>9000);
for(const name of ['gardener','barkguard','sporeseer','liria'])assert.ok(readFileSync(`assets/${name}-v26.png`).length>5000);
for(const scene of Object.keys(scenarios)){
 const sub=spawnSync(process.execPath,[new URL(import.meta.url).pathname,scene],{encoding:'utf8',timeout:17000});
 assert.equal(sub.status,0,`${scene}:\n${sub.stdout}\n${sub.stderr}`)
}
console.log(`OK v2.6: ${Object.keys(scenarios).length} integration scenarios, save migration, sprites, gates, ritual and boss`);
