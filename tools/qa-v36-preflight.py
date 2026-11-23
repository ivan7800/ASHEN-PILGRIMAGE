#!/usr/bin/env python3
"""QA de distribución sin dependencias Python: archivos, referencias, lanzadores y ruta HTTP.

No sustituye una partida humana ni ejecución física en Windows/Linux.
"""
from pathlib import Path
from subprocess import run
from urllib.request import urlopen
from http.server import ThreadingHTTPServer
import json, re, threading, ast, hashlib, sys
P=Path(__file__).resolve().parents[1]
report={'suite':'v3.6-preflight','checks':{},'missing':[]}
def check(name,condition):
 report['checks'][name]='PASS' if condition else 'FAIL'
 if not condition:report['missing'].append(name)
 # Mostrar fallos pero completar la auditoría.
modules=sorted(P.glob('*.js'))
for file in modules:
 proc=run(['node','--check',str(file)],capture_output=True,text=True)
 check('node syntax '+file.name,proc.returncode==0)
for file in [P/'JUGAR-LINUX.sh', P/'serve.py', P/'JUGAR-WINDOWS.bat', P/'index.html', P/'game.js']:
 check('file '+file.name,file.is_file() and file.stat().st_size>50)
check('bash syntax',run(['bash','-n',str(P/'JUGAR-LINUX.sh')],capture_output=True).returncode==0)
check('python syntax',run([sys.executable,'-c','import ast,sys;ast.parse(open(sys.argv[1],encoding="utf-8").read())',str(P/'serve.py')],capture_output=True).returncode==0)
# Una verificación estática comprueba solo los recursos que el código menciona directamente.
visual=(P/'visual.js').read_text()
paths=set(re.findall(r"['\"]\./(assets/[^'\"]+)['\"]",visual))
check('asset paths discovered',len(paths)>30)
for asset in sorted(paths):
 path=P/asset
 check('asset '+asset,path.is_file() and path.stat().st_size>100)
check('fixed port',"default=8765" in (P/'serve.py').read_text())
check('loopback binding',"'127.0.0.1'" in (P/'serve.py').read_text())
# HTTP se prueba sin recurrir a la red externa ni abrir un navegador.
from importlib.util import spec_from_file_location,module_from_spec
spec=spec_from_file_location('ashen_serve',P/'serve.py');app=module_from_spec(spec);spec.loader.exec_module(app)
server=ThreadingHTTPServer(('127.0.0.1',0),app.Handler)
thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
try:
 for asset in ['index.html','game.js','visual.js','assets/pilgrim-v21.png']:
  if (P/asset).is_file():
   with urlopen(f'http://127.0.0.1:{server.server_port}/{asset}',timeout=5) as resp:
    data=resp.read();headers=resp.headers
    check('HTTP '+asset,resp.status==200 and len(data)==(P/asset).stat().st_size and headers.get('X-Content-Type-Options')=='nosniff')
finally:
 server.shutdown();server.server_close();thread.join(timeout=5)
print(json.dumps({'count':len(report['checks']),'passed':sum(x=='PASS' for x in report['checks'].values()),'failures':report['missing']},ensure_ascii=False,indent=2))
raise SystemExit(1 if report['missing'] else 0)
