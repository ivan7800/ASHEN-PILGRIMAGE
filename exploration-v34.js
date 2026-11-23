// ASHEN PILGRIMAGE v3.4 — contenido opcional sin modificar puertas de historia.
// Datos y reglas puras: las pruebas las ejecutan en Node sin navegador.
export const RELICS=Object.freeze([
 {id:'vigil',x:2180,area:2,name:'Amuleto de la Vigilia',effect:'Esquiva: +0,04 s de invulnerabilidad.',hint:'La piedra de los peregrinos esconde un amuleto.'},
 {id:'exile',x:7270,area:6,name:'Acero del Exilio',effect:'La promesa de Valdren fortalece el combate.',hint:'La fragua oculta una hoja entre los juramentos.'},
 {id:'seed',x:10610,area:9,name:'Semilla del Regreso',effect:'Las ampollas restauran 6 PV adicionales.',hint:'Una semilla late entre recuerdos del bosque.'},
 {id:'thread',x:15980,area:13,name:'Hilo de los Nombres',effect:'Resistencia: regeneración +12 %.',hint:'Un hilo imposible se enreda entre archivos.'},
 {id:'pearl',x:22920,area:18,name:'Pulmón de Nácar',effect:'Permite respirar 6 s más bajo el agua.',hint:'Una concha viva guarda aire antiguo.'},
 {id:'bark',x:31220,area:24,name:'Piel de Corteza',effect:'Espinas vivas: 4 puntos menos de daño.',hint:'Las espinas protegen su propia piel.'},
 {id:'bell',x:37300,area:28,name:'Campana Ligera',effect:'Esquiva: 3 puntos menos de resistencia.',hint:'Una campana diminuta vibra bajo la nieve.'},
 {id:'solar',x:42730,area:32,name:'Ceniza Solar',effect:'Daño de espada contra jefes: +8 %.',hint:'El sol quebrado dejó un último rescoldo.'}
]);
export const SHORTCUTS=Object.freeze([
 {id:'tizones',a:5480,b:7160,requires:'valdren',name:'Galería del Contrabando',hint:'Conecta las murallas y los Tizones cuando Erena haya recibido el badajo.'},
 {id:'hollow',a:9560,b:11620,requires:'forest',name:'Tronco del Retorno',hint:'Conecta el sendero con el refugio después de ayudar a Aina.'},
 {id:'ossuary',a:14150,b:17030,requires:'ossara',name:'Pasaje de los Copistas',hint:'Conecta el atrio con el coro cuando el Velador recupere su nombre.'}
]);
export const RELIC_IDS=Object.freeze(RELICS.map(r=>r.id));
export const SHORTCUT_IDS=Object.freeze(SHORTCUTS.map(s=>s.id));
export function validIdList(value,allowed,max=allowed.length){
 return Array.isArray(value)&&value.length<=max&&value.every(id=>typeof id==='string'&&allowed.includes(id))&&new Set(value).size===value.length;
}
export function relicNear(x,owned,radius=74){return RELICS.find(r=>!owned.includes(r.id)&&Math.abs(x-r.x)<=radius)||null}
export function findRelic(x,owned,{desvelo=false,questStage=0,allegiance='none'}={}){
 const relic=relicNear(x,owned);if(!relic)return {found:false,changed:false};
 if(!desvelo)return {found:true,changed:false,reason:'Desvelo permite ver el relicario oculto.'};
 if(relic.id==='exile'&&(questStage<3||!['people','crown'].includes(allegiance)))return {found:true,changed:false,reason:'Termina la promesa de Erena y decide el destino de los Tizones.'};
 return {found:true,changed:true,relic,owned:[...owned,relic.id]};
}
export function relicEffects(owned=[],allegiance='none'){
 const has=id=>owned.includes(id),exile=has('exile');
 return {
  dodgeInvBonus:has('vigil')?.04:0,
  swordMultiplier:exile?(allegiance==='people'?1.05:allegiance==='crown'?1.03:1.02):1,
  bossMultiplier:has('solar')?1.08:1,
  healBonus:(has('seed')?6:0)+(exile&&allegiance==='people'?3:0),
  staminaRegenMultiplier:(has('thread')?1.12:1)*(exile&&allegiance==='crown'?1.06:1),
  airBonus:has('pearl')?6:0,
  thornReduction:has('bark')?4:0,
  dodgeCostReduction:has('bell')?3:0,
 };
}
export function shortcutNear(x,radius=78){
 for(const s of SHORTCUTS){if(Math.abs(x-s.a)<=radius)return {shortcut:s,from:'a',destination:s.b};if(Math.abs(x-s.b)<=radius)return {shortcut:s,from:'b',destination:s.a}}
 return null;
}
export function shortcutReady(s,progress={}){
 if(s.requires==='valdren')return progress.questStage>=3&&['people','crown'].includes(progress.allegiance);
 if(s.requires==='forest')return progress.forestStage>=3;
 if(s.requires==='ossara')return progress.ossaraStage>=3;
 return false;
}
export function traverseShortcut(x,opened,{desvelo=false,progress={}}={}){
 const found=shortcutNear(x);if(!found)return {found:false,changed:false};
 const {shortcut,destination}=found;
 if(!shortcutReady(shortcut,progress))return {found:true,changed:false,reason:'Este pasaje requiere completar antes la misión de la región.'};
 const isOpen=opened.includes(shortcut.id);
 if(!isOpen&&!desvelo)return {found:true,changed:false,reason:'Activa Desvelo para abrir este pasaje oculto.'};
 return {found:true,changed:true,opened:isOpen?[...opened]:[...opened,shortcut.id],destination,shortcut,newlyOpened:!isOpen};
}
