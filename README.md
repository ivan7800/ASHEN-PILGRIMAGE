# ASHEN PILGRIMAGE v4.0 RC — VALIDACIÓN DEL LANZAMIENTO

**Estado: CANDIDATA DE LANZAMIENTO, NO VERSION FINAL CERTIFICADA.** Se han corregido dos problemas de persistencia en v3.9: (1) cargar una ranura manual o activar un autoguardado no sustituye una ranura automática dañada sin consentimiento y (2) continuar una partida ganada conserva `phase=won` y su final en los siguientes guardados. También se normaliza la lectura de ranuras ausentes.

**Pruebas realizadas sobre esta copia:** 49/49 suites Node; 145/145 chequeos estáticos/HTTP; 35/35 cámaras renderizadas en Chromium con posiciones de QA; 16 vistas de ataques; 69 duelos simulados; 23 atlas x 20 fotogramas; recorrido Chromium **desde una partida limpia con entradas de teclado reales**, guardado manual/automático, exportación e importación JSON desde el selector de archivos, título y continuación; lanzador Linux ejecutado en este contenedor (HTTP 200). Ver `QA-v4.0.md`.

**No comprobado:** campaña humana 35 cámaras / 8 jefes sin atajos, tres finales obtenidos por partidas completas, mando físico, Windows 11 y Linux Mint reales, ni sesión de rendimiento/audio de una hora. Por tanto **NO-GO** para anunciar una v4.0 comercial estable. El repositorio y GitHub Pages sí están publicados y verificados.

**Jugar:** doble clic en `JUGAR-WINDOWS.bat` o en Linux `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`; requiere Python 3 y navegador moderno. Usa siempre `http://127.0.0.1:8765/` para mantener tus partidas. Antes de sustituir otra versión, exporta las partidas en **Copias de seguridad JSON** y confirma que el archivo se ha guardado.

**QA local:** `VERIFICAR-WINDOWS.bat` o `./VERIFICAR-LINUX.sh` con Node.js y Python 3. Prueba visual adicional con Chromium y Playwright: `python3 tools/qa-v40-player-browser.py`. La matriz de aceptación física está en `docs/CRITERIOS-LANZAMIENTO-v4.0.md`.

---

# ASHEN PILGRIMAGE v3.9 — QA DE CAMPAÑA Y TRES FINALES (CANDIDATA)

**Mejoras funcionales reales:** golpe frontal tras solapamiento con enemigos, progresión de puertas centralizada y probada en las 35 cámaras, y comprobación automática de los tres finales desde los menús. Mantiene 23 enemigos nuevos, 73 encuentros, ocho jefes, tres finales, 35 cámaras, ocho relicarios, tres atajos y guardados históricos.

**Resultado de QA:** 47/47 suites Node, 145/145 verificaciones técnicas, 35/35 escenas en Chromium autocontenido, 69 duelos de integridad simulados y 3/3 finales seleccionados, guardados y reabiertos desde el menú. Las pruebas de progresión usan estados preparados: **NO equivalen a jugar toda la campaña**, ni certifican equilibrio definitivo. Pendientes Windows 11, Linux Mint y mando físicos. **No es v4.0 final certificada**. Consulta `QA-v3.9.md` y `docs/COMPROBACIONES-DE-CAMPANA-v3.9.md`.

**Arranque:** Windows `JUGAR-WINDOWS.bat`; Linux `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`. Python 3 y navegador; `http://127.0.0.1:8765/` para conservar el origen de las partidas. Pruebas: `VERIFICAR-WINDOWS.bat` / `./VERIFICAR-LINUX.sh` (Node.js 18+). Exporta las partidas JSON antes de mover de navegador o puerto.

---

# ASHEN PILGRIMAGE v3.8 — BESTIARIO ANIMADO (CANDIDATA DE PRUEBAS)

**23 criaturas con nuevas secuencias de sprite, siete lenguajes visuales de combate y sonidos diferenciados.**
Se conservan los 35 sectores, los siete reinos, los ocho jefes, las 73 posiciones de enemigos, tres finales y las partidas anteriores. La nueva versión añade estados de movimiento/ataque/muerte por animación recortada, **no** animación anatómica manual de 20 dibujos por especie.

**Ejecución:** doble clic `JUGAR-WINDOWS.bat` (Windows) o `./JUGAR-LINUX.sh` (Linux), Python 3 y navegador moderno. **Pruebas:** `VERIFICAR-WINDOWS.bat` o `./VERIFICAR-LINUX.sh` con Node.js 18+; `python3 tools/qa-v38-animation.py`, `python3 tools/qa-v38-browser.py` y `python3 tools/qa-v38-combat.py` requieren dependencias optativas.

**Calidad:** 45 suites y 144 comprobaciones técnicas aprobadas, 69 duelos controlados en las tres dificultades, capturas reales en Chromium autocontenido. **No es una v4.0 comercial certificada:** siguen pendientes partida completa sin estados de QA, mando físico, hardware real Windows 11/Linux Mint y sesiones largas de rendimiento. No se ha publicado en GitHub. Ver `QA-v3.8.md` y `docs/GUIA-ANIMACIONES-v3.8.md`.

---

# ASHEN PILGRIMAGE v3.7 — BESTIARIO DE VESPERA (23 ENEMIGOS)

Actualización del juego real sobre v3.6: **23 diseños pixel art nuevos**, 23 atlas de 20 celdas, 23 roles/ritmos de combate, escudos y armaduras, embestidas, hechizos y hostigamiento. Se conserva la población total de **73 encuentros** y los **ocho índices de jefe**, sin modificaciones al formato de partidas y copias JSON. Menú «Bestiario · 23 criaturas» disponible desde título y pausa.

Para jugar: Windows `JUGAR-WINDOWS.bat`, Linux `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`. Requiere Python 3. Para las suites: `for f in test-*.mjs; do node "$f" || exit 1; done` (44 suites). Para render Chromium `python3 tools/qa-v37-browser.py` (Playwright + Chromium + Pillow). Los recursos originales proceden de `art-source/bestiary-v37/concepto-23-enemigos.png`; regeneración opcional con `python3 tools/build-bestiary-v37.py` (Pillow + NumPy).

**Importante:** no es una versión comercial certificada; falta campaña humana completa, balance exhaustivo de los 23 encuentros, mando real y pruebas sobre Windows 11/Linux Mint. Ver `QA-v3.7.md` y `docs/CRITERIOS-LANZAMIENTO-v3.6.md`. No publicada en GitHub.

---

