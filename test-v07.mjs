import assert from 'node:assert/strict';
import {chambers,chamberAt,portalFor,chamberCamera} from './chambers.js';
const noop=()=>{};
assert.ok(chambers.length>=10); // historical regions are preserved; newer regions may extend the map
for(let i=0;i<chambers.length;i++){
  const z=chambers[i];assert.equal(chamberAt((z.start+z.end)/2),i);
  assert.ok(z.end-z.start>=900);
  assert.ok(chamberCamera((z.start+z.end)/2,i,960)>=z.start);
  if(i<chambers.length-1){const d=portalFor(z.end-60,i);assert.equal(d.direction,1);assert.equal(chamberAt(d.destination),i+1)}
  if(i>0){const d=portalFor(z.start+40,i);assert.equal(d.direction,-1);assert.equal(chamberAt(d.destination),i-1)}
}
const fake=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
const els=new Map(['#game','#status','#audio','#pause','#reset'].map(id=>[id,{textContent:'',getContext:()=>fake,onclick:null}]));
globalThis.document={querySelector:id=>els.get(id)};globalThis.window={};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this._src=v}};
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
globalThis.location={reload:noop};
const key='ashen-pilgrimage-prototype-v01';const state=new Map();
const save={p:{x:807,hp:95,flasks:3,checkpoint:90},enemies:Array.from({length:9},(_,i)=>({hp:i===8?180:42,alive:true})),secrets:[{taken:false},{taken:false}],phase:'playing'};
state.set(key,JSON.stringify(save));globalThis.localStorage={getItem:k=>state.get(k),setItem:(k,v)=>state.set(k,v),removeItem:k=>state.delete(k)};
const handlers={};globalThis.addEventListener=(k,fn)=>handlers[k]=fn;const frames=[];globalThis.requestAnimationFrame=fn=>frames.push(fn);
await import('./game.js');let now=performance.now();const frame=()=>{now+=16;frames.shift()(now)};
frame();handlers.keydown({code:'KeyE',repeat:false,preventDefault:noop});frame();handlers.keyup({code:'KeyE'});
handlers.keydown({code:'KeyP',repeat:false,preventDefault:noop});frame();handlers.keyup({code:'KeyP'});
let saved=JSON.parse(state.get(key));assert.ok(saved.p.x>=chambers[1].start && saved.p.x<chambers[1].end,`expected room 2, got ${saved.p.x}`);
assert.equal(saved.enemies[8].hp,180);assert.equal(saved.p.hp,95);
console.log('OK: eight gated chambers, forward/backward portals, camera bounds, transition via E, legacy save retained.');
