# ASHEN PILGRIMAGE v3.5 — VOCES DE VESPERA

**Fecha:** 2026-11-23 · **Ámbito:** fase 5 (audio, menús, accesibilidad y mando). Base: v3.4 de trabajo, conservada sin modificar. Se mantiene HTML5 + JavaScript, tres guardados manuales, autoguardado, exportación/importación JSON, siete regiones y lanzadores Windows/Linux.

## Cambios verificables

1. `presentation-v35.js`: perfiles locales normalizados; volumen general, ambiente/ambientación musical, efectos; indicadores visuales; texto de menú 100/120/140 %; reducción de movimiento. Tolerancia a datos dañados y almacenamiento restringido. Las preferencias **no forman parte de las partidas ni de su JSON**.
2. `game.js`: menú Opciones integrado, pantalla completa cuando el navegador la autoriza, foco accesible mediante Tab/flechas/Home/End, atajos de inventario/mapa en mando, pausa en desconexión y pérdida de visibilidad. Corrección de Start mantenido para impedir apertura/cierre inmediato de la pausa.
3. `soundscape.js`, `king-presentation.js`: encaminamiento por buses separados para ambiente y efectos (incluidos avisos de jefes); silencio inmediato al desactivar audio. Web Audio sintetizado localmente y desactivado hasta acción voluntaria del jugador.
4. `index.html`: capa de avisos con `role=status` y `aria-live`, textos ampliables y estilos de reducción de movimiento. Señales de ataque, puzles y fase del jefe se describen por texto aunque el audio esté apagado.
5. La cámara puede pasar directamente a su posición, se omite la sacudida y se reducen destellos/partículas cuando el usuario activa la opción. No elimina todas las animaciones del mundo y **no debe describirse como accesibilidad plenamente certificada**.

## Comprobaciones ejecutadas

- **40/40 suites Node** `test-*.mjs`, incluida `test-v35-audio-ui.mjs`: validación, persistencia, buses Web Audio, avisos textuales, regresiones de progresión y guardados.
- `node --check` en módulos JS, `bash -n JUGAR-LINUX.sh` y validación sintáctica de Python.
- `python3 tools/qa-v31-http.py`: HTTP 200 para HTML, módulos y recurso real. Prueba del servidor local y sus cabeceras.
- `python3 tools/qa-v35-browser.py`: Chromium **autocontenido**, no conexión directa al servidor. Cambio de volumen y texto, reducción de movimiento, foco de teclado, mezcla, sonido activado/desactivado, avisos, dos escenas renderizadas y mando **simulado** (Start, cruceta, B). Capturas `docs/CAPTURA-REAL-v3.5-*.png`. Sin errores JS observados en este recorrido.
- Se ha verificado la sintaxis del lanzador Windows como archivo de texto, no su ejecución real en Windows.

## Limitaciones / pendientes

- Una navegación directa Chromium → `127.0.0.1` continúa bloqueada en este entorno por `ERR_BLOCKED_BY_ADMINISTRATOR`; el servidor sí responde con HTTP 200 mediante cliente HTTP.
- No se ha jugado la campaña completa desde un inicio nuevo hasta los créditos, ni se ha realizado una sesión física de mando Xbox/PlayStation en Windows 11 o Linux Mint.
- Ambiente musical actualmente **sintetizado**, no una banda sonora arreglada en pistas grabadas y mezcladas por escena; el control regula el canal de ambiente original.
- Los avisos visuales cubren sucesos clave del audio pero no constituyen subtitulado de todos los diálogos, los cuales son texto en pantalla.
- Reducción de movimiento suprime sacudidas, algunas partículas y destellos, pero no todos los movimientos ambientales.
- No se han medido latencia de audio, FPS continuos, rendimiento prolongado ni compatibilidad con todos los navegadores.

## Reproducción

```bash
for f in test-*.mjs; do node "$f" || exit 1; done
python3 tools/qa-v31-http.py
python3 tools/qa-v35-browser.py  # requiere Python playwright, Pillow opcional y Chromium instalado
```

Iniciar: `JUGAR-WINDOWS.bat` o `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`; Python 3 instalado. Preservar `http://127.0.0.1:8765/` para recuperar los guardados previos creados allí.
