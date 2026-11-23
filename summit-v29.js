// ASHEN PILGRIMAGE v2.9 — rules for the closing act of the Sixth Realm.
// Pure functions: safe for browser and Node regression tests.
export const HIGH_SUMMIT_START=36200;
export const HIGH_SUMMIT_END=40700;
export const GIANT_BOSS_INDEX=63;
export const GIANT_BOSS_HP=780;
export const HIGH_SUMMIT_CHECKPOINTS=Object.freeze([36480,37870,39260]);
export const RESONATORS=Object.freeze([
 {id:0,x:37030,name:'Piedra',meaning:'El primer golpe dio forma a la montaña.'},
 {id:1,x:38200,name:'Eco',meaning:'El segundo llevó su nombre al monasterio.'},
 {id:2,x:38680,name:'Silencio',meaning:'El tercero llamó al Gigante que Escucha.'}
]);
export function canClimbHighSummit(stage){return Number.isInteger(stage)&&stage>=3}
export function canCrossEchoBridge(echoes){return Array.isArray(echoes)&&echoes.length>=1}
export function canEnterGiantSanctuary(echoes){return Array.isArray(echoes)&&echoes.length===3&&echoes.every((id,i)=>id===i)}
export function hearResonance(echoes,id,{desvelo=false,stage=0}={}){
 const old=Array.isArray(echoes)?echoes:[];
 if(stage<3)return {echoes:old,changed:false,title:'LA PIEDRA NO RESPONDE',text:'Antes debes llevar el recuerdo a Elda.'};
 if(!desvelo)return {echoes:old,changed:false,title:'UN SONIDO SIN VOZ',text:'Solo el Desvelo descubre la inscripción en el hielo.'};
 if(!Number.isInteger(id)||id<0||id>2)return {echoes:old,changed:false,title:'RESONANCIA DESCONOCIDA',text:'El viento deshace la nota.'};
 if(old.includes(id))return {echoes:old,changed:false,title:'UNA NOTA YA ESCUCHADA',text:'La campana guarda esa voz. Busca la siguiente.'};
 if(id!==old.length)return {echoes:[],changed:true,title:'EL CORO SE ROMPE',text:'Has alterado el orden. Las campanas callan: Piedra, Eco y Silencio.'};
 const next=[...old,id];return {echoes:next,changed:true,title:next.length===3?'LAS TRES CAMPANADAS':'RESONANCIA EN EL HIELO',text:next.length===3?'El santuario se abre. La cima recuerda tu nombre.':RESONATORS[id].meaning};
}
export function giantTiming(phase){return phase===2?{windup:.82,cooldown:1.95,reach:172,damageBonus:9,chargeSpeed:235}:{windup:1.06,cooldown:2.55,reach:146,damageBonus:0,chargeSpeed:0}}
export function giantTelegraph(enemy){const stats=giantTiming(enemy.phase);const maxWindup=stats.windup;return {type:'lane',x:enemy.x+enemy.w/2,y:438,direction:enemy.dir,range:enemy.attackMode==='shockwave'?260:stats.reach,phase:enemy.phase,progress:Math.max(0,Math.min(1,1-enemy.windup/maxWindup)),ttl:Math.max(.05,enemy.windup+.045)}}
// Shockwave attacks extend along the ground but can be jumped over; dodge invulnerability still applies in the runtime.
export function shockwaveHits(enemy,player,ground=438){const center=enemy.x+enemy.w/2,foot=player.x+player.w/2;const ahead=(foot-center)*enemy.dir;return ahead>=-12&&ahead<=260&&player.y+player.h>ground-35}
