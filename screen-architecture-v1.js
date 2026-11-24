// Hand-authored screen beats. These are deliberately fixed: no procedural room roulette.
// Each chamber is split into three readable acts without changing zone/save indices.
const ACTS=Object.freeze(['arrival','pressure','reveal']);
const MOTIFS=Object.freeze([
 ['threshold','pillars','altar'],['gallery','balcony','collapsed'],['ossuary','niche','bonegate'],
 ['bellarch','chains','brokenbell'],['arena','pillars','seal'],['market','watchtower','forge'],
 ['market','alley','thronegate'],['procession','stairs','kinghall'],['roots','hollow','memorytree'],
 ['roots','bridge','echoaltar'],['refuge','lanterns','sanctuary'],['roots','sigils','mothergate'],
 ['ossuary','statues','bonegate'],['archive','shelves','forbidden'],['choir','choirloft','epitaph'],
 ['archive','turntable','archivearena'],['harbor','piers','foghorn'],['drowned','wreck','bellchain'],
 ['underwater','sluice','airwell'],['sluice','organ','floodgate'],['chapel','candles','tidealtar'],
 ['abyss','trident','bridealtar'],['roots','arches','sapgate'],['village','houses','livingdoor'],
 ['garden','trellis','graftgate'],['greenhouse','tanks','gardenarena'],['snow','markers','echoarch'],
 ['cloister','icepillars','silentdoor'],['snow','stairs','bellcliff'],['observatory','resonators','skybridge'],
 ['giant','cathedral','giantarena'],['solar','stairs','sunlock'],['gallery','fragments','solcorridor'],
 ['altar','embers','decisiongate'],['throne','sols','witnessarena']
]);
export const SCREEN_ARCHITECTURE=Object.freeze(MOTIFS.map((m,area)=>Object.freeze({area,acts:Object.freeze(m.map((kind,i)=>Object.freeze({kind,act:ACTS[i],anchor:i/3}))) })));
export function architectureAt(area,x,start,end){const width=end-start;const index=Math.max(0,Math.min(2,Math.floor(((x-start)/width)*3)));return SCREEN_ARCHITECTURE[area]?.acts[index]||null}

function box(c,x,y,w,h,fill,stroke=null){c.fillStyle=fill;c.fillRect(x,y,w,h);if(stroke){c.strokeStyle=stroke;c.lineWidth=3;c.strokeRect(x,y,w,h)}}
function arch(c,x,ground,w,h,fill,trim){c.fillStyle=fill;c.beginPath();c.moveTo(x,ground);c.lineTo(x,ground-h*.42);c.quadraticCurveTo(x+w*.5,ground-h,x+w,ground-h*.42);c.lineTo(x+w,ground);c.fill();c.strokeStyle=trim;c.lineWidth=4;c.stroke()}
export function paintArchitecture(c,{area,start,end,ground,time,desvelo}){
 const beat=SCREEN_ARCHITECTURE[area];if(!beat)return;const width=end-start;
 c.save();c.translate(0,0);
 beat.acts.forEach((item,i)=>{const x=start+width*(i+.5)/3;
  c.globalAlpha=.68;
  if(['threshold','gallery','ossuary','bellarch','procession','archive','choir','cloister','snow','solar','throne'].includes(item.kind))arch(c,x-74,ground,148,150+(i%2)*38,'#20282d',desvelo?'#a87eb2':'#836e60');
  if(['balcony','watchtower','stairs','icepillars','skybridge'].includes(item.kind)){box(c,x-110,ground-145,220,10,desvelo?'#a889b4':'#756657');box(c,x-95,ground-145,8,145,'#30383b');box(c,x+87,ground-145,8,145,'#30383b');}
  if(['pillars','chains','statues','shelves','resonators','sols'].includes(item.kind)){for(let n=-1;n<=1;n++){box(c,x+n*42-7,ground-170-(n===0?25:0),14,170+(n===0?25:0),'#30383d','#8b7667');}}
  if(['altar','seal','memorytree','epitaph','forbidden','foghorn','bellchain','tidealtar','sunlock','decisiongate'].includes(item.kind)){box(c,x-42,ground-65,84,12,'#987457',desvelo?'#d7b5dc':'#c4a27b');c.fillStyle=desvelo?'#d8b1e4':'#e6b978';c.beginPath();c.arc(x,ground-86,14+Math.sin(time*.003+x)*2,0,Math.PI*2);c.fill();}
  if(['collapsed','wreck','hollow','houses','fragments','embers'].includes(item.kind)){box(c,x-90,ground-90,180,90,'#292d31');for(let n=0;n<4;n++)box(c,x-82+n*43,ground-104-(n%2)*23,34,12,'#6d5a50');}
  if(['market','alley','forge','lanterns','candles','organ','sluice','tanks','trellis','graftgate','trident','markers'].includes(item.kind)){for(let n=-1;n<=1;n++){box(c,x+n*42-12,ground-52,24,42,n===0?'#9d654f':'#4c4e4b');}if(desvelo){c.strokeStyle='#d3a3d6';c.lineWidth=2;c.beginPath();c.arc(x,ground-105,48,Math.PI,Math.PI*2);c.stroke();}}
  c.globalAlpha=1;
 });
 c.restore();
}
