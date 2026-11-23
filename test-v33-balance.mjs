import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DIFFICULTIES,DIFFICULTY_LABELS,difficultyProfile,normalizeDifficulty,nextDifficulty,incomingDamage,regularWindup} from './balance-v33.js';
import {beginDodge,regenerateStamina,enemyBehavior,shouldStrike,COMBO} from './combat.js';
import {kingAttackTiming,earlyBossWindup,earlyBossTelegraph} from './boss-clarity.js';
import {archivistTiming} from './archivist-presentation.js';
import {brideTiming} from './sea-v25.js';
import {gardenerTiming} from './roots-v26.js';
import {giantTiming} from './summit-v29.js';
import {witnessTiming} from './final-throne-v30.js';
const profiles=DIFFICULTIES.map(difficultyProfile);
assert.deepEqual(DIFFICULTIES,['pilgrim','normal','penance']);
assert.equal(normalizeDifficulty('__malformed__'),'normal');
assert.equal(nextDifficulty('normal'),'penance');
assert.equal(nextDifficulty('penance'),'pilgrim');
assert.deepEqual(profiles.map(p=>p.healing),[55,45,35]);
assert.deepEqual(profiles.map(p=>incomingDamage(30,DIFFICULTIES[profiles.indexOf(p)])),[23,30,38]);
assert.equal(incomingDamage(0,'normal'),0,'cero no produce daño');
assert.equal(incomingDamage(NaN,'normal'),0,'valor malformado no produce daño');
assert.equal(incomingDamage(100,'normal'),100);
for (const d of DIFFICULTIES) {
 const p=difficultyProfile(d);assert.ok(DIFFICULTY_LABELS[d]);
 const player={attack:0,dodge:0,inv:0,stamina:100,comboWindow:0};
 assert.equal(beginDodge(player,p.dodgeCost,p.dodgeInv),true);
 assert.equal(player.stamina,100-p.dodgeCost);
 assert.equal(player.inv,p.dodgeInv);
 assert.equal(beginDodge(player,p.dodgeCost,p.dodgeInv),false);
 player.dodge=0;
 const before=player.stamina;
 regenerateStamina(player,.5,p.staminaRegen);
 assert.ok(player.stamina>before&&player.stamina<=100);
}
assert.deepEqual(COMBO.map(a=>a.damage),[22,27,40],'los combos heredados no cambian');
assert.equal(regularWindup(.8,'pilgrim'),.96);
assert.equal(regularWindup(.8,'normal'),.8);
assert.equal(regularWindup(1,'penance'),.95);
assert.equal(regularWindup(.43,'normal'),.52,'aviso mínimo 520 ms para enemigos comunes');
assert.equal(regularWindup(.43,'penance'),.52,'también en dificultad alta');
const foe={x:100,y:380,w:30,h:50,dir:1};
const inFront={x:170,y:375,w:32,h:68},behind={x:50,y:375,w:32,h:68};
assert.equal(shouldStrike(foe,inFront,120),true);
assert.equal(shouldStrike(foe,behind,120),false,'enemigo no golpea a sus espaldas');
assert.equal(shouldStrike({...foe,dir:-1},inFront,120),false);
assert.equal(shouldStrike({...foe,dir:-1},behind,120),true);
assert.equal(shouldStrike({...foe,dir:1}, {...behind,x:90},120),true,'solapamiento de hitboxes mantiene tolerancia');
assert.equal(shouldStrike(foe,{...inFront,y:40},120),false,'distancia vertical se respeta');
assert.equal(shouldStrike(foe,{...inFront,x:500},120),false);
for(const [name,func] of [['Rey',kingAttackTiming],['Archivero',archivistTiming],['Novia',brideTiming],['Jardinero',gardenerTiming],['Gigante',giantTiming],['Testigo',witnessTiming]]){
 for(const phase of [1,2]){const c=func(phase);assert.ok(c.windup>=.5,`${name} fase ${phase}: anticipo mínimo`);assert.ok(c.reach>60);}
}
for(const kind of ['warden','mother']){
 assert.equal(earlyBossWindup(kind,2,.42),.6,`fase II de ${kind} legible`);
 assert.equal(earlyBossWindup(kind,1,.65),.65);
 const w=earlyBossTelegraph({kind,x:600,y:384,w:30,h:54,dir:-1,alive:true,windup:.4,phase:2});
 assert.equal(w.type,'lane');assert.equal(w.direction,-1);assert.ok(w.ttl>=.4);assert.ok(w.range>=112);
}
for(const type of ['warden','king','mother','archivist','bride','gardener','bellgiant','firstwitness']){const e=enemyBehavior(type);assert.ok(e.damage>=20&&e.cooldown>1,`configuración ${type}`)}
const game=readFileSync(new URL('./game.js',import.meta.url),'utf8');
for(const snippet of ['incomingDamage(amount,difficulty)',"e.dir=Math.sign(p.x+p.w/2-e.x-e.w/2)||e.dir",'regularWindup(behavior.windup,difficulty)','difficultyProfile(difficulty).staminaRegen','difficultyProfile(difficulty).healing',"localStorage.setItem(DIFFICULTY_STORAGE_KEY,difficulty)"])assert.ok(game.includes(snippet),`integración real: ${snippet}`);
console.log('OK v3.3: tres dificultades, esquiva y resistencia, orientación, ocho jefes y conexiones del motor.');
