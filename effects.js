// Bounded visual effects; no dependency on DOM, renderer or save state.
export function makeEffects(){return {particles:[],shake:0,warning:null}}
export function bossAttackPattern(phase){return phase===2?{radius:132,windup:.42,recovery:1.25}:{radius:112,windup:.65,recovery:1.65}}
export function spawnImpact(state,x,y,color='#caa98d',count=12){
  for(let i=0;i<Math.min(32,Math.max(0,count));i++){
    const a=(i*2.399963229728653),speed=68+(i%5)*34;
    state.particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-45,life:.32+(i%4)*.09,maxLife:.32+(i%4)*.09,color});
  }
  if(state.particles.length>160)state.particles.splice(0,state.particles.length-160);
}
export function stepEffects(state,dt){
  state.shake=Math.max(0,state.shake-42*dt);
  state.particles=state.particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=170*dt;return p.life>0});
  if(state.warning){state.warning.ttl-=dt;if(state.warning.ttl<=0)state.warning=null}
}
export function renderEffects(ctx,state,camera){
 ctx.save();
 if(state.warning){const w=state.warning;
   if(w.type==='lane'){
     // Predictive danger lane, with direction arrow and a progress indicator.
     const sx=w.x-camera, width=w.range, left=w.direction>0?sx:sx-width;
     ctx.fillStyle='rgba(20,8,12,.70)';ctx.fillRect(left,w.y-13,width,25);
     ctx.fillStyle=w.phase===2?'rgba(255,76,50,.46)':'rgba(244,155,83,.39)';ctx.fillRect(left,w.y-13,width,25);
     ctx.strokeStyle='#ffdb98';ctx.lineWidth=3;ctx.strokeRect(left,w.y-13,width,25);
     ctx.fillStyle='#ffe3b8';ctx.fillRect(left,w.y-20,width*w.progress,5);
     ctx.font='bold 18px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff0cc';
     ctx.fillText(w.direction>0?'▶ ▶ ▶':'◀ ◀ ◀',left+width/2,w.y+6);
     ctx.textAlign='left';
   }else{ctx.strokeStyle='rgba(240,95,78,.7)';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(w.x-camera,w.y-6,w.r,10,0,0,Math.PI*2);ctx.stroke()}
 }
 for(const p of state.particles){ctx.globalAlpha=Math.max(0,p.life/p.maxLife);ctx.fillStyle=p.color;ctx.fillRect(p.x-camera-2,p.y-2,4,4)}
 ctx.restore();
}
