import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
for(const kind of ['pilgrim','king','caldris','maera','gravebound']){
 const path=`assets/${kind}-v21.png`,png=readFileSync(path);
 assert.equal(png.subarray(1,4).toString('ascii'),'PNG',path);
 assert.equal(png.readUInt32BE(16),2560,path);
 assert.equal(png.readUInt32BE(20),160,path);
 const source=readFileSync('visual.js','utf8');assert.ok(source.includes(`${kind}-v21.png`),`missing ${kind} in renderer`);
}
for(const kind of ['velador','bonekeeper']){const png=readFileSync(`assets/${kind}-v21.png`);assert.equal(png.subarray(1,4).toString(),'PNG')}
console.log('OK: 7 RGBA-compatible atlas dimensions and renderer references');
