import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isSeaRegion,SEA_LAYERS,SEA_COMBAT_FOG_MAX,SEA_FOREGROUND_ALPHA,seaLayerShift,seaVisualPlan} from './sea-visual-v27.js';
const png=(p)=>{const b=readFileSync(p);assert.equal(b.subarray(1,4).toString(),'PNG',p);return {w:b.readUInt32BE(16),h:b.readUInt32BE(20),bytes:b.length}};
for(const [i,n] of ['drowned','saltguard','sirene'].entries()){
  let {w,h,bytes}=png(`assets/${n}-v27.png`);
  assert.equal(w,2560,n);assert.equal(h,160,n);assert.ok(bytes>10000,n);
  const old=readFileSync(`assets/${n}-v${n==='saltguard'?24:25}.png`);
  assert.notDeepEqual(readFileSync(`assets/${n}-v27.png`),old,`${n} must be newly created`);
}
for(const n of ['sea-far-v27','sea-mid-v27','sea-foam-v27']){const im=png(`assets/${n}.png`);assert.deepEqual([im.w,im.h],[960,540]);}
assert.equal(seaVisualPlan(15).length,0);assert.equal(seaVisualPlan(22).length,0);
for(let i=16;i<=21;i++)assert.equal(seaVisualPlan(i).length,3,`missing maritime parallax for ${i}`);
for(const i of [-1,0,15,22,100])assert.equal(isSeaRegion(i),false);
assert.ok(SEA_LAYERS[0].factor<SEA_LAYERS[1].factor&&SEA_LAYERS[1].factor<SEA_LAYERS[2].factor);
assert.deepEqual(SEA_LAYERS.map(x=>x.order),['behind','behind','front']);
assert.ok(SEA_FOREGROUND_ALPHA<=.20,'foreground cannot conceal player and foes');
assert.ok(SEA_COMBAT_FOG_MAX<=.15,'fog should remain restrained in combat');
assert.equal(seaLayerShift(0,.31,960),0);
assert.ok(seaLayerShift(1200,.31,960)>seaLayerShift(1200,.09,960));
assert.equal(seaLayerShift(960/.31,.31,960),0);
assert.throws(()=>seaLayerShift(-10,.2,960),RangeError);
for(let i=0;i<=5000;i+=73){const v=seaLayerShift(i,1.12,960);assert.ok(v>=0&&v<960)}
const visual=readFileSync('visual.js','utf8');
assert.match(visual,/saltguard:'\.\/assets\/saltguard-v28\.png'/);
assert.match(visual,/drowned:'\.\/assets\/drowned-v27\.png'/);
assert.match(visual,/sirene:'\.\/assets\/sirene-v28\.png'/);
assert.match(visual,/if\(isSeaRegion\(area\)\)/);
assert.match(visual,/const contrast=c\.createLinearGradient/);
console.log('OK v2.7 new sea atlases, parallax layers, non-occlusion and camera shift');
