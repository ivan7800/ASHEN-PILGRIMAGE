import assert from 'node:assert/strict';
import {chambers,portalFor,chamberAt} from './chambers.js';
import {validateSave} from './save-manager.js';
import {canEnterForest,canRecoverMemory,forestDialogue,forestReward} from './forest-region.js';
import {enemyBehavior} from './combat.js';
assert.ok(chambers.length>=10); // historical regions are preserved; newer regions may extend the map
for(let i=0;i<chambers.length-1;i++)assert.equal(chamberAt(portalFor(chambers[i].end-60,i).destination),i+1);
assert.ok(!canEnterForest(true,true));assert.ok(!canEnterForest(false,false));assert.ok(canEnterForest(true,false));
assert.ok(!canRecoverMemory(1,false,true));assert.ok(!canRecoverMemory(1,true,false));assert.ok(canRecoverMemory(1,true,true));
assert.equal(forestDialogue(0).stage,1);assert.equal(forestDialogue(2).stage,3);
assert.equal(forestReward(3).name,'Memoria de Brezaluna');assert.equal(forestReward(2),null);
assert.notDeepEqual(enemyBehavior('rootguard'),enemyBehavior('exile'));
const enemies=Array.from({length:21},(_,i)=>({alive:true,hp:i===8?180:i===16?320:i>=17?78:i>=12?64:i>=9?58:42}));
const save={p:{x:10040,hp:100,flasks:3,checkpoint:10050},enemies,secrets:[{taken:false},{taken:false}],phase:'playing',forestStage:2,visited:[0,7,8,9]};
assert.ok(validateSave(save));assert.ok(validateSave({...save,enemies:enemies.slice(0,17),p:{x:8000,hp:90,flasks:3,checkpoint:7580},forestStage:undefined}));
assert.ok(!validateSave({...save,forestStage:5}));
console.log('OK: Bosque, 2 salas, misión Desvelo, enemigos, guardados nuevos y heredados');
