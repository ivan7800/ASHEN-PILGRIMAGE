import subprocess,re
from pathlib import Path
from playwright.sync_api import sync_playwright
p=subprocess.Popen(['python3','serve.py','--no-browser'],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
try:
 address=re.search(r'http://127\.0\.0\.1:\d+/',p.stdout.readline()).group()
 with sync_playwright() as api:
  browser=api.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':1280,'height':720})
  problems=[];page.on('pageerror',lambda e:problems.append(str(e)))
  page.goto(address,wait_until='domcontentloaded',timeout=18000)
  page.locator('#menuEntries button').filter(has_text='Nueva partida').click()
  page.wait_for_timeout(450)
  assert page.locator('#menu').is_hidden(), 'game should start'
  page.screenshot(path='docs/qa-v15-crypt.png')
  save={"p":{"x":5070,"hp":100,"flasks":3,"checkpoint":5140},"enemies":[{"hp":42,"alive":True} for _ in range(12)],"secrets":[{"taken":False},{"taken":False}],"phase":"playing","chapterClear":True,"questStage":0}
  save['enemies'][8]={"hp":0,"alive":False}
  for i in range(9,12):save['enemies'][i]={"hp":58,"alive":True}
  page.evaluate('(s)=>localStorage.setItem("ashen-pilgrimage-save-v2-auto",JSON.stringify(s))',save)
  page.reload(wait_until='domcontentloaded')
  page.locator('#menuEntries button').filter(has_text='Continuar').click()
  page.wait_for_timeout(350)
  page.keyboard.press('KeyE');page.wait_for_timeout(120)
  state=page.evaluate('JSON.parse(localStorage.getItem("ashen-pilgrimage-save-v2-auto"))')
  assert state['questStage']==1, f'Erena quest not started: {state}'
  page.screenshot(path='docs/qa-v15-valdren.png')
  assert not problems,problems
  print('BROWSER OK: title menu, fresh game, Valdren saved game, Erena quest, no page errors')
  browser.close()
finally:
 p.terminate()
 try:p.wait(timeout=3)
 except subprocess.TimeoutExpired:p.kill()
