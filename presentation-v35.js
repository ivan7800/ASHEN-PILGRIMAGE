// ASHEN PILGRIMAGE v3.5 — preferencias locales de presentación y mezcla de audio.
// No forman parte del guardado de campaña; cada navegador mantiene su configuración.
export const PRESENTATION_KEY='ashen-pilgrimage-presentation-v35';
export const DEFAULT_PRESENTATION=Object.freeze({master:75,ambient:50,effects:75,captions:true,menuText:100,reduceMotion:false});
const VOLUME_LEVELS=[0,25,50,75,100];
export function normalizePresentation(input){
 const v=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
 const volume=k=>Number.isInteger(v[k])&&v[k]>=0&&v[k]<=100?v[k]:DEFAULT_PRESENTATION[k];
 return {master:volume('master'),ambient:volume('ambient'),effects:volume('effects'),
  captions:typeof v.captions==='boolean'?v.captions:DEFAULT_PRESENTATION.captions,
  menuText:[100,120,140].includes(v.menuText)?v.menuText:DEFAULT_PRESENTATION.menuText,
  reduceMotion:typeof v.reduceMotion==='boolean'?v.reduceMotion:DEFAULT_PRESENTATION.reduceMotion};
}
export function loadPresentation(storage){try{return normalizePresentation(JSON.parse(storage?.getItem(PRESENTATION_KEY)??'null'))}catch{return {...DEFAULT_PRESENTATION}}}
export function savePresentation(storage,settings){const safe=normalizePresentation(settings);try{storage?.setItem(PRESENTATION_KEY,JSON.stringify(safe));return true}catch{return false}}
export function cycleVolume(value){const n=Number.isInteger(value)?value:75;return VOLUME_LEVELS.find(v=>v>n)??0}
export function nextMenuText(current){const choices=[100,120,140];return choices[(choices.indexOf(current)+1)%choices.length]||100}
export function createAudioMixer(context,settings){
 // Node buses: oscillator -> effects/ambient -> master -> destination.
 const master=context.createGain(),ambient=context.createGain(),effects=context.createGain();
 ambient.connect(master);effects.connect(master);master.connect(context.destination);
 const api={ambient,effects,master,update(s){const v=normalizePresentation(s);master.gain.value=v.master/100;ambient.gain.value=v.ambient/100;effects.gain.value=v.effects/100;}};
 api.update(settings);return api;
}
export function cueCaption(kind){
 if(/^bestiary:[a-z]+:prepare$/.test(kind))return 'Un enemigo prepara un ataque: observa la forma del aviso y su dirección.';
 if(/^bestiary:[a-z]+:release$/.test(kind))return 'El enemigo ejecuta su ataque. Evita el alcance marcado.';
 if(/(warning|final|windup)/.test(kind))return '¡Ataque inminente! Observa la dirección y prepárate para esquivar.';
 if(/(strike|thorn-hit|wave)/.test(kind))return 'Impacto o descarga: evita la zona de peligro.';
 if(/(mistake|fail|error)/.test(kind))return 'El recuerdo no responde. Revisa el orden del ritual.';
 if(/(echo|memory|seal|root-rite|resonance|tide-turn)/.test(kind))return 'Un eco ha resonado y el mundo ha cambiado.';
 if(/(phase)/.test(kind))return 'El enemigo cambia de fase. Sus ataques serán diferentes.';
 if(/(defeat|ending)/.test(kind))return 'Las campanas anuncian una victoria.';
 return '';
}
