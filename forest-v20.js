// The three-echo listening puzzle is pure logic and independent of rendering.
export const MEMORY_SIGILS=Object.freeze([
 {id:0,name:'El Nombre',x:11395},
 {id:1,name:'La Promesa',x:11715},
 {id:2,name:'El Duelo',x:12015}
]);
export const ECHO_ORDER=Object.freeze([2,0,1]);
export function hearMemory(echoes,id,{desvelo,stage}){
 if(stage<3)return {echoes:[...echoes],changed:false,title:'RAÍCES DORMIDAS',text:'Aina debe restaurar primero la memoria de Brezaluna.'};
 if(!desvelo)return {echoes:[...echoes],changed:false,title:'LA CORTEZA CALLA',text:'Activa Desvelo para escuchar la voz escondida.'};
 if(echoes.length===3)return {echoes:[...echoes],changed:false,title:'EL CORO COMPLETO',text:'Los tres recuerdos han sido escuchados. Entra al santuario.'};
 if(id!==ECHO_ORDER[echoes.length])return {echoes:[],changed:echoes.length>0,title:'EL ECO SE ROMPE',text:'El orden importa: primero el Duelo, después el Nombre y finalmente la Promesa.'};
 const next=[...echoes,id];return {echoes:next,changed:true,title:'ECO '+next.length+' / 3',text:next.length===3?'Tres voces se reconocen. El Santuario de los Mil Nombres está abierto.':'Una voz ha regresado. Escucha la siguiente en el orden del duelo, nombre y promesa.'};
}
export function canChallengeMother(stage,echoes){return stage===3&&Array.isArray(echoes)&&echoes.length===3&&ECHO_ORDER.every((v,i)=>echoes[i]===v)}
export function forestEpilogue(){return 'La Madre no guardaba a sus hijos: guardaba sus nombres del Sol Muerto. Aina agradece la brasa recuperada. El viaje hacia Ossara todavía continúa.'}
