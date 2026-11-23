// Production game.js in a minimal DOM loop. These are prepared ending-state QA cases,
// not a human campaign run. All three choices are exercised through actual menu clicks.
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {ENDINGS} from './final-throne-v30.js';
import {validateSave} from './save-manager.js';

if(process.argv[2]) {
 const choice=process.argv[2];assert.ok(ENDINGS[choice]);
 const defeated=new Set([8,16,21,31,43,52,63,72]);
 const original={p:{x:46160,hp:100,flasks:3,checkpoint:45200},enemies:Array.from({length:73},(_,i)=>({hp:!defeated.has(i)?1:0,alive:!defeated.has(i)})),
 secrets:[{taken:false},{taken:false}],phase:'playing',chapterClear:true,questStage:3,allegiance:'people',districtQuest:2,regionClear:true,
 forestStage:3,forestEchoes:[0,1,2],forestClear:true,ossaraStage:3,ossaraNames:[1,0,2],ossaraClear:true,salmueraStage:3,
 tideMode:'low',seaEchoes:[0,1,2],seaClear:true,rootStage:3,rootRites:[0,1,2],rootClear:true,
 summitStage:3,summitResonances:[0,1,2],summitClear:true,finalStage:2,solarSeals:[0,1,2],finalClear:true,finalEnding:'none',visited:[34]};
 assert.ok(validateSave(original));
 const data=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(original)]]),noop=()=>{};
 const canvasCtx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(obj,k)=>obj[k]??noop});
 class E{constructor(){this.children=[];this.hidden=false;this.disabled=false;this.textContent='';this.tagName='BUTTON';this.classList={add:noop,remove:noop,toggle:noop};this.handlers={};this.style={setProperty:noop};this.dataset={}}
 addEventListener(name,cb){this.handlers[name]=cb}appendChild(e){this.children.push(e);return e}replaceChildren(...children){this.children=children}
 querySelector(){return this.children.find(e=>!e.disabled)}querySelectorAll(){return this.children.filter(e=>e.tagName==='BUTTON'&&!e.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
 const ids=['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError','#caption','#announcement'];
 const nodes=new Map(ids.map(id=>[id,new E()]));nodes.get('#game').getContext=()=>canvasCtx;
 const document={querySelector:id=>nodes.get(id),createElement:()=>new E(),body:new E(),documentElement:new E(),addEventListener:noop};
 globalThis.document=document;globalThis.window={};globalThis.location={reload:noop};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this.url=v}};
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
 globalThis.localStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
 const events={};globalThis.addEventListener=(name,cb)=>events[name]=cb;
 const frames=[];globalThis.requestAnimationFrame=cb=>frames.push(cb);
 await import('./game.js');let clock=performance.now();const frame=()=>{clock+=16;const callback=frames.shift();assert.ok(callback);callback(clock)};
 const entries=()=>nodes.get('#menuEntries').children;
 const select=(text)=>{const e=entries().find(e=>e.textContent===text);assert.ok(e,`button ${text} missing: ${entries().map(e=>e.textContent).join('|')}`);e.click()};
 const press=key=>{events.keydown({code:key,repeat:false,preventDefault:noop});frame();events.keyup({code:key});frame()};
 select('Continuar');frame();frame();
 press('KeyE');
 assert.equal(nodes.get('#menuTitle').textContent,'EL TRONO DEL SOL MUERTO','ending choice opens');
 select(ENDINGS[choice].title);
 let saved=JSON.parse(data.get('ashen-pilgrimage-save-v2-auto'));
 assert.equal(saved.phase,'won');assert.equal(saved.finalEnding,choice);assert.ok(validateSave(saved));
 assert.equal(nodes.get('#menuTitle').textContent,ENDINGS[choice].name);
 assert.ok(nodes.get('#menuDescription').textContent.includes('CRÉDITOS'));
 select('Guardar y volver al título');
 select('Ver último desenlace');
 assert.equal(nodes.get('#menuTitle').textContent,ENDINGS[choice].name,'stored epilogue visible from title');
 assert.equal(JSON.parse(data.get('ashen-pilgrimage-save-v2-auto')).finalEnding,choice);
 console.log('OK interfaz final',choice,'guardado','créditos','archivo de epílogos');
 process.exit(0);
}
for(const choice of Object.keys(ENDINGS)){
 const result=spawnSync(process.execPath,[new URL(import.meta.url).pathname,choice],{encoding:'utf8',timeout:25000});
 assert.equal(result.status,0,`${choice}\n${result.stdout}\n${result.stderr}`);
}
console.log('OK v3.9: 3/3 finales elegidos con menús reales, persistidos y consultados desde el título');
