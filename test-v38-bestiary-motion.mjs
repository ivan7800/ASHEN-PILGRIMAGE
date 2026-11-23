import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BESTIARY,bestiaryFrame} from './bestiary-v37.js';
import {BESTIARY_FAMILIES,bestiaryFamily,bestiaryCue,bestiaryWarningShape,renderBestiaryAction,bestiaryDeathPalette} from './bestiary-presentation-v38.js';
import {cueNotes} from './soundscape.js';
import {cueCaption} from './presentation-v35.js';
import {validateSave} from './save-manager.js';
assert.equal(BESTIARY.length,23);
assert.equal(Object.keys(BESTIARY_FAMILIES).length,23);
assert.equal(new Set(Object.values(BESTIARY_FAMILIES)).size,7);
assert.equal(bestiaryFamily('king'),null);
assert.deepEqual(bestiaryCue('king','prepare'),[]);
const shapes=new Set();
for(const entry of BESTIARY){
 const {kind}=entry;
 const family=bestiaryFamily(kind);
 assert.ok(family,'Missing family '+kind);
 shapes.add(bestiaryWarningShape(kind));
 assert.match(bestiaryDeathPalette(kind),/^#[\da-f]{6}$/i);
 for(const event of ['prepare','release','defeat']){
  const notes=bestiaryCue(kind,event);
  if(event==='prepare'||event==='release')assert.ok(cueCaption(`bestiary:${kind}:${event}`).length>20);
  assert.equal(notes.length,2);
  assert.deepEqual(cueNotes(`bestiary:${kind}:${event}`),notes);
  for(const [freq,duration] of notes){assert.ok(freq>=45&&freq<650);assert.ok(duration>.01&&duration<.6)}
 }
 const ctx={_count:0,save(){},restore(){},set globalAlpha(v){assert.ok(Number.isFinite(v)&&v>=0&&v<=1.01)},set lineWidth(v){},set strokeStyle(v){},set fillStyle(v){},beginPath(){this._count++},arc(){this._count++},moveTo(){this._count++},lineTo(){this._count++},stroke(){this._count++},fillRect(){this._count++},closePath(){}};
 for(const mode of ['cinematic','performance']){
  const enemy={kind,x:200,y:300,w:entry.hitWidth,h:entry.hitHeight,dir:-1,windup:.7,strike:0,dash:0};
  renderBestiaryAction(ctx,enemy,300,{lowEffects:mode==='performance'});
  enemy.windup=0;enemy.strike=.12;renderBestiaryAction(ctx,enemy,300,{lowEffects:mode==='performance'});
  assert.ok(ctx._count>2,`empty warning for ${kind}`);
 }
 for(const event of [{windup:1,strike:0,stagger:0,motion:0},{windup:0,strike:.2,stagger:0,motion:0},{windup:0,strike:0,stagger:.3,motion:0},{windup:0,strike:0,stagger:0,motion:0},{windup:0,strike:0,stagger:0,motion:96}]){
  const i=bestiaryFrame({...event,kind,x:100},600);
  assert.ok(Number.isInteger(i)&&i>=0&&i<=19);
 }
 const path=new URL(`./assets/bestiary-v37/${kind}.png`,import.meta.url);
 const data=readFileSync(path);
 assert.equal(data.readUInt32BE(16),2560);
 assert.equal(data.readUInt32BE(20),160);
 assert.ok(data.length>12000);
}
assert.equal(shapes.size,7);
assert.ok(new Set(BESTIARY.map(entry=>JSON.stringify(bestiaryCue(entry.kind,'prepare')))).size>=17,'Los avisos deben distinguir a más criaturas que las siete familias');
assert.equal(bestiaryFrame({kind:'ashhound',windup:.5,windupTotal:.7,strike:0,dash:0,cast:0},0),8);
assert.equal(bestiaryFrame({kind:'ashhound',windup:.1,windupTotal:.7,strike:0,dash:0,cast:0},0),9);
assert.equal(bestiaryFrame({kind:'ashhound',windup:0,strike:0,dash:0,cast:.04},0),11,'La pose de impacto continúa tras aplicar daño');
const idle=bestiaryFrame({kind:'ashhound',x:100,windup:0,strike:0,stagger:0,motion:0},0);
const run=bestiaryFrame({kind:'ashhound',x:100,windup:0,strike:0,stagger:0,motion:100},0);
assert.ok(idle>=4&&idle<=5);
assert.ok(run<=7);
assert.equal(cueNotes('bestiary:unknown:prepare').length,0);
assert.equal(cueNotes('mother-warning').length,2,'old boss cue still works');
console.log('OK v3.8: 23 sprites, 7 families of telegraph, soundscape, 3 attack events, reduced FX, motion/idle frames.');
