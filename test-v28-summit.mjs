import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {chambers,chamberAt,portalFor} from './chambers.js';
import {validateSave,createSaveManager} from './save-manager.js';
import {SUMMIT_START,SUMMIT_END,SUMMIT_MEMORY_X,SUMMIT_CHECKPOINTS,SUMMIT_NPCS,canEnterSummit,canEnterSilentCloister,canHearFrozenBell,summitDialogue,snowVisualIntensity} from './summit-v28.js';
import {enemyBehavior} from './combat.js';
import {biomeFor,cueNotes} from './soundscape.js';
const HP=i=>i>=53?115:i===52?650:i===43?560:i===46||i===49?90:i>=44?110:i===38||i===41?74:i>=36?96:i===8?180:i===16?320:i===21?420:i===31?480:i>=32?88:i>=26?95:i>=24?85:i>=17?78:i>=12?64:i>=9?58:42;
const enemies=Array.from({length:57},(_,i)=>({hp:[8,16,21,31,43,52].includes(i)?0:HP(i),alive:![8,16,21,31,43,52].includes(i)}));
const base={p:{x:33180,hp:100,flasks:3,checkpoint:32320},enemies,secrets:[{taken:false},{taken:false}],phase:'playing',chapterClear:true,questStage:3,allegiance:'people',districtQuest:2,regionClear:true,forestStage:3,forestEchoes:[2,0,1],forestClear:true,ossaraStage:3,ossaraNames:[1,0,2],ossaraClear:true,salmueraStage:3,tideMode:'low',seaEchoes:[0,1,2],seaClear:true,rootStage:3,rootRites:[0,1,2],rootClear:true,summitStage:0,visited:[20,25]};
const scenarios={
 locked:{x:33180,rootClear:false,action:'KeyE',range:[31750,33250]},
 enter:{x:33180,action:'KeyE',range:[33250,34700]},
 meet:{x:33740,checkpoint:33530,action:'KeyE',stage:1},
 doorLocked:{x:34630,checkpoint:33530,action:'KeyE',stage:0,range:[33250,34700]},
 doorOpen:{x:34630,checkpoint:33530,action:'KeyE',stage:1,range:[34700,36200]},
 tooEarly:{x:35380,checkpoint:34930,action:'KeyQ,KeyE',stage:1},
 echo:{x:35380,checkpoint:34930,action:'KeyQ,KeyE',stage:2,defeated:true},
 finish:{x:33740,checkpoint:33530,action:'KeyE',stage:3,already:2}
};
const target=process.argv[2];
if(target){
 const s=scenarios[target];assert.ok(s,target);
 const save=structuredClone(base);save.p.x=s.x;save.p.checkpoint=s.checkpoint??32320;save.rootClear=s.rootClear??true;save.summitStage=s.already??(target==='meet'?0:s.stage??0);
 if(s.defeated){save.enemies[55]={hp:0,alive:false};save.enemies[56]={hp:0,alive:false}}
 assert.ok(validateSave(save),`fixture ${target}`);
 const store=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(save)]]);
 const noop=()=>{},ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
 class E{constructor(){this.children=[];this.textContent='';this.hidden=false;this.disabled=false;this.tagName='BUTTON';this.classList={add:noop,remove:noop};this.handlers={}}addEventListener(k,f){this.handlers[k]=f}appendChild(e){this.children.push(e)}replaceChildren(...v){this.children=v}querySelector(){return this.children.find(x=>!x.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
 const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(k=>[k,new E()]));els.get('#game').getContext=()=>ctx;
 globalThis.document={querySelector:k=>els.get(k),createElement:()=>new E(),body:new E()};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this.url=v}};
 globalThis.window={};globalThis.location={reload:noop};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
 globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 const events={};globalThis.addEventListener=(k,f)=>events[k]=f;const callbacks=[];globalThis.requestAnimationFrame=f=>callbacks.push(f);
 await import('./game.js');let now=performance.now();const frame=()=>{now+=16;const f=callbacks.shift();assert.ok(f);f(now)};
 const press=k=>{events.keydown({code:k,repeat:false,preventDefault:noop});frame();events.keyup({code:k})};
 const continueButton=els.get('#menuEntries').children.find(b=>b.textContent==='Continuar');assert.ok(continueButton);continueButton.click();frame();frame();
 for(const key of s.action.split(',')){press(key);for(let i=0;i<3;i++)frame()}
 press('KeyP');const result=JSON.parse(store.get('ashen-pilgrimage-save-v2-auto'));assert.ok(validateSave(result),target+' autosave');
 if(s.range)assert.ok(result.p.x>=s.range[0]&&result.p.x<s.range[1],`${target} x=${result.p.x}`);
 if(s.stage!==undefined)assert.equal(result.summitStage,s.stage,`${target} stage`);
 if(s.defeated)assert.equal(result.summitStage,2,'frozen bell must grant stage 2');
 assert.equal(result.enemies.length,73);
 console.log('OK summit runtime',target);
 process.exit(0);
}
assert.ok(chambers.length>=31);assert.equal(chambers[25].end,SUMMIT_START);assert.equal(chambers[27].end,SUMMIT_END);assert.equal(chambers[30].end,40700);
assert.equal(chamberAt(33600),26);assert.equal(chamberAt(35400),27);assert.equal(chamberAt(portalFor(33180,25).destination),26);
assert.equal(canEnterSummit(false,false),false);assert.equal(canEnterSummit(true,true),false);assert.equal(canEnterSummit(true,false),true);
assert.equal(canEnterSilentCloister(0),false);assert.equal(canEnterSilentCloister(1),true);
assert.equal(canHearFrozenBell(1,false,true),false);assert.equal(canHearFrozenBell(1,true,false),false);assert.equal(canHearFrozenBell(1,true,true),true);
assert.equal(summitDialogue(0).stage,1);assert.equal(summitDialogue(2).stage,3);assert.equal(SUMMIT_NPCS[0].id,'elda');
assert.deepEqual(SUMMIT_CHECKPOINTS,[33530,34930]);assert.equal(biomeFor(27),'summit');assert.ok(cueNotes('summit-echo').length>0);
assert.ok(enemyBehavior('icewraith').projectile);assert.equal(enemyBehavior('icewarden').projectile,false);
assert.ok(snowVisualIntensity(26)<.17);assert.equal(snowVisualIntensity(25),0);
assert.ok(validateSave(base));assert.ok(validateSave({...base,enemies:base.enemies.slice(0,53),summitStage:undefined}));
assert.ok(!validateSave({...base,p:{...base.p,x:46601}}));assert.ok(!validateSave({...base,visited:[35]}));assert.ok(!validateSave({...base,summitStage:4}));
const disk=new Map();const manager=createSaveManager({getItem:k=>disk.get(k)??null,setItem:(k,v)=>disk.set(k,v),removeItem:k=>disk.delete(k)});
manager.write('slot1',{...base,enemies:base.enemies.slice(0,53),summitStage:undefined});assert.equal(manager.read('slot1').enemies.length,53);
const visual=readFileSync('visual.js','utf8');assert.match(visual,/saltguard-v28\.png/);assert.match(visual,/sirene-v28\.png/);
for(const f of ['saltguard-v28.png','sirene-v28.png','icewarden-v28.png','icewraith-v28.png','elda-v28.png']){const buf=readFileSync('assets/'+f);assert.equal(buf.readUInt32BE(16),2560,f);assert.equal(buf.readUInt32BE(20),160,f);assert.ok(buf.length>15000)}
for(const f of ['room-summitpass-v28.webp','room-silentcloister-v28.webp','snow-far-v28.png','snow-mid-v28.png'])assert.ok(readFileSync('assets/'+f).length>2000,f);
for(const name of Object.keys(scenarios)){
 const r=spawnSync(process.execPath,[new URL(import.meta.url).pathname,name],{encoding:'utf8',timeout:15000});assert.equal(r.status,0,`${name}: ${r.stdout}\n${r.stderr}`);
}
console.log('OK v2.8: sea atlas revision, winter biome, legacy saves, 8 runtime scenarios');