# ASHEN PILGRIMAGE v3.6 — CANDIDATA DE LANZAMIENTO (QA)

Esta versión consolida la **fase 6: auditoría y preparación de distribución**, sin añadir reinos ni cambiar el motor. Se han reforzado los casos de guardado dañado, las comprobaciones automáticas y el lanzamiento en Windows. **No está certificada como lanzamiento final:** quedan pendientes una partida humana completa, un mando físico y pruebas en Windows 11/Linux Mint de destino.

**Jugar:** doble clic en `JUGAR-WINDOWS.bat` o ejecutar `./JUGAR-LINUX.sh` (requiere Python 3); conserva siempre `http://127.0.0.1:8765/` si ya tienes partidas allí. **QA:** `VERIFICAR-WINDOWS.bat` o `./VERIFICAR-LINUX.sh` (requiere Node.js además de Python 3); prueba de Chromium con `python3 tools/qa-v36-browser.py` y Playwright instalado. Ver `QA-v3.6.md` y `docs/CRITERIOS-LANZAMIENTO-v3.6.md`.

---

# ASHEN PILGRIMAGE v3.5 — VOCES DE VESPERA

**Fase 5 de pulido — Audio e interfaz:** mezcla independiente de ambiente y efectos, volumen general, avisos visuales de sonido, texto del menú ampliable, reducción de movimiento, pantalla completa y navegación mejorada por teclado/mando. El audio sigue desactivado por defecto. Se conservan las fases anteriores, incluidos los ocho relicarios y tres atajos de v3.4.

**Jugar:** `JUGAR-WINDOWS.bat` (Windows) o `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh` (Linux Mint); Python 3 y navegador moderno. Mantén `http://127.0.0.1:8765/` para conservar el mismo origen de las partidas.

**QA:** `for f in test-*.mjs; do node "$f" || exit 1; done` (40 suites); `python3 tools/qa-v31-http.py`; `python3 tools/qa-v35-browser.py` (Chromium/Playwright). Lee `QA-v3.5.md`, `QA-v3.4.md` y `docs/AUDIO-Y-ACCESIBILIDAD-v3.5.md`. No se ha certificado una partida humana completa, ni una prueba física con mando en Windows o Linux Mint. No está publicado en GitHub.

---

# ASHEN PILGRIMAGE v3.3 — ACERO Y CENIZA

**Fase 3 de pulido:** tres dificultades (Peregrino, Normal, Penitencia), colisiones de ataques direccionales, advertencias mínimas para enemigos comunes, y más tiempo de reacción frente al Guardián de la Fosa y la Madre en segunda fase. No se añade contenido narrativo ni se alteran guardados v3.2. Para jugar, ejecuta `JUGAR-WINDOWS.bat` en Windows o `./JUGAR-LINUX.sh` en Linux (con permiso de ejecución); necesitas Python 3.

**Opciones → Dificultad** desde el título o la pausa. Normal conserva daño, resistencia, cura y esquiva principales de la versión anterior. La preferencia se guarda en el navegador (`localStorage`) de la dirección `http://127.0.0.1:8765/`, **no** en el JSON de la partida. Para exportar/importar partidas usa «Copias de seguridad JSON».

**QA reproducible:** `for f in test-*.mjs; do node "$f" || exit 1; done` (37 suites); `python3 tools/qa-v31-http.py`; `python3 tools/qa-v33-browser.py` (Chromium + Playwright + Pillow). Lee `QA-v3.3.md` y `docs/COMBATE-Y-DIFICULTAD-v3.3.md`. No hay certificación de campaña humana completa, mando físico o instaladores Windows/Linux sobre sus equipos destino.

---

# ASHEN PILGRIMAGE v3.2 — ARTE Y LEGIBILIDAD

Nueva pasada gráfica sobre v3.1: mejores fondos visibles, suelo de piedra, nuevo Doliente, Trono del Sol Muerto ilustrado, HUD compacto, modos gráficos y optimización de teselas. **Misma campaña de 35 cámaras y mismos guardados.**

**Ejecución:** Windows `JUGAR-WINDOWS.bat`; Linux `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`. Requiere Python 3. Mantener `http://127.0.0.1:8765/` para conservar las partidas.

**Gráficos:** menú → Opciones → Gráficos; alterna Cinematográfico, Legibilidad alta o Rendimiento. Los modos no alteran físicas ni enemigos.

**QA:** `for f in test-*.mjs; do node "$f" || exit 1; done`; documentación en `QA-v3.2.md` y `docs/PRUEBA-GRAFICA-v3.2.md`; pruebas visuales requieren Chromium, Playwright y Pillow. **No se ha certificado todavía una partida humana completa ni el rendimiento en Windows/Linux físicos.**

---

# ASHEN PILGRIMAGE v3.1 RC — AUDITORÍA Y ESTABILIDAD

**Conserva el contenido jugable de v3.0.** Esta actualización refuerza la protección de partidas y añade pruebas de regresión y comprobación visual; **no constituye una certificación comercial ni una partida humana completa**.

- **Copias de seguridad:** menú principal o pausa → «Copias de seguridad JSON». Exporta las ranuras válidas a `ashen-pilgrimage-guardados.json`; importa el archivo en otro navegador/puerto, con validación completa y confirmación antes de sobrescribir. Se conservan las ranuras que no aparecen en la copia. Máximo 2 MB, sin conexión ni servidores externos.
- **Ranuras dañadas:** aviso visible, sin borrado automático. Cargar una ranura dañada está deshabilitado; se puede borrar voluntariamente con confirmación o restaurar una copia JSON válida.
- **Finales:** «Ver último desenlace» revisa también las ranuras manuales, aunque un autoguardado posterior corresponda a una nueva partida.
- **Foco y teclado:** perder el foco pone en pausa y limpia teclas retenidas.
- **Lanzadores:** `JUGAR-WINDOWS.bat` o `./JUGAR-LINUX.sh` (Python 3; mantiene `http://127.0.0.1:8765/` por defecto).
- **Auditoría reproducible:** `for f in test-*.mjs; do node "$f" || exit 1; done` (34 suites); `python3 tools/qa-v31-http.py` (servidor local); `python3 tools/qa-v31-browser.py` (requiere Playwright, Chromium y Pillow). Ver `QA-v3.1.md` y `docs/CHECKLIST-MANUAL-v3.1.md`.

**Importante:** si las partidas antiguas se crearon en otro puerto, abre temporalmente esa dirección con la v3.1 para exportar y luego importa en la dirección estable; `localStorage` no se comparte entre puertos. Nunca se modifica el ZIP original de v3.0.

