#!/usr/bin/env python3
"""Real Chromium DOM/player input journey starting from empty save storage.

No altered player state, no prepared mission flags, no teleportation. ES modules and
image resources are bundled in memory because Chromium local URLs are blocked by
this execution environment. This is NOT a 35-chamber human campaign.
"""
import base64, json, re
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
modules={}
def load(filename):
 if filename in modules:return
 source=(ROOT/filename).read_text(encoding='utf-8')
 imports=re.findall(r"^import\s*\{([^}]+)\}\s*from\s*'\./([^']+)'\s*;",source,re.M)
 for _,dep in imports:load(dep)
 source=re.sub(r"^import\s*\{([^}]+)\}\s*from\s*'\./([^']+)'\s*;",lambda m:f"const {{{m.group(1)}}}=__M[{json.dumps(m.group(2))}];",source,flags=re.M)
 exports=re.findall(r'^export\s+(?:const|let|function|class)\s+(\w+)',source,re.M)
 source=re.sub(r'^export\s+(?=(?:const|let|function|class)\s+)','',source,flags=re.M)
 if filename=='visual.js':
  def inline(m):
   path=ROOT/m.group(1)
   if not path.is_file():raise FileNotFoundError(path)
   mime='image/webp' if path.suffix=='.webp' else 'image/png'
   return json.dumps('data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode('ascii'))
  source=re.sub(r"'\./(assets/[^']+)'",inline,source)
  sprites={p.stem:'data:image/png;base64,'+base64.b64encode(p.read_bytes()).decode('ascii') for p in sorted((ROOT/'assets/bestiary-v37').glob('*.png'))}
  assert len(sprites)==23
  source=source.replace('...BESTIARY_ART','...'+json.dumps(sprites))
 # Read-only QA observations (no changes to game state).
 if filename=='game.js':
  source+='\nwindow.__v40Read=()=>({phase,position:p.x,hp:p.hp,zone:zoneAt(p.x),menu:menuMode,stored:manager.latest()?.slot||null,ended:finalEnding,paused});\n'
 modules[filename]=(source,exports)
load('game.js')
js='const __M={};\n'
for name,(source,exports) in modules.items():
 js+=f'\n__M[{json.dumps(name)}]=(()=>{{\n{source}\nreturn {{{",".join(exports)}}};\n}})();\n'
html=(ROOT/'index.html').read_text(encoding='utf-8')
html=html.replace('<script type="module" src="./game.js"></script>','<script>'+js.replace('</script>','<\\/script>')+'</script>')
assert 'window.__v40Read' in html
# Pure per-page mock of the browser Storage interface; no real-user browser storage accessed.
stub="""<script>const __v40Storage=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>__v40Storage.get(k)??null,setItem:(k,v)=>__v40Storage.set(k,String(v)),removeItem:k=>__v40Storage.delete(k)}});</script>"""
html=html.replace('<script>const __M=',stub+'<script>const __M=',1)
print(f'Bundled HTML {len(html)/1024/1024:.1f} MiB',flush=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':720},accept_downloads=True)
 failures=[]
 page.on('pageerror',lambda exception:failures.append(str(exception)))
 page.set_content(html,wait_until='domcontentloaded',timeout=120000)
 page.wait_for_function('window.__v40Read!==undefined',timeout=65000)
 assert page.evaluate('window.__v40Read().stored') is None
 page.get_by_role('button',name='Nueva partida').click()
 assert page.locator('#menu').is_hidden()
 assert page.evaluate('window.__v40Read().phase')=='playing'
 start=page.evaluate('window.__v40Read().position')
 page.keyboard.down('d');page.wait_for_timeout(1500);page.keyboard.up('d')
 page.keyboard.press('p')
 page.wait_for_function('JSON.parse(localStorage.getItem("ashen-pilgrimage-save-v2-auto")||"null").p.x>90',timeout=6000)
 moved=page.evaluate('window.__v40Read().position')
 assert moved>start+25,(start,moved)
 raw=page.evaluate('localStorage.getItem("ashen-pilgrimage-save-v2-auto")')
 assert json.loads(raw)['p']['x']>start
 page.locator('#game').screenshot(path=str(ROOT/'docs'/'CAPTURA-QA-v4.0-RECORRIDO-REAL.png'))
 page.keyboard.press('Escape')
 assert not page.locator('#menu').is_hidden()
 page.get_by_role('button',name='Guardar partida').click()
 page.get_by_role('button',name=re.compile('Ranura 1')).click()
 slot=json.loads(page.evaluate('localStorage.getItem("ashen-pilgrimage-save-v2-slot1")'))
 assert abs(slot['p']['x']-moved)<2
 page.get_by_role('button',name='Copias de seguridad JSON').click()
 with page.expect_download(timeout=10000) as download_info:page.get_by_role('button',name='Exportar partidas (.json)').click()
 download=download_info.value
 assert download.suggested_filename.endswith('.json')
 contents=Path(download.path()).read_text(encoding='utf-8')
 assert 'auto' in contents and 'slot1' in contents
 # Exercise the actual browser file chooser and restore confirmation.
 with page.expect_file_chooser(timeout=10000) as chooser_info:
  page.get_by_role('button',name='Importar partidas (.json)').click()
 chooser_info.value.set_files({'name':'partidas.json','mimeType':'application/json','buffer':contents.encode('utf8')})
 page.get_by_role('button',name='Sí, restaurar copia').click()
 assert page.locator('#menuTitle').inner_text()=='LA VIGILIA DE CENIZA'
 assert json.loads(page.evaluate('localStorage.getItem("ashen-pilgrimage-save-v2-slot1")'))['p']['x']==slot['p']['x']
 page.get_by_role('button',name='Continuar').click()
 assert page.locator('#menu').is_hidden()
 page.keyboard.press('j');page.wait_for_timeout(130)
 page.keyboard.press('Escape')
 page.get_by_role('button',name='Volver al menú principal').click()
 page.get_by_role('button',name='Continuar').click()
 assert page.locator('#menu').is_hidden()
 assert page.evaluate('window.__v40Read().position')>start+25
 assert not failures,failures
 print(json.dumps({'result':'PASS','browser':'Chromium','start':round(start,1),'afterMovement':round(moved,1),'actions':['new','move','attack','autosave','manual save','download JSON','import JSON','pause','title','continue'],'jsErrors':failures,'limitations':'offline bundled resources; not 35-chamber human playthrough'},ensure_ascii=False),flush=True)
 browser.close()
