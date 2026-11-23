// Regresión v3.6: no reemplazar silenciosamente un autoguardado dañado.
import assert from 'node:assert/strict';
import {createSaveManager,LEGACY,PREFIX} from './save-manager.js';
const valid={p:{x:530,hp:82,flasks:2,checkpoint:90},enemies:Array.from({length:9},(_,i)=>({hp:i===8?180:42,alive:true})),secrets:[{taken:false},{taken:true}],phase:'playing'};
const rawAuto='{"truncado":';
const cache=new Map([[LEGACY,JSON.stringify(valid)],[PREFIX+'auto',rawAuto]]);
const storage={getItem:k=>cache.get(k)??null,setItem:(k,v)=>cache.set(k,v),removeItem:k=>cache.delete(k)};
const manager=createSaveManager(storage);
assert.equal(manager.slotStatus('auto'),'corrupt');
assert.equal(manager.migrate(),true,'el legado se reconoce');
assert.equal(cache.get(PREFIX+'auto'),rawAuto,'migración no sobrescribe datos dañados');
assert.equal(manager.latest(),null,'no se presenta un guardado corrupto como válido');
cache.delete(PREFIX+'auto');
assert.equal(manager.migrate(),true);
assert.equal(manager.read('auto')?.p.x,530,'solo se migra cuando el autoguardado está vacío');
assert.equal(cache.has(LEGACY),true,'el guardado legado permanece intacto');
console.log('OK v3.6: migración no destructiva ante autoguardado corrupto.');
