#!/usr/bin/env python3
"""Smoke test local sin red externa; arranca el lanzador en un puerto de QA temporal."""
from pathlib import Path
import contextlib
import socket
import subprocess
import sys
import time
import urllib.request

root = Path(__file__).resolve().parents[1]
with socket.socket() as sock:
    sock.bind(('127.0.0.1', 0))
    port = sock.getsockname()[1]
cmd = [sys.executable, str(root/'serve.py'), '--no-browser', '--port', str(port)]
proc = subprocess.Popen(cmd, cwd=root, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
try:
    for endpoint, content_type in [('/', 'text/html'), ('/game.js', 'javascript'),
                                   ('/save-portability.js', 'javascript'),
                                   ('/assets/firstwitness-v30.png', 'image/png')]:
        last_exc = None
        for _ in range(30):
            try:
                with urllib.request.urlopen(f'http://127.0.0.1:{port}{endpoint}', timeout=3) as resp:
                    assert resp.status == 200, (endpoint, resp.status)
                    assert content_type in resp.headers.get_content_type(), (endpoint, resp.headers.get_content_type())
                    assert resp.headers.get('X-Content-Type-Options') == 'nosniff'
                    assert len(resp.read()) > 100
                    print('HTTP 200', endpoint)
                last_exc = None
                break
            except (OSError, AssertionError) as exc:
                last_exc = exc
                time.sleep(.15)
        if last_exc:
            raise last_exc
    print('OK: servidor local con cabeceras seguras y recursos reales cargados.')
finally:
    proc.terminate()
    try: proc.wait(timeout=5)
    except subprocess.TimeoutExpired:
        proc.kill();proc.wait()
