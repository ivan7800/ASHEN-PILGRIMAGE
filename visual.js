// ASHEN PILGRIMAGE — original procedural gothic art, no external assets.
import {paintChamber, chamberAt, chambers} from './chambers.js';
import {BESTIARY_ART,bestiarySpec,bestiaryFrame} from './bestiary-v37.js';
import {renderBestiaryAction} from './bestiary-presentation-v38.js';
import {graphicsProfile, visibleTileStarts} from './visual-style-v32.js';
import {playerFrame,bossFrame,deathFrame,ANIMATION_FRAMES} from './animation-state.js';
import {REGIONAL_NPCS} from './valdren-region.js';
import {kingFrame} from './king-presentation.js';
import {FOREST_NPC,FOREST_RELIC_X} from './forest-region.js';
import {OSSARA_NPC} from './ossara-region.js';
import {OSSARA_KEEPER,OSSARA_SEALS} from './ossara-v22.js';
import {SALMUERA_NPC,TIDE_MEMORY_X} from './salmuera-region.js';
import {SEA_NPCS} from './sea-v25.js';
import {paintSeaObjects} from './sea-art.js';
import {isSeaRegion,seaVisualPlan,seaLayerShift,SEA_COMBAT_FOG_MAX} from './sea-visual-v27.js';
import {SUMMIT_NPCS,SUMMIT_MEMORY_X,snowVisualIntensity} from './summit-v28.js';
import {RESONATORS,giantTelegraph} from './summit-v29.js';
import {SOLAR_SEALS,FIRST_WITNESS_INDEX,FINAL_START,FINAL_END} from './final-throne-v30.js';
import {ROOT_NPCS,ROOT_SIGILS} from './roots-v26.js';
import {paintRootsObjects} from './roots-art.js';
import {paintArchitecture} from './screen-architecture-v1.js';
import {bossPresentation,bossFrameProfile} from './boss-presentation-v1.js';
const TAU=Math.PI*2;
// Real, separately stored visual resources. Missing assets fall back to vector art.
const art = Object.fromEntries(Object.entries({
  backdrop:'./assets/crypt-cinematic.webp',
  roomCrypt:'./assets/room-crypt.webp', roomCloister:'./assets/room-cloister.webp',
  roomOssuary:'./assets/room-ossuary.webp', roomBell:'./assets/room-bell.webp', roomArena:'./assets/room-arena.webp', roomValdren:'./assets/room-valdren.webp',roomMarket:'./assets/room-market.webp',roomThrone:'./assets/room-throne.webp',roomForest:'./assets/room-forest.webp',roomEcho:'./assets/room-echo.webp',roomRefuge:'./assets/room-refuge.webp',roomSanctuary:'./assets/room-sanctuary.webp',roomOssara:'./assets/room-ossara.webp',roomArchive:'./assets/room-archive.webp',roomChoir:'./assets/room-choir.webp',roomArchivist:'./assets/room-archivist.webp',roomHarbor:'./assets/room-harbor.webp',roomDrowned:'./assets/room-drowned.webp',roomSubmerged:'./assets/room-submerged.webp',roomTidehall:'./assets/room-tidehall.webp',roomDrownedChapel:'./assets/room-drownedchapel.webp',roomAbyssBoss:'./assets/room-abyssboss.webp',roomRootgate:'./assets/room-rootgate.webp',roomHojaclara:'./assets/room-hojaclara.webp',roomInjertos:'./assets/room-injertos.webp',roomGardener:'./assets/room-gardener.webp',roomSummit:'./assets/room-summitpass-v28.webp',roomSilentCloister:'./assets/room-silentcloister-v28.webp',roomSnowStairs:'./assets/room-snowstairs-v29.webp',roomSnowEcho:'./assets/room-snowecho-v29.webp',roomGiant:'./assets/room-snowgiant-v29.webp',roomFinalGate:'./assets/room-final-umbral-v30.webp',roomFinalGallery:'./assets/room-final-galeria-v30.webp',roomFinalEmbers:'./assets/room-final-brasas-v30.webp',roomFinalThrone:'./assets/room-final-trono-premium-v32.webp',roomFinalThroneLegacy:'./assets/room-final-trono-v30.webp',
  pilgrim:'./assets/pilgrim-v21.png',pilgrimLegacy:'./assets/pilgrim-v14.png',
  caldris:'./assets/caldris-v21.png', caldrisLegacy:'./assets/caldris-v15.png',maera:'./assets/maera-v21.png',maeraLegacy:'./assets/maera-v15.png', saint:'./assets/saint-v15.png', erena:'./assets/erena-v15.png',aina:'./assets/aina-v19.png',iren:'./assets/iren-v16.png',veska:'./assets/veska-v16.png',
  gravebound:'./assets/gravebound-v21.png',graveboundLegacy:'./assets/gravebound-v15.png', mourner:'./assets/mourner-premium-v32.png',mournerLegacy:'./assets/mourner-v15.png', exile:'./assets/exile-v15.png',cinder:'./assets/cinder-v16.png',bellkeeper:'./assets/bellkeeper-v16.png',rootguard:'./assets/rootguard-v19.png',archivist:'./assets/archivist-v22.png',scriptor:'./assets/scriptor-v22.png',bonekeeper:'./assets/bonekeeper-v21.png',velador:'./assets/velador-v21.png',scribe:'./assets/scribe-v22.png',marin:'./assets/marin-v24.png',saltguard:'./assets/saltguard-v28.png',drowned:'./assets/drowned-v27.png',sirene:'./assets/sirene-v28.png',salwatch:'./assets/drowned-v25.png',bride:'./assets/bride-v25.png',barkguard:'./assets/barkguard-v26.png',sporeseer:'./assets/sporeseer-v26.png',liria:'./assets/liria-v26.png',gardener:'./assets/gardener-v26.png',icewarden:'./assets/icewarden-v28.png',icewraith:'./assets/icewraith-v28.png',hushmonk:'./assets/hushmonk-v29.png',icechoir:'./assets/icechoir-v29.png',bellgiant:'./assets/bellgiant-v29.png',elda:'./assets/elda-v28.png',saintfinal:'./assets/saint-v15.png',maeralast:'./assets/maera-v21.png',firstwitness:'./assets/firstwitness-v30.png',sunpenitent:'./assets/sunpenitent-v30.png',solarwraith:'./assets/solarwraith-v30.png',ashherald:'./assets/ashherald-v30.png',
  warden:'./assets/warden-v14.png',king:'./assets/king-v21.png',kingLegacy:'./assets/king-v18.png',mother:'./assets/mother-v20.png',
  skyline:'./assets/far-spires.png', midground:'./assets/middle-ossuary.png', foreground:'./assets/foreground-brambles.png',
  seaFar:'./assets/sea-far-v27.png',seaMid:'./assets/sea-mid-v27.png',seaFoam:'./assets/sea-foam-v27.png',snowFar:'./assets/snow-far-v28.png',snowMid:'./assets/snow-mid-v28.png',stoneFloor:'./assets/ground-premium-v32.png',stonePlatform:'./assets/platform-premium-v32.png',...BESTIARY_ART
}).map(([key,url]) => { const im=new Image(); im.src=url; return [key,im]; }));
const ready=im=>im?.complete && im.naturalWidth>0;
function sprite(c,im,index,frames,x,y,width,height,mirror=false){
  if(!ready(im))return false;
  c.save(); c.imageSmoothingEnabled=false; if(mirror){c.translate(x*2+width,0);c.scale(-1,1)}
  c.drawImage(im,(index%frames)*128,0,128,160,x,y,width,height);c.restore();return true;
}

