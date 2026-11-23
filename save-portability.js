// Copias locales de partidas: sin red, sin código ejecutable y con restauración reversible.
import { SLOTS, PREFIX, validateSave } from './save-manager.js';

export const BACKUP_FORMAT = 'ashen-pilgrimage-backup-v1';
export const BACKUP_MAX_BYTES = 2_000_000;

export function createBackup(manager) {
  const slots = {};
  for (const slot of SLOTS) {
    const data = manager.read(slot);
    if (data) slots[slot] = data;
  }
  return { format: BACKUP_FORMAT, exportedAt: new Date().toISOString(), slots };
}

export function encodeBackup(manager) {
  const backup = createBackup(manager);
  if (!Object.keys(backup.slots).length) throw Error('No hay partidas válidas que exportar.');
  return JSON.stringify(backup, null, 2);
}

export function decodeBackup(raw) {
  if (typeof raw !== 'string' || new TextEncoder().encode(raw).length > BACKUP_MAX_BYTES)
    throw Error('El archivo de copia de seguridad supera el límite de 2 MB o no es texto JSON.');
  let value;
  try { value = JSON.parse(raw); } catch { throw Error('El archivo no contiene JSON válido.'); }
  if (!value || value.format !== BACKUP_FORMAT || !value.slots || typeof value.slots !== 'object' || Array.isArray(value.slots))
    throw Error('Este archivo no es una copia de ASHEN PILGRIMAGE compatible.');
  const names = Object.keys(value.slots);
  if (!names.length || names.some(slot => !SLOTS.includes(slot)))
    throw Error('La copia no contiene ranuras reconocidas.');
  for (const slot of names) {
    if (!validateSave(value.slots[slot]))
      throw Error(`La ranura ${slot} contiene una partida dañada o incompatible.`);
  }
  return { format: BACKUP_FORMAT, slots: Object.fromEntries(names.map(name => [name, value.slots[name]])) };
}

// Valida TODAS las partidas antes de escribir. Si falla el almacenamiento, restaura las ranuras originales.
export function restoreBackup(manager, storage, backup) {
  const checked = decodeBackup(JSON.stringify(backup));
  const names = Object.keys(checked.slots);
  const before = new Map(names.map(slot => [slot, storage.getItem(PREFIX + slot)]));
  const written = [];
  try {
    for (const slot of names) { manager.write(slot, checked.slots[slot]); written.push(slot); }
  } catch (error) {
    let rollbackFailed = false;
    for (const slot of written.reverse()) {
      const value = before.get(slot);
      try { if (value === null) storage.removeItem(PREFIX + slot); else storage.setItem(PREFIX + slot, value); }
      catch { rollbackFailed = true; }
    }
    if (rollbackFailed) throw Error('Falló la restauración y no se pudieron recuperar todas las ranuras: revisa el almacenamiento del navegador.');
    throw Error('No se pudo restaurar la copia: se han recuperado las ranuras anteriores.');
  }
  return names.length;
}
