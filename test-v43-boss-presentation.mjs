import assert from 'node:assert/strict';
import {BOSS_PRESENTATION,bossPresentation,bossFrameProfile} from './boss-presentation-v1.js';
const kinds=['warden','king','mother','archivist','bride','gardener','bellgiant','firstwitness'];
assert.equal(Object.keys(BOSS_PRESENTATION).length,8);
const assets=new Set(); const colors=new Set();
for(const kind of kinds){const p=bossPresentation(kind);assert.ok(p);assert.ok(p.width>=180&&p.height>=190);assert.ok(p.dx<0&&p.dy<0);assets.add(p.asset);colors.add(p.telegraph);assert.equal(bossFrameProfile(kind,1000,{hp:100,phase:1,windup:0,strike:0}),Math.floor(1000/p.idle)%8);assert.equal(bossFrameProfile(kind,1000,{hp:0,phase:1}),19)}
assert.equal(assets.size,8);assert.equal(colors.size,8);
console.log('boss presentation: 8/8 authored profiles');
