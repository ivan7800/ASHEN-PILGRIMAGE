# QA v3.3 — Acero y Ceniza

Fecha: 2026-11-23. **Base:** copia verificada del ZIP v3.2. No se ha modificado el archivo original ni se ha publicado en GitHub. REA no se ha ejecutado porque esta fase consiste en mantenimiento del código fuente del juego, no en ingeniería inversa de un binario.

## Cambios implementados

- `balance-v33.js`: tres perfiles locales **Peregrino**, **Normal** (predeterminado) y **Penitencia**. Normal conserva daño recibido, curación, resistencia y esquiva originales. La dificultad se persiste en `localStorage` con clave independiente `ashen-pilgrimage-difficulty-v33`; no modifica archivos de guardado ni su validador. No se incluye automáticamente en exportaciones JSON de partidas, puesto que es una preferencia de esta instalación.
- `game.js`: menú principal y menú de pausa → Opciones → Dificultad. El modo modifica daño recibido, cura de ampollas, regeneración de resistencia, coste/invulnerabilidad de esquiva y anticipación de enemigos comunes.
- `combat.js`: daño del cuerpo a cuerpo enemigo respeta la orientación de su ataque. La dirección se fija al comenzar la preparación para impedir que el golpe siga al jugador si esquiva por detrás. **No se cambian** el daño de la espada ni los tres golpes base.
- `balance-v33.js`: preparación de enemigos comunes de al menos **0,52 s** para reforzar la lectura incluso en los patrones rápidos.
- `boss-clarity.js`: fase 2 del Guardián de la Fosa y la Madre de los Mil Nombres: preparación mínima **0,60 s** y banda de peligro orientada durante la preparación. El resto de jefes conserva sus tiempos existentes, incluido el Rey, Archivero, Novia, Jardinero, Gigante y Primer Testigo.
- `visual.js`: flecha direccional durante los avisos de los enemigos comunes; no altera sus hitboxes ni recursos gráficos.

## Perfiles

| Parámetro | Peregrino | Normal | Penitencia |
|---|---:|---:|---:|
| Daño recibido | 0,75x | 1,00x | 1,25x |
| Curación con ampolla | 55 | 45 | 35 |
| Regeneración de resistencia | 1,25x | 1,00x | 0,85x |
| Coste esquiva | 22 | 28 | 34 |
| Invulnerabilidad de esquiva | 0,38 s | 0,34 s | 0,30 s |
| Preparación común | 1,20x (mín. 0,52 s) | 1,00x (mín. 0,52 s) | 0,95x (mín. 0,52 s) |

El daño se redondea al entero más cercano y los valores inválidos/no positivos no generan daño. Los perfiles pueden cambiarse durante la pausa, con aplicación inmediata al siguiente evento de daño o regeneración.

## Pruebas efectivamente ejecutadas

| Prueba | Resultado | Alcance |
|---|---|---|
| Batería heredada v3.2 | **35/35** | Menús, combate, 35 zonas, misiones, guardados y progresión del séptimo reino |
| Batería total v3.3 | **37/37** | + `test-v33-balance.mjs` y `test-v33-menu.mjs` |
| Sintaxis JS de archivos modificados | Correcta | `node --check` |
| Chromium autocontenido | Correcta | Selector de tres dificultades, 23/30/38 puntos de daño para 30 de base, backup/restauración JSON, tres presets de gráficos, 35/35 cámaras desde estados de QA, nueve capturas |
| HTTP local | HTTP 200 | `tools/qa-v31-http.py`: `/`, `/game.js`, copia JSON e imagen de jefe |
| PNG/WebP y menús gráficos | Sin errores JS observados | Capturas disponibles en `docs/CAPTURA-REAL-v3.3-*` |
| ZIP y SHA-256 | Véase fichero `.sha256` externo | Prueba de integridad y digest durante empaquetado |

## Límites de evidencia

- **No** se ha jugado la campaña completa desde una partida nueva hasta los créditos mediante controles físicos. Las 35 escenas de Chromium proceden de estados preparados de QA, no de un recorrido humano.
- **No** se ha medido dificultad real, número de muertes o tiempo de derrota de cada jefe con usuarios. Los porcentajes son reglas codificadas, no una valoración del equilibrio percibido.
- **No** se ha probado un mando físico ni el BAT de Windows 11; tampoco se ha ejecutado el lanzador sobre un Linux Mint físico.
- **No** se han medido latencias de entrada, FPS sostenidos o consumo de memoria en equipos destino.
- No hay cambios en la estructura de las partidas; el nivel de dificultad es un ajuste de navegador/puerto. Para migrarlo, selecciónalo de nuevo tras importar tus guardados.

## Reproducción

```bash
cd ashen-pilgrimage
for f in test-*.mjs; do node "$f" || exit 1; done
python3 tools/qa-v31-http.py
python3 tools/qa-v33-browser.py  # requiere Playwright + Chromium + Pillow
```

Para pruebas manuales, consulta `docs/COMBATE-Y-DIFICULTAD-v3.3.md`. Conserva el servidor en `http://127.0.0.1:8765/` para mantener el mismo origen de almacenamiento. Exporta una copia JSON antes de cambiar de navegador o de equipo.
