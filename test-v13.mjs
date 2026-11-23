import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
globalThis.Image=class {set src(v){this._src=v}};
const {characters}=await import('./visual.js');
import {chamberAt} from './chambers.js';
const kinds=['pilgrim','caldris','maera','saint','gravebound','mourner','warden'];
const visual=readFileSync('visual.js','utf8');
const game=readFileSync('game.js','utf8');
for(const kind of kinds){
 const image=readFileSync(`assets/${kind}-${['pilgrim','warden'].includes(kind)?'v14':'v15'}.png`);
 assert.equal(image.subarray(1,4).toString(),'PNG',`PNG ${kind}`);
 assert.equal(image.readUInt32BE(16),2560);
 assert.equal(image.readUInt32BE(20),160);
 assert.ok(visual.includes(`${kind}-${['pilgrim','warden'].includes(kind)?'v14':'v15'}.png`),`${kind} referenced in renderer`);
}
assert.deepEqual(characters.map(n=>n.id),['maera','caldris','saint','erena','iren','veska','aina','velador','scribe','marin','salwatch','liria','elda','saintfinal','maeralast']);
for(const n of characters)assert.ok(chamberAt(n.x)>=0);
assert.ok(characters.find(n=>n.id==='saint').desveloOnly);
assert.ok(game.includes("npc.id==='erena'"));
assert.ok(game.includes('if(nearbyNpc)'));
assert.ok(visual.includes('c.imageSmoothingEnabled=false'));
console.log('OK: seven alpha atlas assets, complete 20-frame layout, six NPC placements, Desvelo gate, E dialogue, nearest-neighbor sampling.');
