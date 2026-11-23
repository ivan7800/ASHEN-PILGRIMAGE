import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const mode=process.argv[2];
if(!mode){
 for(const scenario of ['gate','intro','relic','turnin']){
  const run=spawnSync(process.execPath,[new URL(import.meta.url).pathname,scenario],{encoding:'utf8',timeout:15000});
  assert.equal(run.status,0,`${scenario}: ${run.stdout} ${run.stderr}`);
 }
 console.log('OK: chapter gateway, Erena quest pickup via Desvelo, and quest completion through actual game update()');
}else{
 const noop=()=>{};
 const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});
 const els=new Map(['#game','#status','#audio','#pause','#reset'].map(id=>[id,{getContext:()=>ctx,textContent:'',onclick:null}]));
 globalThis.document={querySelector:k=>els.get(k)};globalThis.Image=class{complete=false;naturalWidth=0;set src(v){this._src=v}};
 globalThis.window={};globalThis.location={reload:noop};Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[]}});
 const enemies=Array.from({length:12},(_,i)=>({hp:i===8?0:i>8?58:42,alive:i!==8}));
 if(mode==='relic')for(let i=9;i<12;i++){enemies[i].alive=false;enemies[i].hp=0;}
 const positions={gate:4837,intro:5070,relic:6060,turnin:5070};
 const phases={gate:0,intro:0,relic:1,turnin:2};
 const saved={p:{x:positions[mode],hp:100,flasks:3,checkpoint:mode==='gate'?3510:5140},enemies,secrets:[{taken:false},{taken:false}],phase:mode==='gate'?'won':'playing',chapterClear:true,questStage:phases[mode]};
 const map=new Map([['ashen-pilgrimage-prototype-v01',JSON.stringify(saved)]]);
 globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 const events={};globalThis.addEventListener=(k,v)=>events[k]=v;
 const frames=[];globalThis.requestAnimationFrame=cb=>frames.push(cb);
 await import('./game.js');let time=performance.now();
 const frame=()=>{time+=16;frames.shift()(time)};
 const tap=key=>{events.keydown({code:key,repeat:false,preventDefault:noop});frame();events.keyup({code:key})};
 frame();
 if(mode==='relic')tap('KeyQ');
 tap('KeyE');
 tap('KeyP');
 const result=JSON.parse(map.get('ashen-pilgrimage-prototype-v01'));
 if(mode==='gate')assert.ok(result.p.x>=4900,`gate x ${result.p.x}`);
 if(mode==='intro')assert.equal(result.questStage,1);
 if(mode==='relic')assert.equal(result.questStage,2);
 if(mode==='turnin')assert.equal(result.questStage,3);
 console.log('OK '+mode);
}
