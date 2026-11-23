# QA — ASHEN PILGRIMAGE v1.1 RC / La Campana del Acero

## Procedencia
Base: ZIP v1.0 RC proporcionado en la conversación. Se ha editado una copia extraída; el archivo de origen no se modifica.

## Hallazgos y cambios
1. En v1.0 RC el daño de espada se producía al presionar J, sin esperar al fotograma activo. Ahora `combat.js` define ventanas de impacto por golpe y `game.js` consume cada ventana una única vez.
2. En v1.0 RC se comprobaba solo la posición final del proyectil en el fotograma, permitiendo saltar sobre el jugador con movimiento rápido. Ahora se comprueba todo el segmento horizontal recorrido y el rango vertical.
3. El reaparecer restablece también el estado de ataque, esquiva, movimiento e impacto pendiente; evita trasladar una animación a la nueva vida.
4. Canvas mantiene la relación 16:9 en distintas pantallas, en lugar de estirar la imagen al tamaño completo de la ventana.

## Verificado localmente
- `node --check` para todos los `.js`: pasa.
- `node test-runtime.mjs`, `node test-v06.mjs`, `node test-v07.mjs`, `node test-v08.mjs`, `node test-v09.mjs`, `node test-v10.mjs`: pasan.
- `node test-v11.mjs`: pasa (ventana de daño y barrido de proyectiles).
- `node test-v11-integration.mjs`: pasa (el daño real se produce durante la animación y solo una vez).
- `bash -n JUGAR-LINUX.sh`, `python3 -m py_compile serve.py`: pasan.

## Pendiente
- Recorrido completo de principio a fin en Chromium/Firefox/Safari, revisión visual en varios formatos.
- Ejecución real en Windows 11 y Linux Mint mediante doble clic; mando físico y audio real.
- Validar ergonomía de dificultad y duración del capítulo con jugadores.

## Ejecutar
- Linux: `./JUGAR-LINUX.sh` (o `bash JUGAR-LINUX.sh`).
- Windows: doble clic en `JUGAR-WINDOWS.bat`.
- Requiere Python 3. El servidor solo escucha en 127.0.0.1.
- Para pruebas automatizadas: `for f in test-*.mjs; do node "$f" || exit 1; done`.

Este paquete sigue siendo una release candidate del primer capítulo, no la campaña final ni una versión certificada e2e.
