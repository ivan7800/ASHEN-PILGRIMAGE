// Ossara: a deliberately bounded introductory sector, not the full region.
export const OSSARA_NPC={id:'velador',name:'VELADOR DE LOS NOMBRES',x:13725,description:'Ni la piedra se atreve a conservar todos los nombres.'};
export const OSSARA_TABLET_X=14630;
export function canEnterOssara(forestClear,motherAlive){return forestClear===true&&!motherAlive}
export function canRecoverInscription(stage,desvelo,guardiansDefeated){return stage===1&&desvelo&&guardiansDefeated}
export function ossaraDialogue(stage){switch(stage){case 0:return {stage:1,title:'EL VELADOR · OSSARA',text:'Dos centinelas guardan la inscripción del atrio. En Desvelo escucharás el nombre que no debió borrarse.'};case 2:return {stage:3,title:'FRAGMENTO DEL ARCHIVO',text:'Has salvado un nombre. La Catedral de Huesos queda todavía por descubrir; este atrio es solo su umbral.'};default:return {stage,title:'EL VELADOR',text:stage===1?'Escucha la inscripción oriental después de derrotar a los centinelas.':'Al otro lado del atrio empiezan los archivos que nadie quiere leer.'}}}
