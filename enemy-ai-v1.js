// Deterministic enemy locomotion. No random wandering: every family has a readable intent.
const RANGED=new Set(['sunfanatic','wailingspecter','brineworm','rottensiren','fungalsporer','sporematriarch','abyssraven','voidherald','dreamweaver','namecorrupter','ashherald','hushmonk','icechoir','icewraith','sporeseer','bellkeeper','mourner','scriptor']);
const SENTINEL=new Set(['vesperaguard','ruinsentinel','saltgolem','warden','icewarden','saltguard','chainedcastaway']);
const CHARGER=new Set(['ashhound','cryptscavenger','crustplague','cinder','exile','solarwraith','rootguard','drowned','namelessdrowned']);
const SKIRMISHER=new Set(['rottensiren','abyssraven','sirene','sporeseer','sunpenitent']);
const BOSS=new Set(['warden','king','mother','archivist','bride','gardener','bellgiant','firstwitness']);
const profileOf=kind=>BOSS.has(kind)?'boss':RANGED.has(kind)?(SKIRMISHER.has(kind)?'skirmisher':'ranged'):SENTINEL.has(kind)?'sentinel':CHARGER.has(kind)?'charger':'fighter';
export function enemyMovement(e,player,behavior,dt,zone){
 const dx=player.x-e.x,dist=Math.abs(dx),profile=profileOf(e.kind),leash=e.boss?Math.max(460,behavior.aggro*.72):Math.max(260,Math.min(520,behavior.aggro+120));
 const outside=Math.abs(e.x-e.origin)>leash;
 let step=0,state='idle';
 if(outside){state='return';step=Math.sign(e.origin-e.x)}
 else if(dist>=behavior.aggro){state='patrol';step=Math.sign(e.origin-e.x);if(Math.abs(e.x-e.origin)<18)step=0}
 else if(profile==='sentinel'){state='guard';step=0}
 else if(profile==='ranged'){state='zone';if(dist<behavior.range-(behavior.retreat||50))step=-Math.sign(dx);else if(dist>behavior.range+28)step=Math.sign(dx)}
 else if(profile==='skirmisher'){const phase=((e.aiClock||0)+(e.origin%100)/100)%2.4;state=dist<behavior.range*.72?'circle':'approach';step=dist>behavior.range?Math.sign(dx):phase<1.2?-Math.sign(dx):0}
 else if(profile==='charger'){state='hunt';step=dist>behavior.range*.72?Math.sign(dx):0}
 else if(profile==='boss'){state=e.phase===2?'enrage':'duel';step=dist>behavior.range?Math.sign(dx):0}
 else {state='engage';step=dist>behavior.range?Math.sign(dx):0}
 e.aiState=state;e.aiClock=(e.aiClock||0)+dt;
 if(step){const speed=e.boss&&e.phase===2?Math.min(145,behavior.speed*1.35):behavior.speed;const x=Math.max(zone.start+40,Math.min(zone.end-e.w-40,e.x+step*speed*dt));e.x=x;e.dir=step}
 return step;
}
export function enemyArchetype(kind){return profileOf(kind)}
