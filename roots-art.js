// Roots, bark and ritual stones are drawn in world space *behind* combatants.
import {ROOT_SIGILS,ROOT_THORNS,thornPhase} from './roots-v26.js';
export function paintRootsObjects(c,{area,ground,desvelo,time}){
 if(area<22||area>25)return;
 c.save();
 const start=[27400,28900,30350,31750][area-22],end=[28900,30350,31750,33250][area-22];
 c.globalAlpha=.16;
 for(let x=start+160;x<end-120;x+=300){
  c.save();c.strokeStyle='#425e48';c.lineWidth=18;c.beginPath();c.moveTo(x,ground+8);c.bezierCurveTo(x-50,ground-124,x+44,ground-183,x-16,ground-340);c.stroke();
  c.lineWidth=6;c.strokeStyle='#9b8662';c.beginPath();c.moveTo(x+4,ground);c.bezierCurveTo(x+28,ground-100,x+3,ground-205,x+23,ground-332);c.stroke();
  c.fillStyle='rgba(97,132,80,.53)';for(let i=0;i<8;i++){c.beginPath();c.ellipse(x-17+(i%4)*21,ground-320-(i%3)*13,31,18,.3,0,Math.PI*2);c.fill()}c.restore();
 }
 c.globalAlpha=1;
 for(const seal of ROOT_SIGILS){if(seal.x<start||seal.x>=end)continue;const glow=.56+.18*Math.sin(time*.003+seal.id);c.fillStyle='#342d35';c.fillRect(seal.x-24,ground-118,48,118);c.strokeStyle=desvelo?'#eac9aa':'#806e62';c.lineWidth=4;c.strokeRect(seal.x-24,ground-118,48,118);c.fillStyle=desvelo?`rgba(222,242,174,${glow})`:'#8a8170';c.font='bold 24px Georgia';c.textAlign='center';c.fillText(['I','II','III'][seal.id],seal.x,ground-64);c.font='11px Georgia';c.fillText(seal.name,seal.x,ground-37);c.textAlign='left'}
 for(const thorn of ROOT_THORNS){if(thorn.x<start||thorn.x>=end)continue;const state=thornPhase(time/1000,thorn.offset);
  c.fillStyle=state==='active'?'rgba(189,82,68,.76)':state==='warning'?'rgba(219,153,84,.65)':'rgba(75,105,67,.52)';
  c.fillRect(thorn.x,ground-9,thorn.width,9);
  if(state==='warning'){c.save();c.globalAlpha=.33+.23*Math.sin(time*.019);c.fillStyle='#f6ae6c';c.fillRect(thorn.x-3,ground-16,thorn.width+6,5);c.restore()}
  if(state==='active'){c.save();c.globalAlpha=.20;c.fillStyle='#e66857';c.fillRect(thorn.x-4,ground-53,thorn.width+8,53);c.restore()}
  if(state!=='rest')for(let i=0;i<7;i++){
   const x=thorn.x+8+i*(thorn.width-15)/6,h=state==='active'?36+(i%3)*6:11+(i%2)*6;
   c.beginPath();c.moveTo(x-6,ground);c.lineTo(x,ground-h);c.lineTo(x+6,ground);c.closePath();c.fill();
  }
 }
 c.restore();
}
