// ASHEN PILGRIMAGE v3.8 — 23 silhouettes, 8 readable attack languages.
// Render-only: no mutation of saves or enemy collision bounds.
import {bestiarySpec} from './bestiary-v37.js';

const FAMILIES=Object.freeze({
  blade:['corruptpilgrim','severedmonk','namelessdrowned'],
  shield:['vesperaguard','ruinsentinel'],
  hunter:['cryptscavenger','ashhound','crustplague'],
  apparition:['wailingspecter','abyssraven'],
  ritual:['sunfanatic','rottensiren','fungalsporer','sporematriarch','voidherald','dreamweaver','namecorrupter'],
  leviathan:['brineworm','sigilabomination','devotedflesh'],
  brute:['chainedcastaway','saltgolem','disfigured'],
});
export const BESTIARY_FAMILIES=Object.freeze(Object.fromEntries(Object.entries(FAMILIES).flatMap(([family,kinds])=>kinds.map(kind=>[kind,family]))));
export function bestiaryFamily(kind){return BESTIARY_FAMILIES[kind]||null}
export function bestiaryCue(kind,event){
  const family=bestiaryFamily(kind);
  if(!family||!['prepare','release','defeat'].includes(event))return [];
  const base=({blade:184,shield:127,hunter:220,apparition:293,ritual:165,leviathan:91,brute:110})[family]+(bestiarySpec(kind).index%7-3)*9;
  const note=({prepare:1,release:1.43,defeat:.66})[event];
  // At most two oscillator voices per event; users can mute all audio.
  return [[Math.max(45,Math.min(610,Math.round(base*note))),event==='defeat'?.37:.13],[Math.min(610,Math.max(45,Math.round(base*note*(family==='apparition'?1.62:.75)))),.22]];
}
export function bestiaryWarningShape(kind){return ({
 blade:'slash',shield:'shield',hunter:'pounce',apparition:'pierce',ritual:'sigil',leviathan:'spit',brute:'crush',
})[bestiaryFamily(kind)]||null}

// Context is in world coordinates, while the game's graphics settings determine FX complexity.
export function renderBestiaryAction(ctx,enemy,time,{lowEffects=false,reducedMotion=false}={}){
 const spec=bestiarySpec(enemy.kind);if(!spec)return;
 const warning=enemy.windup>0,attacking=enemy.strike>0||enemy.dash>0||enemy.cast>0;
 if(!warning&&!attacking)return;
 const shape=bestiaryWarningShape(enemy.kind),x=enemy.x+enemy.w/2,y=enemy.y+enemy.h*.52,dir=enemy.dir||1;
 const pulse=reducedMotion?.8:lowEffects?.74:.8+.16*Math.sin(time*.016);
 const color=spec.color;
 ctx.save();ctx.globalAlpha=lowEffects?.85:pulse;ctx.lineWidth=warning?3:4;ctx.strokeStyle=warning?'#f5c18d':color;
 ctx.fillStyle=warning?'rgba(255,176,105,.17)':color;
 if(shape==='slash'){
  ctx.beginPath();ctx.arc(x+dir*12,y,52,dir>0?-1.1:Math.PI-.8,dir>0?1.15:Math.PI+1.4);ctx.stroke();
 }else if(shape==='shield'){
  ctx.beginPath();ctx.moveTo(x+dir*18,y-45);ctx.lineTo(x+dir*42,y-24);ctx.lineTo(x+dir*42,y+25);ctx.lineTo(x+dir*18,y+43);ctx.closePath();ctx.stroke();
  if(attacking&&!lowEffects){ctx.fillRect(x+dir*18,y-15,dir*50,30)}
 }else if(shape==='pounce'){
  ctx.beginPath();ctx.moveTo(x+dir*8,y+25);ctx.lineTo(x+dir*85,y+25);ctx.moveTo(x+dir*70,y+17);ctx.lineTo(x+dir*85,y+25);ctx.lineTo(x+dir*70,y+33);ctx.stroke();
 }else if(shape==='pierce'){
  for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(x+dir*12,y+i*12);ctx.lineTo(x+dir*(warning?62:100),y+i*12);ctx.stroke()}
 }else if(shape==='sigil'){
  const r=warning?32:46;ctx.beginPath();ctx.arc(x+dir*32,y-28,r,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(x+dir*32+Math.cos(a)*(r-9),y-28+Math.sin(a)*(r-9));ctx.lineTo(x+dir*32+Math.cos(a)*(r+6),y-28+Math.sin(a)*(r+6));ctx.stroke()}
 }else if(shape==='spit'){
  ctx.beginPath();ctx.arc(x+dir*54,y-22,warning?10:24,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+dir*20,y-22);ctx.lineTo(x+dir*77,y-22);ctx.stroke();
 }else if(shape==='crush'){
  ctx.beginPath();ctx.moveTo(x-dir*36,y+40);ctx.lineTo(x+dir*66,y+40);ctx.moveTo(x+dir*3,y+7);ctx.lineTo(x+dir*3,y+39);ctx.moveTo(x+dir*14,y+29);ctx.lineTo(x+dir*3,y+39);ctx.lineTo(x-dir*9,y+29);ctx.stroke();
 }
 // A species-specific number of marks makes members of the same family readable
 // without changing the combat hitbox or obscuring the shared direction cue.
 const marks=1+spec.index%3;
 ctx.lineWidth=2;
 for(let i=0;i<marks;i++){
  const mx=x+dir*(20+i*11),my=y-51-(spec.index%4)*4;
  ctx.beginPath();ctx.moveTo(mx-3,my);ctx.lineTo(mx+3,my-8);ctx.lineTo(mx+9,my);ctx.stroke();
 }
 ctx.restore();
}

export function bestiaryDeathPalette(kind){const family=bestiaryFamily(kind);return {
 blade:'#c19c86',shield:'#d8b97e',hunter:'#bc745c',apparition:'#a0bfe1',ritual:'#b7a0d8',leviathan:'#c37e83',brute:'#bab4a1',
 }[family]||'#bc8e84'}
