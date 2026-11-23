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
  src+='\nwindow.__qaFocus=()=>({pressed:pressed.size,held:keys.size,paused,menuMode});window.__qaDifficultyHit=mode=>{const old=difficulty;difficulty=mode;p.hp=100;p.inv=0;damagePlayer(30,p.x,"QA");const lost=100-p.hp;p.hp=100;p.inv=0;difficulty=old;return lost};\n'
  src+='\nwindow.__qaScene=(x,cam,phaseValue=1)=>{p.x=x;p.y=ground-p.h;camera=cam;overlayUntil=0;msgUntil=0;portalGlow=0;summitClear=true;finalStage=1;solarSeals=[0,1,2];enemies[GIANT_BOSS_INDEX].alive=false;enemies[FIRST_WITNESS_INDEX].alive=true;enemies[FIRST_WITNESS_INDEX].phase=phaseValue;enemies[FIRST_WITNESS_INDEX].windup=phaseValue===2?.46:0;enemies[FIRST_WITNESS_INDEX].attackMode=phaseValue===2?\"sunwave\":\"staff\";draw();return {room:zoneAt(x),camera,pHp:p.hp,bossHp:enemies[FIRST_WITNESS_INDEX].hp}};window.__qaCombat=(frames)=>{const before=p.hp;for(let i=0;i<frames;i++)update(1/60);draw();return {before,after:p.hp,frames}};window.__qaGraphicsScene=(mode,x,cam)=>{graphicsMode=mode;window.__qaScene(x,cam);return graphicsMode};window.__qaEndingMenu=()=>{p.x=46160;finalClear=true;enemies[FIRST_WITNESS_INDEX].alive=false;solarSeals=[0,1,2];showMenu(\"ending\");return menuTitle.textContent};\n'
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
 browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox','--disable-dev-shm-usage'])
 page = browser.new_page(viewport={'width':1280,'height':720},accept_downloads=True)
 errors=[]
 page.on('pageerror',lambda error:errors.append(str(error)))
 page.set_content(html,wait_until='domcontentloaded',timeout=90000)
 page.wait_for_function('window.__qaAssets && Object.values(window.__qaAssets()).every(Boolean)',timeout=45000)
 page.get_by_role('button',name='Opciones').click()
 assert page.get_by_role('button',name='Dificultad: Normal').count()==1
 page.get_by_role('button',name='Dificultad: Normal').click()
 assert page.get_by_role('button',name='Dificultad: Penitencia').count()==1
 assert page.evaluate('localStorage.getItem("ashen-pilgrimage-difficulty-v33")')=='penance'
 page.get_by_role('button',name='Dificultad: Penitencia').click()
 assert page.get_by_role('button',name='Dificultad: Peregrino').count()==1
 page.get_by_role('button',name='Dificultad: Peregrino').click()
 assert page.get_by_role('button',name='Dificultad: Normal').count()==1
 assert page.get_by_role('button',name='Gráficos: Cinematográfico').count()==1
 page.get_by_role('button',name='Gráficos: Cinematográfico').click()
 assert page.get_by_role('button',name='Gráficos: Legibilidad alta').count()==1
 assert page.evaluate('localStorage.getItem("ashen-pilgrimage-graphics-v32")')=='clarity'
 page.get_by_role('button',name='Gráficos: Legibilidad alta').click()
 assert page.get_by_role('button',name='Gráficos: Rendimiento').count()==1
 page.get_by_role('button',name='Gráficos: Rendimiento').click()
 assert page.get_by_role('button',name='Gráficos: Cinematográfico').count()==1
 page.get_by_role('button',name='Volver').click()
 page.get_by_role('button',name='Copias de seguridad JSON').click()
 assert page.get_by_text('COPIAS DE SEGURIDAD').count() > 0
 with page.expect_download(timeout=12000) as d:
  page.get_by_role('button',name='Exportar partidas').click()
 download=d.value
 assert download.suggested_filename == 'ashen-pilgrimage-guardados.json'
 exported=Path(download.path()).read_text()
 bundle=json.loads(exported)
 assert bundle['format']=='ashen-pilgrimage-backup-v1'
 assert 'auto' in bundle['slots']
 with page.expect_file_chooser(timeout=12000) as fc:
  page.get_by_role('button',name='Importar partidas').click()
 fc.value.set_files({'name':'backups.json','mimeType':'application/json','buffer':exported.encode('utf-8')})
 page.get_by_role('button',name='Cancelar').click()
 assert page.get_by_role('button',name='Importar partidas').count() == 1
 with page.expect_file_chooser(timeout=12000) as fc:
  page.get_by_role('button',name='Importar partidas').click()
 fc.value.set_files({'name':'backups.json','mimeType':'application/json','buffer':exported.encode('utf-8')})
 page.get_by_role('button',name='Sí, restaurar copia').click()
 assert page.get_by_role('button',name='Continuar').count() == 1
 assert 'restaurada' in page.locator('#menuError').inner_text()
 page.get_by_role('button',name='Copias de seguridad JSON').click()
 page.screenshot(path=str(P/'docs'/'CAPTURA-REAL-v3.3-RESPALDOS.png'))
 page.get_by_role('button',name='Volver').click()
 page.get_by_role('button',name='Continuar').click()
 page.wait_for_timeout(300)
 assert page.evaluate('window.__qaDifficultyHit("pilgrim")')==23
 assert page.evaluate('window.__qaDifficultyHit("normal")')==30
 assert page.evaluate('window.__qaDifficultyHit("penance")')==38
 page.keyboard.down('d')
 page.evaluate('window.dispatchEvent(new Event("blur"))')
 focus=page.evaluate('window.__qaFocus()')
 assert focus['menuMode']=='pause' and focus['held']==0 and focus['pressed']==0,focus
 page.get_by_role('button',name='Reanudar').click()
 page.keyboard.up('d')
 page.wait_for_timeout(350)
 page.evaluate('window.__qaFreeze=true')
 from PIL import Image, ImageStat
 summaries=[]
 for idx, room in enumerate(__import__('re').findall(r"name:'([^']+)',start:(\d+),end:(\d+)", (P/'chambers.js').read_text())):
  name,start,end=room;start,end=int(start),int(end);x=(start+end)/2
  scene=page.evaluate('([x,cam])=>window.__qaScene(x,cam)',[x,max(start,x-360)])
  assert scene['room']==idx,(idx,scene)
  if idx in (0,5,8,12,16,22,26,31,34):
   shot=P/'docs'/f'CAPTURA-REAL-v3.3-ZONA-{idx:02}.png'
   page.locator('#game').screenshot(path=str(shot))
   img=Image.open(shot).convert('RGB')
   st=ImageStat.Stat(img)
   summaries.append((idx,name,round(sum(st.stddev)/3,1),shot.stat().st_size))
 assert len(summaries)==9
 assert min(item[2] for item in summaries)>8,'captura monocroma o potencialmente vacía'
 # Same camera position, three visual presets; this is not a gameplay completion test.
 mode_shots=[]
 for mode in ('cinematic','clarity','performance'):
  assert page.evaluate('([mode,x,cam])=>window.__qaGraphicsScene(mode,x,cam)',[mode,20100,19850])==mode
  imagepath=P/'docs'/f'CAPTURA-v3.3-SALMUERA-{mode}.png'
  page.locator('#game').screenshot(path=str(imagepath))
  mode_shots.append(Image.open(imagepath).convert('RGB'))
 compare=ImageStat.Stat(ImageChops.difference(mode_shots[0],mode_shots[1])).mean
 assert sum(compare)/3>.3,compare
 print('Modes: cinematic, clarity, performance; mean pixel diff=',round(sum(compare)/3,2))
 assert not errors,errors
 print('ZONAS 35/35; muestras visuales (id,nombre,desv RGB,bytes):',summaries)

 print('OK Chromium v3.3: descarga JSON, selector de archivo, cancelación, confirmación, restauración, volver al título y recursos.',len(exported),'bytes')
 browser.close()