---

# ASHEN PILGRIMAGE v3.0 RC — EL TRONO DEL SOL MUERTO

**Séptimo reino jugable y desenlace de la campaña principal**, construido sobre v2.9 sin cambiar HTML5/JavaScript ni los lanzadores. Cuatro cámaras nuevas: Umbral de la Santa, Galería de los Soles Rotos, Altar de las Siete Brasas y Cámara del Primer Testigo. La Santa Sin Rostro explica el sol-prisión; el ritual de Desvelo requiere **Nombre → Prisión → Testigo** y las seis brasas regionales, antes del jefe final de 960 PV y dos fases. Tras su derrota se elige entre **tres desenlaces narrativos persistentes** y aparecen los créditos. Desde el título se puede consultar el último final guardado.

- **Windows:** `JUGAR-WINDOWS.bat` · **Linux:** `./JUGAR-LINUX.sh` (dar permisos con `chmod +x`). **Requisito:** Python 3 y un navegador moderno.
- **Guardados:** autoguardado y tres ranuras, con compatibilidad probada para v2.9 y versiones anteriores. Mantén `http://127.0.0.1:8765/` para usar el mismo almacenamiento local.
- **Arte:** 4 fondos WebP propios, atlas del Primer Testigo de 20 cuadros y tres enemigos finales. Fuente y generador en `art-source/final-v30/` y `tools/build-final-art-v30.py` (Pillow solo necesario para regenerar arte).
- **Pruebas:** `for f in test-*.mjs; do node "$f" || exit 1; done` (32 suites); `python tools/qa-v30-browser.py` (requiere Chromium/Playwright para la captura autocontenida). Ver `QA-v3.0.md` y `GUIA-FINAL-v3.0.md`.

**Alcance real:** hay arcos jugables en siete regiones y tres epílogos, pero **no está certificada una campaña de 25–35 horas ni una versión comercial sin fallos**. Falta un recorrido humano completo, optimización y pruebas reales Windows/Linux/mando. No se ha publicado en GitHub.

---

# ASHEN PILGRIMAGE v2.9 — LA ÚLTIMA RESONANCIA

**Cierre jugable de las Cumbres del Silencio** (sexta región). Tres salas nuevas —Escalinata de las Campanas, Observatorio del Eco y Santuario del Gigante—, con dos enemigos de resonancia, tres monolitos activados mediante **Desvelo** en orden **Piedra → Eco → Silencio**, y el **Gigante que Escucha** como jefe de 780 PV y dos fases. Su onda de resonancia puede evitarse saltando. Vencerlo concede la Brasa de las Cumbres del Silencio, registrada en el inventario y guardados. Elda tiene epílogo actualizado. La séptima región no está implementada.

- **Windows:** doble clic en `JUGAR-WINDOWS.bat` (necesita Python 3).
- **Linux Mint:** `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`.
- **Guardar/cargar:** tres ranuras y autoguardado, manteniendo `http://127.0.0.1:8765/` como origen. Guardados anteriores v2.8 aceptados.
- **Arte:** `assets/bellgiant-v29.png`, `hushmonk-v29.png`, `icechoir-v29.png`, tres fondos nuevos y fuentes en `art-source/summit-v29/`. Regenerar con `python3 tools/build-summit-v29.py` (requiere Pillow).
- **Pruebas:** `for f in test-*.mjs; do node "$f" || exit 1; done` y, si dispones de Chromium/Playwright, `python3 tools/qa-v29-browser.py`.
- **Evidencias, capturas y pendientes:** `QA-v2.9.md`, `docs/CAPTURA-REAL-v2.9-*.png` y `docs/VISTA-REAL-v2.9.jpg`.

**No es la campaña completa ni una versión comercial certificada.** Quedan por verificar partidas de principio a fin, mando real, Windows y Linux físicos.

---

# ASHEN PILGRIMAGE v2.8 — MAREAS PROFUNDAS / PRIMEROS ECOS DEL SILENCIO

Esta entrega **mejora el Guardián de Sal y la Sirena** mediante nuevos atlas de 20 celdas y mejora la lectura de personajes sobre los fondos de Salmuera. También abre la **sexta región, Cumbres del Silencio**, con dos sectores, enemigos glaciales y una misión de Elda con Desvelo y recompensa persistente. **No es la región terminada ni la campaña completa**.

- **Windows:** doble clic en `JUGAR-WINDOWS.bat`.
- **Linux:** `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`.
- **Requisito:** Python 3 y navegador moderno. Puerto habitual `http://127.0.0.1:8765/` para mantener los guardados de versiones recientes.
- **Pruebas:** `for f in test-*.mjs; do node "$f" || exit 1; done` (30 suites); `python test-art-v28.py`; `python tools/qa-v28-browser.py` (Chromium + Playwright). Lee `QA-v2.8.md` para límites y evidencia.
- **Fuentes artísticas:** `art-source/sea-v28/` y `art-source/summit-v28/`. Regeneración: `python tools/build-v28-art.py` y **después** `python tools/winterize-v28.py`.

---

# ASHEN PILGRIMAGE v2.7 — LOS ROSTROS DEL MAR

**Mejora artística de Salmuera**, sobre v2.6 sin cambiar el motor HTML5/JavaScript ni las partidas. Tres enemigos marítimos —Ahogado, Guardián de Sal y Sirena— usan ahora **atlas originales separados, con 20 cuadros de animación cada uno**, en vez de adaptaciones de criaturas anteriores. Se han añadido tres capas marítimas de paralaje propias y reducido la obstrucción visual durante los combates. Las dos nuevas siluetas de Guardián y Sirena son pixel art procedural y aún requieren refinamiento para lograr calidad artística comercial.

**Jugar:** `JUGAR-WINDOWS.bat` en Windows o `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh` en Linux. Requiere Python 3 y navegador moderno. Usa **http://127.0.0.1:8765/** para conservar el origen de los guardados anteriores. **Probar:** `for f in test-*.mjs; do node "$f" || exit 1; done` o `python tools/qa-sea-visual-v27.py` con Playwright y Chromium. Consulta `QA-v2.7.md` para resultados y limitaciones.

---

# ASHEN PILGRIMAGE v2.6 — RAÍCES ETERNAS

La quinta región del videojuego de fantasía oscura incluye ahora cuatro cámaras conectadas, Liria, un ritual mediante Desvelo, enemigos vegetales y el Jardinero de Carne como jefe regional. **Esta entrega incorpora cinco trampas de espinas vivas** con reposo, aviso y ataque, colisiones 2D, salto para esquivarlas y señales sonoras opcionales.

