// Cumbres del Silencio: primer arco jugable. Pure domain rules, no DOM.
export const SUMMIT_START=33250;
export const SUMMIT_END=36200;
export const SUMMIT_MEMORY_X=35380;
export const SUMMIT_NPCS=Object.freeze([
 {id:'elda',name:'ELDA · CAMPANERA DEL SILENCIO',x:33740,description:'En la nieve nadie oye la campana. Ayúdame a rescatar la memoria que dejaron los peregrinos.'}
]);
export const SUMMIT_CHECKPOINTS=Object.freeze([33530,34930]);
export function canEnterSummit(rootsClear,gardenerAlive){return rootsClear===true&&!gardenerAlive}
export function canEnterSilentCloister(stage){return Number.isInteger(stage)&&stage>=1}
export function canHearFrozenBell(stage,desvelo,foesDown){return stage===1&&desvelo===true&&foesDown===true}
export function summitDialogue(stage,giantDefeated=false){
 if(giantDefeated)return {stage:3,title:'ELDA · LA SÉPTIMA CAMPANADA',text:'El Gigante por fin descansa. Has recuperado la Brasa de las Cumbres: las campanas de Nival ya no obedecen al hielo. Al otro lado comienza el sendero del Trono del Sol Muerto.'};
 if(stage>=3)return {stage:3,title:'ELDA · EPÍLOGO DE LA CAMPANA',text:'Has devuelto un recuerdo al hielo. El Gigante que Escucha sigue aguardando en la cima; cuando callen sus campanas, subiremos.'};
 if(stage===2)return {stage:3,title:'ELDA · LA MEMORIA LIBERADA',text:'Las palabras vuelven a sonar entre la nieve. Recibes el Eco de la Campana Congelada; aún nos queda el camino hacia la cumbre.'};
 return {stage:1,title:'ELDA · EL SONIDO SIN ECO',text:'En el Monasterio del Hielo Inmóvil los centinelas custodian una campana silenciada. Véncelos y escucha su memoria con Desvelo. Después regresa aquí.'};
}
export function snowVisualIntensity(area){return area===26?.13:area===27?.095:0}
