#!/usr/bin/env python3
"""Chromium real offline render check for v3.6. Uses an in-memory ES module graph because this environment blocks localhost navigation.
Does NOT establish full-campaign, hardware gamepad or Windows testing.
"""
from pathlib import Path
import base64,json,re
from playwright.sync_api import sync_playwright
P=Path(__file__).resolve().parents[1]
modules={}
def visit(filename):
 if filename in modules:return
 src=(P/filename).read_text()
 imports=re.findall(r"^import\s*\{([^}]+)\}\s*from\s*'\./([^']+)'\s*;",src,re.M)
 for _,dep in imports:visit(dep)
 src=re.sub(r"^import\s*\{([^}]+)\}\s*from\s*'\./([^']+)'\s*;",lambda m:f"const {{{m.group(1)}}}=__M[{json.dumps(m.group(2))}];",src,flags=re.M)
 names=re.findall(r'^export\s+(?:const|let|function|class)\s+(\w+)',src,re.M)
 src=re.sub(r'^export\s+(?=(?:const|let|function|class)\s+)','',src,flags=re.M)
 if filename=='visual.js':
  def inline(m):
   f=P/m.group(1)
   if not f.is_file():raise FileNotFoundError(f)
   return json.dumps('data:'+('image/webp' if f.suffix=='.webp' else 'image/png')+';base64,'+base64.b64encode(f.read_bytes()).decode())
  src=re.sub(r"'\./(assets/[^']+)'",inline,src)
 if filename=='game.js':
  src=src.replace('function loop(now){let dt=', 'function loop(now){if(window.__qaFreeze){requestAnimationFrame(loop);return}let dt=')
  src+='\nwindow.__qaFreeze=false;window.__qaState=()=>({phase,menuMode,x:p.x,zone:zoneAt(p.x),saved:manager.latest()?.slot||null,damaged:manager.slotStatus("auto")});window.__qaJump=(x)=>{p.x=x;p.y=ground-p.h;p.hp=100;zoneIndex=-1;camera=chamberCamera(p.x,zoneAt(p.x),W);draw();return zoneAt(x)};\n'
 modules[filename]=(src,names)
visit('game.js')
js='const __M={};\n'
for name,(code,exported) in modules.items():
 js+=f'\n__M[{json.dumps(name)}]=(()=>{{\n{code}\nreturn {{{",".join(exported)}}};\n}})();\n'
html=(P/'index.html').read_text()
html=html.replace('<script type="module" src="./game.js"></script>','<script>'+js.replace('</script>','<\\/script>')+'</script>')
# about:blank does not expose localStorage. Stub is per-page, no access to the real user's data.
fixture={'p':{'x':530,'hp':82,'flasks':2,'checkpoint':90},'enemies':[{'hp':180 if i==8 else 42,'alive':True} for i in range(9)],'secrets':[{'taken':False},{'taken':True}],'phase':'playing'}
stub='''<script>const __qaStore=new Map([['ashen-pilgrimage-save-v2-auto','{\"incompleto\":'],['ashen-pilgrimage-prototype-v01',JSON.stringify(LEGACY_FIXTURE)]]);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>__qaStore.get(k)??null,setItem:(k,v)=>__qaStore.set(k,String(v)),removeItem:k=>__qaStore.delete(k)}});</script>'''.replace('LEGACY_FIXTURE',json.dumps(fixture))
html=html.replace('<script>const __M=',stub+'<script>const __M=',1)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':720},accept_downloads=True)
 errors=[]
 page.on('pageerror',lambda error:errors.append(str(error)))
 page.set_content(html,wait_until='domcontentloaded',timeout=120000)
 page.wait_for_function('window.__qaState',timeout=45000)
 assert page.evaluate('window.__qaState().damaged')=='corrupt'
 assert page.locator('#menuError').inner_text().find('dañada')!=-1
 page.screenshot(path=str(P/'docs'/'CAPTURA-QA-v3.6-GUARDADO-DANADO.png'))
 assert page.evaluate('localStorage.getItem("ashen-pilgrimage-save-v2-auto")')=='{"incompleto":'
 page.get_by_role('button',name='Nueva partida').click()
 assert 'dañado' in page.locator('#menuDescription').inner_text()
 page.get_by_role('button',name='Cancelar').click()
 assert page.evaluate('localStorage.getItem("ashen-pilgrimage-save-v2-auto")')=='{"incompleto":'
 page.get_by_role('button',name='Nueva partida').click()
 page.get_by_role('button',name='Sí, iniciar nueva partida').click()
 assert page.locator('#menu').is_hidden()
 assert page.evaluate('window.__qaState().saved')=='auto'
 assert page.evaluate('JSON.parse(localStorage.getItem("ashen-pilgrimage-save-v2-auto")).p.x')==90
 assert page.evaluate('JSON.parse(localStorage.getItem("ashen-pilgrimage-prototype-v01")).p.x')==530
 # Guardar -> título -> cargar debe funcionar en el navegador real.
 page.keyboard.press('Escape')
 page.get_by_role('button',name='Guardar partida').click()
 page.get_by_role('button',name=re.compile('Ranura 1')).click()
 assert page.evaluate('JSON.parse(localStorage.getItem("ashen-pilgrimage-save-v2-slot1")).p.x')==90
 page.get_by_role('button',name='Volver al menú principal').click()
 page.get_by_role('button',name='Continuar').click()
 assert page.locator('#menu').is_hidden()
 # Todas las cámaras se dibujan con el motor actual. QA mueve únicamente la cámara/posición,
 # nunca simula haber superado los puzles ni derrotado los jefes.
 page.evaluate('window.__qaFreeze=true')
 zones=[]
 for item in re.finditer(r"name:'([^']+)',start:(\d+),end:(\d+)", (P/'chambers.js').read_text()):
  zones.append((item.group(1),int(item.group(2)),int(item.group(3))))
 assert len(zones)==35
 positions=[0,5,8,12,16,21,25,29,34]
 import time,statistics
 times=[];shot_names=[]
 for i,(name,start,end) in enumerate(zones):
  center=(start+end)//2
  elapsed=page.evaluate('(x)=>{const t=performance.now();const room=window.__qaJump(x);return {room,ms:performance.now()-t}}',center)
  assert elapsed['room']==i, (i,elapsed)
  times.append(elapsed['ms'])
  if i in positions:
   shot=P/'docs'/f'CAPTURA-QA-v3.6-ZONA-{i:02}.png'
   page.locator('#game').screenshot(path=str(shot))
   shot_names.append(shot.name)
 assert not errors,errors
 # Muestra microbenchmark; no FPS garantizados ni prueba de un recorrido humano.
 print('OK Chromium autocontenido: menú de datos dañados, confirmación, nueva partida, guardar, continuar y 35/35 escenas.')
 print('Render dibujado (ms por escena; no son FPS): media',round(statistics.mean(times),2),'p95',round(sorted(times)[int(.95*(len(times)-1))],2),'capturas',len(shot_names))
 print('Errores JS:',errors)
 browser.close()
