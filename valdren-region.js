// Original, deterministic region quest and branching consequences.
export const REGIONAL_NPCS=[
 {id:'iren',name:'IREN · EL HERRERO',x:6585,description:'La fragua no sirve a ningún rey.'},
 {id:'veska',name:'VESKA · HERALDO',x:7060,description:'El Consejo exige que se pague el tributo de ceniza.'}
];
export const CHOICE={people:{label:'Proteger a los exiliados',description:'La población te entregará el sello de los Tizones y una ampolla.'},crown:{label:'Obedecer al Consejo',description:'El heraldo te otorgará el salvoconducto real; el herrero te negará ayuda.'}};
export function regionGate(stage){return stage===3}
export function canFaceKing(stage,allegiance){return stage===3 && ['people','crown'].includes(allegiance)}
export function inventoryOf(stage,allegiance,districtQuest){return [
 {name:'Espada del Peregrino',description:'Acero funerario templado en silencio.'},
 ...(stage>=2?[{name:'Badajo del Exilio',description:'Recuerdo de una campana sin voz.'}]:[]),
 ...(stage>=3?[{name:'Campana restaurada',description:'La primera promesa cumplida.'}]:[]),
 ...(allegiance==='people'?[{name:'Sello de los Tizones',description:'Los habitantes del barrio reconocen tu decisión.'}]:[]),
 ...(allegiance==='crown'?[{name:'Salvoconducto real',description:'Los guardias saben que escuchaste al Consejo.'}]:[]),
 ...(districtQuest>=1?[{name:'Ceniza de la Fragua',description:'Una ofrenda para desafiar a las Exequias.'}]:[])
]}
export function bossTitle(){return 'EL REY DE LAS NUEVE EXEQUIAS'}
