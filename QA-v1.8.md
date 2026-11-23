# QA v1.8 — Las Nueve Campanadas

## Hechos verificados en el entorno de construcción

- Origen: ZIP v1.7 `ASHEN-PILGRIMAGE-v1.7-LA-SENTENCIA-VISIBLE-Windows-Linux.zip`, extraído sin modificar el original.
- Sintaxis: `node --check` para todos los módulos `.js`.
- Regresiones: `for t in test-*.mjs; do node "$t" || exit 1; done` — 17 archivos superados (16 históricos + nuevo `test-v18-boss-pad.mjs`).
- `king-v18.png`: atlas RGBA de 2560×160, 20 fotogramas de 128×160; se comprueba con Pillow y carga HTTP.
- Servidor `serve.py --no-browser` en `127.0.0.1`: HTTP 200 para `index.html`, `game.js`, `gamepad-menu.js`, `king-presentation.js` y `assets/king-v18.png`.
- Chromium: `Page.goto` bloqueado por política del entorno `net::ERR_BLOCKED_BY_ADMINISTRATOR`. No fue posible verificar visualmente el juego ni completar una partida en Chromium.

## Cambios y límites

1. El Rey de las Nueve Exequias usa poses expresivas 8/10/11 para anticipación, 9 para golpe, 18/19 para carga de segunda fase, 12/13 para daño y 14–17 para muerte. Se mantienen animaciones y reglas de combate preexistentes.
2. Detallado pixel art adicional mediante trazos sobre **copia nueva** del atlas del Rey (armadura, corona, campana, tela, arma y brillos). Es dibujo programático, no un sprite artesanal pintado a mano ni una producción AAA.
3. Sonidos sintetizados originales (no recursos de terceros): advertencia, acentuación de preparación, golpe, cambio de fase y derrota. Requiere activar «Audio» para no emitir sonidos sin consentimiento.
4. Navegación de menú con mando estándar: cruceta/stick vertical arriba-abajo, A confirmar, B volver, Start reanudar. En juego: Start pausa; Select autoguardar. Gamepad API en navegador, no se ha ensayado con mando físico.
5. Pruebas automáticas verifican la lógica de poses, eventos, sintetizador con contexto simulado, entrada con mandos simulados, compatibilidad y regresiones. **No miden equilibrio real** de dificultad, latencia, mezcla de sonido, animación en pantalla o experiencia subjetiva.

## Protocolo manual obligatorio en Windows y Linux Mint

1. Descomprimir y ejecutar `JUGAR-WINDOWS.bat` o `./JUGAR-LINUX.sh`; comprobar menú con y sin mando.
2. Conectar mando estándar y usar cruceta, A, B, Start; verificar desconexión/reconexión y ausencia de entradas fantasma.
3. Activar Audio y comprobar alternancia a silencio; acercarse al Rey y escuchar advertencia temprana, pre-golpe, impacto, fase dos y derrota sin saturación.
4. Cargar una partida con acceso a Plaza de las Exequias, comprobar que ambos avisos de 0,74 s y 0,54 s son legibles y que el ataque queda alineado con la ventana visual.
5. Vencer al Rey en dificultad actual y registrar intentos, muertes, golpes recibidos, falsas colisiones, percepción de equidad y FPS. Repetir con teclado y mando para comparar.
6. Guardar, cerrar, abrir de nuevo y comprobar que la progresión regional persiste; probar también un guardado antiguo.

**La versión es una candidata de mejora de combate; no es un juego completo ni se considera certificada.**
