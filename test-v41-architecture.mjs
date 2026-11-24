import assert from 'node:assert/strict';
import {chambers} from './chambers.js';
import {SCREEN_ARCHITECTURE,architectureAt} from './screen-architecture-v1.js';

assert.equal(chambers.length,35,'La campaña conserva sus 35 zonas');
assert.equal(SCREEN_ARCHITECTURE.length,35,'Cada zona tiene arquitectura definida');
for(const [area,chamber] of chambers.entries()){
  const beats=SCREEN_ARCHITECTURE[area].acts;
  assert.equal(beats.length,3,`La zona ${area} tiene tres actos`);
  assert.deepEqual(beats.map(b=>b.act),['arrival','pressure','reveal']);
  assert.ok(architectureAt(area,chamber.start+10,chamber.start,chamber.end));
  assert.ok(architectureAt(area,(chamber.start+chamber.end)/2,chamber.start,chamber.end));
  assert.ok(architectureAt(area,chamber.end-10,chamber.start,chamber.end));
}
console.log('OK v4.1: 35 zonas, 105 actos arquitectónicos fijos y sin selección aleatoria.');
