# QA · ASHEN PILGRIMAGE v2.9 — La Última Resonancia

## Alcance

Extensión **sobre v2.8** para cerrar el arco de Cumbres del Silencio: sectores 28–30, resonadores, enemigos y el Gigante que Escucha. Se conservan los 28 sectores anteriores, 57 enemigos previos, autoguardado, tres ranuras manuales, los controles y lanzadores.

## Evidencia realmente ejecutada

- **31/31 suites de Node.js**: `for f in test-*.mjs; do node "$f" || exit 1; done`.
- **7 escenarios de integración** en `test-v29-summit.mjs`: acceso bloqueado por misión pendiente, acceso desbloqueado, primer resonador, primera puerta, segunda puerta cerrada, entrada al santuario y derrota del Gigante registrada en un guardado.
- **Reglas específicas** de orden Piedra/Eco/Silencio, reinicio por error, inmunidad al saltar sobre la onda, dirección y alcance de la advertencia, legibilidad de las dos fases y carga de partidas anteriores con 57 enemigos.
- **Captura en Chromium autocontenido**, mediante `python3 tools/qa-v29-browser.py`. Cuatro posiciones (`docs/CAPTURA-REAL-v2.9-*.png`), los siete recursos visuales nuevos cargados, diferencia de cámara observada y sin errores JavaScript reportados en esta prueba. La simulación posterior de 180 fotogramas redujo los puntos de vida del protagonista de 100 a 14 con el jefe en su segunda fase: prueba de funcionamiento, no medición del equilibrio de dificultad.
- **Sintaxis JavaScript** (`node --check`), **Python** (`python3 -m py_compile serve.py`) y **Bash** (`bash -n JUGAR-LINUX.sh`), correctas.
- **HTTP local**: `serve.py --no-browser --port 18765` devolvió HTTP 200 para `/`, `/game.js`, `/summit-v29.js`, `/assets/bellgiant-v29.png` y `/assets/room-snowgiant-v29.webp` mediante `urllib`.
- **Archivos de arte**: 3 atlas PNG RGBA de 2560×160 (20 cuadros de 128×160) y 3 fondos WebP de 1440×810. Fuente original y generador en `art-source/summit-v29/` y `tools/build-summit-v29.py`.

## Advertencias y limitaciones

- Chromium se ejecutó como **página autocontenida**, no como partida de principio a fin con servidor HTTP. No sustituye comprobación manual del recorrido completo.
- Las capturas utilizan una partida de prueba posicionada en cada cámara. No son pantallas obtenidas a través de una campaña entera controlada por un humano.
- **Sin prueba física** de mando, Windows 11 o Linux Mint; el BAT no se ha ejecutado en Windows. Los mandos usan Gamepad API y deben ensayarse con hardware físico.
- El Gigante dispone de un atlas nuevo basado en ilustración original. Los nuevos Campaneros y Coristas son composiciones derivadas de sprites glaciales del proyecto, no animaciones artesanales completas.
- **No se ha publicado nada en GitHub.** Queda pendiente el séptimo reino y una auditoría completa de principio a fin.

## Recorrido de aceptación recomendado

1. Usa `JUGAR-WINDOWS.bat` o `./JUGAR-LINUX.sh`, comprueba la dirección estable `http://127.0.0.1:8765/` y haz copia de los guardados manuales si hay progreso importante.
2. Desde una partida con el **Jardinero vencido**, sube las Cumbres, habla con **Elda**, recupera la memoria del Monasterio y vuelve a Elda.
3. Entra en la **Escalinata de las Campanas** y escucha **Piedra** con Desvelo; comprueba que la puerta siguiente solo se abre tras escucharla.
4. En el **Observatorio del Eco**, prueba un orden equivocado: las resonancias deben reiniciarse. Completa **Piedra → Eco → Silencio** con Desvelo.
5. Guarda en una ranura manual, vuelve al título, cárgala y comprueba que los tres resonadores continúan registrados.
6. Entra en el **Santuario del Gigante**. Comprueba que su aviso visual muestra dirección, alcance y progreso de preparación; prueba esquiva y salto frente a las ondas.
7. Derrota al Gigante y comprueba la **Brasa de las Cumbres del Silencio** y el epílogo de Elda. Guarda, cierra y vuelve a cargar.
8. Prueba el mismo recorrido con un mando físico estándar; registra caídas de FPS, controles sin asignación, problemas de z-index y ataques poco legibles.
