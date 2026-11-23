// Explicit, side-scroller combat cues. Pure calculations shared by combat and renderer.
export function kingTelegraph(enemy) {
  if (enemy?.kind !== 'king' || !enemy.alive || enemy.windup <= 0) return null;
  const phase = enemy.phase === 2 ? 2 : 1;
  const maxWindup = phase === 2 ? .54 : .74;
  return {
    type: 'lane', x: enemy.x + enemy.w / 2, y: enemy.y + enemy.h - 5,
    direction: enemy.dir || -1, range: phase === 2 ? 152 : 139,
    progress: Math.max(0, Math.min(1, 1 - enemy.windup / maxWindup)),
    phase, ttl: .10
  };
}
export function kingAttackTiming(phase) {
  return phase === 2 ? {windup:.54,cooldown:1.85,damageBonus:5,reach:152,chargeSpeed:285} :
    {windup:.74,cooldown:1.80,damageBonus:0,reach:139,chargeSpeed:0};
}

// Los dos primeros jefes utilizaban un aviso de solo 0,42 s en fase 2.
// La dirección se fija al iniciar la preparación; la franja permanece visible todo el aviso.
export function earlyBossWindup(kind,phase,base){
 return (kind==='warden'||kind==='mother')&&phase===2?.60:base;
}
export function earlyBossTelegraph(e){
 if(!e?.alive||e.windup<=0||!['warden','mother'].includes(e.kind))return null;
 const max=e.phase===2?.60:e.kind==='mother'?.78:.65;
 return {type:'lane',x:e.x+e.w/2,y:e.y+e.h-5,direction:e.dir||-1,
   range:e.kind==='mother'?(e.phase===2?142:142):(e.phase===2?132:112),
   progress:Math.max(0,Math.min(1,1-e.windup/max)),phase:e.phase,ttl:Math.max(.05,e.windup+.05)};
}
