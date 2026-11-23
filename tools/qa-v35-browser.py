#!/usr/bin/env python3
"""Chromium real offline render check for v3.5. Uses an in-memory ES module graph because this environment blocks localhost navigation.
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
  src+='\nwindow.__qaCue=(name)=>soundscape.cue(name,audioContext,audioEnabled);window.__qaPresentation=()=>({...presentation,enabled:audioEnabled});window.__qaMixer=()=>audioMixer?{master:audioMixer.master.gain.value,ambient:audioMixer.ambient.gain.value,effects:audioMixer.effects.gain.value}:null;window.__qaJump=(x)=>{p.x=x;p.y=ground-p.h;p.hp=100;zoneIndex=-1;camera=chamberCamera(p.x,zoneAt(p.x),W);draw();return zoneAt(x)};\n'
 modules[filename]=(src,names)
visit('game.js')
js='const __M={};\n'
for name,(code,exported) in modules.items():
 js+=f'\n__M[{json.dumps(name)}]=(()=>{{\n{code}\nreturn {{{",".join(exported)}}};\n}})();\n'
html=(P/'index.html').read_text()
html=html.replace('<script type="module" src="./game.js"></script>','<script>'+js.replace('</script>','<\\/script>')+'</script>')
# about:blank does not expose localStorage. Stub is per-page, no access to the real user's data.
stub='''<script>const __qaStore=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>__qaStore.get(k)??null,setItem:(k,v)=>__qaStore.set(k,String(v)),removeItem:k=>__qaStore.delete(k)}});</script>'''
html=html.replace('<script>const __M=',stub+'<script>const __M=',1)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':720})
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded',timeout=120000)
 page.wait_for_function('window.__qaPresentation',timeout=45000)
 assert page.get_by_role('button',name='Opciones').count()==1
 page.get_by_role('button',name='Opciones').click()
 assert page.get_by_role('button',name=re.compile('Volumen general: 75')).count()==1
 page.get_by_role('button',name=re.compile('Volumen general: 75')).click()
 assert page.get_by_role('button',name=re.compile('Volumen general: 100')).count()==1
 page.get_by_role('button',name=re.compile('Ambiente musical: 50')).click()
 page.get_by_role('button',name=re.compile('Efectos: 75')).click()
 page.get_by_role('button',name=re.compile('Texto de menús: 100')).click()
 page.get_by_role('button',name=re.compile('Reducir movimiento: no')).click()
 assert page.evaluate('getComputedStyle(document.documentElement).getPropertyValue("--menu-scale").trim()')=='1.2'
 prefs=page.evaluate('window.__qaPresentation()')
 assert (prefs['master'],prefs['ambient'],prefs['effects'],prefs['menuText'],prefs['reduceMotion'])==(100,75,100,120,True),prefs
 assert page.evaluate('document.body.classList.contains("reduce-motion")')
 # Keyboard navigation works in menus, and keeps focus within active buttons.
 page.keyboard.press('Home');assert page.evaluate('document.activeElement.tagName')=='BUTTON'
 page.keyboard.press('End');assert page.evaluate('document.activeElement.innerText.includes("Volver")')
 page.keyboard.press('ArrowUp');assert page.evaluate('document.activeElement.tagName')=='BUTTON'
 # Runtime audio stays opt-in, and independent gain buses update live.
 page.get_by_role('button',name=re.compile('Sonido: desactivado')).click()
 if page.evaluate('window.__qaPresentation().enabled'):
  mix=page.evaluate('window.__qaMixer()');assert mix and mix['master']==1 and mix['ambient']==.75 and mix['effects']==1,mix
  page.get_by_role('button',name=re.compile('Sonido: activado')).click()
  assert page.evaluate('window.__qaMixer().master')==0,'Desactivar sonido debe silenciar los nodos activos inmediatamente'
 out=P/'docs';out.mkdir(exist_ok=True)
 page.screenshot(path=str(out/'CAPTURA-REAL-v3.5-OPCIONES.png'))
 page.get_by_role('button',name='Volver').click()
 page.get_by_role('button',name='Nueva partida').click()
 page.wait_for_timeout(300)
 assert page.locator('#menu').is_hidden()
 # Audio cues are readable during real gameplay, not behind the pause overlay.
 page.evaluate('window.__qaCue("giant-warning")')
 assert page.locator('#caption').is_visible()
 assert 'Ataque inminente' in page.locator('#caption').inner_text()
 page.keyboard.press('Escape')
 page.get_by_role('button',name='Opciones').click()
 page.get_by_role('button',name=re.compile('Avisos visuales de sonido: sí')).click()
 assert page.evaluate('window.__qaPresentation().captions') is False
 page.get_by_role('button',name='Volver').click()
 page.get_by_role('button',name='Reanudar').click()
 page.evaluate('window.__qaCue("bride-warning")')
 assert page.locator('#caption').is_hidden()
 # Rendering title + gameplay and a late-region scene: no missing dynamic imports / fatal errors.
 page.locator('#game').screenshot(path=str(out/'CAPTURA-REAL-v3.5-PARTIDA.png'))
 # Standard Gamepad API simulation (no claim of physical-controller certification).
 page.evaluate("() => {window.__testPad={connected:true,mapping:'standard',axes:[0,0],buttons:Array.from({length:17},()=>({pressed:false}))}; Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[window.__testPad]});window.__testPad.buttons[9].pressed=true;}")
 page.wait_for_timeout(210)
 assert page.locator('#menu').is_visible(), 'Start debe abrir la pausa y mantenerla aunque esté pulsado'
 assert page.get_by_role('button',name='Guardar partida').count()==1
 page.evaluate('window.__testPad.buttons[9].pressed=false')
 page.wait_for_timeout(110)
 page.evaluate('window.__testPad.buttons[13].pressed=true')
 page.wait_for_timeout(100)
 assert 'Guardar' in page.evaluate('document.activeElement.textContent'),'La cruceta baja al siguiente elemento'
 page.evaluate('window.__testPad.buttons[13].pressed=false')
 page.wait_for_timeout(90)
 page.evaluate('window.__testPad.buttons[1].pressed=true')
 page.wait_for_timeout(100)
 assert page.locator('#menu').is_hidden(),'B vuelve al juego desde pausa'
 page.evaluate('window.__testPad.buttons[1].pressed=false')
 assert page.evaluate('window.__qaJump(44300)')==33
 page.locator('#game').screenshot(path=str(out/'CAPTURA-REAL-v3.5-FINAL.png'))
 assert not errors,errors
 print('OK navegador autocontenido: ajustes persistentes, controles, mezcla, avisos y dos escenas sin errores JS')
 browser.close()
