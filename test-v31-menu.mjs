// Menús reales del juego ejercitados con un DOM ligero (no equivale a renderizado de navegador).
import assert from 'node:assert/strict';
const noop=()=>{};
const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
const created=[];let exportedBlob=null,downloadName='';
class Element{
 constructor(tag='button'){this.tagName=tag.toUpperCase();this.children=[];this.hidden=false;this.disabled=false;this.onclick=null;this.handlers={};this.style={};this.textContent='';this.classList={add:noop,remove:noop};this.files=[];}
 addEventListener(k,f){this.handlers[k]=f}
 appendChild(node){this.children.push(node);if(node.tagName==='A')downloadName=node.download;}
 replaceChildren(...nodes){this.children=nodes}
 querySelector(){return this.children.find(x=>!x.disabled)}
 remove(){} focus(){}
 click(){if(this.type==='file')return;this.handlers.click?.();this.onclick?.();}
}
const ids=['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError'];
const els=new Map(ids.map(id=>[id,new Element()]));els.get('#game').getContext=()=>ctx;
globalThis.document={querySelector:id=>els.get(id),createElement:tag=>{const node=new Element(tag);created.push(node);return node},body:new Element('body')};
globalThis.window={};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this.value=v}};
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
globalThis.URL.createObjectURL=blob=>{exportedBlob=blob;return 'blob:test'};
globalThis.URL.revokeObjectURL=noop;
globalThis.addEventListener=noop;globalThis.requestAnimationFrame=noop;
await import('./game.js');
const buttons=()=>els.get('#menuEntries').children;
const choose=label=>{const b=buttons().find(x=>x.textContent===label||x.textContent.startsWith(label));assert.ok(b,`No existe ${label}: ${buttons().map(x=>x.textContent).join('|')}`);b.click();};
choose('Nueva partida');assert.ok(storage.has('ashen-pilgrimage-save-v2-auto'));
els.get('#pause').click();choose('Guardar partida');choose('Ranura 1');
choose('Copias de seguridad JSON');choose('Exportar partidas');
assert.equal(downloadName,'ashen-pilgrimage-guardados.json');
const backup=JSON.parse(await exportedBlob.text());
assert.deepEqual(Object.keys(backup.slots),['auto','slot1']);
choose('Importar partidas');
const picker=created.at(-1);assert.equal(picker.type,'file');
picker.files=[{size:2000,text:async()=>JSON.stringify(backup)}];
await picker.handlers.change();
assert.equal(els.get('#menuTitle').textContent,'¿RESTAURAR ESTAS PARTIDAS?');
choose('Cancelar');assert.equal(els.get('#menuTitle').textContent,'COPIAS DE SEGURIDAD');
choose('Importar partidas');created.at(-1).files=[{size:2000,text:async()=>JSON.stringify(backup)}];
await created.at(-1).handlers.change();
choose('Sí, restaurar copia');assert.equal(els.get('#menuTitle').textContent,'LA VIGILIA DE CENIZA');
assert.ok(els.get('#menuError').textContent.includes('restaurada'));
assert.ok(storage.has('ashen-pilgrimage-save-v2-slot1'));
choose('Continuar');assert.equal(els.get('#menu').hidden,true,'la partida importada se puede reanudar');
storage.set('ashen-pilgrimage-save-v2-slot3','{truncated');
els.get('#pause').click();choose('Volver al menú principal');
assert.ok(els.get('#menuError').textContent.includes('dañada'));
choose('Cargar partida');
const corruptEntry=buttons().find(x=>x.textContent.includes('Ranura 3'));
assert.ok(corruptEntry.textContent.includes('Dañada'));
assert.equal(corruptEntry.disabled,true,'el guardado dañado nunca se carga');
choose('Atrás');choose('Gestionar partidas');
const corruptDelete=buttons().find(x=>x.textContent.includes('Eliminar · Ranura 3'));
assert.ok(corruptDelete&&!corruptDelete.disabled,'se puede eliminar tras confirmar');
assert.equal(storage.get('ashen-pilgrimage-save-v2-slot3'),'{truncated','sin borrado automático');
console.log('OK v3.1: menús de copias JSON, avisos de guardado dañado y restauración confirmada.');
