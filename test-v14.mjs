import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {playerFrame,bossFrame,deathFrame,ANIMATION_FRAMES} from './animation-state.js';
for(const kind of ['pilgrim','warden']){
 const bytes=readFileSync(`assets/${kind}-v14.png`);
 assert.equal(bytes.toString('hex',0,8),'89504e470d0a1a0a');
 assert.equal(bytes.readUInt32BE(16),128*ANIMATION_FRAMES);
 assert.equal(bytes.readUInt32BE(20),160);
}
const player={vx:0,grounded:true,attack:0,dodge:0,combo:0,hurtTime:0};
assert.ok([4,5].includes(playerFrame(player,0)));
player.vx=80;player.walkDistance=72;assert.equal(playerFrame(player,375),3);
player.walkDistance=0;assert.equal(playerFrame(player,375),0,'Los pasos siguen la distancia y no el reloj');
player.motion=0;assert.ok([4,5].includes(playerFrame(player,375)),'No camina contra una pared');
delete player.motion;
player.vx=0;player.grounded=false;assert.equal(playerFrame(player,0),6);
player.grounded=true;player.dodge=.2;assert.equal(playerFrame(player,0),7);
player.dodge=0;player.attack=.30;assert.equal(playerFrame(player,0),8);
player.attack=.05;assert.equal(playerFrame(player,0),11);
player.attack=0;player.hurtTime=.30;assert.equal(playerFrame(player,0),12);
player.hurtTime=.05;assert.equal(playerFrame(player,0),13);
const boss={phase:1,windup:0,strike:0,charge:0,stagger:0};
assert.ok(bossFrame(boss,0)<6);
boss.windup=.2;assert.equal(bossFrame(boss,0),8);
boss.windup=0;boss.phase=2;boss.charge=.3;assert.ok([18,19].includes(bossFrame(boss,0)));
assert.equal(deathFrame(1.05),14);assert.equal(deathFrame(.01),17);
const visual=readFileSync('visual.js','utf8');
for(const id of ['pilgrim-v14.png','warden-v14.png','deathFrame(e.death)','playerFrame(p,time)','bossFrame(e,time)'])assert.ok(visual.includes(id),id);
console.log('OK: 20-frame PNGs, player and boss hit/dodge/attack/death state bindings.');
