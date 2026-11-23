import assert from 'node:assert/strict';
const noop=()=>{};const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
class Element{constructor(tag='button'){this.tagName=tag.toUpperCase();this.children=[];this.hidden=false;this.disabled=false;this.textContent='';this.handlers={};this.style={};this.classList={add:noop,remove:noop}}addEventListener(k,cb){this.handlers[k]=cb}appendChild(e){this.children.push(e)}replaceChildren(...es){this.children=es}querySelector(){return this.children.find(x=>!x.disabled)}focus(){}click(){this.handlers.click?.();this.onclick?.()}}
const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(id=>[id,new Element()]));els.get('#game').getContext=()=>ctx;
globalThis.document={querySelector:id=>els.get(id),createElement:tag=>new Element(tag),body:new Element('body')};globalThis.window={};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this.url=v}};
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
globalThis.addEventListener=noop;globalThis.requestAnimationFrame=noop;
await import('./game.js');
function choose(starts){const button=els.get('#menuEntries').children.find(e=>e.textContent.startsWith(starts));assert.ok(button,`no existe '${starts}'`);button.click();}
choose('Opciones');assert.equal(els.get('#menuEntries').children.some(e=>e.textContent.startsWith('Dificultad: Normal')),true);
choose('Dificultad: Normal');assert.equal(storage.get('ashen-pilgrimage-difficulty-v33'),'penance');
choose('Dificultad: Penitencia');assert.equal(storage.get('ashen-pilgrimage-difficulty-v33'),'pilgrim');
choose('Dificultad: Peregrino');assert.equal(storage.get('ashen-pilgrimage-difficulty-v33'),'normal');
assert.equal(storage.has('ashen-pilgrimage-save-v2-auto'),false,'ajustar opciones no crea ni sobrescribe guardado');
choose('Volver');choose('Nueva partida');assert.equal(storage.has('ashen-pilgrimage-save-v2-auto'),true);
els.get('#pause').click();choose('Opciones');choose('Dificultad: Normal');assert.equal(storage.get('ashen-pilgrimage-difficulty-v33'),'penance');
assert.ok(els.get('#menuEntries').children.some(e=>e.textContent.startsWith('Volver')));
console.log('OK v3.3: selector en título y pausa, ciclo de dificultad y guardados inalterados al cambiar.');
