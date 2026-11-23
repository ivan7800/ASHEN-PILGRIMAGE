# ASHEN PILGRIMAGE v2.8 — Mareas Profundas y los Primeros Ecos del Silencio

## Alcance real

Partiendo de la v2.7 y conservando los archivos originales, esta entrega mejora dos atlas marítimos y abre **dos sectores iniciales de las Cumbres del Silencio**. No representa la sexta región completa ni la campaña terminada.

### Código y contenido integrado

- **Guardián de Sal:** `assets/saltguard-v28.png`, atlas 2560 × 160 con 20 cuadros de 128 × 160, basado en una **nueva ilustración original creada para esta versión** (`art-source/sea-v28/`). Conserva sus colisiones y reglas de ataque de v2.7.
- **Sirena:** `assets/sirene-v28.png`, atlas con 20 cuadros. Adaptación de una **hoja de espectro original del propio proyecto**, redibujada/recoloreada a tonos abisales con detalles marinos. Es un recurso distinto del anterior pero aún requiere animación manual avanzada; no afirmar que sus 20 poses estén dibujadas desde cero.
- **Revisión de Salmuera:** halo frío de silueta, menor opacidad de las arcadas puramente decorativas y el mismo plan de paralaje (`sea-visual-v27.js`); mantiene colisiones e indicadores de peligro.
- **Cumbres del Silencio:** Paso de los Ecos y Monasterio del Hielo Inmóvil, posiciones `33250–34700` y `34700–36200`, con fondos y capas nevadas originales derivados de arte producido para ASHEN PILGRIMAGE. La fuente y las herramientas reproducibles están incluidas.
- **Historia:** Elda, la Campanera del Silencio, encarga recuperar un eco congelado del Monasterio usando Desvelo tras vencer a los dos custodios. El objeto `Eco de la Campana Congelada` aparece en el inventario y se conserva en el guardado.
- **Cuatro enemigos nuevos:** centinelas de hielo y espectros glaciales con patrones cuerpo a cuerpo / distancia. Se utilizan variantes heladas de recursos propios; no son cuatro diseños enteramente independientes.
- **Compatibilidad:** `localStorage` con autosave y tres ranuras; guardados v2.7 de 53 enemigos y los de v2.8 de 57, sin borrar los anteriores. Dos nuevos puntos de descanso. Puerta de entrada bloqueada hasta derrotar al Jardinero. Sin modificación de las condiciones de los reinos anteriores.
- **Mando/lanzadores:** conserva `JUGAR-WINDOWS.bat` y `JUGAR-LINUX.sh`; el servidor usa por defecto `http://127.0.0.1:8765/`.

## Pruebas efectuadas

1. `for f in test-*.mjs; do node "$f" || exit 1; done` → **30/30 suites correctas**. Las 29 heredadas se mantienen y `test-v28-summit.mjs` añade **8 escenarios de integración** (puerta bloqueada/desbloqueada, encuentro con Elda, acceso al Monasterio, eco bloqueado, eco recuperado y epílogo).
2. `python test-art-v28.py` → atlas con 20 celdas de 128×160, alfa no vacía y variación comprobada; `saltguard`, `sirene`, `icewarden`, `icewraith` tienen 20 cuadros distintos; Elda tiene 19 cuadros distintos en 20 celdas (uno se repite).
3. `node --check` sobre los módulos JS, `bash -n JUGAR-LINUX.sh` y `python -m py_compile serve.py` → sintaxis correcta.
4. `python tools/qa-v28-browser.py` → **cuatro capturas reales** del renderizador en Chromium autocontenido: Salmuera y dos posiciones de cámara en Cumbres, más Monasterio. No se observaron errores de JavaScript; el cambio de paralaje produjo una diferencia media de **8,02** unidades RGB en la zona comparada.
5. Simulación de **480 fotogramas (~8 segundos)** de combate en Chromium autocontenido: no hubo excepciones; la salud del personaje pasó de 100 a 28. Esto prueba el bucle de juego y la aplicación de daño, **no** certifica dificultad o fluidez con un jugador real.
6. **Servidor HTTP:** `serve.py --no-browser --port 18765` arrancó y mostró la dirección, pero las peticiones a `127.0.0.1` fueron rechazadas (`ConnectionRefusedError`) por este entorno; **prueba HTTP no superada**. Es imprescindible probar el lanzamiento en Windows y Linux.
7. Integridad del ZIP: comprobar mediante `ZipFile.testzip()` después del empaquetado.

## Límites y pendientes

- La navegación real mediante HTTP, prueba física de mando, rendimiento en hardware real y una partida completa en Windows/Linux Mint **no se han verificado**.
- La sexta región está **comenzada**, no completada; faltan los sectores superiores, el Gigante que Escucha, una misión larga y la siguiente Brasa.
- El resto del juego mantiene recursos procedurales y requiere armonizar dirección artística, animaciones y composición de algunas cámaras.
- La prueba autocontenida instrumenta posiciones de cámara y no prueba el desplazamiento manual continuo. La simulación de combate no demuestra equilibrio.

## Validación manual recomendada

Descomprimir, ejecutar `JUGAR-WINDOWS.bat` o `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`, comprobar menú y guardados en el origen fijo. Completar el Jardinero de Carne; al este se accede al Paso de los Ecos. Hablar con Elda, atravesar el umbral oriental, derrotar los custodios del Monasterio, activar Desvelo y pulsar E junto al eco congelado; regresar con Elda. Guardar, cerrar, cargar, revisar inventario y repetir con mando estándar. En Salmuera verificar Guardián/Sirena y sus telegráficos de ataque en una sesión prolongada.
