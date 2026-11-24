import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import {chambers} from './chambers.js';
import {playerFrame} from './animation-state.js';
const src=readFileSync('visual.js','utf8');
for(const id of ['pilgrim','gravebound','mourner','warden']){
 const path=`assets/${id}-${['pilgrim','warden'].includes(id)?'v14':'v15'}.png`, png=readFileSync(path);
 assert.equal(png.subarray(1,4).toString(),'PNG');
 assert.equal(png.readUInt32BE(16),2560,`${id} 20 frames of width 128`);
 assert.equal(png.readUInt32BE(20),160,`${id} frame height`);
 assert.ok(src.includes(`${id}-${['pilgrim','warden'].includes(id)?'v14':'v15'}.png`),`${id} current atlas referenced`);
}
assert.ok(chambers.length>=10); // historical regions are preserved; newer regions may extend the map
for (const id of ['crypt','cloister','ossuary','bell','arena','valdren','market','throne']){
 const path=`assets/room-${id}.webp`;
 assert.ok(statSync(path).size>10000,`${id} nonempty room artwork`);
 assert.ok(src.includes(`room-${id}.webp`),`${id} referenced`);
}
assert.ok(src.includes("e.kind==='mourner'?art.mourner"));
assert.ok(src.includes('playerFrame(p,time)'));
assert.equal(playerFrame({hp:100,grounded:true,vx:225,motion:225,walkDistance:48,attack:0,dodge:0,hurtTime:0},0),2);
console.log('OK: 20-frame atlases, separate enemy silhouettes, 5 backgrounds, gameplay references.');
