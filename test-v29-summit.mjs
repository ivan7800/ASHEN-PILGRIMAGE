import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {chambers,chamberAt} from './chambers.js';
import {validateSave,createSaveManager} from './save-manager.js';
import {HIGH_SUMMIT_START,HIGH_SUMMIT_END,GIANT_BOSS_INDEX,GIANT_BOSS_HP,RESONATORS,canClimbHighSummit,canCrossEchoBridge,canEnterGiantSanctuary,hearResonance,giantTiming,giantTelegraph,shockwaveHits} from './summit-v29.js';
import {cueNotes,biomeFor} from './soundscape.js';
import {summitDialogue} from './summit-v28.js';
import {enemyBehavior} from './combat.js';
const oldHP=i=>i>=53?115:i===52?650:i===43?560:i===46||i===49?90:i>=44?110:i===38||i===41?74:i>=36?96:i===8?180:i===16?320:i===21?420:i===31?480:i>=32?88:i>=26?95:i>=24?85:i>=17?78:i>=12?64:i>=9?58:42;
const enemies=Array.from({length:64},(_,i)=>({hp:i===63?GIANT_BOSS_HP:i===59?125:i>=57?95:oldHP(i),alive:true}));
for(const i of [8,16,21,31,43,52]){enemies[i]={hp:0,alive:false}}
const base={p:{x:36200,hp:100,flasks:3,checkpoint:34930},enemies,secrets:[{taken:false},{taken:false}],phase:'playing',chapterClear:true,questStage:3,allegiance:'people',districtQuest:2,regionClear:true,forestStage:3,forestEchoes:[2,0,1],forestClear:true,ossaraStage:3,ossaraNames:[1,0,2],ossaraClear:true,salmueraStage:3,tideMode:'low',seaEchoes:[0,1,2],seaClear:true,rootStage:3,rootRites:[0,1,2],rootClear:true,summitStage:3,summitResonances:[],summitClear:false,visited:[25,26,27]};
const scenarios={
 locked:{x:36135,checkpoint:34930,stage:2,action:'KeyE',room:27},
 enter:{x:36135,checkpoint:34930,action:'KeyE',room:28},
 first:{x:37030,checkpoint:36480,action:'KeyQ,KeyE',echoes:[0]},
 gate1:{x:37535,checkpoint:36480,echoes:[0],action:'KeyE',room:29},
 gate2locked:{x:38935,checkpoint:37870,echoes:[0,1],action:'KeyE',room:29},
 gate2:{x:38935,checkpoint:37870,echoes:[0,1,2],action:'KeyE',room:30},
 boss:{x:39848,checkpoint:39260,echoes:[0,1,2],action:'KeyJ',bossDead:true}
};
const target=process.argv[2];
if(target){
 const s=scenarios[target];assert.ok(s);
 const saved=structuredClone(base);saved.p.x=s.x;saved.p.checkpoint=s.checkpoint;saved.summitStage=s.stage??3;saved.summitResonances=[...(s.echoes||[])];
 if(s.bossDead){saved.enemies[GIANT_BOSS_INDEX].hp=12;for(let i=57;i<63;i++)saved.enemies[i]={hp:0,alive:false}}
 assert.ok(validateSave(saved),'scenario fixture '+target);
 const store=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(saved)]]),noop=()=>{},ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(obj,key)=>obj[key]??noop});
 class E{constructor(){this.children=[];this.textContent='';this.hidden=false;this.disabled=false;this.tagName='BUTTON';this.classList={add:noop,remove:noop};this.handlers={}}addEventListener(k,fn){this.handlers[k]=fn}appendChild(x){this.children.push(x)}replaceChildren(...x){this.children=x}querySelector(){return this.children.find(x=>!x.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
 const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(key=>[key,new E()]));els.get('#game').getContext=()=>ctx;
 globalThis.document={querySelector:key=>els.get(key),createElement:()=>new E(),body:new E()};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this.url=v}};globalThis.window={};globalThis.location={reload:noop};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
 globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const events={};globalThis.addEventListener=(k,fn)=>events[k]=fn;const callbacks=[];globalThis.requestAnimationFrame=fn=>callbacks.push(fn);
 await import('./game.js');let now=performance.now();const frame=()=>{now+=16;const fn=callbacks.shift();assert.ok(fn);fn(now)};
 const press=(k,frames=6)=>{events.keydown({code:k,repeat:false,preventDefault:noop});frame();events.keyup({code:k});for(let j=0;j<frames;j++)frame()};
 const cont=els.get('#menuEntries').children.find(b=>b.textContent==='Continuar');assert.ok(cont);cont.click();frame();frame();
 for(const key of s.action.split(','))press(key,s.bossDead?16:4);
 press('KeyP');const result=JSON.parse(store.get('ashen-pilgrimage-save-v2-auto'));assert.ok(validateSave(result));
 if(s.room!==undefined)assert.equal(chamberAt(result.p.x),s.room,`${target} room ${result.p.x}`);
 if(target==='first')assert.deepEqual(result.summitResonances,[0]);
 if(s.bossDead){assert.equal(result.summitClear,true);assert.equal(result.enemies[GIANT_BOSS_INDEX].alive,false)}
 assert.equal(result.enemies.length,73);console.log('OK runtime scenario:',target);process.exit(0)
}
assert.ok(chambers.length>=31);assert.equal(chambers[27].end,HIGH_SUMMIT_START);assert.equal(chambers[30].end,HIGH_SUMMIT_END);assert.equal(GIANT_BOSS_INDEX,63);
assert.match(summitDialogue(3,true).text,/por fin descansa/);assert.equal(canClimbHighSummit(2),false);assert.equal(canClimbHighSummit(3),true);
assert.equal(canCrossEchoBridge([]),false);assert.equal(canCrossEchoBridge([0]),true);
assert.equal(canEnterGiantSanctuary([0,1]),false);assert.equal(canEnterGiantSanctuary([0,1,2]),true);
assert.deepEqual(hearResonance([],0,{desvelo:true,stage:3}).echoes,[0]);
assert.deepEqual(hearResonance([0],2,{desvelo:true,stage:3}).echoes,[],'wrong order must reset');
assert.deepEqual(hearResonance([0,1],2,{desvelo:true,stage:3}).echoes,[0,1,2]);
assert.deepEqual(hearResonance([0],1,{desvelo:false,stage:3}).echoes,[0]);
assert.deepEqual(hearResonance([],0,{desvelo:true,stage:2}).echoes,[]);
assert.equal(giantTiming(1).windup>giantTiming(2).windup,true);
assert.equal(giantTelegraph({x:39920,w:30,dir:-1,phase:2,windup:.5,attackMode:'shockwave'}).range,260);
assert.equal(shockwaveHits({x:40000,w:30,dir:-1},{x:39880,w:32,y:370,h:68}),true);
assert.equal(shockwaveHits({x:40000,w:30,dir:-1},{x:39880,w:32,y:290,h:68}),false,'airborne should evade');
assert.equal(shockwaveHits({x:40000,w:30,dir:-1},{x:40200,w:32,y:370,h:68}),false,'behind giant should evade');
assert.equal(enemyBehavior('bellgiant').projectile,false);assert.equal(enemyBehavior('icechoir').projectile,true);
assert.equal(biomeFor(30),'summit');for(const cue of ['resonance','giant-warning','giant-phase','giant-defeat'])assert.ok(cueNotes(cue).length);
assert.ok(validateSave(base));assert.ok(validateSave({...base,enemies:base.enemies.slice(0,57),summitResonances:undefined,summitClear:undefined}));
assert.ok(!validateSave({...base,p:{...base.p,x:46601}}));assert.ok(!validateSave({...base,visited:[35]}));
assert.ok(!validateSave({...base,summitResonances:[0,2]}));assert.ok(!validateSave({...base,summitClear:'yes'}));
const slotStore=new Map(),m=createSaveManager({getItem:k=>slotStore.get(k)??null,setItem:(k,v)=>slotStore.set(k,v),removeItem:k=>slotStore.delete(k)});
m.write('slot1',base);assert.deepEqual(m.read('slot1').summitResonances,[]);m.write('slot2',{...base,enemies:base.enemies.slice(0,57),summitResonances:undefined,summitClear:undefined});assert.equal(m.read('slot2').enemies.length,57);
for(const fn of ['bellgiant-v29.png','hushmonk-v29.png','icechoir-v29.png']){const buf=readFileSync('assets/'+fn);assert.equal(buf.readUInt32BE(16),2560,fn);assert.equal(buf.readUInt32BE(20),160,fn)}
for(const fn of ['room-snowstairs-v29.webp','room-snowecho-v29.webp','room-snowgiant-v29.webp'])assert.ok(readFileSync('assets/'+fn).length>30000);
for(const name of Object.keys(scenarios)){const r=spawnSync(process.execPath,[new URL(import.meta.url).pathname,name],{encoding:'utf8',timeout:20000});assert.equal(r.status,0,`${name}\n${r.stdout}\n${r.stderr}`)}
console.log('OK v2.9: high-summit gates, resonance order, giant shockwaves, legacy saves, 7 runtime scenarios.');
