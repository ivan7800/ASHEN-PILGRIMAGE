// Perfil de dificultad local. No modifica guardados históricos ni estados de misiones.
export const DIFFICULTY_STORAGE_KEY = 'ashen-pilgrimage-difficulty-v33';
export const DIFFICULTIES = Object.freeze(['pilgrim', 'normal', 'penance']);
export const DIFFICULTY_LABELS = Object.freeze({pilgrim:'Peregrino',normal:'Normal',penance:'Penitencia'});
const PROFILES = Object.freeze({
 pilgrim: Object.freeze({enemyDamage:.75,staminaRegen:1.25,healing:55,dodgeCost:22,dodgeInv:.38,regularWindup:1.20}),
 normal: Object.freeze({enemyDamage:1,staminaRegen:1,healing:45,dodgeCost:28,dodgeInv:.34,regularWindup:1}),
 penance: Object.freeze({enemyDamage:1.25,staminaRegen:.85,healing:35,dodgeCost:34,dodgeInv:.30,regularWindup:.95})
});
export function normalizeDifficulty(value){return DIFFICULTIES.includes(value)?value:'normal'}
export function nextDifficulty(value){return DIFFICULTIES[(DIFFICULTIES.indexOf(normalizeDifficulty(value))+1)%DIFFICULTIES.length]}
export function difficultyProfile(value){return PROFILES[normalizeDifficulty(value)]}
export function incomingDamage(amount,value){return !Number.isFinite(amount)||amount<=0?0:Math.max(1,Math.round(amount*difficultyProfile(value).enemyDamage))}
export function regularWindup(seconds,value){return Math.max(.52,seconds*difficultyProfile(value).regularWindup)}
