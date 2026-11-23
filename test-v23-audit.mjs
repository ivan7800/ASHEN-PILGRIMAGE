import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {archivistTiming,archivistTelegraph,archivistCue} from './archivist-presentation.js';
import {cueNotes} from './soundscape.js';
import {enemyBehavior} from './combat.js';
import {chambers} from './chambers.js';
import {canEnterArchiveBoss} from './ossara-v22.js';
assert.ok(chambers.length>=22, 'La ampliación conserva las 22 cámaras anteriores');
assert.equal(canEnterArchiveBoss(3,[1,0,2]),true);
assert.equal(canEnterArchiveBoss(3,[1,2,0]),false);
assert.ok(archivistTiming(2).windup>.6);
assert.ok(archivistTiming(1).windup>=enemyBehavior('archivist').windup);
const boss={kind:'archivist',alive:true,phase:2,windup:.33,dir:-1,x:18500,w:30};
const w=archivistTelegraph(boss);
assert.equal(w.type,'lane');assert.equal(w.direction,-1);assert.equal(w.range,archivistTiming(2).reach);
assert.ok(w.progress>0 && w.progress<1);assert.equal(archivistTelegraph({...boss,windup:0}),null);
assert.equal(archivistCue({...boss,windup:.2},{...boss,windup:.18}),'archive-final');
assert.equal(archivistCue({...boss,windup:.015},{...boss,windup:0}),'archive-strike');
for(const key of ['archive-warning','archive-final','archive-strike','archive-phase','archive-defeat'])assert.ok(cueNotes(key).length);
for(const room of ['crypt','cloister','ossuary','bell','arena']){
 const source=readFileSync(`art-source/v22-crypt-rooms/room-${room}.webp`);
 const updated=readFileSync(`assets/room-${room}.webp`);
 assert.ok(source.length>15000&&updated.length>15000);
 assert.ok(!source.equals(updated));
}
for(const name of ['game.js','visual.js','soundscape.js','archivist-presentation.js']){
 const result=spawnSync(process.execPath,['--check',name],{encoding:'utf8'});
 assert.equal(result.status,0,`${name}: ${result.stderr}`);
}
console.log('OK v2.3: boss cues, directional telegraph, phase timings, five remastered rooms');
