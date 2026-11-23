// Genuine gameplay input simulation: starts from an empty browser save,
// invokes production menu/button/keyboard handlers, advances production frames.
// Does not inject positions, flags, enemies or prepared campaign states.
import assert from 'node:assert/strict';
import {PREFIX} from './save-manager.js';
const noop=()=>{};
const context=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(obj,key)=>obj[key]??noop});
class Element {
 constructor(){this.children=[];this.hidden=false;this.disabled=false;this.textContent='';this.tagName='BUTTON';this.handlers={};this.style={setProperty:noop};this.dataset={};this.classList={add:noop,remove:noop,toggle:noop};}
 addEventListener(event,handler){this.handlers[event]=handler;}
 appendChild(child){this.children.push(child);return child;}
 replaceChildren(...children){this.children=children;}
 querySelector(){return this.children.find(e=>e.tagName==='BUTTON'&&!e.disabled);}
 querySelectorAll(){return this.children.filter(e=>e.tagName==='BUTTON'&&!e.disabled);}
 focus(){}
 click(){this.handlers.click?.();this.onclick?.();}
}
const ids=['#game','#status','#audio','#pause','#reset','#menu','#menuEntries','#menuTitle','#menuDescription','#menuError','#caption','#announcement'];
const nodes=new Map(ids.map(id=>[id,new Element()]));
nodes.get('#game').getContext=()=>context;
const document={querySelector:id=>nodes.get(id),createElement:()=>new Element(),body:new Element(),documentElement:new Element(),addEventListener:noop};
globalThis.document=document;
globalThis.window={};
globalThis.Image=class {complete=false;naturalWidth=0;set src(x){this.url=x;}};
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
globalThis.location={reload:noop};
const saved=new Map();
globalThis.localStorage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,String(value)),removeItem:key=>saved.delete(key)};
const events={};globalThis.addEventListener=(name,cb)=>events[name]=cb;
const frames=[];globalThis.requestAnimationFrame=cb=>frames.push(cb);
await import('./game.js');
let now=performance.now();
function frame(n=1){for(let i=0;i<n;i++){now+=16;assert.equal(frames.length,1);frames.shift()(now);}}
function press(code){events.keydown({code,repeat:false,preventDefault:noop});frame(1);events.keyup({code});frame(1);}
function hold(code,n){events.keydown({code,repeat:false,preventDefault:noop});frame(n);events.keyup({code});frame(1);}
const entries=()=>nodes.get('#menuEntries').children;
function click(label){const button=entries().find(node=>node.textContent===label);assert.ok(button,`No se encontró ${label}. Opciones: ${entries().map(x=>x.textContent).join(' | ')}`);button.click();}
const auto=()=>JSON.parse(saved.get(PREFIX+'auto'));
assert.equal(saved.has(PREFIX+'auto'),false);
click('Nueva partida');frame(2);
assert.equal(nodes.get('#menu').hidden,true);
assert.equal(auto().p.x,90);
assert.equal(auto().enemies.length,73);
hold('KeyD',65);
press('KeyP');
const moved=auto();
assert.ok(moved.p.x>90,`Jugador no se mueve: ${moved.p.x}`);
assert.equal(moved.phase,'playing');
clickPause();
click('Guardar partida');
const saveButton=entries().find(e=>e.textContent.startsWith('Ranura 1'));
assert.ok(saveButton);saveButton.click();
assert.equal(JSON.parse(saved.get(PREFIX+'slot1')).p.x,moved.p.x);
click('Reanudar');
hold('KeyD',55);
press('KeyP');
assert.ok(auto().p.x>moved.p.x,'Se debe avanzar tras reanudar');
clickPause();click('Cargar partida');entries().find(e=>e.textContent.startsWith('Ranura 1')).click();
click('Sí, cargar');
assert.equal(auto().p.x,moved.p.x,'Carga manual restaura la posición');
assert.equal(nodes.get('#menu').hidden,true);
press('KeyJ');frame(30);
clickPause();click('Volver al menú principal');
assert.equal(nodes.get('#menuTitle').textContent,'LA VIGILIA DE CENIZA');
click('Continuar');
assert.equal(nodes.get('#menu').hidden,true);
assert.equal(auto().p.x,moved.p.x,'Continuar conserva el guardado');
console.log('OK v4.0: Nueva partida limpia → movimiento real → autoguardar → ranura manual → reanudar → cargar → ataque → título → continuar; sin estados inyectados.');
function clickPause(){nodes.get('#pause').onclick();}
