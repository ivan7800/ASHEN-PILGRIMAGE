// Production UI tests for a corrupt auto slot and persistence of completed endings.
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {PREFIX,validateSave} from './save-manager.js';
const scenario=process.argv[2];
if(!scenario){
 for(const caseName of ['damaged','ending']){
  const result=spawnSync(process.execPath,[new URL(import.meta.url).pathname,caseName],{encoding:'utf8',timeout:25000});
  assert.equal(result.status,0,`Fallo ${caseName}:\n${result.stdout}\n${result.stderr}`);
 }
 console.log('OK v4.0: guardados dañados protegidos y epílogo persistente en la UI de producción.');
 process.exit(0);
}
const noop=()=>{};
const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
class El{constructor(){this.children=[];this.tagName='BUTTON';this.hidden=false;this.disabled=false;this.textContent='';this.handlers={};this.style={setProperty:noop};this.classList={add:noop,remove:noop,toggle:noop};this.dataset={};}
 addEventListener(name,cb){this.handlers[name]=cb}appendChild(x){this.children.push(x);return x}replaceChildren(...list){this.children=list}
 querySelector(){return this.children.find(x=>x.tagName==='BUTTON'&&!x.disabled)}querySelectorAll(){return this.children.filter(x=>x.tagName==='BUTTON'&&!x.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
const nodes=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError','#caption','#announcement'].map(k=>[k,new El()]));nodes.get('#game').getContext=()=>ctx;
globalThis.document={querySelector:k=>nodes.get(k),createElement:()=>new El(),body:new El(),documentElement:new El(),addEventListener:noop};
globalThis.window={};globalThis.Image=class{complete=false;naturalWidth=0;set src(x){this.url=x}};
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
globalThis.location={reload:noop};
const bossIndices=new Set([8,16,21,31,43,52,63,72]);
const fixture={p:{x:46070,hp:88,flasks:2,checkpoint:45200},enemies:Array.from({length:73},(_,i)=>({alive:!bossIndices.has(i),hp:bossIndices.has(i)?0:1})),secrets:[{taken:false},{taken:false}],phase:'playing',chapterClear:true,questStage:3,allegiance:'people',districtQuest:2,regionClear:true,forestStage:3,forestEchoes:[0,1,2],forestClear:true,ossaraStage:3,ossaraNames:[1,0,2],ossaraClear:true,salmueraStage:3,tideMode:'low',seaEchoes:[0,1,2],seaClear:true,rootStage:3,rootRites:[0,1,2],rootClear:true,summitStage:3,summitResonances:[0,1,2],summitClear:true,finalStage:2,solarSeals:[0,1,2],finalClear:true,finalEnding:'none',visited:[34]};
assert.ok(validateSave(fixture));
const corrupted='{"guardado":"cortado"';
const data=new Map();
if(scenario==='damaged') {data.set(PREFIX+'auto',corrupted);data.set(PREFIX+'slot1',JSON.stringify(fixture));}
else if(scenario==='ending'){data.set(PREFIX+'slot1',JSON.stringify({...fixture,phase:'won',finalEnding:'custodiar'}));}
else throw Error('Unknown scenario');
globalThis.localStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
const listeners={};globalThis.addEventListener=(n,cb)=>listeners[n]=cb;
const frames=[];globalThis.requestAnimationFrame=cb=>frames.push(cb);
await import('./game.js');
let now=performance.now();function frame(){now+=16;assert.equal(frames.length,1);frames.shift()(now)}
function key(code){listeners.keydown({code,repeat:false,preventDefault:noop});frame();listeners.keyup({code});frame()}
function selectStart(text){const e=nodes.get('#menuEntries').children.find(x=>x.textContent===text);assert.ok(e,`${text}: ${nodes.get('#menuEntries').children.map(x=>x.textContent).join(',')}`);e.click()}
function choose(prefix){const e=nodes.get('#menuEntries').children.find(x=>x.textContent.startsWith(prefix));assert.ok(e,prefix);e.click()}
if(scenario==='damaged'){
 assert.match(nodes.get('#menuError').textContent,/dañada/i);
 selectStart('Cargar partida');choose('Ranura 1');selectStart('Sí, cargar');
 assert.equal(nodes.get('#menu').hidden,true);
 assert.equal(data.get(PREFIX+'auto'),corrupted,'Cargar ranura manual conserva autoguardado dañado');
 key('KeyP');
 assert.equal(data.get(PREFIX+'auto'),corrupted,'Autoguardado por tecla P no sobrescribe dañado');
 assert.match(nodes.get('#announcement').textContent,/protegido/i);
 nodes.get('#pause').onclick();selectStart('Guardar partida');choose('Ranura 2');
 assert.ok(validateSave(JSON.parse(data.get(PREFIX+'slot2'))),'Guardar ranura nueva sigue disponible');
 selectStart('Volver al menú principal');selectStart('Nueva partida');
 assert.match(nodes.get('#menuDescription').textContent,/dañado/i);
 selectStart('Cancelar');assert.equal(data.get(PREFIX+'auto'),corrupted,'Cancelar conserva el daño');
 selectStart('Nueva partida');selectStart('Sí, iniciar nueva partida');
 assert.ok(validateSave(JSON.parse(data.get(PREFIX+'auto'))),'Solo aceptación expresa reemplaza corrupto');
}else{
 selectStart('Continuar');frame();key('KeyP');
 const completed=JSON.parse(data.get(PREFIX+'auto'));
 assert.equal(completed.phase,'won','La continuación conserva la condición completada');
 assert.equal(completed.finalEnding,'custodiar');
 nodes.get('#pause').onclick();selectStart('Volver al menú principal');selectStart('Ver último desenlace');
 assert.ok(nodes.get('#menuDescription').textContent.length>20);
}
console.log('OK',scenario);
process.exit(0);
