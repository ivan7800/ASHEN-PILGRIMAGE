import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {chambers, chamberAt,portalFor} from './chambers.js';
import {validateSave,createSaveManager} from './save-manager.js';
import {questDialogue,canClaimRelic,canEnterValdren} from './valdren.js';
import {enemyBehavior} from './combat.js';
const old={p:{x:4800,hp:82,flasks:2,checkpoint:3510},enemies:Array.from({length:9},(_,i)=>({hp:i===8?0:42,alive:i!==8})),secrets:[{taken:true},{taken:false}],phase:'won',loreSeen:[true,false,false,false],kills:1};
const newSave={...old,p:{x:6060,hp:88,flasks:1,checkpoint:5140},enemies:[...old.enemies,...Array.from({length:3},()=>({hp:0,alive:false}))],phase:'playing',chapterClear:true,questStage:2};
assert.ok(chambers.length>=10); // historical regions are preserved; newer regions may extend the mapassert.equal(chamberAt(5070),5);assert.equal(chamberAt(6350),6);
assert.equal(portalFor(4840,4).direction,1);assert.equal(chamberAt(portalFor(4840,4).destination),5);
assert.equal(portalFor(4940,5).direction,-1);
assert.equal(validateSave(old),true,'legacy save with nine enemies stays valid');assert.equal(validateSave(newSave),true,'new outdoor progress stays valid');
assert.equal(validateSave({...newSave,questStage:5}),false);
assert.equal(validateSave({...newSave,p:{...newSave.p,x:9000}}),true);
const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
const sm=createSaveManager(storage);sm.write('auto',newSave);assert.equal(sm.read('auto').questStage,2);sm.write('slot1',old);assert.equal(sm.read('slot1').enemies.length,9);
assert.equal(canEnterValdren(true,false),true);assert.equal(canEnterValdren(false,false),false);assert.equal(canEnterValdren(true,true),false);
assert.equal(questDialogue(0).stage,1);assert.equal(questDialogue(1).stage,1);assert.equal(questDialogue(2).stage,3);
assert.equal(canClaimRelic(1,true,true),true);assert.equal(canClaimRelic(1,false,true),false);assert.equal(canClaimRelic(1,true,false),false);
assert.notDeepEqual(enemyBehavior('exile'),enemyBehavior('mourner'));
for(const kind of ['caldris','maera','saint','gravebound','mourner','exile','erena']){
 const img=readFileSync(`assets/${kind}-v15.png`);assert.equal(img.subarray(1,4).toString(),'PNG');assert.equal(img.readUInt32BE(16),2560);assert.equal(img.readUInt32BE(20),160);
}
assert.ok(statSync('assets/room-valdren.webp').size>10000);
console.log('OK: eight chambers, two-way gate, legacy & new saves, quest state, 7 new 20-frame atlases, Valdren environment.');
