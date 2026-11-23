// Raíces Eternas — reglas puras de misión, puertas, rito y jefe (sin DOM).
export const ROOT_START=27400;
export const ROOT_END=33250;
export const ROOT_BOSS_INDEX=52;
export const ROOT_BOSS_HP=650;
export const ROOT_SIGILS=Object.freeze([
 {id:0,x:30620,name:'Corteza'},
 {id:1,x:31080,name:'Savia'},
 {id:2,x:31510,name:'Carne'}
]);
export const ROOT_NPCS=Object.freeze([
 {id:'liria',x:29380,name:'LIRIA · GUARDIANA DE HOJACLARA',description:'Los árboles de Hojaclara tienen hambre de nombres, no de sangre.'}
]);
export function canEnterRoots(seaClear,brideAlive){return seaClear===true&&!brideAlive}
export function canCrossRootGate(area,stage,rites){
 if(area===23)return stage>=1;
 if(area===24)return stage>=2&&rites.length===3&&rites.every((n,i)=>n===i);
 return true;
}
export function hearRootName(previous,id,{desvelo,stage}){
 const seal=ROOT_SIGILS[id];
 if(!seal)return {changed:false,rites:[...previous],title:'NERVADURA INEXISTENTE',text:'No responde ninguna raíz.'};
 if(stage<1)return {changed:false,rites:[...previous],title:'RAÍCES SIN GUÍA',text:'Habla con Liria en Hojaclara antes de tocar la memoria.'};
 if(!desvelo)return {changed:false,rites:[...previous],title:'MADERA MÚDA',text:'Activa Desvelo para escuchar su nombre.'};
 if(previous.includes(id))return {changed:false,rites:[...previous],title:'NOMBRE YA ESCUCHADO',text:`${seal.name} ya forma parte de la promesa.`};
 if(id!==previous.length)return {changed:previous.length>0,rites:[],title:'SAVIA DERRAMADA',text:'La raíz se cierra. Recuerda el orden: Corteza, Savia, Carne.'};
 const rites=[...previous,id];return {changed:true,rites,title:rites.length===3?'LA PUERTA RESPIRA':`MEMORIA ${rites.length} · ${seal.name.toUpperCase()}`,text:rites.length===3?'El invernadero abre sus heridas. Ahora puedes enfrentarte al Jardinero.':`La ${seal.name.toLowerCase()} pronuncia su nombre.`};
}
export function rootDialogue(stage,clear){
 if(clear)return {stage:3,title:'LIRIA · EPÍLOGO DE HOJACLARA',text:'Las raíces han elegido crecer sin devorar nombres. Recoge la Brasa de las Raíces Eternas; el jardín seguirá velando por nosotros.'};
 if(stage>=2)return {stage:2,title:'LIRIA · LA ÚLTIMA PODA',text:'Has pronunciado Corteza, Savia y Carne. El Jardinero injerta a los vivos en su huerto. Si llegas al invernadero, no escuches su promesa.'};
 return {stage:1,title:'LIRIA · LOS TRES INJERTOS',text:'Los nuestros fueron sembrados vivos. En el jardín escucha Corteza, Savia y Carne usando Desvelo, en ese orden. Así se abrirá la casa del Jardinero.'};
}
export function gardenerTiming(phase){return phase===2?{windup:.69,cooldown:1.72,reach:184,chargeSpeed:285,damageBonus:9}:{windup:1.04,cooldown:2.30,reach:144,chargeSpeed:205,damageBonus:0}}
export function gardenerTelegraph(enemy){if(!enemy?.alive||enemy.windup<=0)return null;const cfg=gardenerTiming(enemy.phase);return {type:'lane',x:enemy.x+enemy.w/2,y:438,direction:enemy.dir||-1,range:cfg.reach,phase:enemy.phase,progress:Math.max(0,Math.min(1,1-enemy.windup/cfg.windup)),ttl:Math.min(.2,enemy.windup)}}

// Ciclo visible de espinas: pausa y aviso preceden siempre al daño.
export const ROOT_THORNS=Object.freeze([
 {x:28120,width:105,offset:0},{x:28720,width:112,offset:1.0},
 {x:30020,width:100,offset:.1},{x:30920,width:92,offset:1.3},{x:31340,width:102,offset:2.0}
]);
export function thornPhase(seconds,offset=0){
 const t=((seconds+offset)%3.4+3.4)%3.4;
 return t<1.9?'rest':t<2.55?'warning':'active';
}

// Physical bounds of an active thorn patch. Unlike a "grounded" flag, this
// checks actual overlap: jumping high enough or standing on a raised platform
// keeps the pilgrim safe. Coordinates are world-space pixels.
export const THORN_TIP_HEIGHT=48;
export function thornContact(player,thorn,ground,seconds){
 if(thornPhase(seconds,thorn.offset)!=='active')return false;
 if(!player||!thorn||![player.x,player.y,player.w,player.h,thorn.x,thorn.width,ground].every(Number.isFinite))return false;
 if(player.w<=0||player.h<=0||thorn.width<=0)return false;
 const horizontal=player.x < thorn.x+thorn.width && player.x+player.w > thorn.x;
 const vertical=player.y < ground && player.y+player.h > ground-THORN_TIP_HEIGHT;
 return horizontal&&vertical;
}
// Sound cues happen at phase boundaries and only near the character.
export function thornWarningCrossed(thorn,previousSeconds,nowSeconds,playerX,range=270){
 if(!Number.isFinite(playerX)||Math.abs(playerX-(thorn.x+thorn.width/2))>range)return false;
 return thornPhase(previousSeconds,thorn.offset)==='rest' && thornPhase(nowSeconds,thorn.offset)==='warning';
}
