#!/usr/bin/env python3
"""Live Chromium rendering of 23 enemy encounters with the actual game renderer.
Offline ES module graph due local HTTP blocked in this environment. QA camera positions
are injected; this is NOT a completed campaign or a physical-controller test.
"""
import base64,json,re
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
modules={}
def visit(filename):
 if filename in modules:return
 source=(BASE/filename).read_text(encoding='utf8')
 imports=re.findall(r"^import\s*\{([^}]+)\}\s*from\s*'\./([^']+)'\s*;",source,re.M)
 for _,dep in imports:visit(dep)
 source=re.sub(r"^import\s*\{([^}]+)\}\s*from\s*'\./([^']+)'\s*;",lambda m:f"const {{{m.group(1)}}}=__M[{json.dumps(m.group(2))}];",source,flags=re.M)
 exports=re.findall(r'^export\s+(?:const|let|function|class)\s+(\w+)',source,re.M)
 source=re.sub(r'^export\s+(?=(?:const|let|function|class)\s+)','',source,flags=re.M)
 if filename=='visual.js':
  def inline(match):
   p=BASE/match.group(1)
   if not p.is_file():raise FileNotFoundError(p)
   return json.dumps(f'data:image/{"webp" if p.suffix==".webp" else "png"};base64,'+base64.b64encode(p.read_bytes()).decode())
  source=re.sub(r"'\./(assets/[^']+)'",inline,source)
  species={f.stem:'data:image/png;base64,'+base64.b64encode(f.read_bytes()).decode() for f in sorted((BASE/'assets/bestiary-v37').glob('*.png'))}
  assert len(species)==23
  source=source.replace('...BESTIARY_ART','...'+json.dumps(species))
  source+='\nwindow.__qaTexturesReady=()=>Object.values(BESTIARY_ART).every(key=>{const species=Object.keys(BESTIARY_ART).find(x=>BESTIARY_ART[x]===key);return art[species]?.naturalWidth===2560&&art[species]?.naturalHeight===160});\n'
 if filename=='game.js':
  source=source.replace('function loop(now){let dt=', 'function loop(now){if(window.__qaFreeze){requestAnimationFrame(loop);return}let dt=')
  source+='''
window.__qaFreeze=true;
window.__qaEnemyState=()=>({size:enemies.length,kinds:BESTIARY.map(e=>({name:e.name,kind:e.kind,index:e.index,at:enemies[e.index].origin,boss:enemies[e.index].boss,alive:enemies[e.index].alive}))});
window.__qaViewEnemy=(i)=>{const e=enemies[i];if(!e)return null;
 p.x=Math.max(zones[zoneAt(e.origin)].start+60,e.origin-190);p.y=ground-p.h;p.vx=0;p.vy=0;p.grounded=true;p.hp=100;p.inv=0;
 e.x=e.origin;e.y=ground-e.h;e.alive=true;e.windup=0;e.strike=0;e.inv=0;
 camera=chamberCamera(p.x,zoneAt(p.x),W);zoneIndex=zoneAt(p.x);overlay='';msgUntil=0;overlayUntil=0;phase='playing';draw();
 return {kind:e.kind,x:e.x,view:zoneAt(p.x),enemyRoom:zoneAt(e.x),visual:BESTIARY.find(v=>v.index===i)?.name||null}
};
window.__qaPose=(i,mode)=>{const e=enemies[i];enemies.forEach((item,j)=>item.alive=j===i);e.alive=true;e.x=e.origin;e.y=ground-e.h;e.windup=mode==='warning'?.85:0;e.strike=mode==='strike'?.12:0;e.dash=0;e.stagger=0;e.motion=mode==='run'?95:0;e.inv=0;p.x=e.origin-175;p.y=ground-p.h;camera=chamberCamera(p.x,zoneAt(e.origin),W);zoneIndex=zoneAt(e.origin);phase='playing';draw();};
window.__qaStep=(i,dt=.016)=>{for(let n=0;n<i;n++)update(dt);draw();return {hp:p.hp,phase,alive:enemies.filter(e=>e.alive).length}};
window.__qaDuel=(i)=>{const focus=enemies[i];enemies.forEach((e,j)=>{e.alive=j===i;e.windup=0;e.strike=0;e.attack=0;e.projectile=0;e.stagger=0;e.inv=0});
 focus.x=focus.origin;focus.y=ground-focus.h;focus.dir=-1;focus.dash=0;
 p.x=focus.x-(bestiarySpec(focus.kind)?.config.projectile?150:64);p.y=ground-p.h;p.vy=0;p.grounded=true;p.hp=100;p.stamina=100;p.inv=0;p.flasks=3;deathDelay=0;paused=false;menuMode=null;hitStop=0;phase='playing';
 let windup=false,projectile=false,burst=false,minHP=p.hp,minStamina=p.stamina;
 for(let n=0;n<320;n++){update(.016);if(focus.windup>0)windup=true;if(focus.projectile>0)projectile=true;if(focus.dash>0)burst=true;minHP=Math.min(minHP,p.hp);minStamina=Math.min(minStamina,p.stamina)}
 return {kind:focus.kind,windup,projectile,burst,minHP,minStamina}
};
'''
 modules[filename]=(source,exports)
visit('game.js')
js='const __M={};\n'
for name,(code,exported) in modules.items():
 js+=f'\n__M[{json.dumps(name)}]=(()=>{{\n{code}\nreturn {{{",".join(exported)}}};\n}})();\n'
html=(BASE/'index.html').read_text(encoding='utf8').replace('<script type="module" src="./game.js"></script>','<script>'+js.replace('</script>','<\\/script>')+'</script>')
html=html.replace('<script>const __M=', '''<script>const __qaLocal=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>__qaLocal.get(k)??null,setItem:(k,v)=>__qaLocal.set(k,String(v)),removeItem:k=>__qaLocal.delete(k)}})</script><script>const __M=''')
print('HTML MB',round(len(html)/1e6,1),flush=True)
from PIL import Image,ImageDraw,ImageFont
indices=[0,5,10,18,29,35,39,70]
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':720});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded',timeout=120000)
 page.wait_for_function('window.__qaPose&&window.__qaTexturesReady&&window.__qaTexturesReady()',timeout=70000)
 page.locator('#menuEntries button').filter(has_text='Nueva partida').click()
 for index in indices:
  for mode in ('warning','strike'):
   page.evaluate('([i,m])=>window.__qaPose(i,m)',[index,mode]);page.locator('#game').screenshot(path=str(BASE/'docs'/f'V38-{index:02d}-{mode}.png'))
 assert not errors,errors
 browser.close()
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(fontpath,18) if Path(fontpath).exists() else ImageFont.load_default()
board=Image.new('RGB',(1450,8*220+60),(9,13,20));draw=ImageDraw.Draw(board)
draw.text((14,13),'ASHEN PILGRIMAGE v3.8 | 8 CRIATURAS, AVISO E IMPACTO | CAPTURAS REALES',font=font,fill=(230,191,160))
for row,index in enumerate(indices):
 for col,mode in enumerate(('warning','strike')):
  im=Image.open(BASE/'docs'/f'V38-{index:02d}-{mode}.png').convert('RGB');im.thumbnail((710,195));x=12+col*723;y=50+row*220;board.paste(im,(x,y))
  draw.text((x+5,y+197),f'{index:02d} · {mode}',font=font,fill=(220,191,163))
board.save(BASE/'docs/VISTA-REAL-ANIMACIONES-v3.8.jpg',quality=84,optimize=True)
print('OK Chromium 16 in-engine renders: warnings/strikes 8 enemies; no JS exceptions')
