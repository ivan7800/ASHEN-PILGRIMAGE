// Bosque de las Voces: minimal first playable slice, no external assets.
export const FOREST_START=8800;
export const FOREST_RELIC_X=10025;
export const FOREST_WARDEN_X=10430;
export const FOREST_NPC={id:'aina',name:'AINA · GUARDIANA DE LAS VOCES',x:9120,description:'Las raíces recuerdan lo que el reino quiso olvidar.'};
export function canEnterForest(regionClear,kingAlive){return regionClear===true&&!kingAlive}
export function canRecoverMemory(stage,desvelo,guardiansDefeated){return stage===1&&desvelo&&guardiansDefeated}
export function forestDialogue(stage){return stage===0?{stage:1,title:'AINA · GUARDIANA',text:'Las raíces guardan una memoria arrancada. Vence a los Custodios, escucha el Desvelo y tráela.'}:stage===2?{stage:3,title:'LA RAÍZ RECUERDA',text:'La memoria vuelve al bosque. Has recuperado la primera voz de Brezaluna.'}:{stage,title:'AINA · GUARDIANA',text:stage===1?'Busca las raíces marcadas mientras el mundo esté en Desvelo.':'La voz ya ha regresado. Más allá duerme la Madre de los Mil Nombres.'}}
export function forestReward(stage){return stage>=3?{name:'Memoria de Brezaluna',description:'Una voz preservada de la extinción de los altares.'}:null}