**Windows:** `JUGAR-WINDOWS.bat` · **Linux:** `./JUGAR-LINUX.sh` (requiere Python 3). Acceso habitual: `http://127.0.0.1:8765/`; conserva ese origen para mantener las partidas.

**Pruebas:** `for f in test-*.mjs; do node "$f" || exit 1; done`; consultar `QA-v2.6.md` y las capturas reales en `docs/`. La campaña entera, la ejecución HTTP en este entorno, las pruebas de mando físico y la partida completa aún no están certificadas. No se ha publicado nada en GitHub.

---

# ASHEN PILGRIMAGE v2.5 — EL MAR SIN ORILLAS

**Cuarto arco regional jugable implementado como expansión de Salmuera.** No es la campaña de siete reinos completa ni una versión comercial certificada.

## Novedades v2.5

- **22 sectores:** las 18 salas anteriores más Galerías Sumergidas, Sala de las Compuertas, Capilla de los Ahogados y Trono de la Novia.
- **La Novia del Abismo:** jefe regional de dos fases, 560 PV, anticipación direccional, nuevos sonidos y recompensa persistente.
- **Puzles de mareas:** tres ruedas y tres ecos (**Sal, Eco, Nombre**) en pleamar/bajamar, con Desvelo, puertas bloqueadas hasta cumplir la secuencia y un vigía que explica las reglas.
- **Exploración submarina 2D:** física de desplazamiento más lenta, ascenso mediante salto, oxígeno consumible cuando sube la marea y daño por asfixia.
- **Historia:** la relación entre Marín y la Novia culmina con un epílogo y la **Brasa del Mar sin Orillas**.
- **Arte nuevo:** cuatro fondos de ambiente original, sprites inéditos de Ahogados y Sirenas (pixel art programático) y atlas de la Novia basado en arte generado originalmente para este proyecto. Las fuentes y el generador reproducible están en `art-source/sea-v25/` y `tools/build-sea-art-v25.py`.
- **Guardado compatible:** se amplían enemigos, coordenadas, inventario y estados; permanecen las tres ranuras y el autoguardado.

### Ejecutar

**Windows:** doble clic en `JUGAR-WINDOWS.bat`. **Linux Mint:** ejecutar `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh` (o doble clic si el gestor de archivos permite ejecutar scripts). En ambos casos se necesita Python 3 y un navegador moderno, pero **no** es necesario instalar paquetes Python.

El juego utiliza de forma predeterminada **http://127.0.0.1:8765/**. Mantén esa dirección entre ejecuciones: `localStorage` depende del puerto. Si está ocupado, cierra el servidor existente o elige un puerto fijo explícitamente con `python3 serve.py --port 8766` y reutiliza ese mismo puerto en adelante.

**Controles:** A/D o flechas mover, Espacio saltar/nadar, J atacar, Shift esquivar, R curar, Q Desvelo, E hablar/girar compuertas/escuchar ecos/usar puertas, I inventario, M mapa, Esc pausa. Mando estándar: stick/cruceta, A, B, X, Y, Start y Select. La compatibilidad física de mandos requiere prueba manual.

**Pruebas:** `for f in test-*.mjs; do node "$f" || exit 1; done`. Ver `QA-v2.5.md` para resultados, capturas de Chromium autocontenidas y comprobaciones pendientes.

**Pendiente:** se requiere probar el juego completo en navegador normal y en Windows/Linux con mando. La campaña completa incluye regiones aún no desarrolladas.

---

# ASHEN PILGRIMAGE v2.4 — EL PUERTO QUE RECUERDA

**Nueva fase jugable inicial de Salmuera, el Mar sin Orillas. No es la cuarta región terminada ni el juego completo.**

### Novedades v2.4

- Dos sectores conectados: **Puerto de las Campanas** (19000–20500) y **Muelle Hundido** (20500–22000). El acceso desde Ossara exige derrotar al Archivero Ciego.
- **Marín, la Farera**, con un encuentro y una misión en tres pasos: escuchar el encargo, recuperar con Desvelo la memoria sumergida tras vencer a los custodios del muelle, y regresar a recibir el **Sello de Salmuera**.
- Cuatro enemigos **Guardianes de Sal** con comportamiento propio; nuevos atlas de Marín y Guardianes, basados en recursos originales del proyecto.
- Dos nuevos fondos marítimos góticos construidos sobre la arquitectura original ya disponible: escenas inundadas, muelles, barcos y gradación azul petróleo. Son composiciones nuevas de recursos existentes, no pinturas enteramente originales.
- Audio ambiental propio para Salmuera, señal sonora del recuerdo, mapa de dieciocho sectores y dos nuevas hogueras.
- Guardados anteriores compatibles, se conservan las ranuras manuales y el autoguardado; la fase de la misión se guarda.

### Ejecutar y verificar

**Windows:** doble clic en `JUGAR-WINDOWS.bat` (requiere Python 3). **Linux:** `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`.

**Pruebas:** `for f in test-*.mjs; do node "$f" || exit 1; done` desde esta carpeta.

Consultar **QA-v2.4.md** para resultados y pendientes. El navegador Chromium de este entorno bloqueó el acceso local: la partida visual completa sigue sin certificar.

---

# ASHEN PILGRIMAGE v2.3 — EL ÚLTIMO REGISTRO

**Versión candidata en desarrollo; no es la campaña completa.** Continúa sobre v2.2, sin cambiar motor ni sobrescribir guardados existentes.

### Mejoras v2.3

- **Archivero Ciego:** franja de ataque direccional con alcance y progreso; anticipación de 0,88 s en fase 1 y 0,67 s en fase 2; señales sintetizadas de aviso final, golpe y transformación.
- **Cohesión visual del prólogo:** cinco fondos de la cripta graduados y enriquecidos con tracery gótico. Copias originales preservadas en `art-source/v22-crypt-rooms/`. Reproducir con `python tools/remaster-crypts-v23.py`.
- HUD de regiones corregido. Sin cambios incompatibles de guardado ni cambio de colisiones.
- **QA:** `QA-v2.3.md`. 25 suites de pruebas automatizadas aprobadas; juego completo en Chromium pendiente porque este entorno bloquea navegación.

### Ejecutar

Windows: `JUGAR-WINDOWS.bat`. Linux: `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`. Necesita Python 3 y un navegador moderno. Pruebas: `for t in test-*.mjs; do node "$t" || exit 1; done`.

