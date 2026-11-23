import {RELIC_IDS,SHORTCUT_IDS,validIdList} from './exploration-v34.js';
// Save format v2: independent manual slots and autosave; legacy data is read but not deleted.
export const PREFIX='ashen-pilgrimage-save-v2-';
export const LEGACY='ashen-pilgrimage-prototype-v01';
export const SLOTS=['auto','slot1','slot2','slot3'];
export function validateSave(data){
 if(!data||typeof data!=='object'||!data.p)return false;
 const p=data.p;
 if(!Number.isFinite(p.x)||p.x<0||p.x>46600||!Number.isFinite(p.hp)||p.hp<=0||p.hp>100||!Number.isInteger(p.flasks)||p.flasks<0||p.flasks>99||![90,190,2050,3510,5140,6570,7580,9010,10050,11320,13680,15220,16940,17870,19180,20730,22180,23820,25100,26650,27810,29620,30820,32320,33530,34930,36480,37870,39260,41070,42500,43930,45200].includes(p.checkpoint))return false;
 if(!Array.isArray(data.enemies)||![9,12,17,21,24,26,32,36,44,53,57,64,73].includes(data.enemies.length)||!data.enemies.every((e,i)=>e&&typeof e.alive==='boolean'&&Number.isFinite(e.hp)&&e.hp>=-100&&e.hp<=(i===72?960:i>=64?(i===65||i===67||i===70?126:105):i===63?780:i>=57?125:i>=53?115:i===8?180:i===16?320:i===21?420:i===31?480:i===43?560:i===52?650:i>=44?(i===46||i===49?90:110):i>=36?i===38||i===41?74:96:i>=32?88:i>=26?95:i>=24?85:i>=17?78:i>=12?64:i>=9?58:42)))return false;
 if(!Array.isArray(data.secrets)||data.secrets.length!==2||!data.secrets.every(s=>s&&typeof s.taken==='boolean'))return false;
 if(data.loreSeen!==undefined&&(!Array.isArray(data.loreSeen)||data.loreSeen.length!==4||!data.loreSeen.every(v=>typeof v==='boolean')))return false;
 if(data.kills!==undefined&&(!Number.isInteger(data.kills)||data.kills<0||data.kills>73))return false;
 if(data.chapterClear!==undefined&&typeof data.chapterClear!=='boolean')return false;
 if(data.questStage!==undefined&&(!Number.isInteger(data.questStage)||data.questStage<0||data.questStage>3))return false;
 if(data.allegiance!==undefined&&!['none','people','crown'].includes(data.allegiance))return false;
 if(data.districtQuest!==undefined&&(!Number.isInteger(data.districtQuest)||data.districtQuest<0||data.districtQuest>2))return false;
 if(data.forestStage!==undefined&&(!Number.isInteger(data.forestStage)||data.forestStage<0||data.forestStage>3))return false;
 if(data.forestEchoes!==undefined&&(!Array.isArray(data.forestEchoes)||data.forestEchoes.length>3||!data.forestEchoes.every(x=>Number.isInteger(x)&&x>=0&&x<=2)||new Set(data.forestEchoes).size!==data.forestEchoes.length))return false;
 if(data.forestClear!==undefined&&typeof data.forestClear!=='boolean')return false;
 if(data.ossaraStage!==undefined&&(!Number.isInteger(data.ossaraStage)||data.ossaraStage<0||data.ossaraStage>3))return false;
 if(data.ossaraNames!==undefined&&(!Array.isArray(data.ossaraNames)||data.ossaraNames.length>3||!data.ossaraNames.every(x=>Number.isInteger(x)&&x>=0&&x<3)||new Set(data.ossaraNames).size!==data.ossaraNames.length))return false;
 if(data.ossaraClear!==undefined&&typeof data.ossaraClear!=='boolean')return false;
 if(data.salmueraStage!==undefined&&(!Number.isInteger(data.salmueraStage)||data.salmueraStage<0||data.salmueraStage>3))return false;
 if(data.tideMode!==undefined&&!['high','low'].includes(data.tideMode))return false;
 if(data.seaEchoes!==undefined&&(!Array.isArray(data.seaEchoes)||data.seaEchoes.length>3||!data.seaEchoes.every((v,i)=>Number.isInteger(v)&&v===i)))return false;
 if(data.seaClear!==undefined&&typeof data.seaClear!=='boolean')return false;
 if(data.regionClear!==undefined&&typeof data.regionClear!=='boolean')return false;
 if(data.visited!==undefined&&(!Array.isArray(data.visited)||data.visited.length>35||!data.visited.every(v=>Number.isInteger(v)&&v>=0&&v<35)))return false;
 if(data.rootStage!==undefined&&(!Number.isInteger(data.rootStage)||data.rootStage<0||data.rootStage>3))return false;
 if(data.rootRites!==undefined&&(!Array.isArray(data.rootRites)||data.rootRites.length>3||!data.rootRites.every((v,i)=>Number.isInteger(v)&&v===i)))return false;
 if(data.rootClear!==undefined&&typeof data.rootClear!=='boolean')return false;
 if(data.summitStage!==undefined&&(!Number.isInteger(data.summitStage)||data.summitStage<0||data.summitStage>3))return false;
 if(data.summitResonances!==undefined&&(!Array.isArray(data.summitResonances)||data.summitResonances.length>3||!data.summitResonances.every((v,i)=>Number.isInteger(v)&&v===i)))return false;
 if(data.summitClear!==undefined&&typeof data.summitClear!=='boolean')return false;
 if(data.finalStage!==undefined&&(!Number.isInteger(data.finalStage)||data.finalStage<0||data.finalStage>2))return false;
 if(data.solarSeals!==undefined&&(!Array.isArray(data.solarSeals)||data.solarSeals.length>3||!data.solarSeals.every((v,i)=>Number.isInteger(v)&&v===i)))return false;
 if(data.finalClear!==undefined&&typeof data.finalClear!=='boolean')return false;
 if(data.finalEnding!==undefined&&!['none','liberar','custodiar','extinguir'].includes(data.finalEnding))return false;
 if(data.phase!==undefined&&!['intro','playing','won'].includes(data.phase))return false;
 if(data.relicsFound!==undefined&&!validIdList(data.relicsFound,RELIC_IDS))return false;
 if(data.shortcutsOpened!==undefined&&!validIdList(data.shortcutsOpened,SHORTCUT_IDS))return false;
 return true;
}
export function createSaveManager(storage){
 const readKey=key=>{try{const raw=storage.getItem(key);if(raw==null)return null;const data=JSON.parse(raw);return validateSave(data)?data:null}catch{return null}};
 const read=slot=>SLOTS.includes(slot)?readKey(PREFIX+slot):null;
 const write=(slot,data)=>{if(!SLOTS.includes(slot))throw Error('Ranura desconocida');if(!validateSave(data))throw Error('Datos de partida no válidos');storage.setItem(PREFIX+slot,JSON.stringify({...data,version:2,savedAt:new Date().toISOString()}));return true};
 const remove=slot=>{if(!SLOTS.includes(slot))throw Error('Ranura desconocida');storage.removeItem(PREFIX+slot)};
 const slotStatus=slot=>{if(!SLOTS.includes(slot))throw Error('Ranura desconocida');try{const raw=storage.getItem(PREFIX+slot);if(raw==null)return 'empty';return read(slot)?'valid':'corrupt'}catch{return 'inaccessible'}};
 const migrate=()=>{const legacy=readKey(LEGACY);if(legacy&&slotStatus('auto')==='empty')write('auto',legacy);return Boolean(legacy)};
 const byDate=(a,b)=>(Date.parse(b.data.savedAt)||0)-(Date.parse(a.data.savedAt)||0);
 const all=()=>SLOTS.map(slot=>({slot,data:read(slot)})).filter(x=>x.data).sort(byDate);
 const latest=()=>all()[0]||null;
 const latestEnding=()=>all().find(({data})=>['liberar','custodiar','extinguir'].includes(data.finalEnding))||null;
 return {read,write,remove,migrate,latest,latestEnding,slotStatus};
}
