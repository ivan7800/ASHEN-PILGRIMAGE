// ASHEN PILGRIMAGE: Salmuera IV — domain-only tide, memory and boss rules.
// No DOM dependencies. Coordinates are fixed within the existing continuous world.
export const SEA_START=22000;
export const SEA_END=27400;
export const SEA_BOSS_INDEX=43;
export const SEA_BOSS_HP=560;
export const SEA_AIR_SECONDS=22;
export const SEA_VALVES=Object.freeze([
 {id:0,x:22470,name:'Compuerta de la Bóveda',mode:'low'},
 {id:1,x:23880,name:'Rueda de las Anclas',mode:'high'},
 {id:2,x:25120,name:'Órgano de las Mareas',mode:'low'}
]);
export const SEA_ECHOES=Object.freeze([
 {id:0,x:23220,name:'Sal',tide:'low'},
 {id:1,x:24230,name:'Eco',tide:'high'},
 {id:2,x:25570,name:'Nombre',tide:'low'}
]);
export const SEA_NPCS=[{id:'salwatch',name:'EL VIGÍA SIN PULSO',x:23630,description:'Nunca cambies la marea sin escuchar qué nombres arrastra.'}];
export function isUnderwater(zone,tide){return zone>=18&&zone<=20&&tide==='high'}
export function canEnterDepths(stage){return stage>=3}
export function tideGate(zone,tide,echoes){
 if(zone===17)return true; // completion stage checked by caller
 if(zone===18)return tide==='low'&&echoes.includes(0);
 if(zone===19)return tide==='high'&&echoes.includes(1);
 if(zone===20)return tide==='low'&&echoes.length===3;
 return true;
}
export function turnValve(valveId,mode,echoes){
 const valve=SEA_VALVES[valveId];
 if(!valve)return {changed:false,mode,title:'MECANISMO DESCONOCIDO',text:'No hay ninguna rueda aquí.'};
 if(valveId===1&&!echoes.includes(0))return {changed:false,mode,title:'ANCLA INMÓVIL',text:'Escucha primero el nombre de la Sal.'};
 if(valveId===2&&!echoes.includes(1))return {changed:false,mode,title:'UN ÓRGANO MUDO',text:'Primero debe resonar el Eco.'};
 const changed=mode!==valve.mode;
 return {changed,mode:valve.mode,title:valve.mode==='high'?'LA PLEAMAR REGRESA':'LAS AGUAS RETROCEDEN',text:valve.mode==='high'?'El agua invade las galerías; las voces vuelven a flotar. Busca bolsas de aire.':'El mecanismo abre el fondo marino. Camina entre los nombres hundidos.'};
}
export function hearSeaEcho(existing,id,{desvelo,tide}){
 const seal=SEA_ECHOES[id];
 if(!seal)return {changed:false,echoes:[...existing],title:'SIN INSCRIPCIÓN',text:'No hay nada que escuchar.'};
 if(!desvelo)return {changed:false,echoes:[...existing],title:'PIEDRA MUDA',text:'Activa Desvelo para reconocer los ecos.'};
 if(tide!==seal.tide)return {changed:false,echoes:[...existing],title:'LA MAREA EQUIVOCADA',text:`Este recuerdo necesita la marea ${seal.tide==='low'?'baja':'alta'}.`};
 if(existing.includes(id))return {changed:false,echoes:[...existing],title:'NOMBRE RECORDADO',text:`El eco de ${seal.name} ya está inscrito.`};
 if(id!==existing.length)return {changed:existing.length>0,echoes:[],title:'LOS NOMBRES SE DESHACEN',text:'El mar borra la secuencia. Recuerda: Sal, Eco, Nombre.'};
 const echoes=[...existing,id];
 return {changed:true,echoes,title:echoes.length===3?'LA PROMESA RESTITUIDA':`ECO ${echoes.length} · ${seal.name.toUpperCase()}`,text:echoes.length===3?'Las campanas se alinean. La Novia aguarda tras el altar.':`${seal.name} vuelve a ser pronunciado bajo el agua.`};
}
export function brideTiming(phase){return phase===2?{windup:.74,reach:182,cooldown:1.8,damageBonus:7,chargeSpeed:320}:{windup:1.02,reach:148,cooldown:2.25,damageBonus:0,chargeSpeed:225}}
export function brideTelegraph(enemy){if(!enemy||!enemy.alive||enemy.windup<=0)return null;const timing=brideTiming(enemy.phase);return {type:'lane',x:enemy.x+enemy.w/2,y:438,direction:enemy.dir||-1,range:timing.reach,phase:enemy.phase,progress:Math.max(0,Math.min(1,1-enemy.windup/timing.windup)),ttl:Math.min(.2,enemy.windup)};}
export function brideDialogue(clear){return clear?{title:'MARÍN · LA ÚLTIMA TRAVESÍA',text:'El nombre de mi hermana ya no pertenece al agua. La Novia ha descansado, y su brasa ilumina nuestro camino.'}:{title:'MARÍN · LA NOVIA DEL ABISMO',text:'Mi hermana fue entregada al mar a cambio de salvar el puerto. Desciende, escucha Sal, Eco y Nombre. No vuelvas sin su recuerdo.'}}
