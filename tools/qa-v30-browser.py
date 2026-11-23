#!/usr/bin/env python3
"""ASHEN v3.0: isolated Chromium render/integration smoke test.
Bundles the actual ES modules and images into an in-memory page to work around
this test environment's blocked localhost navigation. Not a release/OS certification.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image,ImageChops,ImageStat
import re,base64,json
P=Path(__file__).resolve().parents[1];modules={}
def visit(filename):
 if filename in modules:return
 src=(P/filename).read_text()
 imports=re.findall(r"^import\s*\{([^}]+)\}\s*from\s*'\./([^']+)'\s*;",src,re.M)
 for _,dep in imports:visit(dep)
 src=re.sub(r"^import\s*\{([^}]+)\}\s*from\s*'\./([^']+)'\s*;",lambda m:f"const {{{m.group(1)}}}=__M[{json.dumps(m.group(2))}];",src,flags=re.M)
 names=re.findall(r'^export\s+(?:const|let|function|class)\s+(\w+)',src,re.M)
 src=re.sub(r'^export\s+(?=(?:const|let|function|class)\s+)', '',src,flags=re.M)
 if filename=='visual.js':
  def inline(m):
   f=P/m.group(1)
   if not f.exists():raise FileNotFoundError(f)
   return json.dumps('data:'+('image/webp' if f.suffix=='.webp' else 'image/png')+';base64,'+base64.b64encode(f.read_bytes()).decode())
  src=re.sub(r"'\./(assets/[^']+)'",inline,src)
  src+='\nwindow.__qaAssets=()=>Object.fromEntries(Object.entries(art).filter(([k])=>["firstwitness","sunpenitent","solarwraith","ashherald","roomFinalGate","roomFinalGallery","roomFinalEmbers","roomFinalThrone","pilgrim"].includes(k)).map(([k,im])=>[k,im.complete&&im.naturalWidth>0]));\n'
 if filename=='game.js':
  src=src.replace('function loop(now){let dt=', 'function loop(now){if(window.__qaFreeze){requestAnimationFrame(loop);return}let dt=')
  src+='\nwindow.__qaScene=(x,cam,phaseValue=1)=>{p.x=x;p.y=ground-p.h;camera=cam;overlayUntil=0;msgUntil=0;portalGlow=0;summitClear=true;finalStage=1;solarSeals=[0,1,2];enemies[GIANT_BOSS_INDEX].alive=false;enemies[FIRST_WITNESS_INDEX].alive=true;enemies[FIRST_WITNESS_INDEX].phase=phaseValue;enemies[FIRST_WITNESS_INDEX].windup=phaseValue===2?.46:0;enemies[FIRST_WITNESS_INDEX].attackMode=phaseValue===2?\"sunwave\":\"staff\";draw();return {room:zoneAt(x),camera,pHp:p.hp,bossHp:enemies[FIRST_WITNESS_INDEX].hp}};window.__qaCombat=(frames)=>{const before=p.hp;for(let i=0;i<frames;i++)update(1/60);draw();return {before,after:p.hp,frames}};window.__qaEndingMenu=()=>{p.x=46160;finalClear=true;enemies[FIRST_WITNESS_INDEX].alive=false;solarSeals=[0,1,2];showMenu(\"ending\");return menuTitle.textContent};\n'
 modules[filename]=(src,names)
visit('game.js');js='const __M={};\n'
for name,(code,exported) in modules.items():js+=f'\n__M[{json.dumps(name)}]=(()=>{{\n{code}\nreturn {{{",".join(exported)}}};\n}})();\n'
html=(P/'index.html').read_text().replace('<script type="module" src="./game.js"></script>','<script>'+js.replace('</script>','<\\/script>')+'</script>')
def hp(i):
 if i==63:return 780
 if i>=57:return 125 if i==59 else 95
 if i>=53:return 115
 if i==52:return 650
 if i in (46,49):return 90
 if i>=44:return 110
 if i==43:return 560
 if i in (38,41):return 74
 if i>=36:return 96
 return {8:180,16:320,21:420,31:480}.get(i,88 if i>=32 else 95 if i>=26 else 85 if i>=24 else 78 if i>=17 else 64 if i>=12 else 58 if i>=9 else 42)
state={'p':{'x':39740,'hp':100,'flasks':3,'checkpoint':39260},'enemies':[{'hp':0 if i in (8,16,21,31,43,52) else hp(i),'alive':i not in (8,16,21,31,43,52)} for i in range(64)],'secrets':[{'taken':False},{'taken':False}],'phase':'playing','chapterClear':True,'questStage':3,'allegiance':'people','districtQuest':2,'regionClear':True,'forestStage':3,'forestEchoes':[2,0,1],'forestClear':True,'ossaraStage':3,'ossaraNames':[1,0,2],'ossaraClear':True,'salmueraStage':3,'seaEchoes':[0,1,2],'tideMode':'low','seaClear':True,'rootStage':3,'rootRites':[0,1,2],'rootClear':True,'summitStage':3,'summitResonances':[0,1,2],'summitClear':True,'visited':list(range(31))}
mock='''<script>const __qaStore=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(STATE)]]);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>__qaStore.get(k)??null,setItem:(k,v)=>__qaStore.set(k,v),removeItem:k=>__qaStore.delete(k)}});</script>'''.replace('STATE',json.dumps(state,ensure_ascii=False))
html=html.replace('<script>const __M=',mock+'<script>const __M=',1)
out=P/'docs';out.mkdir(exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':720},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded',timeout=90000)
 page.wait_for_function('window.__qaAssets && Object.values(window.__qaAssets()).every(Boolean)',timeout=45000)
 page.get_by_role('button',name='Continuar').click()
 page.wait_for_timeout(1300);page.evaluate('window.__qaFreeze=true')
 shots=[]
 for name,x,cam,phase in [('UMBRAL',40900,40700,1),('GALERIA',42500,42000,1),('BRASAS',43860,43400,1),('TESTIGO-I',45650,45200,1),('TESTIGO-II',45650,45200,2)]:
  result=page.evaluate('([x,cam,phase])=>window.__qaScene(x,cam,phase)',[x,cam,phase]);path=out/f'CAPTURA-REAL-v3.0-{name}.png';page.locator('#game').screenshot(path=str(path));shots.append(path);print(name,result,'bytes',path.stat().st_size)
 a=Image.open(shots[3]).convert('RGB');b=Image.open(shots[4]).convert('RGB')
 delta=ImageChops.difference(a.crop((0,150,1280,600)),b.crop((0,150,1280,600)));v=sum(ImageStat.Stat(delta).mean)/3
 assert v>.6,f'Camera variation did not change scene: {v}'
 assert not errors,errors[:3]
 print('ASSETS',page.evaluate('window.__qaAssets()'))
 print('COMBAT 180 frames',page.evaluate('window.__qaCombat(180)'))
 title=page.evaluate('window.__qaEndingMenu()');assert title=='EL TRONO DEL SOL MUERTO'
 assert page.get_by_role('button',name='EXTINGUIR LA PRISIÓN').count()==1
 page.screenshot(path=str(out/'CAPTURA-REAL-v3.0-ELECCION.png'))
 page.get_by_role('button',name='EXTINGUIR LA PRISIÓN').click()
 assert page.get_by_text('LA NOCHE DE LOS NOMBRES').count()>0
 page.screenshot(path=str(out/'CAPTURA-REAL-v3.0-CREDITOS.png'))
 print('ENDING UI: botones, selección y créditos verificados en Chromium')
 print('OK: isolated Chromium screenshots, four positions, sprite resources, no observed JS errors, camera delta',round(v,2))
 browser.close()
