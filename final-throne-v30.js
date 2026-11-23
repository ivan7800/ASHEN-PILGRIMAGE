// ASHEN PILGRIMAGE v3.0 — dominio puro del Trono del Sol Muerto.
// Los seis fuegos anteriores abren el último altar; el séptimo no es una recompensa: es una elección.
export const FINAL_START=40700;
export const FINAL_END=46600;
export const FIRST_WITNESS_INDEX=72;
export const FIRST_WITNESS_HP=960;
export const FINAL_CHECKPOINTS=Object.freeze([41070,42500,43930,45200]);
export const SOLAR_SEALS=Object.freeze([
 {id:0,x:43120,name:'Nombre',truth:'Los dioses fueron encerrados en el sol para que no devorasen los nombres.'},
 {id:1,x:43680,name:'Prisión',truth:'La luz que te guía es también una celda y una herida.'},
 {id:2,x:44220,name:'Testigo',truth:'El Primer Testigo selló la prisión y quedó atrapado custodiándola.'}
]);
export const ENDINGS=Object.freeze({
 liberar:{name:'EL AMANECER HERIDO',title:'LIBERAR A LOS DIOSES',text:'El sol se abre. Las campanas vuelven a sonar, pero cada nombre liberado trae una voz que el mundo había olvidado. Vespera conoce por fin un amanecer que no puede controlar.'},
 custodiar:{name:'EL GUARDIÁN DEL SOL',title:'CUSTODIAR LA PRISIÓN',text:'Te sientas en el trono vacío. La campana de tu pecho se convierte en el último cerrojo; el mundo continúa bajo una luz prestada, mientras tu nombre se borra de la historia.'},
 extinguir:{name:'LA NOCHE DE LOS NOMBRES',title:'EXTINGUIR LA PRISIÓN',text:'Apagas el falso sol y rompes el ciclo de los Altares. Las seis brasas iluminan a quienes aún viven. En la primera noche sin dioses, Vespera aprende a recordarse sola.'}
});
export function canEnterThrone(summitClear,giantAlive){return summitClear===true&&!giantAlive}
export function allSixEmbers(flags){return Array.isArray(flags)&&flags.length===6&&flags.every(f=>f===true)}
export function canEnterLastArchive(stage){return Number.isInteger(stage)&&stage>=1}
export function hearSolarSeal(seals,id,{desvelo=false,stage=0}={}){
 const old=Array.isArray(seals)?seals:[];
 if(stage<1)return {seals:old,changed:false,title:'EL ALTAR ESTÁ MUDO',text:'Primero escucha a la Santa Sin Rostro.'};
 if(!desvelo)return {seals:old,changed:false,title:'EL MUNDO NO RECUERDA',text:'Activa Desvelo para leer el sol por dentro.'};
 if(!Number.isInteger(id)||id<0||id>2)return {seals:old,changed:false,title:'SELLO DESCONOCIDO',text:'La piedra no responde.'};
 if(old.includes(id))return {seals:old,changed:false,title:'VERDAD RECORDADA',text:'Ese juramento ya ha sido escuchado.'};
 if(id!==old.length)return {seals:[],changed:true,title:'LOS SELLOS SE APAGAN',text:'El orden importa: Nombre, Prisión, Testigo.'};
 const next=[...old,id];return {seals:next,changed:true,title:next.length===3?'EL SOL REVELADO':'UNA VERDAD ARDE',text:next.length===3?'El último umbral reconoce las seis brasas. Puedes afrontar al Primer Testigo.':SOLAR_SEALS[id].truth};
}
export function canEnterFinalSanctuary(seals,embers){return Array.isArray(seals)&&seals.length===3&&seals.every((v,i)=>v===i)&&allSixEmbers(embers)}
export function witnessTiming(phase){return phase===2?{windup:.75,cooldown:1.8,reach:188,damageBonus:10,chargeSpeed:260}:{windup:1.0,cooldown:2.45,reach:152,damageBonus:0,chargeSpeed:0}}
export function witnessTelegraph(e){const t=witnessTiming(e.phase);return {type:'lane',x:e.x+e.w/2,y:438,direction:e.dir,range:e.attackMode==='sunwave'?295:t.reach,phase:e.phase,progress:Math.max(0,Math.min(1,1-e.windup/t.windup)),ttl:Math.max(.05,e.windup+.05)}}
export function sunwaveHits(e,p,ground=438){const delta=(p.x+p.w/2-e.x-e.w/2)*e.dir;return delta>=-12&&delta<=295&&p.y+p.h>ground-42}
export function saintDialogue({stage=0,clear=false,ending='none',emberCount=0}={}){
 if(ending!=='none'&&ENDINGS[ending])return {stage:2,title:ENDINGS[ending].name,text:'Lo que sucedió fue una elección, no una profecía. '+ENDINGS[ending].text};
 if(clear)return {stage:2,title:'LA SANTA SIN ROSTRO · EL UMBRAL FINAL',text:'El Primer Testigo ha caído. Acércate al Altar del Último Sol y decide el destino de Vespera.'};
 if(stage>=1)return {stage:1,title:'LA SANTA SIN ROSTRO · SEIS BRASAS',text:`Traes ${emberCount} de las seis brasas. El sol es una prisión. Recuerda en Desvelo Nombre, Prisión y Testigo, y entra en el trono.`};
 return {stage:1,title:'LA SANTA SIN ROSTRO · LA PRISIÓN',text:'No hay dioses detrás del alba: están dentro. El Primer Testigo no protege un reino, protege la cerradura. Lee las tres verdades del sol con Desvelo.'};
}
export function canChooseEnding(clear,ending){return clear===true && ending==='none'}
export function finishPilgrimage(clear,current,choice){if(!canChooseEnding(clear,current)||!Object.prototype.hasOwnProperty.call(ENDINGS,choice))return {ok:false,ending:current};return {ok:true,ending:choice,...ENDINGS[choice]}}
