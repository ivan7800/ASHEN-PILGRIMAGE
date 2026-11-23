# QA — ASHEN PILGRIMAGE v0.5

## Resultados ejecutados

- `node --check game.js` y `node --check visual.js`: correctos.
- `node test-runtime.mjs`: prueba aislada de inicialización, 22 fotogramas, entrada de ataque y pausa/reanudación: correcta.
- `bash -n JUGAR-LINUX.sh`: correcto.
- `python -m py_compile serve.py`: correcto.
- Servidor `serve.py --no-browser` y peticiones HTTP: respuesta 200 para HTML, JS, WebP y tres capas PNG.
- Integridad y estructura ZIP: comprobadas durante empaquetado.

## Fallos corregidos

- `audioButton.onclick` estaba antes de la inicialización de `audioButton` (ReferenceError en carga).
- `pauseButton.onclick` estaba antes de la inicialización de `pauseButton` (ReferenceError en carga).
- Los enemigos golpeaban sin preparación visual; ahora advierten antes del daño.

## Limitaciones

- Chromium de este entorno devuelve `ERR_BLOCKED_BY_ADMINISTRATOR` al navegar a `http://127.0.0.1:<puerto>`; **no** se ha validado el recorrido completo ni las capturas del juego.
- No se ha probado el doble clic real en Windows 11, Linux Mint ni gamepads físicos.
- Todavía hay pocos fotogramas en las hojas de sprites. Se ha ampliado la expresión del ataque mediante arco dinámico y anticipación enemiga, no con animación rotoscopiada.
- Las nuevas capas se dibujan independientemente pero son siluetas de apoyo generadas por procedimiento y no geometría 3D.
- Sin publicación en GitHub.
