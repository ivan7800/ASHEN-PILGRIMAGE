import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {chambers,chamberAt,portalFor} from './chambers.js';
import {validateSave,createSaveManager} from './save-manager.js';
import {SEA_BOSS_INDEX,SEA_BOSS_HP,SEA_VALVES,SEA_ECHOES,isUnderwater,canEnterDepths,tideGate,turnValve,hearSeaEcho,brideTiming,brideTelegraph} from './sea-v25.js';
import {enemyBehavior} from './combat.js';
import {biomeFor,cueNotes} from './soundscape.js';
const kind=process.argv[2];
const maxHP=i=>i===43?SEA_BOSS_HP:i===38||i===41?74:i>=36?96:i===8?180:i===16?320:i===21?420:i===31?480:i>=32?88:i>=26?95:i>=24?85:i>=17?78:i>=12?64:i>=9?58:42;
const enemies=Array.from({length:44},(_,i)=>({hp:maxHP(i),alive:true}));
for(const i of [8,16,21,31])enemies[i]={hp:0,alive:false};
const base={p:{x:21940,hp:100,flasks:3,checkpoint:20730},enemies,secrets:[{taken:false},{taken:false}],phase:'playing',chapterClear:true,questStage:3,allegiance:'people',districtQuest:2,regionClear:true,forestStage:3,forestEchoes:[2,0,1],forestClear:true,ossaraStage:3,ossaraNames:[1,0,2],ossaraClear:true,salmueraStage:3,tideMode:'high',seaEchoes:[],seaClear:false,visited:[15,16,17]};
const SCENARIOS={
 locked17:{x:21940,checkpoint:20730,salmueraStage:2,action:'KeyE',expectX:[20500,22000]},
 door17:{x:21940,checkpoint:20730,action:'KeyE',expectX:[22000,23400]},
 dial0:{x:22470,checkpoint:22180,action:'KeyE',expectMode:'low'},
 echo0:{x:23220,checkpoint:22180,tideMode:'low',action:'KeyQ,KeyE',expectEcho:[0]},
 locked18:{x:23340,checkpoint:22180,tideMode:'high',seaEchoes:[0],action:'KeyE',expectX:[22000,23400]},
 door18:{x:23340,checkpoint:22180,tideMode:'low',seaEchoes:[0],action:'KeyE',expectX:[23400,24700]},
 dial1:{x:23880,checkpoint:23820,tideMode:'low',seaEchoes:[0],action:'KeyE',expectMode:'high'},
 echo1:{x:24230,checkpoint:23820,tideMode:'high',seaEchoes:[0],action:'KeyQ,KeyE',expectEcho:[0,1]},
 locked19:{x:24640,checkpoint:23820,tideMode:'low',seaEchoes:[0,1],action:'KeyE',expectX:[23400,24700]},
 door19:{x:24640,checkpoint:23820,tideMode:'high',seaEchoes:[0,1],action:'KeyE',expectX:[24700,26000]},
 dial2:{x:25120,checkpoint:25100,tideMode:'high',seaEchoes:[0,1],action:'KeyE',expectMode:'low'},
 echo2:{x:25570,checkpoint:25100,tideMode:'low',seaEchoes:[0,1],action:'KeyQ,KeyE',expectEcho:[0,1,2]},
 locked20:{x:25940,checkpoint:25100,tideMode:'low',seaEchoes:[0,1],action:'KeyE',expectX:[24700,26000]},
 door20:{x:25940,checkpoint:25100,tideMode:'low',seaEchoes:[0,1,2],action:'KeyE',expectX:[26000,27400]},
 boss:{x:26910,checkpoint:26650,tideMode:'low',seaEchoes:[0,1,2],bossHP:1,action:'KeyJ',expectClear:true}
};
if(kind){
 const a=SCENARIOS[kind];assert.ok(a,kind);const state=structuredClone(base);state.p.x=a.x;state.p.checkpoint=a.checkpoint;
 if(a.salmueraStage!==undefined)state.salmueraStage=a.salmueraStage;
 if(a.tideMode!==undefined)state.tideMode=a.tideMode;
 if(a.seaEchoes!==undefined)state.seaEchoes=a.seaEchoes;
 if(a.bossHP!==undefined)state.enemies[SEA_BOSS_INDEX].hp=a.bossHP;
 assert.ok(validateSave(state),kind);
 const map=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(state)]]);
 const noop=()=>{},context=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
 class El{constructor(){this.children=[];this.textContent='';this.hidden=false;this.disabled=false;this.tagName='BUTTON';this.classList={add:noop,remove:noop};this.handlers={}}addEventListener(k,f){this.handlers[k]=f}appendChild(e){this.children.push(e)}replaceChildren(...xs){this.children=xs}querySelector(){return this.children.find(x=>!x.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
 const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(k=>[k,new El()]));els.get('#game').getContext=()=>context;
 globalThis.document={querySelector:k=>els.get(k),createElement:()=>new El(),body:new El()};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this._src=v}};
 globalThis.window={};globalThis.location={reload:noop};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
 globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const events={};globalThis.addEventListener=(k,f)=>events[k]=f;const frames=[];globalThis.requestAnimationFrame=f=>frames.push(f);
 await import('./game.js');let now=performance.now();const frame=()=>{now+=16;const f=frames.shift();assert.ok(f,'frame handler');f(now)};
 const press=k=>{events.keydown({code:k,repeat:false,preventDefault:noop});frame();events.keyup({code:k})};
 const continueButton=els.get('#menuEntries').children.find(b=>b.textContent==='Continuar');assert.ok(continueButton);continueButton.click();frame();frame();
 for(const key of a.action.split(',')){press(key);for(let i=0;i<(key==='KeyJ'?22:3);i++)frame()}
 press('KeyP'); // force post-action autosave
 const d=JSON.parse(map.get('ashen-pilgrimage-save-v2-auto'));assert.ok(validateSave(d),`${kind} invalid after action`);
 if(a.expectX)assert.ok(d.p.x>=a.expectX[0]&&d.p.x<a.expectX[1],`${kind}: x=${d.p.x}`);
 if(a.expectMode)assert.equal(d.tideMode,a.expectMode,kind);
 if(a.expectEcho)assert.deepEqual(d.seaEchoes,a.expectEcho,kind);
 if(a.expectClear){assert.equal(d.seaClear,true,kind);assert.equal(d.enemies[SEA_BOSS_INDEX].alive,false,kind)}
 console.log('OK v2.5 runtime',kind);process.exit(0);
}
assert.ok(chambers.length>=22, 'La ampliación conserva las 22 cámaras anteriores');assert.equal(chamberAt(22470),18);assert.equal(chamberAt(23880),19);assert.equal(chamberAt(25120),20);assert.equal(chamberAt(26950),21);
assert.equal(chamberAt(portalFor(21940,17).destination),18);
assert.equal(isUnderwater(18,'high'),true);assert.equal(isUnderwater(19,'low'),false);assert.equal(isUnderwater(21,'high'),false);
assert.equal(canEnterDepths(2),false);assert.equal(canEnterDepths(3),true);
assert.equal(tideGate(18,'low',[0]),true);assert.equal(tideGate(18,'high',[0]),false);
assert.equal(tideGate(19,'high',[0,1]),true);assert.equal(tideGate(20,'low',[0,1]),false);
assert.equal(tideGate(20,'low',[0,1,2]),true);
assert.equal(turnValve(1,'low',[]).changed,false);assert.equal(turnValve(2,'high',[0]).changed,false);
assert.equal(turnValve(0,'high',[]).mode,'low');assert.equal(turnValve(1,'low',[0]).mode,'high');assert.equal(turnValve(2,'high',[0,1]).mode,'low');
assert.deepEqual(hearSeaEcho([],0,{desvelo:true,tide:'low'}).echoes,[0]);
assert.deepEqual(hearSeaEcho([0],1,{desvelo:true,tide:'high'}).echoes,[0,1]);
assert.deepEqual(hearSeaEcho([0,1],2,{desvelo:true,tide:'low'}).echoes,[0,1,2]);
assert.deepEqual(hearSeaEcho([0,1],2,{desvelo:false,tide:'low'}).echoes,[0,1]);
assert.deepEqual(hearSeaEcho([0,1],2,{desvelo:true,tide:'high'}).echoes,[0,1]);
assert.deepEqual(hearSeaEcho([0,1],0,{desvelo:true,tide:'low'}).echoes,[0,1]);
assert.deepEqual(hearSeaEcho([0],2,{desvelo:true,tide:'low'}).echoes,[]);
assert.ok(brideTiming(1).windup>brideTiming(2).windup);assert.ok(brideTelegraph({kind:'bride',x:200,w:30,alive:true,windup:.42,phase:2,dir:-1}));
assert.equal(enemyBehavior('bride').damage,33);assert.equal(enemyBehavior('sirene').projectile,true);
assert.equal(biomeFor(21),'salmuera');assert.ok(cueNotes('bride-defeat').length&&cueNotes('tide-turn').length);
assert.ok(validateSave(base));assert.ok(validateSave({...base,enemies:base.enemies.slice(0,36),p:{...base.p,x:20990,checkpoint:20730}}));
assert.ok(!validateSave({...base,p:{...base.p,x:46601}}));assert.ok(!validateSave({...base,seaEchoes:[0,2]}));assert.ok(!validateSave({...base,tideMode:'flood'}));
const store=new Map();const sm=createSaveManager({getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)});sm.write('slot1',base);assert.equal(sm.read('slot1').tideMode,'high');
for(const file of ['room-submerged.webp','room-tidehall.webp','room-drownedchapel.webp','room-abyssboss.webp','bride-v25.png','drowned-v25.png','sirene-v25.png'])assert.ok(readFileSync('assets/'+file).length>2500,file);
for(const scenario of Object.keys(SCENARIOS)){
 const r=spawnSync(process.execPath,[new URL(import.meta.url).pathname,scenario],{encoding:'utf8',timeout:12000});
 assert.equal(r.status,0,`${scenario}\n${r.stdout}\n${r.stderr}`);
}
console.log(`OK v2.5: ${Object.keys(SCENARIOS).length} runtime scenarios, domain, assets, save migration and boss defeat`);
