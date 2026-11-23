# QA v2.4 — Salmuera, el puerto que recuerda

## Alcance verificado (22 de noviembre de 2026)

- 26 archivos `test-*.mjs` ejecutados con Node.js 22.16.0: todos finalizan con código 0.
- Nueva prueba `test-v24-salmuera.mjs`: admisión de zona tras derrota del Archivero; bloqueo antes de esa derrota; encuentro con Marín; recuperación de la campana sumergida mediante Desvelo tras derrotar a los dos enemigos del Muelle Hundido.
- Guardados: validación de 36 enemigos actuales, aceptación de 32 enemigos de v2.3, rechazo de coordenadas y progreso inválidos, persistencia de la fase de misión.
- Sintaxis de JavaScript con `node --check` para los módulos, `bash -n JUGAR-LINUX.sh`, `python -m py_compile serve.py`.
- Carga HTTP 200 de `index.html`, `game.js`, `chambers.js`, `salmuera-region.js`, dos fondos WebP y dos atlas PNG.

## No certificado

- Chromium/Playwright: `Page.goto` ha fallado con `ERR_BLOCKED_BY_ADMINISTRATOR` al navegar al servidor local. No se ha comprobado una partida completa visualmente ni el equilibrio real de los enemigos.
- Windows 11, Linux Mint y mando físico: no disponibles para esta ejecución. La sintaxis de Bash/Python no demuestra que el doble clic funcione en esos sistemas.
- No es una región completa: son dos sectores de introducción, sin la Novia del Abismo, navegación marítima ni mecánicas de inmersión.

## Prueba manual recomendada

1. Ejecutar `JUGAR-WINDOWS.bat` o `./JUGAR-LINUX.sh` tras conceder permiso de ejecución. Activar el audio en Opciones.
2. Cargar una partida con Ossara completada. Si no existe, jugar la ruta normal desde el prólogo hasta derrotar al Archivero Ciego.
3. En la Cámara del Archivero, aproximarse a la puerta oriental y pulsar E. Antes de vencerlo, comprobar que permanece cerrada; después, que lleva al Puerto de las Campanas.
4. Hablar con Marín en el puerto. Usar E en la puerta oriental y entrar en el Muelle Hundido.
5. Derrotar a los guardianes junto a la campana sumergida, activar Desvelo con Q y usar E junto a ella. Debe registrarse la recuperación del recuerdo.
6. Volver al puerto, hablar con Marín y comprobar que el Sello de Salmuera aparece en el inventario (I).
7. Guardar en una ranura manual, cerrar el navegador, reiniciar y cargar la ranura. Comprobar misión, enemigos, mapa y posición.
8. Verificar accesibilidad de la lectura del combate y tasa de fotogramas en la resolución habitual, repitiendo con mando si está disponible.

## Comandos de reproducción

```bash
for f in test-*.mjs; do node "$f" || exit 1; done
node test-v24-salmuera.mjs
bash -n JUGAR-LINUX.sh
python3 -m py_compile serve.py
python3 serve.py
```

## Limitaciones artísticas

Los fondos de Salmuera se han generado por composición y gradación cromática a partir de un fondo gótico original ya incluido en el juego. Se han superpuesto muelles, navíos, inundación y niebla. No constituyen una ilustración completamente nueva dibujada escena por escena. Los dos atlas son recoloraciones de personajes existentes para distinguir facciones, no dibujos originales de cada pose.
