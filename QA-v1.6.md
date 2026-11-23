# ASHEN PILGRIMAGE v1.6 — QA

## Base y alcance

Partiendo de v1.5 (sin sustituir los recursos existentes): ampliación jugable de Valdren, no siete regiones ni una campaña final.

## Cambios implementados

- Dos nuevas cámaras físicas: Barrio de los Tizones (6350–7450) y Plaza de las Exequias (7450–8800); ocho en total.
- Rey de las Nueve Exequias: enemigo regional con 320 HP, segunda fase, animación basada en atlas de 20 cuadros, barra de vida y derrota persistente.
- Dos enemigos de Valdren con arte diferenciado (`cinder-v16.png`, `bellkeeper-v16.png`) y parámetros de IA distintos.
- Dos NPC: Iren y Veska, con diálogos y elección persistente entre protección de exiliados y obediencia al Consejo.
- Las consecuencias disponibles son sello de facción y una ampolla extra para los exiliados, salvoconducto para el Consejo, respuestas distintas y registro en el guardado. No es aún un árbol de misiones largo.
- Inventario de reliquias de misión en pausa y tecla I; mapa de cámaras visitadas, representado gráficamente en menú con tecla M.
- Fondos propios de sector (`room-market.webp`, `room-throne.webp`) basados en transformación/ilustración procedural del entorno anterior; se conservan sprites existentes.
- Menor opacidad del primer plano y contorno visual de enemigos para mejorar lectura del combate.
- Guardados v2 admiten 9, 12 o 17 enemigos y los puntos de control antiguos o nuevos; partidas originales no se reemplazan en disco.

## Verificaciones ejecutadas

- `node --check` para cada módulo `.js`: correcto.
- `node test-*.mjs`: **15/15 archivos de prueba finalizan con código 0**, incluido `test-v16-region.mjs` con decisiones, puertas, inventario y muerte del rey dentro del bucle real del juego con DOM simulado.
- Transparencia y tamaño de cinco atlas: PNG RGBA 2560×160, correcto.
- Fondos de los dos nuevos sectores: WebP 1600×900, correcto.
- `bash -n JUGAR-LINUX.sh`: correcto.
- `python3 -m py_compile serve.py`: correcto.
- Servidor `serve.py --no-browser`: respuestas HTTP 200 para `index.html`, `game.js`, el módulo de región y tres recursos gráficos.
- `browser-v15.py`: **no completado**. Chromium devolvió `ERR_BLOCKED_BY_ADMINISTRATOR` navegando a 127.0.0.1. No se atribuye a un fallo del juego.

## Pendiente de verificación real

- Recorrido en navegador gráfico sin restricciones, rendimiento y contraste en pantallas distintas.
- Prueba física de `.bat` en Windows 11, `.sh` en Linux Mint y mando estándar.
- Campaña desde partida nueva, ajuste de dificultad del Rey, acciones de diálogos con gamepad y recuperación del guardado en sesión larga.
- Calidad artística: los nuevos sprites derivados siguen siendo procedurales/editados en código, no animación artesanal cuadro a cuadro.

## Ejecutar

Desde la carpeta `ashen-pilgrimage`: `python3 serve.py --no-browser` o usar el lanzador del sistema operativo. Abrir la URL local anunciada. El menú incluye Nueva partida, Continuar, Guardar/Cargar y Opciones. Acceder a la nueva región tras la derrota del Guardián y la misión del badajo de Erena.
