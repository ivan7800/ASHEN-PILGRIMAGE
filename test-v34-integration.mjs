import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {validateSave} from './save-manager.js';
import {relicEffects} from './exploration-v34.js';
const base={
 p:{x:2180,hp:100,flasks:3,checkpoint:2050},
 enemies:Array.from({length:73},(_,i)=>({hp:[8,16,21,31,43,52,63].includes(i)?0:i===72?960:1,alive:![8,16,21,31,43,52,63].includes(i)})),
 secrets:[{taken:false},{taken:false}],phase:'playing',kills:7,chapterClear:true,questStage:3,allegiance:'people',districtQuest:2,regionClear:true,
 forestStage:3,forestEchoes:[2,0,1],forestClear:true,ossaraStage:3,ossaraNames:[1,0,2],ossaraClear:true,
 salmueraStage:3,tideMode:'low',seaEchoes:[0,1,2],seaClear:true,rootStage:3,rootRites:[0,1,2],rootClear:true,
 summitStage:3,summitResonances:[0,1,2],summitClear:true,finalStage:1,solarSeals:[],finalClear:false,finalEnding:'none',visited:[0]
};
const cases={
  relicCrypt:{x:2180,checkpoint:2050,keys:['KeyQ','KeyE'],found:['vigil']},
  relicLocked:{x:7270,checkpoint:6570,questStage:2,allegiance:'none',keys:['KeyQ','KeyE'],found:[]},
  relicValdren:{x:7270,checkpoint:6570,keys:['KeyQ','KeyE'],found:['exile']},
  relicForest:{x:10610,checkpoint:10050,keys:['KeyQ','KeyE'],found:['seed']},
  relicOssara:{x:15980,checkpoint:15220,keys:['KeyQ','KeyE'],found:['thread']},
  relicSea:{x:22920,checkpoint:22180,keys:['KeyQ','KeyE'],found:['pearl']},
  relicRoots:{x:31220,checkpoint:30820,keys:['KeyQ','KeyE'],found:['bark']},
  relicSummit:{x:37300,checkpoint:36480,keys:['KeyQ','KeyE'],found:['bell']},
  relicFinal:{x:42730,checkpoint:42500,keys:['KeyQ','KeyE'],found:['solar']},
  valdrShortcutLocked:{x:5480,checkpoint:5140,questStage:2,keys:['KeyQ','KeyE'],room:5,paths:[]},
  valdrShortcutOpen:{x:5480,checkpoint:5140,keys:['KeyQ','KeyE'],room:6,paths:['tizones']},
  valdrShortcutReturn:{x:7160,checkpoint:6570,keys:['KeyE'],existingPaths:['tizones'],room:5,paths:['tizones']},
  forestShortcut:{x:9560,checkpoint:9010,keys:['KeyQ','KeyE'],room:10,paths:['hollow']},
  ossaraShortcut:{x:14150,checkpoint:13680,keys:['KeyQ','KeyE'],room:14,paths:['ossuary']},
};
const which=process.argv[2];
if(which){
 const conf=cases[which];assert.ok(conf);const state=structuredClone(base);
 state.p.x=conf.x;state.p.checkpoint=conf.checkpoint;
 for(const k of ['questStage','allegiance'])if(k in conf)state[k]=conf[k];
 state.relicsFound=[];state.shortcutsOpened=conf.existingPaths??[];
 assert.ok(validateSave(state),which+' fixture invalid');
 const store=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(state)]]),noop=()=>{};
 const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
 class Element{constructor(){this.children=[];this.hidden=false;this.disabled=false;this.textContent='';this.tagName='BUTTON';this.style={};this.classList={add:noop,remove:noop};this.handlers={}}addEventListener(k,cb){this.handlers[k]=cb}appendChild(e){this.children.push(e)}replaceChildren(...es){this.children=es}querySelector(){return this.children.find(e=>!e.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
 const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(k=>[k,new Element()]));els.get('#game').getContext=()=>ctx;
 globalThis.document={querySelector:k=>els.get(k),createElement:()=>new Element(),body:new Element()};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this.url=v}};globalThis.window={};globalThis.location={reload:noop};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
 globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const events={};globalThis.addEventListener=(k,cb)=>events[k]=cb;const callbacks=[];globalThis.requestAnimationFrame=cb=>callbacks.push(cb);
 await import('./game.js');let now=performance.now();const frame=()=>{now+=16;const cb=callbacks.shift();assert.ok(cb);cb(now)};
 const press=k=>{events.keydown({code:k,repeat:false,preventDefault:noop});frame();events.keyup({code:k});for(let i=0;i<4;i++)frame()};
 const cont=els.get('#menuEntries').children.find(b=>b.textContent==='Continuar');assert.ok(cont);cont.click();frame();frame();
 for(const k of conf.keys)press(k);
 press('KeyP');const result=JSON.parse(store.get('ashen-pilgrimage-save-v2-auto'));assert.ok(validateSave(result),`${which} save invalid`);
 if(conf.found)assert.deepEqual(result.relicsFound,conf.found,which);
 if(conf.paths)assert.deepEqual(result.shortcutsOpened,conf.paths,which);
 if(conf.room!==undefined){const {chamberAt}=await import('./chambers.js');assert.equal(chamberAt(result.p.x),conf.room,`área de ${which}`)}
 console.log('OK v3.4 runtime',which);process.exit(0);
}
assert.ok(validateSave(base),'v3.3 full save compatible');
const buffs=relicEffects(['vigil','exile','seed','thread','pearl','bark','bell','solar'],'people');assert.ok(buffs.healBonus>0&&buffs.swordMultiplier>1);
for(const name of Object.keys(cases)){
 const r=spawnSync(process.execPath,[new URL(import.meta.url).pathname,name],{encoding:'utf8',timeout:18000});
 assert.equal(r.status,0,`${name}\n${r.stdout}\n${r.stderr}`);
}
console.log(`OK v3.4: ${Object.keys(cases).length} escenarios de integración real del bucle de juego.`);