const hash=n=>{let x=Math.sin(n*127.1+78.233)*43758.5453;return x-Math.floor(x)};
function poly(c,pts,fill,stroke=null,w=1){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke()}}
function stroke(c,x,y,X,Y,color,w=1){c.strokeStyle=color;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.stroke()}
function box(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h)}
function arch(c,x,y,w,h,color,inner=null){c.fillStyle=color;c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+w*.42);c.quadraticCurveTo(x+w*.2,y+w*.12,x+w*.5,y);c.quadraticCurveTo(x+w*.8,y+w*.12,x+w,y+w*.42);c.lineTo(x+w,y+h);c.closePath();c.fill();if(inner)arch(c,x+7,y+11,w-14,h-11,inner)}
function tower(c,x,base,w,h,palette,seed){let top=base-h;box(c,x,top,w,h,palette.wall);for(let i=0;i<4;i++){let xx=x+i*w/4;stroke(c,xx,top+7,xx,base,palette.mortar,1)}for(let j=0;j<Math.floor(h/33);j++){stroke(c,x,top+24+j*33,x+w,top+24+j*33,palette.mortar,1);for(let k=0;k<3;k++){let xx=x+hash(seed+j*11+k)*w;stroke(c,xx,top+24+j*33,xx,top+35+j*33,palette.mortar,1)}}for(let j=0;j<3;j++)arch(c,x+w*(.15+j*.29),top+34,w*.17,h*.22,palette.cut,palette.glass);for(let j=0;j<Math.ceil(w/17);j++){box(c,x+j*17,top-9,12,12,palette.wall)}poly(c,[[x-7,top],[x+w/2,top-h*.19],[x+w+7,top]],palette.roof);stroke(c,x+w/2,top-h*.19-14,x+w/2,top-h*.19,palette.metal,2)}
function silhouette(c,x,y,scale=1,seed=0){c.save();c.translate(x,y);c.scale(scale,scale);poly(c,[[-20,0],[-24,-58],[-12,-84],[0,-103],[14,-85],[22,-58],[20,0]],'#11191d');poly(c,[[-16,-72],[0,-106],[16,-72]],'#172329');stroke(c,-19,-65,19,-65,'#34434a',2);arch(c,-7,-67,14,25,'#0a1217','#3b1f23');for(let i=0;i<3;i++)stroke(c,-18+i*15,-52,-18+i*15,-4,'#24333a',1);c.restore()}
function knight(c,p,time,reduceMotion=false){
  const moving=Math.abs(p.motion??p.vx)>1&&p.grounded;
  const duration=p.combo===2?.50:p.combo===1?.35:.30;
  const progress=p.attack>0?1-p.attack/duration:0;
  const frame=playerFrame(p,time);
  c.save();if(p.inv>0&&Math.floor(time/80)%2===0)c.globalAlpha=.62;
  const bob=reduceMotion?0:moving?Math.sin((p.walkDistance||0)/24*Math.PI)*.8:Math.sin(time*.002)*.45;
  c.shadowColor='rgba(7,11,18,.75)';c.shadowBlur=3;
  const done=sprite(c,art.pilgrim,frame,ANIMATION_FRAMES,p.x-47,p.y+(p.dodge>0?-59:-75)+bob,125,p.dodge>0?127:145,p.face<0);
  c.restore();
  if(done){
    if(p.attack>0){const cx=p.x+p.w*.5,cy=p.y+23;
      c.save();c.translate(cx,cy);if(p.face<0)c.scale(-1,1);
      c.strokeStyle=`rgba(246,207,147,${.68*(1-progress)})`;c.lineWidth=5;c.beginPath();
      c.lineWidth=p.combo===2?9:p.combo===1?4:6;
      const sweep=p.combo===1?1.35-progress*2.5:-1.35+progress*(p.combo===2?2.9:2.25);
      c.arc(0,p.combo===2?14:2,66+p.combo*9,sweep,sweep+(p.combo===2?.7:.4));c.stroke();c.restore();}
    return;
  }
  let x=p.x+p.w/2,y=p.y+p.h;let movingFallback=Math.abs(p.vx)>1&&p.grounded;let walk=movingFallback?Math.sin(time*.013)*5:0;c.save();c.translate(x,y);if(p.face<0)c.scale(-1,1);if(p.inv>0&&Math.floor(time/80)%2===0)c.globalAlpha=.55;let cape=walk*.6+Math.sin(time*.002)*3;poly(c,[[-8,-47],[-24,-37+cape],[-28,-8+cape],[-12,-12],[5,-43]],'#8d3038','#d16558',1.5);poly(c,[[-9,-17],[-13+walk,-1],[-3+walk,0],[1,-20]],'#31383c','#859092',1);poly(c,[[4,-17],[5-walk,-1],[16-walk,0],[14,-20]],'#252c33','#7b8588',1);box(c,-14,-4,13,5,'#1b2429');box(c,5,-4,13,5,'#1b2429');poly(c,[[-13,-51],[-17,-37],[-10,-18],[13,-18],[18,-37],[11,-52]],'#465158','#9ba3a0',2);poly(c,[[-11,-46],[0,-53],[12,-45],[9,-25],[-8,-25]],'#252f36','#a5a69c',1);c.fillStyle='#d89b59';c.beginPath();c.arc(0,-33,5,0,TAU);c.fill();c.fillStyle='#f7d3a0';c.fillRect(-2,-35,4,4);poly(c,[[-15,-52],[-18,-64],[-10,-78],[9,-78],[18,-65],[14,-52]],'#879294','#d1c8b4',1.5);poly(c,[[-9,-77],[-2,-87],[2,-87],[11,-77]],'#3d494e','#c2b8a6',1);poly(c,[[-12,-66],[12,-66],[9,-59],[-9,-59]],'#10181e');box(c,1,-65,8,2,'#edb0a0');poly(c,[[-17,-50],[-22,-44],[-18,-28],[-11,-31]],'#667478','#c4b8a2',1);poly(c,[[13,-50],[20,-45],[20,-30],[12,-29]],'#667478','#c4b8a2',1);if(p.attack>0){let swing=(.33-p.attack)/.33;stroke(c,14,-39,28+Math.cos(swing*3)*39,-64+Math.sin(swing*3)*34,'#e2d6b9',5);c.strokeStyle='rgba(255,198,142,.65)';c.lineWidth=5;c.beginPath();c.arc(14,-43,47,-1.4+swing*1.7,-.9+swing*1.7);c.stroke()}else{stroke(c,18,-37,34,-11,'#b6a999',4);stroke(c,17,-38,24,-31,'#d7bc89',4)}c.restore()}
