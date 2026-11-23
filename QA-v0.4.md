# Registro de validación v0.4

## Comprobado con herramientas

- `node --check game.js` y `node --check visual.js` pasan.
- `python3 -m py_compile serve.py` pasa.
- `bash -n JUGAR-LINUX.sh` pasa.
- Los cuatro recursos gráficos son legibles, con dimensiones y transparencias válidas.
- El servidor HTTP local entrega HTML, scripts y recursos nuevos, comprobado con solicitudes HTTP.
- El ZIP se somete a comprobación de integridad con `ZipFile.testzip()`.

## Pendiente

- La captura headless con Chromium no completó dentro del plazo del entorno; **no** prueba ni descarta defectos gráficos.
- No hay prueba automatizada completa de partida, colisiones o animaciones.
- No se ha validado el doble clic en Windows 11 ni Linux Mint reales.
- No se ha probado un gamepad real.
