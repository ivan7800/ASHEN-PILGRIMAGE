#!/usr/bin/env python3
"""Compara dos posiciones de cámara en Chromium sin red usando los módulos reales.
No certifica movimiento físico ni la ejecución HTTP; solo renderizado y desplazamiento.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image,ImageChops,ImageStat
import re,base64,json
P=Path(__file__).resolve().parents[1]
modules={}
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
   if not f.exists():return m.group(0)
   return json.dumps('data:'+('image/webp' if f.suffix=='.webp' else 'image/png')+';base64,'+base64.b64encode(f.read_bytes()).decode())
  src=re.sub(r"'\./(assets/[^']+)'",inline,src)
  src+='\nwindow.__qaSeaAssets=()=>Object.fromEntries(Object.entries(art).filter(([k])=>["drowned","sirene","saltguard","seaFar","seaMid","seaFoam"].includes(k)).map(([k,im])=>[k,im.complete&&im.naturalWidth>0]));\n'
 if filename=='game.js':
  src=src.replace('function loop(now){let dt=', 'function loop(now){if(window.__qaFreeze){requestAnimationFrame(loop);return}let dt=')
  src+='\nwindow.__qaSeaView=(x,cam)=>{p.x=x;camera=cam;overlayUntil=0;msgUntil=0;portalGlow=0;draw();return {x:p.x,cam:camera}};\n'
 modules[filename]=(src,names)
visit('game.js')
js='const __M={};\n'
for name,(src,names) in modules.items():
 js+=f'\n__M[{json.dumps(name)}]=(()=>{{\n{src}\nreturn {{{",".join(names)}}};\n}})();\n'
html=(P/'index.html').read_text().replace('<script type="module" src="./game.js"></script>','<script>'+js.replace('</script>','<\\/script>')+'</script>')
def hp(i):
 return 650 if i==52 else 90 if i in (46,49) else 110 if i>=44 else 560 if i==43 else 74 if i in (38,41) else 96 if i>=36 else 180 if i==8 else 320 if i==16 else 420 if i==21 else 480 if i==31 else 88 if i>=32 else 95 if i>=26 else 85 if i>=24 else 78 if i>=17 else 64 if i>=12 else 58 if i>=9 else 42
state={"p":{"x":22600,"hp":100,"flasks":3,"checkpoint":22180},"enemies":[{"hp":0 if i in (8,16,21,31) else hp(i),"alive":i not in (8,16,21,31)} for i in range(53)],"secrets":[{"taken":False},{"taken":False}],"phase":"playing","chapterClear":True,"questStage":3,"allegiance":"people","districtQuest":2,"regionClear":True,"forestStage":3,"forestEchoes":[2,0,1],"forestClear":True,"ossaraStage":3,"ossaraNames":[1,0,2],"ossaraClear":True,"salmueraStage":3,"seaEchoes":[],"tideMode":"high","seaClear":False,"visited":list(range(26)),"rootStage":0,"rootRites":[],"rootClear":False}
store='''<script>const __qaStore=new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(STATE)]]);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>__qaStore.get(k)??null,setItem:(k,v)=>__qaStore.set(k,v),removeItem:k=>__qaStore.delete(k)}});</script>'''.replace('STATE',json.dumps(state))
html=html.replace('<script>const __M=',store+'<script>const __M=',1)
out=P/'docs';out.mkdir(exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':720},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded',timeout=30000)
 page.wait_for_function('window.__qaSeaAssets && Object.values(window.__qaSeaAssets()).every(Boolean)',timeout=30000)
 page.get_by_role('button',name='Continuar').click()
 page.wait_for_timeout(1700)
 page.evaluate('window.__qaFreeze=true')
 shots=[]
 for name,x,cam in [('MUELLE-A',22600,22070),('MUELLE-B',22600,22210),('CAPILLA',25580,25220)]:
  probe=page.evaluate('([x,cam])=>window.__qaSeaView(x,cam)',[x,cam])
  path=out/f'CAPTURA-SALMUERA-v2.7-{name}.png';page.locator('#game').screenshot(path=str(path));shots.append(path)
  print(name,probe,'size',path.stat().st_size)
 img1=Image.open(shots[0]).convert('RGB');img2=Image.open(shots[1]).convert('RGB')
 # Restrict to scenery, not HUD and hero. The pixel differences come from moving backgrounds.
 upper=ImageChops.difference(img1.crop((0,160,1280,425)),img2.crop((0,160,1280,425)))
 mean=sum(ImageStat.Stat(upper).mean)/3
 assert mean>1.2,f'Parallax did not change across camera poses ({mean:.3f})'
 assert not errors,f'Chromium errors: {errors[:4]}'
 print('OK render: 3 real screenshots, no JS errors, parallax delta mean',round(mean,2),'assets:',page.evaluate('window.__qaSeaAssets()'))
 browser.close()
