// Decorative, gameplay-readable tide art. Rendered behind HUD and in world coordinates.
import {SEA_VALVES,SEA_ECHOES,isUnderwater} from './sea-v25.js';
export function paintSeaObjects(c,{area,camera,ground,tide,desvelo,time,waterOverlay=false}){
 if(area<18||area>21)return;
 c.save();c.translate(-camera,0);
 const start=[22000,23400,24700,26000][area-18],end=[23400,24700,26000,27400][area-18];
 for(let x=start+120;x<end;x+=320){
  // Ribs of wrecked hulls and glass-filled alcoves; low opacity for foreground legibility.
  c.fillStyle='#273b44';c.beginPath();c.moveTo(x-95,ground-4);c.lineTo(x-58,ground-95);c.quadraticCurveTo(x,ground-156,x+61,ground-97);c.lineTo(x+95,ground-4);c.closePath();c.fill();
  c.strokeStyle='#82a4a4';c.lineWidth=3;c.beginPath();c.arc(x,ground-84,39,Math.PI,Math.PI*2);c.stroke();
  c.fillStyle='#3e666d';for(let j=0;j<5;j++)c.fillRect(x-76+j*35,ground-16,6,16);
 }
 for(const valve of SEA_VALVES){if(valve.x<start||valve.x>=end)continue;
  const x=valve.x,y=ground-104;
  c.strokeStyle=tide===valve.mode?'#e2bb82':'#78aeb6';c.lineWidth=6;c.beginPath();c.arc(x,y,32,0,Math.PI*2);c.stroke();
  for(let i=0;i<8;i++){const a=i*Math.PI/4+time*.00018;c.beginPath();c.moveTo(x+9*Math.cos(a),y+9*Math.sin(a));c.lineTo(x+31*Math.cos(a),y+31*Math.sin(a));c.stroke()}
  c.fillStyle='#ddd4b2';c.font='bold 13px Georgia';c.textAlign='center';c.fillText('✦',x,y+5);
 }
 for(const seal of SEA_ECHOES){if(seal.x<start||seal.x>=end)continue;
  const x=seal.x,y=ground-69,pulse=.55+.25*Math.sin(time*.003+seal.id);
  c.strokeStyle=desvelo?`rgba(171,235,220,${pulse})`:'#53686e';c.lineWidth=4;c.strokeRect(x-25,y-35,50,90);
  c.fillStyle=desvelo?'#d2f6e2':'#87999a';c.font='bold 20px Georgia';c.textAlign='center';c.fillText(['I','II','III'][seal.id],x,y+4);c.font='12px Georgia';c.fillText(seal.name,x,y+29);
 }
 c.restore();
 if(waterOverlay&&isUnderwater(area,tide)){
  c.save();c.fillStyle='rgba(37,116,138,.19)';c.fillRect(0,85,960,350);
  for(let i=0;i<26;i++){const x=(i*131+time*(.012+(i%5)*.006))%960,y=120+(i*71+time*(.04+(i%4)*.01))%305;
   c.strokeStyle='rgba(176,237,238,.23)';c.lineWidth=1;c.beginPath();c.arc(x,y,2+(i%4),0,Math.PI*2);c.stroke();}
  c.strokeStyle='rgba(178,223,219,.50)';c.lineWidth=2;c.beginPath();c.moveTo(0,86);for(let x=0;x<=960;x+=16)c.lineTo(x,86+Math.sin(x*.027+time*.002)*5);c.stroke();c.restore();
 }
}

// Draw only the underwater tint after characters; do not occlude hit boxes with architecture.
export function paintSeaWater(c,{area,tide,time}){
 if(!isUnderwater(area,tide))return;
 c.save();c.fillStyle='rgba(41,129,152,.12)';c.fillRect(0,88,960,350);
 c.strokeStyle='rgba(172,228,227,.43)';c.lineWidth=2;c.beginPath();c.moveTo(0,90);
 for(let x=0;x<=960;x+=16)c.lineTo(x,90+Math.sin(x*.026+time*.002)*4);c.stroke();
 c.restore();
}
