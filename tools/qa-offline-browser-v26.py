#!/usr/bin/env python3
"""Offline visual smoke test: bundle ES modules/assets into an in-memory document.
No network access needed. This does not replace testing the release via HTTP,
launchers, a real controller, or a full campaign playthrough.
Requires playwright and a locally installed chromium binary.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re,base64,json,sys
P=Path(__file__).resolve().parents[1]
modules={}
def visit(filename):
 if filename in modules:return
 src=(P/filename).read_text()
 imports=re.findall(r"^import\s*\{([^}]+)\}\s*from\s*'\./([^']+)'\s*;",src,re.M)
 for _,dep in imports:visit(dep)
 # Original imports become scoped references to previously evaluated modules.
 src=re.sub(r"^import\s*\{([^}]+)\}\s*from\s*'\./([^']+)'\s*;",lambda m:f"const {{{m.group(1)}}}=__M[{json.dumps(m.group(2))}];",src,flags=re.M)
 ex=re.findall(r'^export\s+(?:const|let|function|class)\s+(\w+)',src,re.M)
 src=re.sub(r'^export\s+(?=(?:const|let|function|class)\s+)', '',src,flags=re.M)
 if filename=='visual.js':
  def inline(m):
   path=m.group(1);f=P/path
   if not f.exists():return m.group(0)
   mt='image/webp' if f.suffix=='.webp' else 'image/png'
   return json.dumps('data:'+mt+';base64,'+base64.b64encode(f.read_bytes()).decode())
  src=re.sub(r"'\./(assets/[^']+)'",inline,src)
 modules[filename]=(src,ex)
visit('game.js')
js='const __M={};\n'
for name,(content,exports) in modules.items():
 js+=f"\n__M[{json.dumps(name)}]=(()=>{{\n{content}\nreturn {{{','.join(exports)}}};\n}})();\n"
html=(P/'index.html').read_text()
html=html.replace('<script type="module" src="./game.js"></script>','<script>'+js.replace('</script>','<\\/script>')+'</script>')
# Prepare a historically valid boss-room save that uses the actual v2.5 structure.
def hp(i):
 return 650 if i==52 else 90 if i in (46,49) else 110 if i>=44 else 560 if i==43 else 74 if i in (38,41) else 96 if i>=36 else 180 if i==8 else 320 if i==16 else 420 if i==21 else 480 if i==31 else 88 if i>=32 else 95 if i>=26 else 85 if i>=24 else 78 if i>=17 else 64 if i>=12 else 58 if i>=9 else 42
sea_scene=('--sea' in sys.argv)
root_scene=('--roots' in sys.argv)
village_scene=('--village' in sys.argv)
state={"p":{"x":29560 if village_scene else 32080 if root_scene else 22600 if sea_scene else 26450,"hp":100,"flasks":3,"checkpoint":29620 if village_scene else 32320 if root_scene else 22180 if sea_scene else 26650},"enemies":[{"hp":0 if i in (8,16,21,31) else hp(i),"alive":i not in (8,16,21,31)} for i in range(53)],"secrets":[{"taken":False},{"taken":False}],"phase":"playing","chapterClear":True,"questStage":3,"allegiance":"people","districtQuest":2,"regionClear":True,"forestStage":3,"forestEchoes":[2,0,1],"forestClear":True,"ossaraStage":3,"ossaraNames":[1,0,2],"ossaraClear":True,"salmueraStage":3,"seaEchoes":[] if sea_scene else [0,1,2],"tideMode":"high" if sea_scene else "low","seaClear":False,"visited":list(range(26)),"rootStage":2 if root_scene else 1 if village_scene else 0,"rootRites":[0,1,2] if root_scene else [],"rootClear":False}
if root_scene:state['enemies'][51]={'hp':0,'alive':False}
mock='''<script>const __qaStore = new Map([['ashen-pilgrimage-save-v2-auto',JSON.stringify(STATE)]]);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>__qaStore.get(k)??null,setItem:(k,v)=>__qaStore.set(k,v),removeItem:k=>__qaStore.delete(k)}});</script>'''.replace('STATE',json.dumps(state,ensure_ascii=False))
html=html.replace('<script>const __M=',mock+'<script>const __M=',1)
out=P/'docs'/('CAPTURA-HOJACLARA-v2.6.png' if village_scene else 'CAPTURA-JARDINERO-v2.6.png' if root_scene else 'CAPTURA-SUMERGIDA-v2.5.png' if sea_scene else 'CAPTURA-REAL-v2.5.png')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':720},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded',timeout=30000)
 page.wait_for_timeout(1200)
 btn=page.get_by_role('button',name='Continuar')
 if btn.count()!=1:raise RuntimeError('Continuar menu missing')
 btn.click()
 page.wait_for_timeout(5200 if root_scene else 4500 if village_scene else 4700)
 canvas=page.locator('#game')
 if canvas.count()!=1:raise RuntimeError('Canvas missing')
 canvas.screenshot(path=str(out))
 print('Screenshot:',out,'size:',out.stat().st_size,'page errors:',errors[:5])
 if errors:sys.exit(1)
 browser.close()
