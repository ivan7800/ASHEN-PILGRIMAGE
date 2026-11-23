# QA v2.5 — El Mar sin Orillas

Fecha: 22 de noviembre de 2026. Alcance: expansión de Salmuera sobre v2.4, sin modificar el archivo original.

## Hechos de implementación

- 22 sectores en un mundo continuo: las 18 zonas anteriores y cuatro nuevas (`Galerías Sumergidas`, `Sala de las Compuertas`, `Capilla de los Ahogados`, `Trono de la Novia`).
- Ocho enemigos/jefes adicionales (44 entidades en total): Ahogados y Sirenas originales, y **La Novia del Abismo** como nuevo jefe de 560 PV, dos fases y aviso direccional.
- Tres ruedas de marea y tres epitafios con reglas dependientes de Desvelo y la pleamar/bajamar. Orden: **Sal → Eco → Nombre**, con mareas **baja → alta → baja**.
- Exploración submarina 2D: menor velocidad horizontal, gravedad reducida, impulso ascendente al saltar, barra de oxígeno en pleamar y daño por asfixia. *No es un motor acuático con simulación física de fluidos.*
- Desenlace de Marín y recompensa persistente `Brasa del Mar sin Orillas` tras vencer a la Novia; diálogos relacionados con el sacrificio de su hermana.
- Guardados ampliados con `tideMode`, `seaEchoes`, `seaClear` y 44 enemigos. Se aceptan partidas anteriores de 36, 32, etc. La clave y ranuras previas permanecen.
- Nuevos fondos WebP de la región y atlas PNG de 20 cuadros para Ahogado, Sirena y Novia. Novia: imagen original generada y recortada/normalizada en `tools/build-sea-art-v25.py`; los otros dos: pixel art programático original, sin extraer sprites de videojuegos ajenos.
- Audio sintetizado opcional para mareas, ecos, avisos, fase 2 y derrota.
- **Corrección de guardados:** `serve.py` ahora usa por defecto `127.0.0.1:8765` en vez de puerto aleatorio. Usar la misma URL para conservar el origen de `localStorage`.

## Pruebas ejecutadas

1. Todas las suites `test-*.mjs` con Node.js 22: **27/27 salidas con código 0**.
2. `test-v25-sea.mjs`: **15 escenarios aislados de integración del bucle del juego** (accesos permitidos/bloqueados, compuertas, cada epitafio, jefe, continuidad de guardado), además de verificaciones de dominio, compatibilidad y recursos.
3. Sintaxis `node --check` de módulos JavaScript, `bash -n JUGAR-LINUX.sh`, `python3 -m py_compile serve.py`.
4. Server HTTP con ruta de `index.html`, scripts y sprites nuevos: respuestas HTTP 200 en la comprobación local. **No se ensayó el `.bat` en Windows**.
5. Chromium real ejecutó una **copia autocontenida en memoria** del HTML/JS, utilizando los recursos locales embebidos; sin excepciones JavaScript, y creó capturas reales en `docs/CAPTURA-REAL-v2.5.png` y `docs/CAPTURA-SUMERGIDA-v2.5.png`.
6. Una primera captura reveló que la decoración submarina tapaba los sprites. Se trasladó detrás de los personajes y se volvió a generar la captura sin errores.
7. PNG/WebP decodificables, 20 cuadros por atlas y ZIP verificado con test de integridad.

## Límites de verificación

- La navegación **normal** de Chromium al servidor `http://127.0.0.1` en este entorno sigue bloqueada por `ERR_BLOCKED_BY_ADMINISTRATOR`. La captura autocontenida verifica el renderizado de las escenas elegidas, **no** la experiencia de distribución normal completa ni todo el recorrido visual.
- No se ha jugado físicamente de principio a fin con teclado o mando; el equilibrio de 560 PV, daño, esquivas y tiempos de aire requiere observación humana y ajuste posterior.
- Las pruebas no abarcan la ejecución del lanzador BAT en Windows 11 ni del `.sh` en Linux Mint con un mando físico.
- Los fondos nuevos son originales y diferenciados, pero aún contienen geometría rasterizada por código. Los Ahogados/Sirenas también son sprites programáticos; no equivalen al nivel de detalle de las ilustraciones conceptuales.
- Los guardados antiguos almacenados en **otros puertos aleatorios** no se trasladan automáticamente a `:8765`, porque el navegador aísla `localStorage` por origen. Mantener el puerto previo para acceder al guardado antiguo, si se conoce; no borrar datos del navegador. Nuevas partidas con `serve.py` usarán el puerto fijo.

## Ruta manual de aceptación de Salmuera

1. Abrir `JUGAR-WINDOWS.bat` o `JUGAR-LINUX.sh`. Comprobar `http://127.0.0.1:8765/` y que la pantalla de título, `Continuar`, `Guardar` y `Cargar` funcionan.
2. Jugar la historia normal hasta derrotar al Archivero; cruzar a Salmuera, terminar la misión de Marín y conseguir el Sello.
3. Desde Muelle Hundido, entrar en Galerías Sumergidas. Comprobar barra de aire, natación lateral y ascenso con salto mientras hay pleamar.
4. Activar la primera compuerta (bajamar), usar `Q` Desvelo y escuchar **Sal** con `E`. La puerta oriental debe abrirse.
5. Hablar con el Vigía Sin Pulso; girar segunda compuerta (pleamar), escuchar **Eco** y cruzar a la Capilla.
6. Activar tercera compuerta (bajamar), escuchar **Nombre** y entrar al Trono de la Novia. Comprobar que las puertas no se abren saltándose los requisitos.
7. Luchar contra la Novia: comprobar barra de vida, segunda fase al llegar aproximadamente a 280 PV, aviso direccional y registro de la derrota.
8. Volver a Marín, leer el epílogo; revisar Inventario (`I`) y Mapa (`M`). Guardar y cerrar, relanzar desde el mismo puerto y cargar.
9. Repetir con mando estándar; revisar menú, juego, sensibilidad, rendimiento, FX y sonido activado/desactivado. Registrar cualquier defecto reproducible.

## Comandos

```bash
for f in test-*.mjs; do node "$f" || exit 1; done
node test-v25-sea.mjs
node --check game.js
bash -n JUGAR-LINUX.sh
python3 -m py_compile serve.py
python3 serve.py --no-browser
# Opcional: requiere Playwright y Chromium instalados
python3 tools/qa-offline-browser.py
python3 tools/qa-offline-browser.py --sea
```
