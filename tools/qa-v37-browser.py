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
selected=[0,5,10,18,29,35,39,70]
from PIL import Image,ImageDraw,ImageFont
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':720})
 errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
 print('page.set_content begins',flush=True)
 page.set_content(html,wait_until='domcontentloaded',timeout=120000)
 print('set_content loaded',flush=True)
 print('waiting textures',flush=True)
 page.wait_for_function('window.__qaEnemyState && window.__qaTexturesReady && window.__qaTexturesReady()',timeout=70000)
 print('textures ready',flush=True)
 info=page.evaluate('window.__qaEnemyState()')
 assert info['size']==73
 assert len(info['kinds'])==23 and all(not e['boss'] for e in info['kinds'])
 page.locator('#menuEntries button').filter(has_text='Bestiario · 23 criaturas').click()
 assert page.locator('#menuTitle').inner_text()=='BESTIARIO DE VESPERA'
 assert page.locator('#menuEntries button').count()==24
 page.locator('#menuEntries button').last.click()
 title=page.locator('#menuEntries button').filter(has_text='Nueva partida');title.click()
 page.wait_for_function('window.__qaFreeze && window.__qaEnemyState')
 assert page.locator('#menu').is_hidden()
 # 23 distinct enemy atlas resources loaded and used at their original indices.
 for entry in info['kinds']:
  state=page.evaluate('(idx)=>window.__qaViewEnemy(idx)',entry['index'])
  assert state['visual']==entry['name'],entry
  assert state['view']==state['enemyRoom'],state
 for index in selected:
  v=page.evaluate('(i)=>window.__qaViewEnemy(i)',index)
  path=BASE/'docs'/f'CAPTURA-REAL-v3.7-{index:02d}.png'
  page.locator('#game').screenshot(path=str(path),timeout=40000)
  print('CAPTURA:',index,v['visual'],'en zona',v['view'])
 # Run selected enemy behavior through actual runtime update() with injected local duels.
 melee=page.evaluate('(i)=>window.__qaDuel(i)',5)
 ranged=page.evaluate('(i)=>window.__qaDuel(i)',29)
 guard=page.evaluate('(i)=>window.__qaDuel(i)',10)
 assert melee['windup'] and melee['burst'],melee
 assert ranged['windup'] and ranged['projectile'],ranged
 assert guard['windup'] and not guard['projectile'],guard
 assert not errors,errors
 print('Duels: ',melee,ranged,guard)
 print(f'OK Chromium: {len(info["kinds"])} especies en sus zonas, {len(selected)} capturas reales, 0 errores JavaScript observados.')
 browser.close()
# Eight selected game screenshots assembled into a reference panel (source images are actual canvas).
font_path='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(font_path,18) if Path(font_path).exists() else ImageFont.load_default()
thumbs=[]
for i in selected:
 raw=Image.open(BASE/'docs'/f'CAPTURA-REAL-v3.7-{i:02d}.png').convert('RGB')
 raw.thumbnail((720,405))
 thumbs.append((i,raw))
collage=Image.new('RGB',(1450,4*440+65),(9,12,17))
d=ImageDraw.Draw(collage)
d.text((20,15),'ASHEN PILGRIMAGE v3.7 — 8 ENCUENTROS · CAPTURAS REALES EN CHROMIUM',font=font,fill=(237,202,166))
for n,(i,img) in enumerate(thumbs):
 x=12+(n%2)*725;y=53+(n//2)*440
 collage.paste(img,(x,y))
 d.text((x+8,y+409),next(e['name'] for e in info['kinds'] if e['index']==i),font=font,fill=(226,193,158))
collage.save(BASE/'docs/VISTA-REAL-BESTIARIO-v3.7.jpg',quality=86,optimize=True)
