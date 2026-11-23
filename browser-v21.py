from pathlib import Path
from playwright.sync_api import sync_playwright
import mimetypes
root=Path(__file__).resolve().parent
errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1440,'height':900})
 page.on('pageerror',lambda e:errors.append(str(e)))
 def serve(route):
  rel=route.request.url.split('://',1)[-1].split('/',1)[-1].split('?',1)[0] or 'index.html'
  target=(root/rel).resolve()
  if not target.is_relative_to(root) or not target.is_file(): return route.fulfill(status=404,body='No encontrado')
  mt=mimetypes.guess_type(str(target))[0] or 'application/octet-stream'
  if target.suffix=='.js':mt='text/javascript'
  return route.fulfill(status=200,body=target.read_bytes(),content_type=mt)
 page.route('http://ashen.invalid/**',serve)
 try:
  page.goto('http://ashen.invalid/',timeout=15000,wait_until='domcontentloaded')
  page.wait_for_timeout(750)
  print('TITLE',page.title())
  print('MENU',page.locator('#menuTitle').inner_text())
  page.get_by_role('button',name='Nueva partida').click()
  page.wait_for_timeout(400)
  if page.locator('#menu').is_visible():
   page.get_by_role('button',name='Sí, iniciar nueva partida').click()
  page.wait_for_timeout(500)
  page.screenshot(path=str(root/'QA-v2.1-browser.png'))
  print('SCREENSHOT',root/'QA-v2.1-browser.png')
  print('ERRORS',errors)
 except Exception as e:print('BROWSER FAILURE',str(e)[:800]);raise
 finally:browser.close()
