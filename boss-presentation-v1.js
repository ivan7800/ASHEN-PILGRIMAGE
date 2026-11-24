// Distinct visual language for each major boss.  The sprites are shared
// sheets, but their staging is deliberately authored per encounter.
export const BOSS_PRESENTATION=Object.freeze({
  warden:{asset:'warden',width:182,height:194,dx:-74,dy:-108,glow:'#9ed0dc',aura:'rgba(92,183,207,.18)',telegraph:'#8de3ef',idle:220,phase:'ice'},
  king:{asset:'king',width:190,height:202,dx:-78,dy:-116,glow:'#ffd39b',aura:'rgba(239,145,77,.18)',telegraph:'#ffb86b',idle:205,phase:'crown'},
  mother:{asset:'mother',width:198,height:206,dx:-82,dy:-119,glow:'#e8a3d3',aura:'rgba(185,74,151,.18)',telegraph:'#ef9ad0',idle:235,phase:'roots'},
  archivist:{asset:'archivist',width:184,height:196,dx:-75,dy:-111,glow:'#e7c89e',aura:'rgba(204,159,98,.16)',telegraph:'#f2cf94',idle:215,phase:'ink'},
  bride:{asset:'bride',width:196,height:204,dx:-81,dy:-117,glow:'#9de8df',aura:'rgba(47,191,184,.17)',telegraph:'#7ee7df',idle:225,phase:'tide'},
  gardener:{asset:'gardener',width:222,height:224,dx:-94,dy:-135,glow:'#a9dc87',aura:'rgba(91,177,79,.18)',telegraph:'#a4e47f',idle:255,phase:'thorns'},
  bellgiant:{asset:'bellgiant',width:270,height:258,dx:-118,dy:-177,glow:'#f0c58f',aura:'rgba(215,127,66,.2)',telegraph:'#ffc77d',idle:285,phase:'bell'},
  firstwitness:{asset:'firstwitness',width:242,height:266,dx:-104,dy:-190,glow:'#ffcf91',aura:'rgba(232,92,67,.2)',telegraph:'#ff9a6e',idle:240,phase:'sun'}
});
export function bossPresentation(kind){return BOSS_PRESENTATION[kind]||null}
export function bossFrameProfile(kind,time,e){
  const p=bossPresentation(kind); if(!p)return null;
  if(e.hp<=0)return 19;
  if(e.windup>0)return e.attackMode==='sunwave'||e.attackMode==='shockwave'?13:(kind==='mother'?13:9);
  if(e.strike>0)return e.attackMode==='sunwave'||e.attackMode==='shockwave'?14:(kind==='mother'?15:11);
  if(e.phase===2)return 12+Math.floor(time/(p.idle*.82))%4;
  return Math.floor(time/p.idle)%8;
}
