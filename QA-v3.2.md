# QA v3.2 — Arte y Legibilidad

**Base comprobada:** ASHEN PILGRIMAGE v3.1 (copia de trabajo). **Fecha:** 2026-11-23. No se ha cambiado el ZIP original, el esquema de guardado ni la lógica de daños, colisiones, jefes o progresión. No se ha ejecutado REA; el análisis fue del código fuente disponible.

## Cambios implementados

- En `chambers.js`, opacidad de la decoración geométrica reducida para dejar visibles los fondos ilustrados; se conservan los portales y sus reglas físicas.
- En `visual.js`, retiradas las columnas y grandes arcos opacos del primer plano cuando existe fondo ilustrado. Se conserva una ruta de dibujo de emergencia si falta la imagen. Las texturas de suelo/plataforma son locales y originales, con coordenadas de colisión sin alterar.
- Nuevo atlas `assets/mourner-premium-v32.png`, creado desde la hoja previamente generada en el proyecto; 20 fotogramas en tira horizontal con transparencia. La limpieza y conversión son programáticas, **no** una animación artesanal definitiva. La hoja original se conserva en `art-source/premium-v32/mourner-source.png`.
- Nuevo fondo ilustrado `assets/room-final-trono-premium-v32.webp`, desarrollado para esta fase, con su fuente original conservada y la versión anterior `room-final-trono-v30.webp` sin eliminar.
- Nuevo HUD compacto y legible, con estilo gótico discreto y barras de vida/resistencia, implementado en `hud-v32.js`.
- Menú **Opciones → Gráficos**: Cinematográfico / Legibilidad alta / Rendimiento. Su ajuste se guarda en `localStorage` con la clave `ashen-pilgrimage-graphics-v32`, **fuera de las partidas**. `visual-style-v32.js` controla transparencia, polvo, iluminación, nieve y niebla.
- Optimización del renderizado de suelo: antes se recorría el mundo de 46.600 px en franjas de 53 px para pintar líneas decorativas; ahora solo se calculan las teselas visibles. También se descartan plataformas fuera del encuadre al dibujar. Esto **reduce trabajo teórico por fotograma**, pero no es una medición de FPS en hardware.
- Texto de ayuda inferior abreviado. Las instrucciones ampliadas siguen en el menú Controles.

## Pruebas realmente ejecutadas

| Verificación | Resultado | Evidencia |
|---|---|---|
| Batería de referencia v3.1 | 34/34 suites | `for f in test-*.mjs; do node "$f"; done` antes de cambiar código |
| Regresión v3.2 | **35/35 suites** | 34 previas + `test-v32-art.mjs` |
| Sintaxis JS | Superada | `node --check` de todos los módulos |
| Gráficos y atlas | Superada | PNG, tamaño de atlas y parámetros de los tres modos, `test-v32-art.mjs` |
| Opciones, guardados, foco, importación JSON | Superada en Chromium autocontenido | `tools/qa-v32-browser.py` |
| 35 cámaras | Renderizadas desde estados preparados | `tools/qa-v32-browser.py`: 35/35 y nueve capturas |
| Comparación de modos en una escena marítima | Confirmada | Tres capturas de una misma escena; diferencia media por canal entre Cinematográfico y Legibilidad alta: ~2,38/255 |
| Servidor local | HTTP 200 en recursos principales | `tools/qa-v31-http.py` |
| Empaquetado | Comprobación ZIP y SHA-256 | `zipfile.testzip()` y fichero `.sha256` |

**Aviso sobre las imágenes:** son capturas del motor ejecutado en Chromium autocontenido con estados de QA preparados, no una partida humana completa. La comparativa visual recoge pruebas reales de renderizado, no una certificación de FPS, legibilidad con jugadores o dificultad.

## Limitaciones y pendientes

- **No** se ha jugado una partida completa desde la cripta hasta los créditos usando solo controles normales.
- **No** se han medido FPS estables ni uso de memoria en un PC/portátil de destino; Rendimiento disminuye la carga del renderizador, pero aún necesita medición física.
- **No** se han probado el lanzador BAT en Windows 11, Linux Mint sobre hardware real, ni un mando físico. La sintaxis de Bash y el servidor Python se pueden comprobar aquí.
- Algunos personajes y fondos de regiones antiguas siguen siendo procedurales y requieren redibujo artesanal; la v3.2 es una **pasada de coherencia y legibilidad**, no un remaster completo.
- Para mantener las partidas antiguas, conserva siempre `http://127.0.0.1:8765/`; hay exportación e importación JSON desde el menú.

## Reproducir

```bash
cd ashen-pilgrimage
for f in test-*.mjs; do node "$f" || exit 1; done
python3 tools/qa-v31-http.py
python3 tools/qa-v32-browser.py  # necesita Playwright, Chromium y Pillow
python3 tools/build-v32-art.py    # Pillow; vuelve a generar suelo, plataformas y sala final
python3 tools/import-v32-mourner.py # Pillow; vuelve a importar la hoja de 20 cuadros
```

Para comprobar la versión en Windows y Linux, seguir `docs/PRUEBA-GRAFICA-v3.2.md`.
