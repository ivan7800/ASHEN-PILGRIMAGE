# QA — ASHEN PILGRIMAGE v0.9

## Evidencia positiva obtenida en el entorno de desarrollo

- `node --check` de todos los módulos JS: sin errores sintácticos.
- `node test-v09.mjs`: 4 atlas de 12×128 píxeles por frame, alto 160 px, cinco variantes de fondo, referencias correctas.
- `node test-v08.mjs`: combos, resistencia, esquiva y comportamientos de enemigos.
- `node test-v07.mjs`: cinco cámaras, umbrales y compatibilidad de guardado.
- `node test-v06.mjs`: lore, Desvelo, boss y carga anterior.
- `node test-runtime.mjs`: ejecución simulada de 22 frames, combate y pausa.
- `bash -n JUGAR-LINUX.sh` y `python3 -m py_compile serve.py`: correctos.
- Pillow abre y verifica los nueve archivos gráficos nuevos.
- Integridad ZIP comprobada con `unzip -t` tras empaquetar.

## No verificado

- Prueba Playwright Chromium con servidor HTTP local: `net::ERR_BLOCKED_BY_ADMINISTRATOR`. La restricción es externa al código del juego; no demuestra que el juego funcione en un navegador real.
- Campaña completa, transiciones observadas visualmente, estabilidad a largo plazo, ajustes de daño y sincronización del impacto, Windows 11, Linux Mint y mando físico.
- Dibujos todavía esquemáticos, no son equivalentes a la técnica artística ni fidelidad de Silver Pines.

## Reproducción en PC

1. Ejecutar `JUGAR-WINDOWS.bat` o `./JUGAR-LINUX.sh` con Python 3.
2. Verificar pantalla inicial y protagonista; caminar, saltar, atacar tres veces, esquivar y comprobar resistencia.
3. Visitar enterradores y dolientes, observar diferencias visuales y proyectiles.
4. Atravesar los cinco umbrales pulsando E y comprobar la variación de los fondos.
5. Guardar en P, cerrar, relanzar y comprobar la posición y los hallazgos.
6. Comprobar con mando real y registrar navegador, FPS, latencia y errores de consola.
