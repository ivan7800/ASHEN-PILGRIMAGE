// Ossara chapter 3: domain-only puzzle and gate state. Save stores puzzle IDs, never display text.
export const OSSARA_SEALS=Object.freeze([{id:0,x:15520,name:'CENIZA'},{id:1,x:16870,name:'HUESO'},{id:2,x:17230,name:'SILENCIO'}]);
export const OSSARA_ORDER=Object.freeze([1,0,2]);
export const OSSARA_KEEPER={id:'scribe',name:'ESCRIBA NERIA',x:15205,description:'Los nombres falsos no abren el santuario.'};
export const ARCHIVIST_MAX_HP=480;
export function readForbiddenName(current,id,{desvelo,stage}={}){
 const old=Array.isArray(current)?current:[];
 if(!desvelo||stage<3)return {echoes:[...old],changed:false,title:'LA PIEDRA CALLA',text:'Para escuchar el nombre prohibido necesitas Desvelo y el Fragmento del Archivo.'};
 if(old.includes(id))return {echoes:[...old],changed:false,title:'ECO YA RECORDADO',text:'Este epitafio ya ha respondido.'};
 const next=OSSARA_ORDER[old.length];
 if(id!==next)return {echoes:[],changed:true,title:'EL NOMBRE SE ROMPE',text:'Los epitafios se apagan. Vuelve a empezar: Hueso, Ceniza, Silencio.'};
 const echoes=[...old,id];return {echoes,changed:true,title:echoes.length===3?'EL CORO RECUERDA':'EPITAFIO ESCUCHADO',text:echoes.length===3?'Tres voces han abierto la Cámara del Archivero.':'La piedra deja escapar una voz antigua.'};
}
export function canEnterArchiveBoss(stage,echoes){return stage>=3&&Array.isArray(echoes)&&OSSARA_ORDER.every((id,i)=>echoes[i]===id)}
export function canEnterOssaraInterior(stage){return stage>=3}
export function archiveVictoryText(){return 'El Archivero Ciego ha caído. La Brasa de Ossara permanece encendida; el camino hacia el Mar sin Orillas aún no está construido.'}
