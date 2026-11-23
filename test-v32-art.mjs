import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {graphicsProfile,GRAPHICS_MODES,GRAPHICS_LABELS,normalizeGraphicsMode,nextGraphicsMode,visibleTileStarts} from './visual-style-v32.js';
import {hudTextForZone} from './hud-v32.js';
assert.deepEqual(GRAPHICS_MODES,['cinematic','clarity','performance']);
assert.equal(normalizeGraphicsMode('evil'),'cinematic');
assert.equal(nextGraphicsMode('cinematic'),'clarity');
assert.equal(nextGraphicsMode('clarity'),'performance');
assert.equal(nextGraphicsMode('performance'),'cinematic');
for(const mode of GRAPHICS_MODES){
 const p=graphicsProfile(0,mode);
 assert.equal(p.mode,mode);
 assert.ok(GRAPHICS_LABELS[mode]);
 assert.ok(p.vignette>=0&&p.vignette<=.25);
 assert.ok(p.layerFactor>=0&&p.layerFactor<=1);
 assert.ok(p.dustCount>=0&&p.dustCount<80);
 for(const area of [0,4,7,10,16,21,22,25,26,30,31,34]){
  const q=graphicsProfile(area,mode);
  assert.ok(q.accent.startsWith('#'));
 }
}
assert.ok(graphicsProfile(20,'clarity').fogFactor<graphicsProfile(20,'cinematic').fogFactor);
assert.ok(graphicsProfile(7,'performance').dustCount===0);
assert.deepEqual(visibleTileStarts(0,960,256),[0,256,512,768]);
assert.deepEqual(visibleTileStarts(400,960,256),[256,512,768,1024,1280]);
assert.deepEqual(visibleTileStarts(500,0,256),[]);
assert.deepEqual(visibleTileStarts(NaN,960,256),[]);
assert.ok(hudTextForZone('X'.repeat(80)).length<=32);
assert.equal(hudTextForZone('Valdren'),'Valdren');
const png=(file)=>{const b=readFileSync(new URL(file,import.meta.url));assert.equal(b.toString('hex',0,8),'89504e470d0a1a0a');return [b.readUInt32BE(16),b.readUInt32BE(20),b.length]};
assert.deepEqual(png('./assets/ground-premium-v32.png').slice(0,2),[256,128]);
assert.deepEqual(png('./assets/platform-premium-v32.png').slice(0,2),[256,64]);
assert.deepEqual(png('./assets/mourner-premium-v32.png').slice(0,2),[2560,160]);
assert.ok(readFileSync(new URL('./assets/room-final-trono-premium-v32.webp',import.meta.url)).length>100000);
console.log('OK v3.2: presets, opciones, visibilidad, teselas y tres recursos PNG.');
