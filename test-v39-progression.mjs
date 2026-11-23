// v3.9: every physical chamber, all story gates, safe return routes and melee overlap.
import assert from 'node:assert/strict';
import {chambers, chamberAt, portalFor} from './chambers.js';
import {canTraverseForward,canTraversePortal} from './campaign-progression-v39.js';
import {attackHit} from './combat.js';
import {BESTIARY} from './bestiary-v37.js';
import {finishPilgrimage,ENDINGS} from './final-throne-v30.js';
import {createSaveManager,validateSave} from './save-manager.js';
import {encodeBackup,decodeBackup} from './save-portability.js';

// Simulated milestone flags, NOT a claimed playthrough. Each gate is checked at its exact portal.
const completed={chapterClear:true,wardenAlive:false,questStage:3,allegiance:'people',regionClear:true,kingAlive:false,
 forestStage:3,forestClear:true,motherAlive:false,ossaraStage:3,ossaraNames:[1,0,2],ossaraClear:true,archivistAlive:false,
 salmueraStage:3,tideMode:'low',seaEchoes:[0,1,2],seaClear:true,brideAlive:false,
 rootStage:3,rootRites:[0,1,2],rootClear:true,gardenerAlive:false,
 summitStage:3,summitResonances:[0,1,2],summitClear:true,giantAlive:false,finalStage:1,solarSeals:[0,1,2]};
const locked=[];
const noProgress={...completed,chapterClear:false,wardenAlive:true,questStage:0,allegiance:'none',regionClear:false,kingAlive:true,
 forestStage:0,forestClear:false,motherAlive:true,ossaraStage:0,ossaraNames:[],ossaraClear:false,archivistAlive:true,
 salmueraStage:0,tideMode:'high',seaEchoes:[],seaClear:false,brideAlive:true,rootStage:0,rootRites:[],rootClear:false,gardenerAlive:true,
 summitStage:0,summitResonances:[],summitClear:false,giantAlive:true,finalStage:0,solarSeals:[]};
assert.equal(chambers.length,35);
for(let area=0;area<chambers.length;area++){
 const z=chambers[area];
 assert.equal(chamberAt(z.start+95),area,`wrong sector ${area}`);
 if(area<34){
  const forward=portalFor(z.end-60,area);
  assert.equal(forward?.direction,1);
  assert.equal(chamberAt(forward.destination),area+1);
  const tide=area===19?'high':'low';
  assert.equal(canTraversePortal(forward,true,area,{...completed,tideMode:tide}),true,`missing reachable forward gate ${area}`);
  assert.equal(canTraversePortal(forward,false,area,{...completed,tideMode:tide}),false,'not allowed in air');
  if(!canTraverseForward(area,noProgress))locked.push(area);
 }
 if(area>0){
  const back=portalFor(z.start+40,area);
  assert.equal(back?.direction,-1);
  assert.equal(chamberAt(back.destination),area-1);
  assert.equal(canTraversePortal(back,true,area,noProgress),true,'backtracking must remain possible');
 }
}
assert.deepEqual(locked,[4,5,6,7,10,11,12,14,15,17,18,19,20,21,23,24,25,26,27,28,29,30,31,33]);
assert.equal(canTraverseForward(35,completed),false);
assert.equal(canTraverseForward(-1,completed),false);
assert.equal(canTraversePortal(null,true,4,completed),false);
// Important transitions must close again if even one prerequisite is missing.
const deny=[
 [4,{wardenAlive:true}],[5,{questStage:2}],[6,{allegiance:'none'}],[7,{kingAlive:true}],[10,{forestStage:2}],
 [11,{motherAlive:true}],[12,{ossaraStage:1}],[14,{ossaraNames:[0,2]}],[15,{archivistAlive:true}],
 [17,{salmueraStage:2}],[18,{seaEchoes:[]}],[19,{tideMode:'low'}],[20,{seaEchoes:[0,1]}],
 [21,{brideAlive:true}],[23,{rootStage:0}],[24,{rootRites:[0,1]}], [25,{gardenerAlive:true}],
 [26,{summitStage:0}],[27,{summitStage:2}],[28,{summitResonances:[]}],[29,{summitResonances:[0,1]}],
 [30,{giantAlive:true}],[31,{finalStage:0}],[33,{solarSeals:[0,1]}],[33,{ossaraClear:false}]
];
for(const [area,partial] of deny)assert.equal(canTraverseForward(area,{...completed,...partial,tideMode:partial.tideMode??(area===19?'high':'low')}),false,`unsafe early gate ${area} with ${JSON.stringify(partial)}`);
// A frontal swipe must connect after a charge overlaps the player's center, but never hit a fully rear target.
for(const specimen of [BESTIARY.find(x=>x.kind==='ashhound'),BESTIARY.find(x=>x.kind==='devotedflesh')]){
 const player={x:200,y:370,w:32,h:68,face:1};
 const enemy={x:216-specimen.hitWidth/2,y:438-specimen.hitHeight,w:specimen.hitWidth,h:specimen.hitHeight,alive:true};
 assert.equal(attackHit(player,enemy,0),true,'overlapping enemy center should be hittable '+specimen.kind);
 assert.equal(attackHit(player,{...enemy,x:player.x-enemy.w-20},0),false,'rear-only target not hittable');
}
for(const choice of Object.keys(ENDINGS)){
 const finished=finishPilgrimage(true,'none',choice);assert.equal(finished.ending,choice);
 assert.equal(finishPilgrimage(true,choice,'liberar').ok,false,'no changing chosen ending');
}
// Completed saves of each ending must remain valid and round-trip JSON backups independently.
const initial={p:{x:46160,hp:85,flasks:2,checkpoint:45200},enemies:Array.from({length:73},(_,i)=>({hp:i===72?0:1,alive:i!==72})),secrets:[{taken:false},{taken:true}],phase:'won',
 chapterClear:true,questStage:3,allegiance:'people',regionClear:true,forestStage:3,forestClear:true,ossaraStage:3,ossaraClear:true,seaClear:true,rootClear:true,summitClear:true,finalStage:2,solarSeals:[0,1,2],finalClear:true,visited:Array.from({length:35},(_,i)=>i)};
const storageData=new Map();const storage={getItem:k=>storageData.get(k)??null,setItem:(k,v)=>storageData.set(k,String(v)),removeItem:k=>storageData.delete(k)};
const saves=createSaveManager(storage);
for(const [index,choice] of Object.keys(ENDINGS).entries()){
 const data={...initial,finalEnding:choice};assert.ok(validateSave(data));saves.write(['slot1','slot2','slot3'][index],data);
}
const parsed=decodeBackup(encodeBackup(saves));
for(const [index,choice] of Object.keys(ENDINGS).entries()){
 const slot=['slot1','slot2','slot3'][index];assert.equal(parsed.slots[slot].finalEnding,choice);
 assert.equal(saves.read(slot).finalEnding,choice);
}
console.log(`OK v3.9: 35 chambers, ${locked.length} locked forward gates, ${deny.length} premature-entry guards, 34 backward gates, melee collision, 3 ending save/backup round-trips`);
