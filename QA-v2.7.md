# QA — ASHEN PILGRIMAGE v2.7 · Los rostros del mar

## Objetivo y modificaciones

Continúa sobre **v2.6 (Raíces Eternas con espinas)**, sin cambiar mapa, guardados, física, HP, diálogos ni lanzadores. Se corrige la reutilización de recursos marítimos y se revisa el paralaje al mover la cámara, con la prioridad de que enemigos y señales sigan siendo legibles.

- Tres atlas **nuevos** de 20 fotogramas, 128 × 160 por celda, PNG RGBA (2560 × 160): `drowned-v27.png`, `saltguard-v27.png`, `sirene-v27.png`. El **Ahogado** utiliza una hoja de arte generada específicamente para esta entrega, convertida sin reskin de criaturas antiguas. El **Guardián de Sal** y la **Sirena** se han dibujado en código original con siluetas propias (casco de buzo/coral/tridente frente a máscara/velo/cola acuática), sin copiar otros personajes; su nivel de detalle sigue siendo más sencillo y exige refinamiento artístico.
- Tres capas marítimas originales RGBA de 960 × 540: `sea-far-v27.png`, `sea-mid-v27.png`, `sea-foam-v27.png`. Paralaje independiente al 0,09×, 0,31× y 1,12× de cámara. La espuma se restringe a la zona inferior de la escena y su opacidad es 0,18; no tapa al Portador ni las señales de ataque.
- Menos opacidad de arquitectura decorativa en los seis sectores de Salmuera. Niebla más tenue y gradiente de contraste detrás de la zona jugable. No cambia el tamaño ni la posición de las colisiones.
- Mantiene v2.6: 26 sectores, 53 posiciones de enemigos/jefes, progresión, 3 ranuras + autoguardado y lanzadores Windows/Linux con puerto fijo `127.0.0.1:8765`.

## Pruebas realizadas

1. `for f in test-*.mjs; do node "$f" || exit 1; done` — **29/29 archivos** superados, incluida `test-v27-sea-art.mjs`. Se comprueba que los atlas nuevos no son las imágenes de las versiones anteriores, dimensiones, recursos, plan y rango del paralaje, orden de capas, cambios de cámara, niebla y compatibilidad con la base anterior.
2. `node --check` sobre todos los módulos `.js`, `bash -n JUGAR-LINUX.sh`, `python -m py_compile serve.py` — sin errores de sintaxis.
3. **Chromium real con Playwright, ejecución autocontenida:** `python tools/qa-sea-visual-v27.py`. Carga seis recursos nuevos, inicia la partida, captura dos cámaras del Muelle y otra de la Capilla, sin errores JavaScript observados; la diferencia visual entre dos posiciones de cámara en el recorte de escenario es de aproximadamente **3,76 unidades medias RGB**. Capturas en `docs/CAPTURA-SALMUERA-v2.7-*.png`.
4. PNG RGBA con **20 cuadros no vacíos y distintos** por atlas, transparencias y proporciones validadas con Pillow.
5. HTTP local: `serve.py --no-browser` respondió **200** para `index.html`, `game.js` y los atlas/capas nuevas. Chromium bloqueó específicamente la navegación HTTP con `ERR_BLOCKED_BY_ADMINISTRATOR`; la captura se realizó autocontenida.
6. Integridad ZIP comprobada con `ZipFile.testzip()`.

## Limitaciones verificables

- La prueba visual utiliza un HTML autocontenido en Chromium, no un recorrido completo a través del servidor HTTP y los lanzadores reales. Las posiciones de cámara se han establecido por una instrumentación del **script de QA**, no con un mando físico: evidencian paralaje y renderizado, **no certifican sensación de movimiento real ni equilibrio**.
- El Ahogado tiene mayor detalle de arte; el Guardián y la Sirena son **pixel art procedural original** y necesitarán más poses expresivas/iluminación manual para alcanzar la ambición artística prevista. El escenario mantiene arquitectura procedural heredada y puede requerir pulido adicional.
- Sin una prueba extensa con un mando real, varias resoluciones y Windows/Linux no se pueden certificar fluidez, dificultad, rendimiento ni experiencia completa.
- Los guardados no se han migrado de otros puertos: usa el mismo origen `http://127.0.0.1:8765/` para conservar las partidas que ya estén allí.

## Validación manual recomendada

1. Abre el ZIP en una carpeta nueva y ejecuta `JUGAR-WINDOWS.bat` (Windows) o `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh` (Linux); requiere Python 3.
2. Comprueba el inicio, Continuar, Guardar y Cargar. No borres datos anteriores del navegador.
3. En Salmuera, recorre Puerto, Muelle, Galerías, Compuertas, Capilla y Trono; fíjate en cómo se desplazan por separado barcos lejanos, arcos hundidos y espuma de mar al mover la cámara.
4. Enfréntate al Ahogado, Guardián de Sal y Sirena: comprueba anticipación de golpe, animación, distinción de siluetas y que ningún ornamento se interponga entre el jugador y el enemigo.
5. Prueba Desvelo, el puzle Sal → Eco → Nombre, subida/bajada de mareas, oxígeno y Novia del Abismo; comprueba que la dificultad sigue siendo razonable.
6. Repite en pantalla completa, ventana pequeña y con mando. Guarda, cierra, abre y verifica que la partida persiste.

**Estado:** revisión artística y regresiones realizadas, no campaña completa certificada y sin publicación en GitHub.