---

# ASHEN PILGRIMAGE v2.2 — LOS NOMBRES PROHIBIDOS

**Versión en desarrollo.** Continúa sobre v2.1, sin sustituir los datos anteriores ni cambiar el motor HTML5/JavaScript.

## Novedades

- Mejorada la anticipación de la Madre de los Mil Nombres (el área de peligro se mantiene durante la preparación del ataque).
- Ambiente sonoro original por síntesis Web Audio: tonos ambientales según región, avisos y ecos. Solo suena si el jugador activa **Audio**; no requiere Internet ni música con licencia.
- Primer sector jugable de **Ossara · Atrio de los Huesos**, accesible tras derrotar a la Madre.
- NPC Velador de los Nombres, dos centinelas óseos y misión breve: hablar con el Velador, derrotar a los centinelas, usar Desvelo en la inscripción oriental, regresar.
- Nuevo fondo de Ossara y variantes de sprite de Velador y centinela, generadas a partir de recursos originales del proyecto.
- Integrados cinco atlas visualmente más detallados (Portador, Rey, Caldris, Maera y Enterrador), convertidos desde las hojas originales aprobadas por el usuario a 20 celdas transparentes de 128×160. Los recursos de origen y el conversor reproducible se incluyen en `art-source/` y `tools/import-generated-sprites-v21.py`. Es arte generado y adaptado, no animación manual definitiva.
- Guardados ampliados, admitiendo todos los formatos históricos existentes. Mapa de 13 sectores, con dos filas para que no se desborde.

**Ossara no es todavía una región completa.** El atrio inicia su historia, pero faltan la Catedral, el Archivero Ciego, misiones y puzles extensos.

## Arranque

Windows: doble clic en `JUGAR-WINDOWS.bat`. Linux Mint: `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`. Se necesita Python 3 y navegador moderno. El servidor escucha únicamente en `127.0.0.1` y selecciona un puerto disponible.

## Controles

A/D mover, Espacio saltar, J atacar, Shift esquivar, E interactuar/cruzar puertas, Q Desvelo, R curarse, P autoguardar, I inventario, M mapa y Esc pausa. Mando estándar: cruceta/stick, A, X, B, Y, Start y Select. Activar audio con el botón «Audio»; se inicia desactivado.

## Verificar

`for f in test-*.mjs; do node "$f" || exit 1; done` en Linux, Bash o WSL. Pruebas de navegador: `python3 browser-v21.py` si Playwright y Chromium están instalados.

Resultados, limitaciones y ruta manual en `QA-v2.1.md`. Las vistas previas `docs/VISTA-PREVIA-v2.1.png` y `docs/ATLAS-v2.1-REVISION.png` es una composición de recursos, **no** una captura real del motor.

---

# ASHEN PILGRIMAGE v1.8 RC — LAS NUEVE CAMPANADAS

Actualización del Rey de las Nueve Exequias, sonido de combate y menús con mando sobre el proyecto HTML5 v1.7.

- **Jugar**: `JUGAR-WINDOWS.bat` en Windows o `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh` en Linux Mint. Necesita Python 3 y navegador moderno.
- **Mando estándar**: A saltar/confirmar, X atacar, B esquivar/volver, Y interactuar, Start pausa/reanudar, Select autoguardar, cruceta/stick navegación. Activar sonido con el botón «Audio».
- **Pruebas**: `for t in test-*.mjs; do node "$t" || exit 1; done` (Node.js). Ver `QA-v1.8.md` para resultados, limitaciones y protocolo de prueba con mando.
- **Recursos**: atlas original del Rey v1.7 conservado en `assets/king-v16.png`; nuevo atlas refinado `assets/king-v18.png` y vista de sus 20 cuadros en `docs/REY-v1.8-ATLAS.png`.
- **Código nuevo**: `king-presentation.js`, `gamepad-menu.js`, `test-v18-boss-pad.mjs`, `tools/king-v18-atlas.py` (script reproducible con Pillow para regenerar el atlas).
- **Límites**: los dibujos siguen siendo pixel art programático y las pruebas no sustituyen un recorrido completo con mando físico. No se ha publicado en GitHub.

---

# ASHEN PILGRIMAGE v1.7 RC — LA SENTENCIA VISIBLE

Revisión de claridad visual y jugabilidad del Rey de las Nueve Exequias. Se conservan ocho sectores, guardados, personajes, menús y lanzadores Windows/Linux. Aviso del jefe direccional con alcance y progreso, anticipación extendida y escenario de arena despejado.

**Ejecución:** `JUGAR-WINDOWS.bat` (Windows) o `./JUGAR-LINUX.sh` (Linux, tras dar permiso). Requiere Python 3. **Pruebas:** `for t in test-*.mjs; do node "$t" || exit 1; done`. Registro en `QA-v1.7.md`.

---

# ASHEN PILGRIMAGE v1.6 — EL JUICIO DE VALDREN

**Versión en desarrollo.** Juego HTML5 + JavaScript compatible con navegadores modernos. Mantiene los lanzadores `JUGAR-WINDOWS.bat` y `JUGAR-LINUX.sh` con Python 3 instalado.

## Novedades v1.6

- Ocho cámaras en total, incluidas dos nuevas áreas de Valdren: **Barrio de los Tizones** y **Plaza de las Exequias**.
- **Rey de las Nueve Exequias**: jefe regional de dos fases y 320 HP. La victoria cierra el arco jugable de Valdren, no la campaña completa.
- Dos enemigos adicionales: **Guardianes de Tizón** y **Campaneros Espectrales** con comportamientos diferentes.
- Nuevos personajes **Iren** y **Veska**, y decisión persistente entre ayudar a los exiliados u obedecer al Consejo, con recompensas diferentes.
- **Inventario** (tecla `I`) y **mapa de sectores descubiertos** (tecla `M`). También en el menú de pausa.
- Sistema de guardados ampliado, manteniendo compatibilidad con partidas anteriores de 9 y 12 enemigos.
- Fondos y atlas específicos para Valdren, menor obstrucción del primer plano y siluetas más legibles.

**Acceso a la plaza:** derrota al Guardián, completa la misión del badajo con Erena, atraviesa el umbral de las murallas, habla con Iren o Veska y decide una promesa. Las puertas se cruzan con `E`.

## Ejecutar

Windows: `JUGAR-WINDOWS.bat`. Linux: `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`. Ambos requieren Python 3. Alternativa: `python3 serve.py --no-browser` y abrir la URL local indicada.

