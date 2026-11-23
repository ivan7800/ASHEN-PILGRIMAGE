import assert from 'node:assert/strict';
import {kingTelegraph,kingAttackTiming} from './boss-clarity.js';
import {makeEffects,renderEffects,stepEffects} from './effects.js';
for (const phase of [1,2]) {
 const timing=kingAttackTiming(phase);
 assert.ok(timing.windup>=.5, 'reaction window too short');
 const king={kind:'king',alive:true,x:8000,y:384,w:30,h:54,dir:-1,phase,windup:timing.windup};
 const cue=kingTelegraph(king);
 assert.equal(cue.direction,-1);assert.equal(cue.range,timing.reach);
 assert.equal(cue.progress,0);
 king.windup=timing.windup/2;assert.ok(kingTelegraph(king).progress>.45);
 king.dir=1;assert.equal(kingTelegraph(king).direction,1);
 king.windup=0;assert.equal(kingTelegraph(king),null);
}
assert.equal(kingTelegraph({kind:'gravebound',windup:1,alive:true}),null);
const calls=[];
const ctx=new Proxy({save(){},restore(){},fillRect(...a){calls.push(['fill',...a])},strokeRect(...a){calls.push(['stroke',...a])},fillText(...a){calls.push(['text',...a])}},{get:(o,k)=>o[k]??(()=>{})});
const effects=makeEffects();effects.warning={type:'lane',x:8020,y:433,direction:-1,range:152,phase:2,progress:.5,ttl:.1};
renderEffects(ctx,effects,7600);
assert.ok(calls.some(c=>c[0]==='stroke'&&c[3]===152));
assert.ok(calls.some(c=>c[0]==='text'&&c[1].includes('◀')));
stepEffects(effects,.11);assert.equal(effects.warning,null);
console.log('OK: aviso direccional, anticipación >= 0,5 s, progreso y renderizado');