function foe(c,e,time,visualMode,reduceMotion){
  const variant=bestiarySpec(e.kind);
  const bossLook=e.boss&&!variant?bossPresentation(e.kind):null;
  const im=variant?art[e.kind]:e.kind==='firstwitness'?art.firstwitness:e.kind==='sunpenitent'?art.sunpenitent:e.kind==='solarwraith'?art.solarwraith:e.kind==='ashherald'?art.ashherald:e.kind==='bellgiant'?art.bellgiant:e.kind==='hushmonk'?art.hushmonk:e.kind==='icechoir'?art.icechoir:e.kind==='icewarden'?art.icewarden:e.kind==='icewraith'?art.icewraith:e.kind==='gardener'?art.gardener:e.kind==='barkguard'?art.barkguard:e.kind==='sporeseer'?art.sporeseer:e.kind==='bride'?art.bride:e.kind==='mother'?art.mother:e.kind==='king'?art.king:e.kind==='archivist'?art.archivist:e.boss?art.warden:e.kind==='mourner'?art.mourner:e.kind==='bellkeeper'?art.bellkeeper:e.kind==='cinder'?art.cinder:e.kind==='rootguard'?art.rootguard:e.kind==='scriptor'?art.scriptor:e.kind==='saltguard'?art.saltguard:e.kind==='drowned'?art.drowned:e.kind==='sirene'?art.sirene:e.kind==='bonekeeper'?art.bonekeeper:e.kind==='exile'?art.exile:art.gravebound;
  const frame=variant?bestiaryFrame(e,time):bossLook?bossFrameProfile(e.kind,time,e):e.kind==='king'?kingFrame(e,time):e.boss?bossFrame(e,time):e.windup>0?8:e.strike>0||e.charge>0?9:e.stagger>0?7:Math.floor(time/175+e.x)%6;
  c.save();if(e.inv>0)c.globalAlpha=.56;const seaFoe=['drowned','sirene','saltguard'].includes(e.kind);c.shadowColor=variant?variant.color:seaFoe?'#7fc7c9':e.kind==='king'?'#ffdbab':e.kind==='archivist'?'#e8c49c':'rgba(232,201,164,.7)';c.shadowBlur=seaFoe?6:e.kind==='king'?12:e.kind==='archivist'?11:4;
  if(bossLook){
    c.save();
    const cx=e.x+e.w/2, base=e.y+e.h-3, pulse=.78+.12*Math.sin(time*.004);
    c.fillStyle='rgba(2,6,10,.5)';c.beginPath();c.ellipse(cx,base+3,bossLook.width*.34,8,0,0,TAU);c.fill();
    const halo=c.createRadialGradient(cx,e.y+30,8,cx,e.y+30,bossLook.width*.62);
    halo.addColorStop(0,bossLook.aura);halo.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=halo;c.fillRect(cx-bossLook.width*.7,e.y-110,bossLook.width*1.4,220);
    if(e.phase===2){c.globalAlpha=.32*pulse;c.strokeStyle=bossLook.glow;c.lineWidth=3;c.beginPath();c.arc(cx,e.y+35,bossLook.width*.48+Math.sin(time*.006)*5,0,TAU);c.stroke();}
    c.restore();
  }
  const done=variant?sprite(c,im,frame,ANIMATION_FRAMES,e.x+(e.w-variant.visualWidth*1.28)/2,e.y+e.h-variant.visualHeight*1.28,variant.visualWidth*1.28,variant.visualHeight*1.28,e.dir>0):bossLook?sprite(c,im,frame,ANIMATION_FRAMES,e.x+bossLook.dx,e.y+bossLook.dy,bossLook.width,bossLook.height,e.dir>0):sprite(c,im,frame,ANIMATION_FRAMES,e.x-(e.kind==='firstwitness'?91:e.kind==='bellgiant'?105:e.boss?66:46),e.y-(e.kind==='firstwitness'?162:e.kind==='bellgiant'?155:e.boss?93:73),e.kind==='firstwitness'?215:e.kind==='bellgiant'?244:e.boss?166:121,e.kind==='firstwitness'?238:e.kind==='bellgiant'?233:e.boss?177:145,e.dir>0);
  c.restore();if(done){
    if(variant)renderBestiaryAction(c,e,time,{lowEffects:visualMode==='performance',reducedMotion:reduceMotion});
    if(e.kind==='mourner'||e.kind==='bellkeeper'){
      const aura=c.createRadialGradient(e.x+15,e.y-8,2,e.x+15,e.y-8,74);
      aura.addColorStop(0,'rgba(145,116,202,.19)');aura.addColorStop(1,'rgba(145,116,202,0)');
      c.fillStyle=aura;c.fillRect(e.x-62,e.y-81,154,154);
    }
    if(e.windup>0){const cx=e.x+e.w/2,cy=e.y+e.h-14;
      c.save();const telegraph=bossLook?.telegraph||'rgba(245,112,87,1)';c.strokeStyle=telegraph;c.globalAlpha=.5+.25*Math.sin(time*.025);c.lineWidth=e.boss?5:3;c.beginPath();
      c.arc(cx,cy,e.kind==='mourner'?72:e.boss?58:35,Math.PI*.15,Math.PI*.85);c.stroke();
      if(!e.boss){c.fillStyle='#ffe3b6';c.textAlign='center';c.font='bold 17px sans-serif';c.fillText(e.dir===1?'▶':'◀',cx,cy-34);}
      c.restore();}
    if(e.projectile>0){c.save();const pulse=6+Math.sin(time*.019)*2;
      const g=c.createRadialGradient(e.projectileX,e.projectileY,1,e.projectileX,e.projectileY,24);
      g.addColorStop(0,variant?'#ffe6bc':'rgba(237,198,255,.92)');g.addColorStop(.27,variant?variant.color:'rgba(183,116,214,.70)');g.addColorStop(1,'rgba(100,54,145,0)');
      c.fillStyle=g;c.fillRect(e.projectileX-25,e.projectileY-25,50,50);c.strokeStyle=variant?variant.color:'#e4b9ec';c.lineWidth=2;c.beginPath();c.arc(e.projectileX,e.projectileY,pulse,0,TAU);c.stroke();c.restore()}
    if(e.boss&&e.phase===2){c.save();c.strokeStyle=bossLook?.glow||'rgba(241,83,65,.55)';c.globalAlpha=.55;c.lineWidth=3;c.beginPath();c.arc(e.x+e.w/2,e.y+30,(bossLook?.width||166)*.45+6*Math.sin(time*.01),0,TAU);c.stroke();c.restore()}
    return;
  }
  let x=e.x+e.w/2,y=e.y+e.h;c.save();c.translate(x,y);if(e.dir>0)c.scale(-1,1);if(e.inv>0)c.globalAlpha=.6;let sway=Math.sin(time*.003+x)*2;if(e.boss){c.scale(1.6,1.6);c.translate(0,-8)}poly(c,[[-16,0],[-21,-28],[-13,-51+sway],[8,-53+sway],[20,-27],[17,0]],'#30373a','#7d7770',1);poly(c,[[-16,-42],[-4,-60+sway],[10,-53],[17,-40]],'#5a4747','#a18a7b',1);poly(c,[[-12,-48],[-10,-67],[0,-77],[10,-67],[13,-48]],'#9b9586','#d3b69a',1);poly(c,[[-9,-63],[9,-63],[8,-56],[-9,-56]],'#10171a');box(c,-6,-61,4,2,'#f36e56');box(c,4,-61,4,2,'#f36e56');stroke(c,-19,-33,-25,-4,'#888178',4);stroke(c,15,-37,32,-8,'#b7a899',4);if(e.boss){poly(c,[[-22,-69],[-13,-91],[0,-80],[15,-96],[23,-68]],'#b2a18b','#e0c5a0',2);stroke(c,-34,-86,-34,-6,'#aa9581',4)}c.restore()}
