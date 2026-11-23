// Fake-DOM integration: validates actual menu wiring, not a browser rendering claim.
import assert from 'node:assert/strict';
const noop=()=>{};const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),measureText:()=>({width:10})},{get(o,k){return o[k]??noop},set(o,k,v){o[k]=v;return true}});
class Element{constructor(){this.textContent='';this.children=[];this.hidden=false;this.disabled=false;this.onclick=null;this.handlers={};this.classList={add:noop,remove:noop};}addEventListener(k,f){this.handlers[k]=f}appendChild(el){this.children.push(el)}replaceChildren(...xs){this.children=xs}querySelector(){return this.children.find(e=>!e.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(id=>[id,new Element()]));els.get('#game').getContext=()=>ctx;
globalThis.document={querySelector:s=>els.get(s),createElement:()=>new Element(),body:new Element()};globalThis.window={};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
globalThis.Image=class{complete=false;naturalWidth=0;naturalHeight=0;set src(v){this._src=v}};globalThis.location={reload:noop};const events={};globalThis.addEventListener=(kind,cb)=>events[kind]=cb;const frames=[];globalThis.requestAnimationFrame=fn=>frames.push(fn);
await import('./game.js');
const menu=els.get('#menu'),list=els.get('#menuEntries');const buttons=()=>list.children.map(x=>x.textContent);const select=label=>{const b=list.children.find(x=>x.textContent===label||x.textContent.startsWith(label));assert.ok(b,`missing button ${label} in ${buttons()}`);b.click()};
assert.equal(menu.hidden,false);assert.ok(buttons().includes('Nueva partida'));assert.equal(list.children[0].disabled,true,'no continue before save');
select('Nueva partida');assert.equal(menu.hidden,true);assert.ok(storage.has('ashen-pilgrimage-save-v2-auto'));
els.get('#pause').click();assert.equal(menu.hidden,false);assert.ok(buttons().includes('Guardar partida'));select('Guardar partida');assert.ok(buttons().some(x=>x.startsWith('Ranura 1')));select('Ranura 1');assert.ok(storage.has('ashen-pilgrimage-save-v2-slot1'));
select('Reanudar');assert.equal(menu.hidden,true);els.get('#pause').click();select('Volver al menú principal');assert.ok(buttons().includes('Continuar'));select('Nueva partida');assert.ok(buttons().includes('Sí, iniciar nueva partida'));select('Cancelar');select('Cargar partida');select('Ranura 1');assert.ok(buttons().includes('Sí, cargar'));select('Sí, cargar');assert.equal(menu.hidden,true);
els.get('#pause').click();select('Gestionar partidas');select('Eliminar · Ranura 1');assert.ok(buttons().includes('Sí, eliminar definitivamente'));select('Cancelar');assert.ok(storage.has('ashen-pilgrimage-save-v2-slot1'));
select('Eliminar · Ranura 1');select('Sí, eliminar definitivamente');assert.equal(storage.has('ashen-pilgrimage-save-v2-slot1'),false);
console.log('OK: title, new, pause, save, resume, confirmation, load, delete, legacy-independent autosave.');
