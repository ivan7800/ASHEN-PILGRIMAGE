import subprocess,time,re,os
from pathlib import Path
from playwright.sync_api import sync_playwright
server=subprocess.Popen(['python3','serve.py','--no-browser'],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
try:
 line=server.stdout.readline().strip()
 m=re.search(r'http://127\.0\.0\.1:\d+/',line)
 assert m,line
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':1280,'height':720})
  issues=[]
  page.on('pageerror',lambda e:issues.append(str(e)))
  page.goto(m.group(),wait_until='domcontentloaded',timeout=20000)
  page.wait_for_timeout(800)
  assert not issues,issues
  page.keyboard.down('KeyD');page.wait_for_timeout(250);page.keyboard.up('KeyD')
  page.keyboard.press('KeyJ');page.wait_for_timeout(250)
  page.keyboard.press('Escape');page.wait_for_timeout(150)
  assert page.locator('#pause').inner_text()=='Reanudar'
  page.keyboard.press('Escape');page.wait_for_timeout(100)
  assert page.locator('#pause').inner_text()=='Pausa'
  page.screenshot(path='QA-v0.8-browser.png')
  print('BROWSER OK: page started, game rendered, movement, attack and pause, no uncaught errors.')
  browser.close()
finally:
 server.terminate()
 try:server.wait(timeout=4)
 except subprocess.TimeoutExpired:server.kill()
