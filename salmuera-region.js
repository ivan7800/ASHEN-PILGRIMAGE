// Salmuera: first coastal mission, independent from rendering and input.
export const SALMUERA_NPC=[{id:'marin',name:'MARÍN · FARERA',x:19240,description:'La marea devuelve campanas de los ahogados.'}];
export const TIDE_MEMORY_X=21410;
export function canEnterSalmuera(ossaraClear,archivistAlive){return ossaraClear===true&&archivistAlive===false}
export function canRecoverTideMemory(stage,desvelo,guardsDefeated){return stage===1&&desvelo===true&&guardsDefeated===true}
export function talkToMarin(stage){
 if(stage===0)return {stage:1,title:'MARÍN · LA MAREA SIN ORILLAS',text:'Escucha la campana sumergida del muelle. La marea oculta su recuerdo: usa Desvelo y silencia a los guardianes de sal.'};
 if(stage===1)return {stage:1,title:'MARÍN · LA BRUMA SALADA',text:'En el Muelle Hundido, la campana recuerda solo durante Desvelo. Sin el silencio de los guardianes, nada oirás.'};
 if(stage===2)return {stage:3,title:'EL NOMBRE DE LA MAREA',text:'Marín recupera el nombre de su tripulación. Obtienes el Sello de Salmuera. El mar aún custodia otras puertas.'};
 return {stage:3,title:'MARÍN · VIGILIA',text:'La marea conserva lo que Ossara quiso borrar. La travesía acaba de comenzar.'};
}
