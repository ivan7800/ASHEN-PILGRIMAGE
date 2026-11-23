import {BESTIARY_BEHAVIORS} from './bestiary-v37.js';
// Combat mechanics are deterministic and independent of the renderer.
export const COMBO=[{damage:22,reach:80,cost:18,recovery:.30},{damage:27,reach:87,cost:21,recovery:.35},{damage:40,reach:99,cost:29,recovery:.50}];
export const STAMINA_MAX=100;
// Each attack's damage lands during its animated swing, not on key-down.
export const IMPACT_WINDOWS=[.13,.16,.22];
export function startSwing(player,attack){
 player.pendingSwing={id:player.attackId,index:attack.index,remaining:IMPACT_WINDOWS[attack.index]};
}
export function advanceSwing(player,dt){
 const swing=player.pendingSwing;
 if(!swing)return null;
 swing.remaining-=dt;
 if(swing.remaining>0)return null;
 player.pendingSwing=null;
 return swing;
}
// Swept horizontal test prevents fast projectiles skipping past the player.
export function projectileCrossesPlayer(oldX,newX,projectileY,player){
 const left=player.x-8,right=player.x+player.w+8;
 const crosses=Math.max(oldX,newX)>=left && Math.min(oldX,newX)<=right;
 return crosses && projectileY>=player.y-9 && projectileY<=player.y+player.h+9;
}

