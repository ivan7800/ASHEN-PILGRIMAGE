# QA v3.0 — El Trono del Sol Muerto

Fecha: 2026-11-23 · Entrega: RC jugable para navegador HTML5 con lanzadores Windows/Linux (Python 3).

## Evidencia obtenida

- `for f in test-*.mjs; do node "$f" || exit 1; done`: **32/32 suites Node completadas**. Se incluye `test-v30-final.mjs` con 9 escenarios de integración del código real, no solo funciones puras.
- `node --check` para todos los módulos JS; `python3 -m py_compile` para `serve.py`, y `bash -n JUGAR-LINUX.sh`.
- `python3 tools/build-final-art-v30.py`: genera cuatro fondos WebP, un atlas del Primer Testigo de 20 cuadros y tres variantes de criaturas. Fuente artística original incluida en `art-source/final-v30/`. Requiere Pillow **solo para regenerar el arte, no para jugar**.
- `python3 tools/qa-v30-browser.py`: Chromium autocontenido con recursos incrustados. Capturas de Umbral, Galería, Altar, dos fases del Primer Testigo y dos menús de desenlace. Carga de los nueve recursos nuevos verificada; sin errores JavaScript observados. Menú de elección, selección, créditos y 180 cuadros de simulación del combate probados. El daño descendió de 100 a 4 PV en esa simulación concreta; **no demuestra un equilibrio adecuado**.
- `python3 serve.py --no-browser --port 18765`: servidor local del juego. Probar con `curl` o `urllib` a `/`, `/game.js`, `/final-throne-v30.js`, `/assets/firstwitness-v30.png` y `/assets/room-final-trono-v30.webp`.
- Guardados v2.9 de 64 enemigos siguen admitidos; v3.0 usa 73. No se modifica ni borra la clave antigua, y los guardados manuales y autoguardado siguen separados.

## Recorrido reproducible de la región final

1. Desde una partida con los seis jefes regionales vencidos, atraviesa la salida oriental del Santuario del Gigante. Comprueba que no se abre antes de derrotarlo.
2. Habla con la **Santa Sin Rostro** en el Umbral del Sol Muerto para que la misión avance. Sin hablar con ella, la puerta siguiente debe permanecer cerrada.
3. Cruza la Galería de los Soles Rotos y en el Altar activa Desvelo (`Q`). Escucha los sellos con `E` en el orden **Nombre → Prisión → Testigo**. Un error reinicia los sellos.
4. Prueba la puerta hacia el Primer Testigo sin completar los sellos y comprueba que no se puede cruzar. Vuelve a completar el ritual. Las seis brasas regionales son también obligatorias.
5. Enfréntate al Primer Testigo (960 PV, dos fases). El martillazo y la onda solar anuncian dirección y rango; saltar sobre la onda permite evitarla. Comprueba el estado de segunda fase, la derrota y el autoguardado.
6. Acércate al altar oriental y pulsa `E` para elegir uno de los **tres desenlaces**. Elige uno, comprueba la pantalla narrativa y los créditos, guarda, vuelve al título y utiliza «Ver último desenlace».
7. Comprueba nueva partida y carga de guardados anteriores sin modificar manualmente el `localStorage` de un usuario real.

## Límites pendientes y riesgos

- **No está certificada una partida completa desde el prólogo hasta los créditos.** Los escenarios automatizados cargan estados de prueba previamente definidos, y las capturas usan escenas preparadas para QA, no una campaña humana completa.
- El motor HTML5 y los sprites se han probado en Chromium autocontenido. Todavía hay que ensayar las transiciones reales, los controles y la dificultad en **Windows 11, Linux Mint y con mando físico**.
- Los tres desenlaces son decisiones narrativas persistentes. No existen tres campañas alternativas completas después de la elección.
- Aunque las siete regiones poseen arcos jugables, la duración de 25–35 horas y el acabado gráfico comercial **no están demostrados** y no deben anunciarse como hechos.
- El atlas del Primer Testigo deriva de ilustración original convertida en 20 celdas; los tres enemigos nuevos reutilizan composiciones cromáticamente modificadas de recursos propios. No afirmar que todos están dibujados artesanalmente fotograma a fotograma.
- La dirección por defecto `http://127.0.0.1:8765/` conserva el mismo origen de `localStorage`. Si una partida antigua usó otro puerto, la migración **no es automática**. Hay que exportar manualmente sus datos desde su origen o migrarlos con procedimiento documentado.
- No se ha publicado en GitHub. No se han ejecutado los `.bat` en Windows ni la prueba física de doble clic en Linux.

## Próxima auditoría

Realizar un recorrido humano completo; perfilar fotogramas en escenas de mucha acción, revisar accesibilidad, audio, choque de hitboxes y velocidad del último jefe, y exportar una copia de seguridad de las partidas antes de cambios de versión mayores.
