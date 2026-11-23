# ASHEN PILGRIMAGE v4.0 RC — Informe de cierre técnico

**Fecha:** 23 de noviembre de 2026. **Base:** copia de v3.9; los ZIP v3.9 y anteriores no se han modificado. **Decisión: NO-GO para release estable**, porque falta validación humana y física. No se ha publicado en GitHub. No se ha utilizado REA: se trabaja con código fuente JavaScript, no con un ejecutable de terceros.

## Hallazgos, causa y correcciones

1. **Datos de autoguardado dañados protegidos.** Antes, la confirmación de carga manual ejecutaba `save()` y podía reemplazar sin aviso un `auto` corrupto. `game.js` comprueba ahora el estado antes de guardar automáticamente; si está dañado, lo conserva y avisa en pantalla de que el usuario puede guardar manualmente o restaurar una copia JSON. Únicamente «Nueva partida» tras la confirmación de sobrescritura, «Eliminar» tras confirmación o «Restaurar copia JSON» tras confirmación permiten sustituirlo. El resultado de `save()` devuelve éxito/error. Prueba `test-v40-save-protection.mjs` (también una interacción de teclado que pide autoguardar).
2. **Partidas ganadas no regresan a estado incompleto al cargarse.** `applySave()` reemplazaba siempre `phase` por `playing`. Ahora conserva `won` exclusivamente si la partida contiene `finalClear` y un final conocido; `finalEnding` se conserva. Prueba de guardado/carga `test-v40-save-protection.mjs` y pruebas previas de los tres finales `test-v39-ending-ui.mjs`.
3. **Lectura robusta de ausencia de ranura.** `save-manager.js` trata `null` o `undefined` como ranura ausente en ambas consultas; es compatible con la semántica real de `localStorage` y con implementaciones de pruebas, sin alterar las claves o esquemas.
4. **Recorrido desde cero sin inyectar progreso.** `test-v40-player-journey.mjs` usa los manejadores reales de menús y teclado con un almacenamiento vacío; prueba crear partida, avanzar, autoguardar, guardar/cargar en ranura, atacar y regresar al título. `tools/qa-v40-player-browser.py` repite el recorrido con Chromium real, exporta una copia mediante descarga del navegador y la importa mediante su selector de archivos. No se modifican flags ni posiciones internas.

## Resultado automatizado registrado en este entorno

| Prueba | Resultado | Alcance exacto |
|---|---|---|
| 49 ficheros `test-*.mjs` | **49/49 PASS** | Unitarias/integración, incluidos 2 nuevos casos v4.0 |
| `tools/qa-v36-preflight.py` | **145/145 PASS** | Sintaxis, recursos declarados, launcher estático y HTTP local |
| `tools/qa-v38-animation.py` | **23/23 atlas; 460 fotogramas no vacíos** | No equivale a animación anatómica individual dibujada |
| `tools/qa-v36-browser.py` | **35/35 cámaras, PASS** | Render en Chromium con posiciones preparadas |
| `tools/qa-v39-browser.py` | **16/16 vistas, PASS** | Avisos y golpes de 8 enemigos en estados de QA |
| `tools/qa-v38-combat.py` | **69/69 duelos, PASS** | 23 especies × 3 dificultades, jugador inmóvil |
| `tools/qa-v40-player-browser.py` | **PASS; sin errores JS observados** | Nueva partida con teclado, movimiento, ataque, autoguardado, ranura, descarga/importación JSON, reanudar y título |
| `JUGAR-LINUX.sh` | **HTTP 200** | Lanzador realmente ejecutado en este contenedor Linux; **no** Linux Mint de destino |
| Windows 11 con navegador y mando físicos | **NO PROBADO** | Entorno sin acceso a esos equipos |
| Campaña humana de principio a fin, 3 finales con partidas completas | **NO PROBADO** | Las suites de puertas y finales usan estados preparados |
| Rendimiento, FPS, audio y RAM 60 minutos | **NO PROBADO** | Las micropruebas de render no son una sesión larga |

### Pruebas reproducibles

Desde el directorio del juego, con Node.js 18+ y Python 3:

```bash
for t in test-*.mjs; do node "$t" || exit 1; done
python3 tools/qa-v36-preflight.py
```

Con `pip install playwright pillow` y Chromium disponible en `/usr/bin/chromium` (las pruebas visuales incluidas utilizan esa ruta en este entorno Linux):

```bash
python3 tools/qa-v38-animation.py
python3 tools/qa-v36-browser.py
python3 tools/qa-v39-browser.py
python3 tools/qa-v38-combat.py
python3 tools/qa-v40-player-browser.py
```

**Importante:** el navegador Chromium de este contenedor no puede navegar a `127.0.0.1` (`ERR_BLOCKED_BY_ADMINISTRATOR`). Las pruebas visuales usan un empaquetado temporal del código y recursos en memoria y un almacenamiento vacío; el servidor sí ha sido comprobado por HTTP. Este procedimiento no reproduce las condiciones exactas de un navegador del usuario.

## Condiciones para un lanzamiento real

La matriz verificable sin casillas premarcadas está en `docs/CRITERIOS-LANZAMIENTO-v4.0.md`. Se requieren: (1) recorrido manual de 35 cámaras y 8 jefes sin modificar estados, (2) tres finales obtenidos y reabiertos desde tres partidas, (3) Windows 11 y Linux Mint reales, con teclado y mando, (4) una sesión de al menos 60 minutos con FPS/CPU/RAM/audio, y (5) corrección de bloqueantes con repetición de pruebas. Hasta entonces la etiqueta correcta es **v4.0 RC / candidata**, no «final sin fallos» ni «calidad 9,5/10 certificada».