export function attackHit(player,enemy,step){
 const hit=COMBO[step];
 const pc=player.x+player.w/2,ec=enemy.x+enemy.w/2;
 // During charges the two centers may coincide or cross while bodies still overlap.
 // Keep a narrow overlap tolerance without allowing hits on a target fully behind us.
 const ahead=(ec-pc)*player.face;
 const overlapTolerance=Math.min(player.w,enemy.w)/2;
 return enemy.alive && (player.face===1||player.face===-1) && ahead>=-overlapTolerance && ahead<=hit.reach+enemy.w/2 && Math.abs((enemy.y+enemy.h/2)-(player.y+player.h/2))<76;
}
export function beginAttack(player){
 const index=player.comboWindow>0?(player.combo+1)%COMBO.length:0;
 const move=COMBO[index];
 if(player.attack>0||player.dodge>0||player.stamina<move.cost)return null;
 player.combo=index;player.stamina-=move.cost;player.attack=move.recovery;player.comboWindow=.78;player.attackId=(player.attackId||0)+1;
 return {index,...move};
}
export function beginDodge(player,cost=28,invDuration=.34){
 if(player.dodge>0||player.attack>0||player.stamina<cost)return false;
 player.stamina-=cost;player.dodge=.32;player.inv=Math.max(player.inv,invDuration);return true;
}
export function regenerateStamina(player,dt,multiplier=1){
 const rate=(player.attack>0||player.dodge>0?11:36)*multiplier;
 player.stamina=Math.min(STAMINA_MAX,Math.max(0,player.stamina+rate*dt));
 player.comboWindow=Math.max(0,player.comboWindow-dt);
}
export function enemyBehavior(kind){
 if(BESTIARY_BEHAVIORS[kind])return BESTIARY_BEHAVIORS[kind];
 return kind==='firstwitness'?{aggro:780,speed:77,range:145,windup:1,cooldown:2.45,damage:38,reach:152,projectile:false}:
        kind==='sunpenitent'?{aggro:400,speed:75,range:90,windup:.84,cooldown:2.08,damage:25,reach:110,projectile:false}:
        kind==='ashherald'?{aggro:425,speed:51,range:167,windup:.98,cooldown:2.3,damage:20,reach:184,projectile:true}:
        kind==='solarwraith'?{aggro:420,speed:94,range:80,windup:.71,cooldown:1.82,damage:22,reach:102,projectile:false}:
        kind==='bellgiant'?{aggro:700,speed:68,range:128,windup:1.06,cooldown:2.55,damage:34,reach:146,projectile:false}:
        kind==='hushmonk'?{aggro:390,speed:60,range:148,windup:.94,cooldown:2.25,damage:19,reach:159,projectile:true}:
        kind==='icechoir'?{aggro:430,speed:45,range:169,windup:1.12,cooldown:2.7,damage:21,reach:180,projectile:true}:
        kind==='icewraith'?{aggro:430,speed:53,range:153,windup:1.03,cooldown:2.3,damage:18,reach:162,projectile:true}:
        kind==='icewarden'?{aggro:365,speed:76,range:82,windup:.82,cooldown:2.05,damage:23,reach:98,projectile:false}:
        kind==='gardener'?{aggro:660,speed:86,range:116,windup:1.04,cooldown:2.3,damage:36,reach:144,projectile:false}:
        kind==='barkguard'?{aggro:395,speed:71,range:88,windup:.81,cooldown:2.1,damage:24,reach:102,projectile:false}:
        kind==='sporeseer'?{aggro:445,speed:51,range:150,windup:1.01,cooldown:2.4,damage:17,reach:168,projectile:true}:
        kind==='bride'?{aggro:630,speed:84,range:111,windup:1.02,cooldown:2.25,damage:33,reach:148,projectile:false}:
        kind==='drowned'?{aggro:330,speed:86,range:78,windup:.74,cooldown:1.9,damage:20,reach:95,projectile:false}:
        kind==='sirene'?{aggro:410,speed:51,range:144,windup:1.08,cooldown:2.2,damage:18,reach:155,projectile:true}:
        kind==='saltguard'?{aggro:360,speed:66,range:94,windup:.92,cooldown:2.05,damage:24,reach:116,projectile:false}:
        kind==='archivist'?{aggro:605,speed:73,range:108,windup:.83,cooldown:1.84,damage:32,reach:145,projectile:false}:
        kind==='scriptor'?{aggro:380,speed:54,range:122,windup:.95,cooldown:2.1,damage:19,reach:141,projectile:true}:
        kind==='bonekeeper'?{aggro:335,speed:72,range:77,windup:.81,cooldown:1.95,damage:22,reach:93,projectile:false}:
        kind==='mother'?{aggro:630,speed:94,range:103,windup:.78,cooldown:1.85,damage:30,reach:142,projectile:false}:
        kind==='rootguard'?{aggro:370,speed:95,range:83,windup:.65,cooldown:1.75,damage:23,reach:93,projectile:false}:
        kind==='bellkeeper'?{aggro:380,speed:38,range:175,windup:1.02,cooldown:2.4,damage:16,reach:188,projectile:true}:
        kind==='cinder'?{aggro:325,speed:114,range:64,windup:.49,cooldown:1.6,damage:20,reach:80,projectile:false}:
        kind==='mourner'?{aggro:345,speed:46,range:145,windup:.82,cooldown:2.3,damage:10,reach:156,projectile:true}:
        kind==='exile'?{aggro:310,speed:93,range:60,windup:.52,cooldown:1.7,damage:19,reach:69,projectile:false}:
        kind==='king'?{aggro:560,speed:87,range:102,windup:.58,cooldown:1.5,damage:29,reach:135,projectile:false}:
        kind==='warden'?{aggro:480,speed:62,range:85,windup:.65,cooldown:1.65,damage:25,reach:112,projectile:false}:
        {aggro:250,speed:82,range:48,windup:.43,cooldown:1.55,damage:14,reach:56,projectile:false};
}
export function shouldStrike(enemy,player,reach){
 const delta=player.x+player.w/2-(enemy.x+enemy.w/2);
 // Un ataque cuerpo a cuerpo no debe golpear al jugador situado detrás del atacante.
 // Tolerancia de 12 px para cuerpos que se solapan al recibir el impacto.
 if((enemy.dir===1 && delta< -12)||(enemy.dir===-1 && delta>12))return false;
 return Math.abs(delta)<=reach&&Math.abs((enemy.y+enemy.h/2)-(player.y+player.h/2))<88;
}
