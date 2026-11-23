// Predictive, direction-aware Archivero Ciego combat readability.
// All measurements come from the same collision rule used by the combat loop.
export function archivistTiming(phase){
 return phase===2?{windup:.67,cooldown:1.46,reach:155,damageBonus:5}:{windup:.88,cooldown:1.84,reach:145,damageBonus:0};
}
export function archivistTelegraph(enemy){
 if(enemy.kind!=='archivist'||!enemy.alive||enemy.windup<=0)return null;
 const timing=archivistTiming(enemy.phase);
 const direction=enemy.dir===-1?-1:1;
 return {type:'lane',x:enemy.x+enemy.w/2,y:438,range:timing.reach,
  direction,phase:enemy.phase,progress:Math.max(0,Math.min(1,1-enemy.windup/timing.windup)),
  ttl:Math.max(.12,enemy.windup)};
}
// The attack is telegraphed first; the hit happens at the end of the strike window.
export function archivistCue(previous,next){
 if(previous.kind!=='archivist'||!previous.alive)return null;
 if(previous.windup>0&&next.windup>0&&next.windup<=.19&&previous.windup>.19)return 'archive-final';
 if(previous.windup>0&&next.windup===0)return 'archive-strike';
 return null;
}
