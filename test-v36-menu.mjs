// Prueba de integración real del menú con autoguardado corrupto (DOM simulado).
import assert from 'node:assert/strict';
import { PREFIX, LEGACY } from './save-manager.js';
const noop=()=>{};
const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
class Element {
 constructor(){this.textContent='';this.children=[];this.hidden=false;this.disabled=false;this.handlers={};this.tagName='BUTTON';this.classList={add:noop,remove:noop};this.style={setProperty:noop,toggle:noop}}
 addEventListener(k,f){this.handlers[k]=f}appendChild(e){this.children.push(e)}replaceChildren(...xs){this.children=xs}
 querySelector(){return this.children.find(e=>!e.disabled)}querySelectorAll(){return this.children.filter(e=>!e.disabled)}
 focus(){}click(){this.handlers.click?.();this.onclick?.()}
}
const els=new Map(['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'].map(id=>[id,new Element()]));
els.get('#game').getContext=()=>ctx;
globalThis.document={querySelector:s=>els.get(s),createElement:()=>new Element(),documentElement:new Element(),body:new Element()};
globalThis.window={};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
const old={p:{x:530,hp:82,flasks:2,checkpoint:90},enemies:Array.from({length:9},(_,i)=>({hp:i===8?180:42,alive:true})),secrets:[{taken:false},{taken:true}],phase:'playing'};
const bad='{"guardadoSinCerrar":';
const storage=new Map([[LEGACY,JSON.stringify(old)],[PREFIX+'auto',bad]]);
globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)};
globalThis.Image=class{set src(s){this.url=s}};
globalThis.location={reload:noop};globalThis.addEventListener=noop;globalThis.requestAnimationFrame=noop;
await import('./game.js');
const list=els.get('#menuEntries');const buttons=()=>list.children.map(b=>b.textContent);const select=label=>{const button=list.children.find(b=>b.textContent.startsWith(label));assert.ok(button,`No encontrado: ${label} entre ${buttons()}`);button.click()};
assert.match(els.get('#menuError').textContent,/ranura\(s\) dañada\(s\)/i);
assert.equal(storage.get(PREFIX+'auto'),bad,'la migración no sobrescribe un autoguardado dañado');
select('Nueva partida');
assert.equal(els.get('#menuTitle').textContent,'¿COMENZAR DE NUEVO?');
assert.match(els.get('#menuDescription').textContent,/dañado.*sobrescribirá/i);
assert.equal(storage.get(PREFIX+'auto'),bad,'la confirmación no debe escribir datos');
select('Cancelar');
assert.equal(storage.get(PREFIX+'auto'),bad,'cancelar no borra el dato dañado');
select('Nueva partida');select('Sí, iniciar nueva partida');
assert.notEqual(storage.get(PREFIX+'auto'),bad,'la persona consintió explícitamente reemplazar el registro');
assert.equal(JSON.parse(storage.get(PREFIX+'auto')).p.x,90);
assert.equal(storage.has(LEGACY),true,'el registro anterior se conserva');
console.log('OK v3.6: menú avisa, conserva al cancelar y solo sobrescribe tras confirmación.');
