// A short, deterministic exterior quest. State 0=not started, 1=searching, 2=relic secured, 3=delivered.
export const VALDREN_QUEST={giverX:5070,relicX:6060,bonfireX:5140,endX:6350};
export function questDialogue(stage){
 if(stage===0)return {stage:1,title:'LA CAMPANA DEL EXILIO',text:'Vigía Erena: recupera el badajo que la guardia ocultó al pie de la muralla. El Desvelo revela su rastro.'};
 if(stage===1)return {stage:1,title:'VIGÍA ERENA',text:'Busca el badajo en el extremo oriental de Valdren. No aparecerá en el mundo visible.'};
 if(stage===2)return {stage:3,title:'LA CAMPANA RECUPERADA',text:'Erena vuelve a escuchar la campana. Los muros recuerdan a sus muertos. Misión completada.'};
 return {stage:3,title:'VIGÍA ERENA',text:'El badajo está a salvo. La puerta exterior permanece cerrada hasta otra peregrinación.'};
}
export function canClaimRelic(stage,desvelo,allGuardsDefeated){return stage===1&&desvelo&&allGuardsDefeated}
export function canEnterValdren(chapterClear,bossAlive){return chapterClear&&!bossAlive}