## Probar

```bash
for t in test-*.mjs; do node "$t" || exit 1; done
```

Las pruebas de integración usan un DOM simulado, **no equivalen a una partida real en navegador**. Ver `QA-v1.6.md`.

---

## Documentación histórica

# ASHEN PILGRIMAGE v1.4 — La Forja de las Siluetas

**Estado:** prototipo jugable del primer capítulo. No es todavía la campaña completa ni una versión certificada.

## Novedades v1.4

- Nuevas hojas PNG originales 20 × (128 × 160) para **El Portador de Ceniza** y **Guardián de la Fosa**, pixel art con transparencia.
- Fotogramas 0–3 caminata, 4–5 reposo, 6 salto, 7 esquiva, 8–11 ataque, 12–13 daño, 14–17 muerte; 18–19 corresponden a la segunda fase del jefe.
- `animation-state.js` desacopla estados de animación del render; `game.js` mantiene un temporizador de daño visual y reinicia ese estado al reaparecer.
- El jefe utiliza nueva animación de derrota, aviso de ataque y variante visual durante la fase dos.
- Se conservan 3 ranuras manuales, autoguardado, menús, Desvelo, otros cinco atlas v1.3, cinco cámaras y lanzadores.
- Previsualizaciones en `docs/pilgrim-v14-preview.png` y `docs/warden-v14-preview.png`.

## Ejecutar

Linux: `./JUGAR-LINUX.sh` (o `bash JUGAR-LINUX.sh`).
Windows: doble clic en `JUGAR-WINDOWS.bat`.
Se necesita Python 3. Los lanzadores levantan un servidor solo en 127.0.0.1 y abren el navegador.

## Verificar

En el directorio del juego, `for f in test-*.mjs; do node "$f" || exit 1; done` en Linux; en Windows ejecutar cada `node test-...mjs`.
Ver `QA-v1.4.md`. No se modificaron los archivos de guardado originales de los usuarios: la evolución es compatible con los registros anteriores.

---

# ASHEN PILGRIMAGE — v1.0 RC El Último Umbral

Prototipo jugable HTML5 Canvas, JavaScript ES modules. Esta versión sustituye el fondo procedural distante por una ilustración original y añade atlas de sprites dibujados para protagonista y enemigos.

## Inicio

* Linux: doble clic en `JUGAR-LINUX.sh` si está asociado al terminal, o `./JUGAR-LINUX.sh`.
* Windows 10/11: doble clic en `JUGAR-WINDOWS.bat`.
* Alternativa multiplataforma: `python3 serve.py` o `python -m http.server 8000` y abrir la URL que indique.
* Requisito: Python 3 y navegador moderno. Internet no es necesario.

## Controles

A/D o flechas: caminar; Espacio: saltar; J: espada; Shift: esquivar; E: interactuar; Q: Desvelo; R: curarse; P: guardar; Esc: pausa. Gamepad estándar compatible con Gamepad API, sin validación en dispositivo físico.

## Recursos nuevos

* `assets/crypt-cinematic.webp`: fondo ilustrado original 1672 × 941; se recorta suavemente con la cámara.
* `assets/pilgrim-sprites.png`: atlas RGBA de 10 fotogramas, 120 × 140 cada uno (6 de marcha, 1 reposo, 3 de ataque).
* `assets/gravebound-sprites.png`: 6 fotogramas de enemigo común.
* `assets/warden-sprites.png`: 6 fotogramas de jefe.
* `visual.js`: cargador de recursos y renderizado de sprites con inversión horizontal y retorno al dibujo vectorial mientras los sprites no estén disponibles.

Los atlas están generados a partir de ilustraciones SVG originales mediante un script de preparación externo, no son sprites o texturas extraídos de otros juegos. Se incluyen los PNG finales para que el prototipo no requiera generador de recursos al ejecutarse.

## Limitaciones y siguiente fase

Este es un prototipo y no el capítulo definitivo: falta dirección artística consistente en todas las salas, animaciones de daño, salto y muerte, sincronización de ataques con hitboxes, variantes de enemigos, bosses con telegráficos, audio ambiental, pruebas reales con mando, y tests de recorrido end-to-end. El fondo es un único plano ilustrado; no constituye una escena 3D real ni reemplaza un sistema de paralaje multicapa. Quedan pendientes pruebas reales en Windows 11 y Linux Mint.

## Integridad y seguridad

El servidor solo entrega archivos del juego a través de una URL local. El guardado actual sigue en `localStorage`, identificador `ashen-pilgrimage-prototype-v01`; se mantiene compatibilidad con partidas anteriores. No requiere conexión a terceros ni telemetría.


## v0.6 — Profundidad y lectura del combate

- Tres recursos originales adicionales: `far-spires.png` (0,12× cámara), `middle-ossuary.png` (0,34×), `foreground-brambles.png` (1,18×), con la geometría del nivel en 1×.
- Ataques encadenados (tercer impacto más potente) y arco visual para el golpe.
- Aviso visual y retraso antes del daño enemigo; ventana de esquiva.
- Seguimiento de cámara suavizado sin alterar la lógica de colisiones.
- Se preserva `localStorage` anterior y los lanzadores `.bat` / `.sh`.
- Pendiente ampliar los fotogramas de los atlas (todavía 10/6/6); esta versión mejora las animaciones **de combate** con arco dinámico y estados de anticipación, no utiliza motion capture.


## v0.6 — Las Cinco Cámaras

Esta actualización mantiene el recorrido único anterior, ahora dividido narrativamente en cinco sectores: Cripta de los Peregrinos, Claustro en Ruinas, Osario Menor, Campanario Caído y Fosa del Guardián. Cuatro inscripciones legibles con **E** amplían la historia. El Guardián tiene dos fases y una barra de vida. Ver `QA-v0.6.md` para pruebas y limitaciones.

**Advertencia:** la división en sectores y las cinemáticas de texto no sustituyen nuevos mapas y salas conectadas. Los gráficos existentes se conservan; no hay nuevas animaciones artísticas de producción en esta entrega.


## v0.7 — Los Umbrales

Cinco cámaras con barreras físicas que requieren **E** junto al umbral. La transición conserva el estado de enemigos, lore y hogueras, delimita la cámara visualmente, cambia su arquitectura y añade iluminación cálida dinámica. La estructura permanece en un solo mundo 2D persistente; no son mapas Tiled separados. Ver `QA-v0.7.md`.

