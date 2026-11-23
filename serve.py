#!/usr/bin/env python3
"""Servidor local de ASHEN PILGRIMAGE; sin dependencias externas."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import threading
import webbrowser

ROOT = Path(__file__).resolve().parent

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description='Lanzador local ASHEN PILGRIMAGE')
    parser.add_argument('--no-browser', action='store_true')
    parser.add_argument('--port', type=int, default=8765, help='Puerto HTTP estable; mantiene el origen de los guardados (8765 por defecto)')
    args = parser.parse_args()
    if args.port < 1 or args.port > 65535:
        parser.error('El puerto debe estar entre 1 y 65535')
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), Handler)
    except OSError as exc:
        print(f'ERROR: No se puede abrir 127.0.0.1:{args.port}: {exc}', flush=True)
        print('Cierra el servidor anterior o utiliza siempre --port NUMERO para mantener los guardados.', flush=True)
        return 1
    url = f'http://127.0.0.1:{server.server_port}/'
    print(f'ASHEN PILGRIMAGE disponible en {url}', flush=True)
    print('Para detener el servidor: Ctrl+C', flush=True)
    if not args.no_browser:
        threading.Timer(0.4, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
