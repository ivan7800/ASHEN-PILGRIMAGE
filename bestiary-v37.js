// ASHEN PILGRIMAGE · Bestiario de Vespera v3.7
// Las posiciones son índices de ENCUENTROS NORMALES ya existentes.
// Nunca se insertan ni reordenan entradas en el array de enemigos:
// los guardados históricos y las condiciones de misiones siguen apuntando a los mismos índices.
const rows = [
 // key, nombre, índice estable, región, rol, color, ancho visual, alto visual, vida de colisión (ancho/alto), parámetros
 ['corruptpilgrim','Peregrino Corrompido',0,'Criptas','Espadachín en duelo','#d39168',120,144,32,57, {aggro:290,speed:80,range:70,windup:.69,cooldown:1.9,damage:13,reach:82}],
 ['vesperaguard','Guardia de Vespera',10,'Valdren','Escudo frontal','#d2b480',139,154,39,62, {aggro:315,speed:54,range:72,windup:.88,cooldown:2.25,damage:18,reach:100,shield:.52}],
 ['sunfanatic','Fanático del Sol',65,'Heliófago','Invocador solar','#e5ac56',145,153,32,61,{aggro:430,speed:46,range:183,windup:1.13,cooldown:2.5,damage:19,reach:191,projectile:true,projectileSpeed:245,retreat:96,staminaDrain:7}],
 ['cryptscavenger','Carroñero de Cripta',2,'Criptas','Emboscada veloz','#ba6c5b',117,119,38,43,{aggro:270,speed:126,range:52,windup:.55,cooldown:1.78,damage:12,reach:68,burst:165}],
 ['ashhound','Perro de Ceniza',5,'Criptas','Carga en carrera','#cf6c58',157,112,52,40,{aggro:340,speed:143,range:55,windup:.64,cooldown:2.15,damage:16,reach:77,burst:255}],
 ['wailingspecter','Espectro Lamentoso',7,'Criptas','Proyectiles espectrales','#9cc8d5',138,144,32,57,{aggro:350,speed:63,range:157,windup:.99,cooldown:2.15,damage:11,reach:168,projectile:true,projectileSpeed:230,retreat:82,staminaDrain:8}],
 ['severedmonk','Monje Degollado',26,'Ossara','Verdugo de alcance largo','#b59a7e',143,152,34,61,{aggro:330,speed:55,range:89,windup:.98,cooldown:2.45,damage:24,reach:113}],
 ['brineworm','Verme de la Salmuera',35,'Salmuera','Escupe sal abisal','#d39aa0',164,113,57,42,{aggro:378,speed:37,range:171,windup:1.16,cooldown:2.5,damage:16,reach:189,projectile:true,projectileSpeed:160,retreat:65}],
 ['namelessdrowned','Ahogado sin Nombre',37,'Salmuera','Hostigador húmedo','#9aab92',134,145,38,58,{aggro:310,speed:94,range:68,windup:.77,cooldown:1.86,damage:17,reach:89}],
 ['rottensiren','Sirena Putrefacta',40,'Salmuera','Canto agotador','#81b5b0',131,149,36,54,{aggro:425,speed:48,range:182,windup:1.13,cooldown:2.65,damage:16,reach:196,projectile:true,projectileSpeed:214,retreat:100,staminaDrain:14}],
 ['chainedcastaway','Náufrago Encadenado',34,'Salmuera','Golpe pesado de ancla','#c7a381',148,151,42,63,{aggro:305,speed:45,range:94,windup:1.1,cooldown:2.7,damage:24,reach:110,staminaDrain:8}],
 ['fungalsporer','Esporador Fúngico',18,'Brezaluna','Esporas a distancia','#e9a871',149,132,40,51,{aggro:365,speed:43,range:163,windup:1.04,cooldown:2.6,damage:12,reach:174,projectile:true,projectileSpeed:177,retreat:90,staminaDrain:7}],
 ['crustplague','Plaga de la Costra',19,'Brezaluna','Enjambre acosador','#b28d69',137,103,48,39,{aggro:290,speed:140,range:55,windup:.57,cooldown:1.72,damage:13,reach:75,burst:175}],
 ['sporematriarch','Matriarca de Esporas',23,'Brezaluna','Esporas lentas y tenaces','#e4a66d',166,151,49,66,{aggro:410,speed:32,range:174,windup:1.2,cooldown:2.9,damage:19,reach:186,projectile:true,projectileSpeed:145,retreat:65,staminaDrain:8,armor:.89}],
 ['saltgolem','Gólem de Sal',39,'Salmuera','Coloso acorazado','#bfc7c8',160,158,54,72,{aggro:310,speed:35,range:86,windup:1.24,cooldown:2.75,damage:27,reach:106,armor:.73}],
 ['abyssraven','Cuervo del Abismo',58,'Cumbres','Hostigador aéreo','#9b85b7',159,117,39,44,{aggro:415,speed:105,range:170,windup:.95,cooldown:2.1,damage:17,reach:182,projectile:true,projectileSpeed:290,retreat:102}],
 ['ruinsentinel','Vigía de Ruina',28,'Ossara','Centinela inamovible','#c4b39d',147,154,38,65,{aggro:350,speed:52,range:91,windup:1.0,cooldown:2.45,damage:23,reach:106,shield:.66}],
 ['voidherald','Heraldo del Vacío',68,'Heliófago','Rito de largo alcance','#b79cc8',150,165,36,62,{aggro:470,speed:51,range:194,windup:1.15,cooldown:2.6,damage:21,reach:207,projectile:true,projectileSpeed:220,retreat:114,staminaDrain:14}],
 ['sigilabomination','Abominación de las Sigilas',47,'Hojaclara','Monstruo pesado','#c58282',161,146,55,64,{aggro:360,speed:55,range:87,windup:1.02,cooldown:2.5,damage:25,reach:115,armor:.81}],
 ['disfigured','El Desfigurado',60,'Cumbres','Bruto aplastante','#be9289',164,158,52,70,{aggro:340,speed:41,range:96,windup:1.15,cooldown:2.72,damage:27,reach:121,staminaDrain:7,armor:.88}],
 ['dreamweaver','Tejedor de Sueños',29,'Ossara','Hechicería agotadora','#bca5d0',162,156,37,63,{aggro:410,speed:58,range:170,windup:1.07,cooldown:2.52,damage:18,reach:181,projectile:true,projectileSpeed:200,retreat:115,staminaDrain:16}],
 ['namecorrupter','Corruptor de Nombres',30,'Ossara','Magia de olvido','#c4a5d6',150,163,37,63,{aggro:448,speed:43,range:188,windup:1.2,cooldown:2.77,damage:19,reach:200,projectile:true,projectileSpeed:208,retreat:118,staminaDrain:20}],
 ['devotedflesh','La Carne Devota',70,'Heliófago','Horror devorador','#d78590',174,155,63,68,{aggro:378,speed:57,range:105,windup:1.11,cooldown:2.63,damage:29,reach:130,armor:.86,staminaDrain:9}]
];
export const BESTIARY = Object.freeze(rows.map(([kind,name,index,realm,role,color,visualWidth,visualHeight,hitWidth,hitHeight,config])=>Object.freeze({kind,name,index,realm,role,color,visualWidth,visualHeight,hitWidth,hitHeight,config:Object.freeze({...config,projectile:!!config.projectile})})));
export const BESTIARY_BY_KIND = Object.freeze(Object.fromEntries(BESTIARY.map(entry=>[entry.kind,entry])));
export const BESTIARY_AT_INDEX = Object.freeze(Object.fromEntries(BESTIARY.map(entry=>[entry.index,entry.kind])));
export const BESTIARY_ART = Object.freeze(Object.fromEntries(BESTIARY.map(entry=>[entry.kind,`./assets/bestiary-v37/${entry.kind}.png`])));
export const BESTIARY_BEHAVIORS = Object.freeze(Object.fromEntries(BESTIARY.map(entry=>{
 const {config}=entry;
 return [entry.kind,{aggro:config.aggro,speed:config.speed,range:config.range,windup:config.windup,cooldown:config.cooldown,damage:config.damage,reach:config.reach,projectile:config.projectile}];
})));
export const bestiarySpec = kind=>BESTIARY_BY_KIND[kind]||null;
export function bestiaryFrame(enemy,time){
 if(enemy.windup>0)return 8+(Math.floor(time/145)%2);
 if(enemy.strike>0||enemy.dash>0)return 10+Math.floor(time/110)%2;
 if(enemy.stagger>0)return 16;
 return Math.abs(enemy.motion||0)>9?Math.floor(time/145)%8:4+Math.floor(time/650)%2;
}
export function bestiaryDamage(original,enemy,player){
 const c=bestiarySpec(enemy.kind)?.config;
 if(!c)return original;
 const facing=(player.x+player.w/2 < enemy.x+enemy.w/2?-1:1)===enemy.dir;
 return Math.max(1,Math.round(original*(c.armor||1)*(facing?(c.shield||1):1)));
}
export function bestiaryStaminaDrain(kind){return bestiarySpec(kind)?.config.staminaDrain||0}
export function bestiaryProjectileSpeed(kind){return bestiarySpec(kind)?.config.projectileSpeed||null}
export function bestiaryRetreat(kind){return bestiarySpec(kind)?.config.retreat||0}
export function bestiaryBurst(kind){return bestiarySpec(kind)?.config.burst||0}