**Compatibilidad:** lanzadores `JUGAR-WINDOWS.bat` / `JUGAR-LINUX.sh` y `serve.py` idénticos a v0.6; partida guardada con la misma clave.


## v0.8 — El Lamento de las Cenizas

- Combate extraído a `combat.js`: tres impactos de distinta fuerza, alcance, recuperación y consumo de resistencia. La cadena se reinicia después de 0,78 segundos sin encadenar.
- Nueva barra de resistencia: ataques y esquivas consumen energía y se recarga con el tiempo. La esquiva concede un breve intervalo de invulnerabilidad.
- Los **dolientes** ahora disparan ecos funerarios a distancia, en lugar de limitarse a perseguir al protagonista. Los enterradores mantienen ataques físicos y el Guardián conserva su segunda fase con embestida.
- Animación contextual de salto y esquiva, arco de espada ajustado al golpe, proyectiles y avisos de ataque más legibles. Se reutilizan los atlas artísticos originales de v0.4 (10/6/6 fotogramas), todavía no son animaciones nuevas dibujadas cuadro a cuadro.
- Compatible con partidas v0.1–v0.7 bajo la misma clave. La resistencia no se guarda para no invalidar partidas históricas.
- `test-v08.mjs` valida la lógica de combate; `browser-smoke.py` sirve como prueba reproducible en un ordenador con Playwright y Chromium instalados, pero no es necesario para jugar.
- **Limitación de QA:** Chromium en el entorno de desarrollo bloqueó la URL local (`ERR_BLOCKED_BY_ADMINISTRATOR`); no hay recorrido e2e certificado. Tampoco se han ejecutado los lanzadores en Windows o Linux Mint físicos.


## v0.9 — La Danza de los Sepultados

- Nuevos atlas **originales** de 12 fotogramas y 128×160 por personaje: `pilgrim-v09.png`, `gravebound-v09.png`, `mourner-v09.png` y `warden-v09.png`.
- Animación diferenciada de caminata (4 fases), reposo (2), salto, esquiva y cuatro poses de ataque para el protagonista. Los otros personajes incorporan distintas poses reutilizadas según estado. **No es rotoscopia ni captura de movimiento**; son ilustraciones 2D vectoriales rasterizadas y todavía necesitan más interpolación y fotogramas.
- Siluetas propias: enterradores acorazados, dolientes espectrales con rituales violetas y Guardián de la Fosa de gran tamaño. No se utilizan recursos de Silver Pines ni otros videojuegos.
- Cinco fondos originales derivados de la ilustración licenciada para el proyecto: `room-crypt.webp`, `room-cloister.webp`, `room-ossuary.webp`, `room-bell.webp`, `room-arena.webp`. Cambian gradación y ornamentación por cámara; no son cinco escenarios 3D ni mapas independientes.
- Continúan `crypt-cinematic.webp` y los parallax anteriores como recursos de respaldo. Se conservan los lanzadores y la clave de guardado `ashen-pilgrimage-prototype-v01`.
- `test-v09.mjs` verifica dimensiones y referencias de recursos nuevos; los tests v0.6, v0.7, v0.8 y runtime siguen disponibles.
- Se mantiene pendiente la partida real y la validación visual en navegador: el Chromium de este entorno devuelve `ERR_BLOCKED_BY_ADMINISTRATOR` al acceder a localhost.


## v1.0 RC — El Último Umbral (candidata, no lanzamiento definitivo)

- Respuesta visual al impacto: partículas con límite de memoria, breve congelación de contacto (hit stop), temblor de pantalla y destello del objetivo.
- Derrota del protagonista: transición carmesí de 1,75 segundos y reaparición en la última hoguera, con salud, resistencia y ampollas restauradas.
- Enemigos derrotados: partículas y desvanecimiento de una silueta en el suelo (todavía **no** una animación artesanal completa de muerte).
- Segunda fase del Guardián: círculo de aviso en el suelo durante los instantes finales de la anticipación; se conservan embestidas y telegráficos de v0.9.
- `effects.js` contiene efectos sin dependencia del DOM y se prueba mediante `test-v10.mjs`.
- No se ha rediseñado el mapa: siguen siendo cinco sectores conectados en un único espacio persistente, no cinco niveles independientes.
- Guardados antiguos: misma clave `ashen-pilgrimage-prototype-v01`, sin migración destructiva.

**Estado de QA:** pruebas unitarias y simulación JavaScript ejecutadas; juego completo en un navegador real, hardware gamepad, Windows 11 y Linux Mint siguen pendientes. Se distribuye como **release candidate**, no como juego terminado.

## v1.1 RC — La Campana del Acero

- Golpes de espada sincronizados con una ventana activa durante cada una de las tres animaciones, sin aplicar daño al pulsar el botón antes de la animación.
- Proyectiles con colisión barrida para evitar atravesar al jugador entre fotogramas.
- La reaparición reinicia las acciones pendientes y el movimiento.
- El canvas mantiene relación de aspecto 16:9, evitando distorsión en monitores ultrapanorámicos o en vertical.
- Nuevas pruebas `test-v11.mjs` y `test-v11-integration.mjs`. Consultar `QA-v1.1-RC.md` para evidencias y pendientes.

**Nota:** esto continúa siendo una candidata técnica de un capítulo; el juego completo requiere más contenido, recursos y pruebas reales en navegadores y equipos.

## v1.2 RC — Menús y guardados

Al iniciar el navegador aparece el menú principal con **Continuar**, **Nueva partida**, **Cargar partida**, **Opciones**, **Controles** y **Gestionar partidas**. `Esc` abre la pausa, desde donde se puede **Guardar**, **Cargar**, regresar al título o reanudar. Existen **tres ranuras manuales** y **un autoguardado** independientes. Guardar en una ranura ocupada, empezar una nueva partida si hay progreso, cargar otro progreso y borrar una ranura requieren confirmación.

Las partidas v1.1 se importan una sola vez al autoguardado si este está vacío; el dato antiguo se conserva. Los guardados se almacenan por origen HTTP y perfil del navegador en `localStorage`, no en la carpeta del juego. No se recomienda borrar datos del navegador sin copia de seguridad (exportación JSON todavía pendiente). Los lanzadores Linux y Windows se conservan.

Para verificar: `node test-v12-menu.mjs && node test-v12-save.mjs`. Más detalles en `QA-v1.2-RC.md`.


## v1.3 — Reparto en pixel art original

