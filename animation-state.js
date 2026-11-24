// Pixel atlas state machine. A frame is one 128x160 tile, 20 tiles per atlas.
export const ANIMATION_FRAMES=20;
export function playerFrame(p,time=0){
  if(p.hp<=0)return 16+Math.min(3,Math.floor((1-Math.max(0,p.deathTime||0)/1.75)*4));
  if(p.hurtTime>0)return p.hurtTime>.17?12:13;
  if(p.attack>0){const duration=p.combo===2?.50:p.combo===1?.35:.30;
    const progress=Math.min(.999,Math.max(0,1-p.attack/duration));
    return 8+Math.floor(progress*4);
  }
  if(p.dodge>0)return 7;
  if(!p.grounded)return 6;
  // Match footfalls to distance travelled rather than elapsed time.
  if(Math.abs(p.motion??p.vx)>1)return Math.floor((p.walkDistance||0)/24)%4;
  return 4+Math.floor(time/700)%2;
}
export function bossFrame(e,time=0){
  if(e.phase===2&&(e.charge>0||e.strike>0))return 18+Math.floor(time/130)%2;
  if(e.stagger>0)return e.stagger>.12?12:13;
  if(e.windup>0)return 8;
  if(e.strike>0||e.charge>0)return 9+Math.floor(time/100)%3;
  return Math.floor(time/190)%6;
}
export function deathFrame(remaining,duration=1.05){
  const progress=Math.min(.999,Math.max(0,1-remaining/duration));
  return 14+Math.floor(progress*4);
}
