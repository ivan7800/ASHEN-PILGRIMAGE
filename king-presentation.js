// The king's animation/cues use the same timing contract as the combat simulation.
import {kingAttackTiming} from './boss-clarity.js';
export function kingFrame(e, time=0) {
  if ((e.stagger||0)>0) return e.stagger>.12?12:13;
  const phase=e.phase===2?2:1;
  if(e.windup>0){
    const duration=kingAttackTiming(phase).windup;
    const progress=Math.max(0,Math.min(.999,1-e.windup/duration));
    return phase===2 ? (progress<.38?18:19) : (progress<.30?8:progress<.65?10:11);
  }
  if(e.strike>0 || e.charge>0) return phase===2 ? 19 : 9;
  return Math.floor(time/220)%6;
}
export function kingCue(previous, current) {
  if(!current || !current.alive || current.kind!=='king')return null;
  if(previous?.phase===1 && current.phase===2)return 'phase';
  if((previous?.windup??0)<=0 && current.windup>0)return 'windup';
  if((previous?.windup??0)>0 && current.windup===0)return 'release';
  if(previous?.windup>0 && current.windup>0){
    const threshold=kingAttackTiming(current.phase).windup*.42;
    if(previous.windup>threshold && current.windup<=threshold)return 'warning';
  }
  return null;
}
// Audio only plays after an explicit user gesture has enabled sound. Uses original synthesis.
export function playKingCue(context, cue, volume=.65, output=null) {
  if(!context || !cue)return false;
  const patterns={
    windup:[[155,.18,'sawtooth'],[230,.22,'triangle']],
    warning:[[480,.09,'square'],[580,.11,'square']],
    release:[[110,.15,'sawtooth'],[68,.21,'triangle']],
    phase:[[80,.55,'sawtooth'],[135,.40,'triangle']],
    death:[[200,.32,'triangle'],[92,.65,'sawtooth']]
  };
  const notes=patterns[cue];if(!notes)return false;
  try{
    notes.forEach(([f,d,wave],i)=>{
      const start=context.currentTime+i*.055;
      const oscillator=context.createOscillator(),gain=context.createGain();
      oscillator.type=wave;oscillator.frequency.setValueAtTime(f,start);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(35,f*.67),start+d);
      gain.gain.setValueAtTime(.0001,start);
      gain.gain.linearRampToValueAtTime(Math.min(.085,.047*volume),start+.025);
      gain.gain.exponentialRampToValueAtTime(.0001,start+d);
      oscillator.connect(gain);gain.connect(output||context.destination);oscillator.start(start);oscillator.stop(start+d+.012);
    });
    return true;
  }catch{return false}
}
