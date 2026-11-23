import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {chambers,chamberAt,portalFor} from './chambers.js';
import {validateSave,createSaveManager} from './save-manager.js';
import {FINAL_START,FINAL_END,FIRST_WITNESS_INDEX,FIRST_WITNESS_HP,SOLAR_SEALS,ENDINGS,canEnterThrone,hearSolarSeal,canEnterFinalSanctuary,finishPilgrimage,witnessTiming,witnessTelegraph,sunwaveHits} from './final-throne-v30.js';
import {enemyBehavior} from './combat.js';
import {biomeFor,cueNotes} from './soundscape.js';

const enemies=Array.from({length:73},(_,i)=>({alive:true,hp:i===72?960:1}));
for(const i of [8,16,21,31,43,52,63])enemies[i]={alive:false,hp:0};
const base={p:{x:40750,hp:100,flasks:3,checkpoint:39260},enemies,secrets:[{taken:false},{taken:false}],phase:'playing',loreSeen:[true,true,true,true],kills:7,chapterClear:true,questStage:3,allegiance:'people',districtQuest:2,regionClear:true,forestStage:3,forestEchoes:[2,0,1],forestClear:true,ossaraStage:3,ossaraNames:[1,0,2],ossaraClear:true,salmueraStage:3,tideMode:'low',seaEchoes:[0,1,2],seaClear:true,rootStage:3,rootRites:[0,1,2],rootClear:true,summitStage:3,summitResonances:[0,1,2],summitClear:true,finalStage:1,solarSeals:[],finalClear:false,finalEnding:'none',visited:[27,28,29,30]};
const scenarios={
 locked:{x:40575,checkpoint:39260,giantAlive:true,action:['KeyE'],room:30},
 enter:{x:40575,checkpoint:39260,action:['KeyE'],room:31},
 saint:{x:40970,checkpoint:41070,stage:0,action:['KeyE'],stageAfter:1},
 firstseal:{x:43120,checkpoint:42500,action:['KeyQ','KeyE'],sealsAfter:[0]},
 misorder:{x:44220,checkpoint:43930,seals:[0],action:['KeyQ','KeyE'],sealsAfter:[]},
 lockedaltar:{x:44730,checkpoint:43930,action:['KeyE'],room:33},
 openaltar:{x:44730,checkpoint:43930,seals:[0,1,2],action:['KeyE'],room:34},
 boss:{x:45690,checkpoint:45200,seals:[0,1,2],bossHP:12,action:['KeyJ'],bossDead:true},
 ending:{x:46160,checkpoint:45200,seals:[0,1,2],cleared:true,action:['KeyE'],ending:'extinguir'}
};
const which=process.argv[2];
if(which){
 const scenario=scenarios[which];assert.ok(scenario,'escenario conocido');
 const saved=structuredClone(base);saved.p.x=scenario.x;saved.p.checkpoint=scenario.checkpoint;
 saved.finalStage=scenario.stage??1;saved.solarSeals=scenario.seals??[];
 if(scenario.giantAlive){saved.summitClear=false;saved.enemies[63]={hp:780,alive:true}}
 if(scenario.bossHP)saved.enemies[72].hp=scenario.bossHP;
 if(scenario.cleared){saved.finalClear=true;saved.enemies[72]={hp:0,alive:false}}
 assert.ok(validateSave(saved),'fixture '+which);
 const store=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(saved)]]),noop=()=>{};
 const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(obj,key)=>obj[key]??noop});
 class Element{constructor(){this.children=[];this.hidden=false;this.disabled=false;this.textContent='';this.tagName='BUTTON';this.classList={add:noop,remove:noop};this.handlers={};this.style={}}addEventListener(k,cb){this.handlers[k]=cb}appendChild(e){this.children.push(e)}replaceChildren(...es){this.children=es}querySelector(){return this.children.find(e=>!e.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
 const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(k=>[k,new Element()]));els.get('#game').getContext=()=>ctx;
 globalThis.document={querySelector:k=>els.get(k),createElement:()=>new Element(),body:new Element()};
 globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this.url=v}};
 globalThis.window={};globalThis.location={reload:noop};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
 globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const events={};globalThis.addEventListener=(k,cb)=>events[k]=cb;
 const callbacks=[];globalThis.requestAnimationFrame=cb=>callbacks.push(cb);
 await import('./game.js');let now=performance.now();const frame=()=>{now+=16;const cb=callbacks.shift();assert.ok(cb);cb(now)};
 const press=(key,extraFrames=5)=>{events.keydown({code:key,repeat:false,preventDefault:noop});frame();events.keyup({code:key});for(let i=0;i<extraFrames;i++)frame()};
 const cont=els.get('#menuEntries').children.find(b=>b.textContent==='Continuar');assert.ok(cont,'continuar disponible');cont.click();frame();frame();
 for(const key of scenario.action)press(key,scenario.bossDead?18:5);
 if(scenario.ending){const item=els.get('#menuEntries').children.find(e=>e.textContent===ENDINGS[scenario.ending].title);assert.ok(item,'desenlace accesible tras jefe');item.click()}
 if(!scenario.ending)press('KeyP');
 const data=JSON.parse(store.get('ashen-pilgrimage-save-v2-auto'));
 assert.ok(validateSave(data));
 if(scenario.room!==undefined)assert.equal(chamberAt(data.p.x),scenario.room,`zona ${which}`);
 if(scenario.stageAfter!==undefined)assert.equal(data.finalStage,scenario.stageAfter);
 if(scenario.sealsAfter)assert.deepEqual(data.solarSeals,scenario.sealsAfter);
 if(scenario.bossDead){assert.equal(data.finalClear,true);assert.equal(data.enemies[72].alive,false)}
 if(scenario.ending){assert.equal(data.phase,'won');assert.equal(data.finalEnding,scenario.ending)}
 assert.equal(data.enemies.length,73);
 console.log('OK integración final',which);process.exit(0);
}
assert.equal(chambers.length,35);assert.equal(chambers[30].end,FINAL_START);assert.equal(chambers.at(-1).end,FINAL_END);
assert.equal(FIRST_WITNESS_INDEX,72);assert.equal(FIRST_WITNESS_HP,960);assert.equal(SOLAR_SEALS.length,3);
assert.equal(chamberAt(41100),31);assert.equal(chamberAt(42900),32);assert.equal(chamberAt(43800),33);assert.equal(chamberAt(45700),34);
assert.equal(canEnterThrone(false,false),false);assert.equal(canEnterThrone(true,true),false);assert.equal(canEnterThrone(true,false),true);
assert.equal(hearSolarSeal([],0,{desvelo:false,stage:1}).changed,false);
assert.deepEqual(hearSolarSeal([],0,{desvelo:true,stage:0}).seals,[]);
assert.deepEqual(hearSolarSeal([],0,{desvelo:true,stage:1}).seals,[0]);
assert.deepEqual(hearSolarSeal([0],2,{desvelo:true,stage:1}).seals,[]);
assert.deepEqual(hearSolarSeal([0],1,{desvelo:true,stage:1}).seals,[0,1]);
assert.deepEqual(hearSolarSeal([0,1],2,{desvelo:true,stage:1}).seals,[0,1,2]);
assert.equal(canEnterFinalSanctuary([0,1,2],[true,true,true,true,true,true]),true);
assert.equal(canEnterFinalSanctuary([0,1,2],[true,true,false,true,true,true]),false);
assert.equal(canEnterFinalSanctuary([0,2],[true,true,true,true,true,true]),false);
assert.equal(finishPilgrimage(true,'none','liberar').ending,'liberar');assert.equal(finishPilgrimage(true,'liberar','custodiar').ok,false);
assert.equal(finishPilgrimage(false,'none','custodiar').ok,false);
assert.equal(witnessTiming(1).windup>witnessTiming(2).windup,true);
assert.equal(witnessTelegraph({x:45750,w:30,dir:-1,phase:2,windup:.4,attackMode:'sunwave'}).range,295);
assert.equal(sunwaveHits({x:45900,w:30,dir:-1},{x:45770,w:32,y:370,h:68}),true);
assert.equal(sunwaveHits({x:45900,w:30,dir:-1},{x:45770,w:32,y:320,h:68}),false);
assert.ok(enemyBehavior('ashherald').projectile);assert.ok(!enemyBehavior('firstwitness').projectile);
assert.equal(biomeFor(34),'final');assert.ok(cueNotes('witness-defeat').length>0);
assert.ok(validateSave(base),'nuevo formato');assert.ok(validateSave({...base,enemies:base.enemies.slice(0,64),finalStage:undefined,solarSeals:undefined,finalClear:undefined,finalEnding:undefined,visited:[30]}),'guardado v2.9 compatible');
assert.ok(!validateSave({...base,p:{...base.p,x:46601}}));assert.ok(!validateSave({...base,visited:[35]}));
assert.ok(!validateSave({...base,solarSeals:[0,2]}));assert.ok(!validateSave({...base,finalEnding:'invalid'}));
const memory=new Map(),manager=createSaveManager({getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)});
manager.write('slot1',base);assert.equal(manager.read('slot1').enemies.length,73);
const old={...base,enemies:base.enemies.slice(0,64),finalStage:undefined,solarSeals:undefined,finalClear:undefined,finalEnding:undefined};manager.write('slot2',old);assert.equal(manager.read('slot2').enemies.length,64);
for(const f of ['firstwitness-v30.png','sunpenitent-v30.png','solarwraith-v30.png','ashherald-v30.png']){
 const buf=readFileSync(`assets/${f}`);assert.equal(buf.subarray(1,4).toString(),'PNG');assert.equal(buf.readUInt32BE(16),2560);assert.equal(buf.readUInt32BE(20),160)}
for(const f of ['umbral','galeria','brasas','trono'])assert.ok(readFileSync(`assets/room-final-${f}-v30.webp`).length>30000);
for(const scenario of Object.keys(scenarios)){
 const r=spawnSync(process.execPath,[new URL(import.meta.url).pathname,scenario],{encoding:'utf8',timeout:19000});
 assert.equal(r.status,0,`${scenario}\n${r.stdout}\n${r.stderr}`)}
console.log(`OK v3.0: reglas del séptimo reino, formatos de guardado, arte y ${Object.keys(scenarios).length} escenarios de integración`);
