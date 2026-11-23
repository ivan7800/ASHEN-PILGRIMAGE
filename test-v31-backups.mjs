import assert from 'node:assert/strict';
import { createSaveManager, PREFIX, LEGACY } from './save-manager.js';
import { BACKUP_FORMAT, BACKUP_MAX_BYTES, createBackup, encodeBackup, decodeBackup, restoreBackup } from './save-portability.js';
import { chambers, portalFor, chamberAt } from './chambers.js';

const makeStorage = (map = new Map(), fail = () => false) => ({
 getItem: key => map.get(key) ?? null,
 setItem: (key, value) => { if (fail(key)) throw Error('QUOTA'); map.set(key, value); },
 removeItem: key => map.delete(key),
});
const legacy = { p: { x: 650, hp: 87, flasks: 2, checkpoint: 90 }, enemies: Array.from({ length: 9 }, (_, i) => ({ hp: i === 8 ? 180 : 42, alive: true })), secrets: [{ taken: false }, { taken: true }], phase: 'playing' };
const memory = new Map(), manager = createSaveManager(makeStorage(memory));
manager.write('auto', legacy);
manager.write('slot1', { ...legacy, p: { ...legacy.p, x: 1300 } });
manager.write('slot2', { ...legacy, p: { ...legacy.p, x: 1900 } });
const raw = encodeBackup(manager);
const parsed = decodeBackup(raw);
assert.equal(parsed.format, BACKUP_FORMAT);
assert.deepEqual(Object.keys(parsed.slots), ['auto', 'slot1', 'slot2']);
assert.equal(createBackup(manager).slots.slot1.p.x, 1300);
const oldJson = memory.get(PREFIX + 'auto');
const targetMap = new Map([[LEGACY, JSON.stringify(legacy)]]);
const targetStore = makeStorage(targetMap), target = createSaveManager(targetStore);
target.write('slot3', { ...legacy, p: { ...legacy.p, x: 900 } });
assert.equal(restoreBackup(target, targetStore, parsed), 3);
assert.equal(target.read('slot1').p.x, 1300);
assert.equal(target.read('slot2').p.x, 1900);
assert.equal(target.read('slot3').p.x, 900, 'ranuras ajenas a la copia intactas');
assert.equal(targetMap.get(LEGACY), JSON.stringify(legacy), 'datos históricos preservados');
assert.equal(memory.get(PREFIX + 'auto'), oldJson, 'exportar no escribe sobre los guardados');
const bad = JSON.parse(raw);bad.slots.slot1.p.hp = 9999;
const beforeBad = targetMap.get(PREFIX + 'slot1');
assert.throws(() => decodeBackup(JSON.stringify(bad)), /dañada|incompatible/);
assert.equal(targetMap.get(PREFIX + 'slot1'), beforeBad, 'validar no escribe');
for (const value of [
 'esto no es JSON', '{}', JSON.stringify({ format: 'otra-app', slots: { auto: legacy } }),
 JSON.stringify({ format: BACKUP_FORMAT, slots: {} }),
 JSON.stringify({ format: BACKUP_FORMAT, slots: { other: legacy } }),
 ' '.repeat(BACKUP_MAX_BYTES + 1),
]) assert.throws(() => decodeBackup(value));
// Provoca un fallo después de escribir la primera ranura; rollback atómico.
const faultyMap = new Map(targetMap), faultyStorage = makeStorage(faultyMap, key => key === PREFIX + 'slot1');
const faultyManager = createSaveManager(faultyStorage);
const autoBefore = faultyMap.get(PREFIX + 'auto');
assert.throws(() => restoreBackup(faultyManager, faultyStorage, parsed), /No se pudo restaurar/);
assert.equal(faultyMap.get(PREFIX + 'auto'), autoBefore, 'rollback restaura incluso las primeras ranuras');
// Un desenlace de ranura manual se mantiene accesible después de comenzar otra partida (autoguardado nuevo).
manager.write('slot3', { ...legacy, finalEnding: 'extinguir', phase: 'won' });
manager.write('auto', { ...legacy, finalEnding: 'none' });
assert.equal(manager.latestEnding().slot, 'slot3');
// Estructura del mundo: ni huecos ni solapamientos y portales de ida y vuelta.
assert.equal(chambers.length, 35);
for (let i = 0; i < chambers.length; i++) {
 const room = chambers[i]; assert.ok(room.end > room.start && room.end - room.start >= 900);
 assert.equal(chamberAt((room.start + room.end) / 2), i);
 if (i > 0) {
  assert.equal(chambers[i - 1].end, room.start, 'mundo continuo');
  const west = portalFor(room.start + 40, i);
  assert.equal(west?.direction, -1); assert.equal(chamberAt(west.destination), i - 1);
 }
 if (i < chambers.length - 1) {
  const east = portalFor(room.end - 60, i);
  assert.equal(east?.direction, 1); assert.equal(chamberAt(east.destination), i + 1);
 }
}
console.log('OK v3.1: export/import en tres ranuras, JSON inválido, rollback ante fallo, desenlace histórico y 35 cámaras conectadas.');
