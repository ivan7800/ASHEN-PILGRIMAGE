import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RELICS,SHORTCUTS,RELIC_IDS,SHORTCUT_IDS,validIdList,findRelic,relicNear,relicEffects,shortcutNear,traverseShortcut} from './exploration-v34.js';
import {validateSave,createSaveManager} from './save-manager.js';
import {chamberAt} from './chambers.js';
import {decodeBackup,encodeBackup} from './save-portability.js';
assert.equal(RELICS.length,8);assert.equal(SHORTCUTS.length,3);
assert.equal(new Set(RELIC_IDS).size,8);assert.equal(new Set(SHORTCUT_IDS).size,3);
for(const r of RELICS){assert.equal(chamberAt(r.x),r.area,`el relicario ${r.id} está en su cámara`);assert.equal(findRelic(r.x,[],{desvelo:false}).changed,false);if(r.id!=='exile')assert.equal(findRelic(r.x,[],{desvelo:true}).relic.id,r.id);assert.equal(findRelic(r.x,[r.id],{desvelo:true}).found,false)}
assert.equal(findRelic(7270,[],{desvelo:true,questStage:2,allegiance:'people'}).changed,false);
assert.equal(findRelic(7270,[],{desvelo:true,questStage:3,allegiance:'none'}).changed,false);
assert.equal(findRelic(7270,[],{desvelo:true,questStage:3,allegiance:'crown'}).changed,true);
assert.equal(relicNear(800,[])?.id,undefined);
const e0=relicEffects([]);assert.equal(e0.swordMultiplier,1);assert.equal(e0.healBonus,0);assert.equal(e0.airBonus,0);
const all=relicEffects(RELIC_IDS,'people');assert.equal(all.healBonus,9);assert.equal(all.dodgeInvBonus,.04);assert.equal(all.swordMultiplier,1.05);assert.equal(all.bossMultiplier,1.08);assert.equal(all.airBonus,6);assert.equal(all.dodgeCostReduction,3);assert.equal(all.thornReduction,4);assert.equal(all.staminaRegenMultiplier,1.12);
const crown=relicEffects(RELIC_IDS,'crown');assert.equal(crown.healBonus,6);assert.equal(crown.swordMultiplier,1.03);assert.ok(crown.staminaRegenMultiplier>all.staminaRegenMultiplier);
assert.equal(validIdList(['vigil','solar'],RELIC_IDS),true);assert.equal(validIdList(['vigil','vigil'],RELIC_IDS),false);assert.equal(validIdList(['foo'],RELIC_IDS),false);assert.equal(validIdList('vigil',RELIC_IDS),false);
const progress={questStage:3,allegiance:'people',forestStage:3,ossaraStage:3};
for(const shortcut of SHORTCUTS){
 assert.equal(chamberAt(shortcut.a)===chamberAt(shortcut.b),false,'un pasaje conecta zonas diferentes');
 assert.equal(traverseShortcut(shortcut.a,[],{desvelo:false,progress}).changed,false,'el primer acceso requiere Desvelo');
 const go=traverseShortcut(shortcut.a,[],{desvelo:true,progress});assert.equal(go.destination,shortcut.b);assert.ok(go.newlyOpened);assert.deepEqual(go.opened,[shortcut.id]);
 const back=traverseShortcut(shortcut.b,go.opened,{desvelo:false,progress});assert.equal(back.destination,shortcut.a);assert.equal(back.newlyOpened,false);assert.equal(shortcutNear(shortcut.a).shortcut.id,shortcut.id);
 assert.equal(traverseShortcut(shortcut.a,[],{desvelo:true,progress:{}}).changed,false,'sin progreso no permite saltar puertas');
}
const legacy={p:{x:650,hp:87,flasks:2,checkpoint:90},enemies:Array.from({length:9},(_,i)=>({hp:i===8?180:42,alive:true})),secrets:[{taken:false},{taken:true}],phase:'playing'};
assert.ok(validateSave(legacy),'v0.1 intacto');assert.ok(validateSave({...legacy,relicsFound:['vigil','solar'],shortcutsOpened:['tizones']}));
for(const invalid of [{relicsFound:['untrusted']},{relicsFound:['vigil','vigil']},{shortcutsOpened:['hollow','hollow']},{shortcutsOpened:[0]},{relicsFound:Array(9).fill('vigil')}])assert.equal(validateSave({...legacy,...invalid}),false);
const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};const mgr=createSaveManager(storage);mgr.write('auto',{...legacy,relicsFound:['vigil','pearl'],shortcutsOpened:['tizones']});const copied=decodeBackup(encodeBackup(mgr));assert.deepEqual(copied.slots.auto.relicsFound,['vigil','pearl']);assert.deepEqual(copied.slots.auto.shortcutsOpened,['tizones']);
const game=readFileSync(new URL('./game.js',import.meta.url),'utf8');const visual=readFileSync(new URL('./visual.js',import.meta.url),'utf8');
for(const token of ['relicsFound:[...relicsFound]','shortcutsOpened:[...shortcutsOpened]','const relic=findRelic(','traverseShortcut(p.x,','relicEffects(relicsFound,allegiance).swordMultiplier','relicEffects(relicsFound,allegiance).airBonus'])assert.ok(game.includes(token),token);
assert.ok(visual.includes('for(const relic of RELICS)'),'los relicarios deben dibujarse dentro del juego');
console.log('OK v3.4: 8 relicarios, 3 pasajes bidireccionales, efectos, validación, retrocompatibilidad y exportación JSON.');