export const characters=[
  {id:"maera",name:"MAERA",x:1200,description:"La historia de las siete brasas todavía no ha terminado."},
  {id:"caldris",name:"SER CALDRIS",x:3180,description:"La puerta hacia Valdren se abre para quien resiste la última campanada."},
  {id:"saint",name:"LA SANTA SIN ROSTRO",x:2460,desveloOnly:true,description:"Las voces del Sol Muerto conocen tu nombre."},
  {id:"erena",name:"VIGÍA ERENA",x:5070,description:"La campana del exilio está rota. Necesito su badajo."},
  ...REGIONAL_NPCS,FOREST_NPC,OSSARA_NPC,OSSARA_KEEPER,...SALMUERA_NPC,...SEA_NPCS,...ROOT_NPCS,...SUMMIT_NPCS,
  {id:'saintfinal',name:'SANTA SIN ROSTRO',x:40970,description:'El sol es una prisión. La luz tiene un precio.'},
  {id:'maeralast',name:'ECO DE MAERA',x:44020,desveloOnly:true,description:'La séptima brasa no se toma: se decide.'}
];
import {RELICS,SHORTCUTS} from './exploration-v34.js';
export function renderWorld(c,{W,H,ground,worldW,camera,desvelo,p,enemies,platforms,secrets,relicsFound=[],shortcutsOpened=[],tideMode,time,area=chamberAt(p.x),rootTime=time,visualMode='cinematic',reduceMotion=false}){
 const style=graphicsProfile(area,visualMode);
 c.save();
 const backdrop=[art.roomCrypt,art.roomCloister,art.roomOssuary,art.roomBell,art.roomArena,art.roomValdren,art.roomMarket,art.roomThrone,art.roomForest,art.roomEcho,art.roomRefuge,art.roomSanctuary,art.roomOssara,art.roomArchive,art.roomChoir,art.roomArchivist,art.roomHarbor,art.roomDrowned,art.roomSubmerged,art.roomTidehall,art.roomDrownedChapel,art.roomAbyssBoss,art.roomRootgate,art.roomHojaclara,art.roomInjertos,art.roomGardener,art.roomSummit,art.roomSilentCloister,art.roomSnowStairs,art.roomSnowEcho,art.roomGiant,art.roomFinalGate,art.roomFinalGallery,art.roomFinalEmbers,art.roomFinalThrone][area]||art.backdrop;
 if(ready(backdrop)) {
   // Each chamber has an independently graded original environment texture.
   const im=backdrop, viewAspect=W/H;
   const srcH=im.naturalHeight,srcW=Math.min(im.naturalWidth,srcH*viewAspect);
   const maxX=im.naturalWidth-srcW;
   const sx=Math.min(maxX,Math.max(0,(camera/(worldW-W))*maxX));
   c.drawImage(im,sx,0,srcW,srcH,0,0,W,H);
   c.fillStyle='rgba(5,11,17,.12)'; c.fillRect(0,0,W,H);
 } else {
   let sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#0e1720');sky.addColorStop(1,'#75423e');box(c,0,0,W,H,sky);
 }
 // True independent depth layers: back 0.12x, architecture 0.34x, gameplay 1x, front 1.18x.
 const layer=(im,factor,alpha=1)=>{if(!ready(im))return;const shift=isSeaRegion(area)?seaLayerShift(camera,factor,W):(camera*factor)%(W*.95);
   c.save();c.globalAlpha=alpha;c.drawImage(im,-shift,0,W,H);c.drawImage(im,W-shift,0,W,H);c.restore();};
 if(isSeaRegion(area)){
   // Maritime layers are independent resources, not crypt masonry reused at sea.
   for(const v of seaVisualPlan(area).filter(v=>v.order==='behind')){
     layer(art[v.key],v.factor,v.alpha*style.layerFactor);
   }
 }else if(area>=26){
   layer(art.snowFar,.1,.55*style.layerFactor);layer(art.snowMid,.27,.35*style.layerFactor);
 }else{
   layer(art.skyline,.12,(area<=4?.36:.67)*style.layerFactor);
   layer(art.midground,.34,(area<=4?.28:.53)*style.layerFactor);
 }
 if(area>=26){c.save();c.fillStyle=`rgba(193,219,239,${snowVisualIntensity(area)*style.snowFactor})`;for(let i=0;i<(visualMode==='performance'?12:visualMode==='clarity'?24:42);i++){const x=(i*181+Math.floor(time*.07))%W;const y=(i*127+Math.floor(time*.032))%H;c.fillRect(x,y,2,3)}c.restore()}
 if(desvelo) {c.fillStyle='rgba(118,46,92,.25)';c.fillRect(0,0,W,H)}
 // Atmospheric midground and drifting fog, kept separate from the foreground geometry.
// Fog layers separate the skyline from the traversable architecture.
for(let i=0;i<4;i++){let yy=290+i*42;let fog=c.createLinearGradient(0,yy-45,0,yy+50);fog.addColorStop(0,'rgba(146,160,161,0)');fog.addColorStop(.55,`rgba(154,160,154,${(isSeaRegion(area)?Math.min(SEA_COMBAT_FOG_MAX,.027+i*.015):.055+i*.012)*style.fogFactor})`);fog.addColorStop(1,'rgba(100,119,121,0)');box(c,0,yy-45,W,100,fog)}
if(isSeaRegion(area)){
  // Keep the lower combat lane darker than its ornate backdrop; no foreground geometry crosses sprites.
  const contrast=c.createLinearGradient(0,ground-178,0,ground+28);
  contrast.addColorStop(0,'rgba(2,12,23,0)');contrast.addColorStop(.65,'rgba(2,12,23,.15)');contrast.addColorStop(1,'rgba(2,12,23,.22)');
  box(c,0,ground-178,W,206,contrast);
}
paintChamber(c,{camera,W,H,ground,area,time,desvelo});
paintArchitecture(c,{area,start:chambers[area].start,end:chambers[area].end,ground,time,desvelo});
c.save();c.translate(-camera,0);
if(ready(art.stoneFloor)){
 for(const x of visibleTileStarts(camera,W,256))c.drawImage(art.stoneFloor,x,ground-4,256,128);
}else{box(c,camera,ground,W,H-ground,'#22292d');box(c,camera,ground,W,7,'#8d8274')}
// Stone details are painted only inside the camera viewport, not across the entire 46,600px world.
for(let x=Math.max(0,Math.floor(camera/53)*53);x<Math.min(worldW,camera+W+53);x+=53){
 if(!ready(art.stoneFloor)){stroke(c,x,ground+8,x-12,H,'#45484a',1);stroke(c,x,ground+31,x+52,ground+31,'#444549',1)}
}
if(!ready(backdrop))for(let i=0;i<11;i++){let x=i*445+185;let h=130+hash(i*2)*95;box(c,x,ground-h,25,h,'#505258');box(c,x-11,ground-h-8,48,11,'#8b8073');box(c,x-4,ground-h+8,7,h-14,'#646467');arch(c,x-32,ground-h-58,90,60,'#696568','#1c272c');poly(c,[[x-36,ground-h-54],[x+13,ground-h-100],[x+62,ground-h-54]],'#56585b','#948879',2);for(let j=0;j<3;j++)box(c,x-8+j*15,ground-h-64,9,17,'#8d8177');for(let j=0;j<4;j++){let xx=x+hash(i*23+j)*38;stroke(c,xx,ground-h+25+j*29,xx+9,ground-h+30+j*29,'#343b3f',1)}}
for(let i=0;i<13;i++){let x=i*390+105;box(c,x,ground-28,48,28,'#474649');poly(c,[[x-8,ground-28],[x+24,ground-51],[x+55,ground-28]],'#646060','#a99a84',1);stroke(c,x+24,ground-45,x+24,ground-8,'#302f35',2);stroke(c,x+12,ground-25,x+36,ground-25,'#302f35',2)}
for(let s of platforms){
 if(s.x+s.w<camera-32||s.x>camera+W+32)continue;
 if(ready(art.stonePlatform)){
   for(let xx=s.x;xx<s.x+s.w;){const len=Math.min(128,s.x+s.w-xx);c.drawImage(art.stonePlatform,0,0,len*2,64,xx,s.y,len,32);xx+=len}
 }else{box(c,s.x,s.y,s.w,19,'#5c5a59');box(c,s.x,s.y,s.w,5,'#b2a08b')}
}
for(let x of [190,2050,3510,9010,10050,11320,19180,20730,27810,29620,30820,32320,33530,34930]){box(c,x-17,ground-25,34,25,'#4e4440');box(c,x-21,ground-30,42,8,'#b49a7d');let flicker=Math.sin(time*.01+x)*6;let light=c.createRadialGradient(x,ground-57,2,x,ground-57,105);light.addColorStop(0,'rgba(255,170,75,.35)');light.addColorStop(1,'rgba(255,120,50,0)');box(c,x-110,ground-170,220,190,light);poly(c,[[x,ground-77-flicker],[x-11,ground-37],[x+12,ground-37]],'#f2a457');poly(c,[[x,ground-61-flicker*.6],[x-5,ground-37],[x+7,ground-37]],'#ffe1a0')}
// Optional lore monoliths: world-space markers for readable collectible inscriptions.
for(const x of [390,1550,2470,3410]){box(c,x-8,ground-42,16,42,'#38383c');box(c,x-12,ground-45,24,6,'#82766b');stroke(c,x,ground-40,x,ground-16,'#bb8d71',2);box(c,x-3,ground-31,6,3,'#d7ae86')}
if(area>=31){
 for(const seal of SOLAR_SEALS){if(chamberAt(seal.x)!==area)continue;
  const glow=desvelo?.78+.22*Math.sin(time*.004+seal.id):.28;
  c.save();c.globalAlpha=glow;
  c.strokeStyle=desvelo?'#fff0bb':'#9b7a70';c.lineWidth=5;
  c.beginPath();c.arc(seal.x,ground-154,50,Math.PI,Math.PI*2);c.stroke();
  c.fillStyle='#352a31';c.fillRect(seal.x-34,ground-130,68,125);
  c.fillStyle=desvelo?'#ffe2a3':'#ad8974';c.font='bold 23px Georgia';c.textAlign='center';c.fillText(['I','II','III'][seal.id],seal.x,ground-61);
  c.font='13px Georgia';c.fillText(seal.name,seal.x,ground-35);c.textAlign='left';c.restore();
 }
 if(area===34){const xx=46160;c.save();c.strokeStyle=desvelo?'#ffdcaa':'#b7856f';c.lineWidth=7;c.beginPath();c.arc(xx,ground-152,69,Math.PI,Math.PI*2);c.stroke();c.fillStyle='#51343a';c.fillRect(xx-42,ground-119,84,118);c.fillStyle='#d8a679';c.fillRect(xx-12,ground-77,24,54);c.restore()}
}
if(area>=28){for(const r of RESONATORS){if(chamberAt(r.x)!==area)continue;const glow=.45+.25*Math.sin(time*.004+r.id);c.save();c.strokeStyle=desvelo?`rgba(178,238,252,${glow})`:'#758fa8';c.lineWidth=5;c.beginPath();c.arc(r.x,ground-117,33,Math.PI,Math.PI*2);c.stroke();c.fillStyle='#243745';c.fillRect(r.x-29,ground-102,58,102);c.strokeStyle=desvelo?'#e2f5ef':'#9eb0b6';c.strokeRect(r.x-29,ground-102,58,102);c.fillStyle=desvelo?'#d7ffff':'#aec3cb';c.textAlign='center';c.font='bold 22px Georgia';c.fillText(['I','II','III'][r.id],r.x,ground-49);c.textAlign='left';c.restore()}}if(area===27){const x=SUMMIT_MEMORY_X;c.save();c.fillStyle=desvelo?'#cdefff':'#809eab';c.fillRect(x-23,ground-125,46,109);c.fillStyle='#142b3c';c.fillRect(x-15,ground-115,30,75);c.strokeStyle=desvelo?'#d7fff3':'#90a9b9';c.lineWidth=3;c.beginPath();c.arc(x,ground-113,22,Math.PI,0);c.stroke();c.restore()}
if(area===17){const x=TIDE_MEMORY_X;const glow=desvelo?(.48+.28*Math.sin(time*.005)):.23;c.fillStyle=`rgba(98,207,206,${glow})`;c.fillRect(x-27,ground-113,54,95);c.strokeStyle=desvelo?'#d8efe5':'#64888a';c.lineWidth=4;c.beginPath();c.arc(x,ground-113,24,Math.PI,Math.PI*2);c.stroke();c.fillStyle='#bfb7a3';c.fillRect(x-14,ground-80,28,42)}
if(area===7){const sx=8090; c.fillStyle='#281f24';c.fillRect(sx-43,ground-22,87,22);c.strokeStyle='#b67d65';c.strokeRect(sx-43,ground-22,87,22)}
if(area===12){const x=14630;c.strokeStyle=desvelo?'#eedec8':'#73716b';c.lineWidth=6;c.strokeRect(x-19,ground-137,38,131);c.fillStyle=desvelo?'rgba(233,211,177,.45)':'rgba(145,139,129,.25)';c.fillRect(x-17,ground-133,34,125)}
if(area===9 && desvelo){const x=FOREST_RELIC_X;const pulse=.43+.24*Math.sin(time*.008);box(c,x-23,ground-100,46,100,`rgba(175,124,199,${pulse})`);box(c,x-13,ground-90,26,70,'#d7bde6')}
if(area===10){for(const [j,x] of [11395,11715,12015].entries()){const on=desvelo;c.strokeStyle=on?'#dcafe0':'#63776a';c.lineWidth=4;c.beginPath();c.arc(x,ground-73,24,0,Math.PI*2);c.stroke();c.fillStyle=on?'#f4cee8':'#7a8376';c.font='bold 22px Georgia';c.textAlign='center';c.fillText(['I','II','III'][j],x,ground-66);c.textAlign='left'}}if(area===5 && desvelo){const x=6060;const a=.35+.35*Math.sin(time*.005);box(c,x-18,ground-66,36,60,`rgba(245,158,85,${a})`);box(c,x-9,ground-53,18,37,'#e6ba7f')}
for(let s of secrets)if(desvelo&&!s.taken){let a=.5+.5*Math.sin(time*.004);box(c,s.x-11,ground-57,22,29,`rgba(227,151,137,${a})`);box(c,s.x-5,ground-68,10,11,'#f0d4b7')}
// Relicarios y rutas opcionales se dibujan en coordenadas del mundo, antes de personajes.
for(const relic of RELICS){if(relic.area!==area||relicsFound.includes(relic.id)||Math.abs(relic.x-camera)>W+85)continue;const glow=desvelo?.72+.13*Math.sin(time*.005):.20;
 c.save();c.globalAlpha=glow;c.strokeStyle=desvelo?'#f5d29c':'#85726b';c.lineWidth=3;c.beginPath();c.arc(relic.x,ground-67,17,0,Math.PI*2);c.stroke();c.fillStyle='#34292c';c.fillRect(relic.x-11,ground-53,22,53);c.fillStyle=desvelo?'#ffd58b':'#b7a18e';c.beginPath();c.moveTo(relic.x,ground-96);c.lineTo(relic.x+9,ground-69);c.lineTo(relic.x,ground-60);c.lineTo(relic.x-9,ground-69);c.closePath();c.fill();c.restore()}
for(const path of SHORTCUTS){const x=chamberAt(path.a)===area?path.a:chamberAt(path.b)===area?path.b:null;if(x===null||Math.abs(x-camera)>W+110)continue;const open=shortcutsOpened.includes(path.id);
 c.save();c.globalAlpha=open?.72:desvelo?.50:.12;c.strokeStyle=open?'#c8eac4':'#caa487';c.lineWidth=6;c.beginPath();c.arc(x,ground-91,41,Math.PI,Math.PI*2);c.stroke();c.fillStyle=open?'#9fcab1':'#665868';c.fillRect(x-7,ground-84,14,73);c.restore()}
// Forbidden epitaphs are visible in the actual playable scene, not just the HUD.
for(const seal of OSSARA_SEALS){if(chamberAt(seal.x)!==area)continue;
 c.save();const pulse=.55+.25*Math.sin(time*.0024+seal.id);
 c.fillStyle='#29262d';c.fillRect(seal.x-29,ground-91,58,91);
 c.strokeStyle=desvelo?'#d5b0ef':'#978c7e';c.lineWidth=3;c.strokeRect(seal.x-29,ground-91,58,91);
 c.fillStyle=desvelo?`rgba(224,181,238,${pulse})`:'#8e8179';c.font='bold 24px Georgia';c.textAlign='center';c.fillText(['I','II','III'][seal.id],seal.x,ground-45);
 c.font='11px Georgia';c.fillText(seal.name,seal.x,ground-20);c.textAlign='left';c.restore();}
paintSeaObjects(c,{area,camera:0,ground,tide:tideMode,desvelo,time});
paintRootsObjects(c,{area,ground,desvelo,time:rootTime});
// New original pixel-art NPCs: visible in appropriate rooms, and Saint only through Desvelo.
for(const n of characters){if(chamberAt(n.x)!==area || (n.desveloOnly&&!desvelo))continue;
  const walkFrame=4+Math.floor(time/800+n.x)%2;
  const near=Math.abs(p.x-n.x)<100;
  c.save();if(n.desveloOnly)c.globalAlpha=.75+.15*Math.sin(time*.004);
  sprite(c,art[n.id]||art.maera,walkFrame,ANIMATION_FRAMES,n.x-40,ground-118,84,119,false);
  c.restore();
  if(near){c.save();c.fillStyle='#eed3a6';c.font='bold 14px Georgia';c.textAlign='center';c.fillText(n.name,n.x,ground-132);c.restore()}
}
for(let e of enemies){if(e.alive)foe(c,e,time,visualMode,reduceMotion);else if(e.death>0){c.save();c.globalAlpha=Math.min(1,e.death*1.5);
  if(bestiarySpec(e.kind) && ready(art[e.kind])){const variant=bestiarySpec(e.kind);const index=Math.min(19,17+Math.floor((1-e.death/1.05)*3));sprite(c,art[e.kind],index,ANIMATION_FRAMES,e.deathX+(e.w-variant.visualWidth*1.28)/2,e.deathY+e.h-variant.visualHeight*1.28,variant.visualWidth*1.28,variant.visualHeight*1.28,e.dir>0)}
  else {const im=art[e.kind]||(e.boss?art.warden:art.gravebound);if(ready(im)){const giant=e.kind==='bellgiant',w=e.kind==='firstwitness'?215:giant?244:e.boss?166:121,h=e.kind==='firstwitness'?238:giant?233:e.boss?177:145;const x=e.deathX-(e.kind==='firstwitness'?91:giant?105:e.boss?66:46),y=e.deathY-(e.kind==='firstwitness'?162:giant?155:e.boss?93:73);sprite(c,im,deathFrame(e.death),ANIMATION_FRAMES,x,y,w,h,e.dir>0)}else{c.fillStyle='#805d64';c.beginPath();c.ellipse(e.deathX+15,ground-5,32+(1-e.death)*35,8,0,0,Math.PI*2);c.fill()}}c.restore()}}
// Contact shadow gives player a clear plane against ornate backgrounds.
if(p.grounded){c.save();c.fillStyle='rgba(2,8,11,.34)';c.beginPath();c.ellipse(p.x+p.w/2,ground+2,35,6,0,0,TAU);c.fill();c.restore()}
knight(c,p,time,reduceMotion);
// foreground arches and twisted silhouettes frame the action without obscuring the player.
if(!ready(backdrop))for(let i=0;i<(area===7||area>=8?0:10);i++){let x=i*580-65;box(c,x,ground-250,22,250,'#1c2429');box(c,x-9,ground-256,39,11,'#31373a');poly(c,[[x-24,ground-254],[x+10,ground-310],[x+46,ground-254]],'#222a2e');for(let j=0;j<3;j++)stroke(c,x+4,ground-190+j*48,x+16,ground-202+j*48,'#3e4243',2)}c.restore();
 // Vegetation close to the virtual camera runs at 1.18x; kept translucent for combat readability.
 if(isSeaRegion(area)){
   // Sea spray is restricted to the bottom of the viewport, below the sprite silhouettes.
   const foreground=art.seaFoam;
   if(ready(foreground)){
     const v=seaVisualPlan(area).find(v=>v.order==='front');
     const shift=seaLayerShift(camera,v.factor,W);
     c.save();c.globalAlpha=v.alpha*style.foregroundFactor;
     c.drawImage(foreground,-shift,0,W,H);c.drawImage(foreground,W-shift,0,W,H);c.restore();
   }
 }else if(ready(art.foreground)){const shift=(camera*1.18)%(W*.95);c.save();c.globalAlpha=(area>=7?.075:.22)*style.foregroundFactor;
   c.drawImage(art.foreground,-shift,0,W,H);c.drawImage(art.foreground,W-shift,0,W,H);c.restore();}
// Dynamic emissive lighting: limited to the active room, fully optional Canvas gradients.
const lights=[...([190,2050,3510,5140,6570,7580,9010,10050,11320,13680,19180,20730,27810,29620,30820,32320,33530,34930,41070,42500,43930,45200].filter(x=>chamberAt(x)===area).map(x=>({x:x-camera,y:ground-55,r:145,color:'240,166,100'}))),
 {x:p.x-camera+p.w/2,y:p.y+29,r:72,color:desvelo?'176,118,230':'200,153,112'}];
for(const l of (style.glowFactor>0?lights:[])){const flicker=1+.035*Math.sin(time*.013+l.x);const rr=l.r*flicker;
 const glow=c.createRadialGradient(l.x,l.y,1,l.x,l.y,rr);
 glow.addColorStop(0,`rgba(${l.color},${.24*style.glowFactor})`);glow.addColorStop(.38,`rgba(${l.color},${.09*style.glowFactor})`);glow.addColorStop(1,`rgba(${l.color},0)`);
 c.fillStyle=glow;c.fillRect(l.x-rr,l.y-rr,rr*2,rr*2);
}
// Cinematic grain, drifting dust and vignette.
for(let i=0;i<style.dustCount;i++){let x=(hash(i*13)*W+time*(.004+hash(i)*.009))%W,y=hash(i*21+5)*H;box(c,x,y,1.3,1.3,i%5?'rgba(200,179,150,.13)':'rgba(239,171,119,.24)')}
let vignette=c.createRadialGradient(W/2,H/2,160,W/2,H/2,590);vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,`rgba(0,0,0,${style.vignette})`);box(c,0,0,W,H,vignette);c.restore()}
function w(l,i){return 64+l*13+hash(i*6+l)*25}
