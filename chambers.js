// Five physically gated chambers, drawn and traversed in one persistent world coordinate space.
// All positions are world-space; connections require a deliberate interaction.
export const chambers = [
 {name:'Cripta de los Peregrinos',start:0,end:900,story:'Los muertos descansan de pie. Algunos todavía escuchan la campana.',tint:'#75838c',motif:'crypt'},
 {name:'Claustro en Ruinas',start:900,end:1850,story:'Las estatuas del claustro tienen sus rostros borrados.',tint:'#657c71',motif:'cloister'},
 {name:'Osario Menor',start:1850,end:2820,story:'Los nombres fueron borrados antes de quemar los cuerpos.',tint:'#a19477',motif:'ossuary'},
 {name:'Campanario Caído',start:2820,end:3900,story:'La campana suena únicamente cuando el mundo recuerda.',tint:'#6a7194',motif:'bell'},
 {name:'Fosa del Guardián',start:3900,end:4900,story:'La puerta exige el último recuerdo del Guardián de la Fosa.',tint:'#9d5752',motif:'arena'},
 {name:'Valdren · Murallas del Exilio',start:4900,end:6350,story:'Fuera del osario, los exiliados custodian una campana que nadie puede tocar.',tint:'#8b5553',motif:'valdren'},
 {name:'Valdren · Barrio de los Tizones',start:6350,end:7450,story:'La ceniza cubre los mercados. Los vivos temen a su propia guardia.',tint:'#a07855',motif:'market'},
 {name:'Valdren · Plaza de las Exequias',start:7450,end:8800,story:'Nueve campanas rodean el trono del Rey de las Nueve Exequias.',tint:'#82414d',motif:'throne'},
 {name:'Bosque de las Voces · Sendero de Raíces',start:8800,end:9900,story:'Los árboles llevan nombres enterrados en su corteza. Una voz llama desde Brezaluna.',tint:'#496e60',motif:'forest'},
 {name:'Bosque de las Voces · Arboleda del Eco',start:9900,end:11050,story:'Las raíces recuerdan incluso a aquellos que fueron borrados del tiempo.',tint:'#6d5978',motif:'echo'},
 {name:'Bosque de las Voces · Refugio de las Luciérnagas',start:11050,end:12200,story:'Un refugio entre troncos huecos donde incluso los nombres perdidos encuentran descanso.',tint:'#6b937c',motif:'refuge'},
 {name:'Bosque de las Voces · Santuario de los Mil Nombres',start:12200,end:13500,story:'Tres voces abren la corteza. La Madre espera bajo el altar viviente.',tint:'#8a6e99',motif:'sanctuary'},
 {name:'Ossara · Atrio de los Huesos',start:13500,end:15000,story:'Un corredor de estatuas y osamentas conduce hacia la Catedral de Huesos. Los nombres aquí se escriben en piedra.',tint:'#9e9b87',motif:'ossara'},
 {name:'Ossara · Archivo de las Ausencias',start:15000,end:16400,story:'En los anaqueles se guardan nombres que nunca debieron pronunciarse.',tint:'#817d76',motif:'archive'},
 {name:'Ossara · Coro de los Sin Nombre',start:16400,end:17700,story:'Tres epitafios cantan donde antes hubo voces humanas.',tint:'#706c83',motif:'choir'},
 {name:'Ossara · Cámara del Archivero',start:17700,end:19000,story:'El Archivero Ciego escribe con los huesos de quienes olvidaron su nombre.',tint:'#a78e79',motif:'archiveboss'},
 {name:'Salmuera · Puerto de las Campanas',start:19000,end:20500,story:'Los muelles vacíos emergen de una pleamar inmóvil. Una farera vigila la costa que ha perdido su nombre.',tint:'#4e8590',motif:'harbor'},
 {name:'Salmuera · Muelle Hundido',start:20500,end:22000,story:'Bajo los tablones, una campana ahogada todavía recuerda el último barco.',tint:'#547e88',motif:'drowned'},
 {name:'Salmuera · Galerías Sumergidas',start:22000,end:23400,story:'En las galerías sin aire se retienen los nombres de los ahogados. Las compuertas regulan la pleamar.',tint:'#267a83',motif:'submerged'},
 {name:'Salmuera · Sala de las Compuertas',start:23400,end:24700,story:'El órgano de sal necesita una marea alta para escuchar el segundo eco.',tint:'#377b83',motif:'tidehall'},
 {name:'Salmuera · Capilla de los Ahogados',start:24700,end:26000,story:'Los nombres de los muertos están escritos en las velas. Solo la bajamar libera la promesa.',tint:'#5d8591',motif:'drownedchapel'},
 {name:'Salmuera · Trono de la Novia',start:26000,end:27400,story:'En el altar hundido, la Novia del Abismo protege el nombre que nadie se atrevió a recordar.',tint:'#2d7183',motif:'abyssboss'},
 {name:'Raíces Eternas · Umbral de la Savia',start:27400,end:28900,story:'Las raíces levantan sus arcos bajo un cielo que jamás amanece. Los árboles han aprendido a caminar.',tint:'#62826c',motif:'rootgate'},
 {name:'Hojaclara · Aldea de la Corteza',start:28900,end:30350,story:'Las casas crecen en troncos vivos. Bajo las puertas aún susurran los desaparecidos.',tint:'#9c9062',motif:'rootvillage'},
 {name:'Raíces Eternas · Jardín de los Injertos',start:30350,end:31750,story:'Tres nervaduras guardan el umbral del Jardinero. Solo Desvelo reconoce las voces.',tint:'#97738a',motif:'rootgarden'},
 {name:'Raíces Eternas · Invernadero de Carne',start:31750,end:33250,story:'En este santuario los cuerpos se injertan en raíces eternas. El Jardinero escucha el último nombre.',tint:'#8e545a',motif:'rootboss'},
 {name:'Cumbres del Silencio · Paso de los Ecos',start:33250,end:34700,story:'Las campanas están enterradas bajo nieve que no cae del cielo.',tint:'#7394a2',motif:'snowpass'},
 {name:'Cumbres del Silencio · Monasterio del Hielo Inmóvil',start:34700,end:36200,story:'Los peregrinos entregaron sus últimas palabras al hielo. Solo Desvelo puede devolverles su voz.',tint:'#879eab',motif:'snowmonastery'},
 {name:'Cumbres del Silencio · Escalinata de las Campanas',start:36200,end:37600,story:'Las campanas suspendidas en el acantilado suenan solo para quienes miran en Desvelo.',tint:'#769db0',motif:'snowstairs'},
 {name:'Cumbres del Silencio · Observatorio del Eco',start:37600,end:39000,story:'Tres resonadores ordenan las últimas palabras de un pueblo sepultado.',tint:'#8d9fb4',motif:'snowobservatory'},
 {name:'Cumbres del Silencio · Santuario del Gigante',start:39000,end:40700,story:'Una catedral sobre los hombros de un gigante que escucha hasta los nombres enterrados.',tint:'#739aa8',motif:'snowgiant'},
 {name:'Trono del Sol Muerto · Umbral de la Santa',start:40700,end:42000,story:'Las seis brasas iluminan los peldaños de un cielo convertido en cárcel.',tint:'#b56a60',motif:'finalgate'},
 {name:'Trono del Sol Muerto · Galería de los Soles Rotos',start:42000,end:43300,story:'En cada sol fragmentado duerme una versión del mundo que nunca nació.',tint:'#ae6763',motif:'finalgallery'},
 {name:'Trono del Sol Muerto · Altar de las Siete Brasas',start:43300,end:44800,story:'Tres verdades abren la última cerradura: Nombre, Prisión y Testigo.',tint:'#b38a6a',motif:'finalembers'},
 {name:'Trono del Sol Muerto · Cámara del Primer Testigo',start:44800,end:46600,story:'La luz era una celda. Ahora alguien debe decidir si permanece cerrada.',tint:'#bc6555',motif:'finalthrone'}
];
export function chamberAt(x){const found=chambers.findIndex(c=>x>=c.start&&x<c.end);return found<0?(x<0?0:chambers.length-1):found}
export function portalFor(x, chamberIndex, radius=78){
 const chamber=chambers[chamberIndex];
 if(chamberIndex>0 && Math.abs(x-(chamber.start+40))<=radius)return {direction:-1,destination:chambers[chamberIndex-1].end-130};
 if(chamberIndex<chambers.length-1 && Math.abs(x-(chamber.end-60))<=radius)return {direction:1,destination:chambers[chamberIndex+1].start+95};
 return null;
}
export function chamberCamera(x,chamberIndex,viewportWidth){
 const chamber=chambers[chamberIndex];return Math.max(chamber.start,Math.min(chamber.end-viewportWidth,x-viewportWidth*.36));
}
export function paintChamber(c,{camera,W,H,ground,area,time,desvelo}){
 const z=chambers[area];
 c.save();c.translate(-camera,0);
 // Distinct architectural composition and atmospheric color for each chamber.
 c.globalAlpha=area>=16&&area<=21?.075:area>=31?.045:area>=26?.055:z.motif.startsWith('root')?.05:.085;c.fillStyle=z.tint;c.fillRect(z.start,0,z.end-z.start,ground);
 // Keep decorative arches behind the action; the illustrated backdrop remains readable.
 c.globalAlpha=area>=31?.085:area>=16&&area<=21?.09:area>=26?.095:.095;
 const drawArch=(x,w=150,h=240)=>{c.save();c.fillStyle='#252d32';c.fillRect(x,ground-h+42,w,h-42);c.fillStyle='#0a171b';c.beginPath();c.moveTo(x+17,ground);c.lineTo(x+17,ground-h+74);c.quadraticCurveTo(x+w/2,ground-h-30,x+w-17,ground-h+74);c.lineTo(x+w-17,ground);c.closePath();c.fill();c.strokeStyle=z.tint;c.lineWidth=4;c.stroke();c.restore()};
 for(let x=z.start+170;x<z.end-80;x+=270){
  if(z.motif.startsWith('final')){
   drawArch(x,195,z.motif==='finalthrone'?390:320);
   c.strokeStyle=desvelo?'#e4bc9c':'#a6756c';c.lineWidth=5;
   c.beginPath();c.arc(x+95,ground-200,z.motif==='finalthrone'?92:64,Math.PI,Math.PI*2);c.stroke();
   c.fillStyle='#301d27';c.fillRect(x+56,ground-162,76,90);
   for(let q=0;q<6;q++){const theta=q*Math.PI/3;c.strokeStyle='#d49c6c';c.lineWidth=3;c.beginPath();c.moveTo(x+95+Math.cos(theta)*44,ground-210+Math.sin(theta)*44);c.lineTo(x+95+Math.cos(theta)*62,ground-210+Math.sin(theta)*62);c.stroke()}
   c.fillStyle='#b18568';c.fillRect(x+80,ground-128,28,6);
  }else if(['snowpass','snowmonastery','snowstairs','snowobservatory','snowgiant'].includes(z.motif)){
   drawArch(x,175,z.motif==='snowgiant'?410:z.motif==='snowobservatory'?370:z.motif==='snowmonastery'?345:275);
   c.fillStyle='#b4c8cd';c.fillRect(x-12,ground-24,195,7);
   c.strokeStyle='#a9cbd3';c.lineWidth=5;c.beginPath();c.moveTo(x+83,ground-220);c.lineTo(x+83,ground-160);c.stroke();
   c.fillStyle='#c2e8f3';c.beginPath();c.arc(x+83,ground-148,8,0,Math.PI*2);c.fill();
  }else if(z.motif==='crypt'||z.motif==='cloister'){
   drawArch(x,145,z.motif==='crypt'?248:285);
   if(z.motif==='cloister'){c.fillStyle='#4b6159';c.fillRect(x+70,ground-140,7,122);c.fillStyle='#637b68';c.fillRect(x+46,ground-37,60,10)}
  }else if(z.motif==='ossuary'){
   c.fillStyle='#383533';c.fillRect(x,ground-188,155,188);
   for(let row=0;row<4;row++)for(let col=0;col<4;col++){const xx=x+20+col*34,yy=ground-167+row*39;c.fillStyle='#afa38c';c.beginPath();c.arc(xx,yy,9,Math.PI,0);c.lineTo(xx+9,yy+9);c.lineTo(xx-9,yy+9);c.closePath();c.fill();c.fillStyle='#242426';c.fillRect(xx-5,yy,3,4);c.fillRect(xx+3,yy,3,4)}
  }else if(z.motif==='bell'){
   drawArch(x,170,325);c.strokeStyle='#857c84';c.lineWidth=3;c.beginPath();c.moveTo(x+85,ground-290);c.lineTo(x+85,ground-240);c.stroke();c.fillStyle='#746a66';c.beginPath();c.moveTo(x+55,ground-236);c.quadraticCurveTo(x+85,ground-285,x+115,ground-236);c.lineTo(x+125,ground-210);c.lineTo(x+45,ground-210);c.closePath();c.fill();
  }else if(['forest','echo','refuge','sanctuary'].includes(z.motif)){
   c.fillStyle=z.motif==='forest'?'#172c29':'#252139';c.fillRect(x+20,ground-280,35,280);
   c.strokeStyle=z.motif==='forest'?'#52766a':'#947ba9';c.lineWidth=11;c.beginPath();c.moveTo(x+37,ground-200);c.lineTo(x-35,ground-320);c.moveTo(x+37,ground-240);c.lineTo(x+145,ground-350);c.stroke();
   for(let n=0;n<5;n++){c.fillStyle=n%2?'#344f45':'#264138';c.beginPath();c.arc(x+37+(n-2)*24,ground-335+(n%2)*22,43,0,Math.PI*2);c.fill()}
   if(z.motif==='refuge'){c.fillStyle='#d7ba76';c.beginPath();c.arc(x+85,ground-132,13+5*Math.sin(time*.003+x),0,Math.PI*2);c.fill();c.fillStyle='#9b7d52';c.fillRect(x-10,ground-20,85,9)}if(z.motif==='sanctuary'){c.strokeStyle='#c39ac4';c.lineWidth=5;c.beginPath();c.arc(x+45,ground-185,63,Math.PI,Math.PI*2);c.stroke()}if(z.motif==='echo'){c.fillStyle=desvelo?'#d5aad7':'#82658c';c.fillRect(x+29,ground-173,8,52)}
  }else if(['archive','choir','archiveboss'].includes(z.motif)){
   drawArch(x,190,z.motif==='archiveboss'?390:330);
   c.fillStyle='#443c38';c.fillRect(x+30,ground-180,130,145);
   for(let row=0;row<5;row++){c.fillStyle=row%2?'#ae9e82':'#6e605c';c.fillRect(x+38,ground-165+row*26,114,5);for(let col=0;col<5;col++){c.fillStyle=col%2?'#857e73':'#c2ad93';c.fillRect(x+42+col*20,ground-181+row*26,12,13)}}
   if(z.motif==='choir'){c.strokeStyle=desvelo?'#d7beec':'#84818b';c.lineWidth=4;c.beginPath();c.arc(x+93,ground-205,56,Math.PI,Math.PI*2);c.stroke()}
   if(z.motif==='archiveboss'){c.fillStyle='#9b7a57';c.fillRect(x+88,ground-280,7,120)}
  }else if(z.motif==='ossara'){
   drawArch(x,185,335);c.strokeStyle='#bfb69b';c.lineWidth=4;for(let j=0;j<5;j++){const xx=x+27+j*28;c.beginPath();c.arc(xx,ground-164,10,Math.PI,Math.PI*2);c.stroke();c.fillStyle='#c5b9a3';c.fillRect(xx-6,ground-160,12,18)}c.fillStyle='#6c655c';c.fillRect(x+40,ground-92,96,24);
  }else if(z.motif==='harbor'||z.motif==='drowned'){
   drawArch(x,190,z.motif==='drowned'?295:270);
   c.strokeStyle='#659ba4';c.lineWidth=6; c.beginPath();c.moveTo(x+12,ground-102);c.lineTo(x+160,ground-102);c.stroke();
   c.fillStyle='#4a555a';c.fillRect(x-8,ground-38,210,13);
   c.strokeStyle='#ad8b6b';c.lineWidth=3;for(let k=0;k<4;k++){c.beginPath();c.moveTo(x+15+k*43,ground-130);c.lineTo(x+15+k*43,ground-25);c.stroke()}
   if(z.motif==='drowned'){c.strokeStyle=desvelo?'#b1e5df':'#54858d';c.lineWidth=4;c.beginPath();c.arc(x+93,ground-178,42,0,Math.PI*2);c.stroke()}
  }else if(['submerged','tidehall','drownedchapel','abyssboss'].includes(z.motif)){
   drawArch(x,220,z.motif==='abyssboss'?420:340);
   c.fillStyle='#32636c';c.fillRect(x+28,ground-126,162,14);
   c.strokeStyle='#88a9a1';c.lineWidth=3;for(let k=0;k<4;k++){c.beginPath();c.arc(x+40+k*44,ground-144,14,Math.PI,Math.PI*2);c.stroke()}
   if(z.motif==='tidehall'){c.strokeStyle='#c5ad83';c.lineWidth=6;c.beginPath();c.arc(x+109,ground-235,58,0,Math.PI*2);c.stroke()}
   if(z.motif==='abyssboss'){c.fillStyle='#537785';c.fillRect(x+90,ground-300,22,150);c.strokeStyle='#b7d4d3';c.lineWidth=4;c.beginPath();c.arc(x+100,ground-300,55,Math.PI,Math.PI*2);c.stroke()}
  }else if(['rootgate','rootvillage','rootgarden','rootboss'].includes(z.motif)){
   drawArch(x,190,z.motif==='rootboss'?375:300);
   c.strokeStyle=z.motif==='rootboss'?'#a55e60':'#658b6b';c.lineWidth=14;
   c.beginPath();c.moveTo(x+28,ground);c.bezierCurveTo(x+55,ground-105,x-30,ground-200,x+78,ground-310);
   c.moveTo(x+140,ground);c.bezierCurveTo(x+130,ground-125,x+210,ground-210,x+95,ground-310);c.stroke();
   c.strokeStyle='#b9a787';c.lineWidth=3;for(let q=0;q<4;q++){c.beginPath();c.moveTo(x+47+q*23,ground-150);c.lineTo(x+55+q*21,ground-178);c.stroke()}
   if(z.motif==='rootvillage'){c.fillStyle='#6e5946';c.fillRect(x+42,ground-109,92,93);c.fillStyle='#a38f69';c.beginPath();c.moveTo(x+35,ground-110);c.lineTo(x+85,ground-163);c.lineTo(x+143,ground-110);c.fill()}
   if(z.motif==='rootgarden'){c.strokeStyle=desvelo?'#efc3d8':'#766a6e';c.lineWidth=6;c.beginPath();c.arc(x+93,ground-195,48,Math.PI,2*Math.PI);c.stroke()}
   if(z.motif==='rootboss'){c.fillStyle='#643a44';c.fillRect(x+76,ground-220,36,138)}
  }else if(z.motif==='market'){
   drawArch(x,165,245);c.fillStyle='#604a41';c.fillRect(x+9,ground-133,140,75);c.fillStyle='#a1574a';c.beginPath();c.moveTo(x,ground-135);c.lineTo(x+75,ground-181);c.lineTo(x+157,ground-135);c.fill();
  }else if(z.motif==='throne'){
   drawArch(x,210,350);c.strokeStyle='#bc7d69';c.lineWidth=5;for(let k=0;k<3;k++){c.beginPath();c.arc(x+105,ground-200,35+k*19,3.4,6.1);c.stroke()}
  }else if(z.motif==='valdren'){
   drawArch(x,182,335);c.fillStyle='#56444a';c.fillRect(x+38,ground-325,85,43);
   c.fillStyle='#9d514b';c.fillRect(x+110,ground-247,20,88);
   c.strokeStyle='#ba8b70';c.lineWidth=3;c.strokeRect(x+107,ground-252,25,92);
  }else{
   drawArch(x,190,315);c.strokeStyle='#893f3e';c.lineWidth=6;c.beginPath();c.arc(x+90,ground-190,38,0,Math.PI*2);c.stroke();
  }
 }
 c.globalAlpha=.46;
 // Solid visual portals correspond to the same coordinates as the collision barriers.
 for(const boundary of [z.start,z.end]){
  if(boundary<=0||boundary>=chambers[chambers.length-1].end)continue;
  const bx=boundary-11;const grad=c.createLinearGradient(bx,ground-185,bx+22,ground);
  grad.addColorStop(0,'#b69c83');grad.addColorStop(.5,'#352c32');grad.addColorStop(1,'#a28b78');
  c.fillStyle=grad;c.fillRect(bx,ground-182,22,182);
  c.fillStyle=desvelo?'#9f7193':'#ad8260';c.fillRect(bx+7,ground-100,8,15);
  c.strokeStyle='#bba383';c.lineWidth=4;c.strokeRect(bx-12,ground-202,46,208);
 }
 // Local glows, time-based pulsing for environmental feedback.
 c.globalAlpha=.1+.04*Math.sin(time*.0012);c.fillStyle=desvelo?'#b688de':z.tint;c.fillRect(z.start,ground-160,z.end-z.start,160);
 c.restore();
}