El Portador de Ceniza, Enterrador, Doliente, Guardián de la Fosa, Maera, Ser Caldris y la Santa Sin Rostro tienen atlas PNG originales de 12 cuadros, 128 × 160 por cuadro, fondo transparente y remuestreo nearest-neighbor. Los diseños combinan armadura funeraria, metal ennegrecido, capas carmesí y detalles de grabado medieval.

Maera aparece en el Claustro (x=1200), Caldris en el Campanario (x=3180) y la Santa en el Osario (x=2460), esta última solo en Desvelo. Acércate y pulsa **E** para escuchar sus diálogos. Son encuentros narrativos sencillos, no líneas de misiones completas. Los guardados existentes no cambian de formato.

**Arte:** Los sprites pixel art son originales y generados expresamente mediante `tools/generate-pixel-art.py` en la entrega; los fondos originales de versiones anteriores permanecen. **No se han copiado sprites de videojuegos comerciales.**

## v1.5 — Campana del Exilio (ampliación jugable)

Esta entrega **no es la campaña completa**. Mantiene el capítulo I (cinco cámaras) y
suma la **primera zona exterior de Valdren**, una sexta cámara contigua y transitable.

- Tras derrotar al Guardián de la Fosa y acercarte al final de su cámara,
  aparece el aviso de capítulo terminado. Usa **E** junto al umbral oriental
  para entrar en Valdren. La campaña sigue siendo jugable tras el aviso.
- En Valdren, habla con **Vigía Erena** (E). Te encarga recuperar el
  **Badajo de los Exiliados**.
- Derrota a los **tres guardias del Exilio**, utiliza **Q (Desvelo)** junto al
  muro oriental y pulsa **E** para recuperar el badajo. Regresa con Erena para
  cerrar la misión. No hay un segundo jefe ni región adicional todavía.
- Hoguera nueva de Valdren situada cerca de la entrada, con autoguardado.
- Atlas secundarios ampliados a 20 cuadros: Ser Caldris, Maera,
  Santa Sin Rostro, Enterrador y Doliente. Se añaden Vigía Erena y
  Guardias del Exilio. Son pixel art procedural derivado de nuestros recursos
  originales, **no animaciones artesanales cuadro a cuadro**.
- Guardados v1.4 y anteriores se leen sin reescribir sus originales.
  Los nuevos estados de misión se guardan en los mismos slots v2.

**Ejecutar:** `JUGAR-LINUX.sh` o `JUGAR-WINDOWS.bat`, con Python 3 instalado.
También puedes iniciar `python3 -m http.server 8000` y acceder a
`http://localhost:8000`.

**Pruebas:** ejecuta `node test-v15.mjs` y `node test-v15-flow.mjs`, más
`node test-v12-menu.mjs`. El resto de archivos `test-*.mjs` cubre regresiones.
`python browser-v15.py` permite probar Chromium en un equipo sin bloqueo
administrativo al acceso HTTP local. Consulta `QA-v1.5.md`.


## v1.9 — El sendero de las voces
Después del Rey de Valdren se puede cruzar al **Bosque de las Voces**: Sendero de Raíces y Arboleda del Eco. Incluye Aina, cuatro Custodios y la misión «Memoria entre raíces» que exige Desvelo. Se mantienen los lanzadores Windows/Linux y la compatibilidad con guardados de 17 enemigos. No es una región completa ni una certificación de hardware. Véase `QA-v1.9.md`.

## v2.0 — Los Tres Nombres (ampliación jugable)

- **Refugio de las Luciérnagas** (sector 11): nuevo ambiente, hoguera en `x=11320` y descanso/guardado.
- **Santuario de los Mil Nombres** (sector 12): arena y enfrentamiento contra **la Madre de los Mil Nombres**, con dos fases y barra de vida.
- **Puzle de los tres ecos**: completa antes la misión de Aina; en el Refugio, activa Desvelo (`Q`) y escucha los monolitos (`E`) en el orden **Duelo → Nombre → Promesa**. Una respuesta incorrecta reinicia la secuencia. Después se desbloquea el Santuario.
- **Epílogo de Aina**: al vencer a la Madre, regresa al Sendero para escuchar el cierre del arco. La Brasa del Bosque aparece en el inventario.
- Nuevos recursos originales `room-refuge.webp`, `room-sanctuary.webp` y `mother-v20.png` (20 cuadros pixel-art programáticos).
- Las partidas existentes conservan sus ranuras; se añaden `forestEchoes` y `forestClear` de forma opcional.

### Alcance

Esta versión **cierra un primer arco jugable del Bosque**, no representa todavía el juego completo de siete regiones. Las animaciones y gráficos son recursos originales hechos con código; no equivalen a sprites premium dibujados a mano. La validación completa en navegador, con mando físico y en Windows/Linux Mint sigue pendiente.

Pruebas: `node test-v20-forest.mjs`, `node test-v20-integration.mjs` y `for f in test-*.mjs; do node "$f"; done`.


## v2.2 — Los Nombres Prohibidos
Tres cámaras de Ossara conectadas a su atrio: Archivo de las Ausencias, Coro de los Sin Nombre y Cámara del Archivero. Epitafios en orden Hueso → Ceniza → Silencio con Desvelo; Escriba Neria y enemigos Escribas; Archivero Ciego de dos fases; Brasa de Ossara persistente; fondos de mayor detalle y arte propio de la región. Lanzadores Windows/Linux sin cambios.

## v2.6 — Raíces Eternas · El Jardinero de Carne

Se abre el quinto reino después de derrotar a la Novia del Abismo. Cuatro cámaras conectan el Umbral de la Savia, Hojaclara, el Jardín de los Injertos y el Invernadero de Carne. Liria inicia una misión que exige escuchar mediante Desvelo tres injertos en orden **Corteza → Savia → Carne**, antes de poder desafiar al Jardinero de Carne (650 PV, dos fases). Se añaden Cortezudos, Videntes de Esporas y trampas de espinas que avisan antes de activarse. La Brasa de las Raíces Eternas y el Garfio de la Raíz Viva quedan en el inventario; el garfio todavía no concede desplazamiento especial.

Los cuatro fondos y nuevos atlas de 20 cuadros están en `assets/`, con fuente del Jardinero en `art-source/v26-jardinero-source.png` y procedimiento reproducible en `tools/build-roots-art-v26.py`. Se conserva el servidor Python y los lanzadores Windows/Linux, con puerto estable 8765. Las capturas reales de Chromium autocontenido están en `docs/CAPTURAS-v2.6.png`. Consulta `QA-v2.6.md` para las **28 suites** de pruebas y los límites de verificación. No es la campaña de siete regiones terminada.
