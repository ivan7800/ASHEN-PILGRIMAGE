# QA — ASHEN PILGRIMAGE v1.5

## Estado / alcance

- Basado en el código de v1.4, conservando lanzadores, menús, controles, arte y guardados.
- Capítulo I: cinco cámaras con enfrentamiento de jefe y umbral final; la antigua
  pantalla final inmovilizaba el personaje, ahora permite seguir a Valdren.
- Nueva zona exterior **Valdren · Murallas del Exilio**, un sector transitable,
  no la región ni la campaña completas.
- NPC Vigía Erena, tres guardias del Exilio, hoguera, reliquia de Desvelo y misión
  de cuatro estados (no iniciada / buscando / recuperada / entregada).
- Cinco atlas secundarios ampliados a 20 cuadros; dos nuevas variantes de elenco.
  Los movimientos derivan de transformaciones y retoques programáticos.

## Pruebas ejecutadas

- `node test-*.mjs`: 14 archivos, cada uno ejecutado con éxito incluyendo
  nuevo `test-v15.mjs` y `test-v15-flow.mjs` (el comando literal shell necesita bucle).
- `test-v15.mjs`: validación de seis cámaras, puertas de ida/vuelta, guardados
  antiguos de 9 enemigos y nuevos de 12, coordenadas y fase de misión,
  siete atlas nuevos 2560×160 y fondo de Valdren.
- `test-v15-flow.mjs`: escenarios aislados de la función real `update()`;
  cruza el umbral, habla con Erena, activa Desvelo y recoge reliquia, entrega misión.
- `python serve.py --no-browser`: servidor HTTP devolvió 200 para `index.html`,
  módulos del motor, sprites de Erena y Exilio y fondo exterior.
- `python browser-v15.py`: **no superado**. Chromium devuelve
  `net::ERR_BLOCKED_BY_ADMINISTRATOR` al navegar al servidor local.
  El resultado no es evidencia de fallo de arranque del juego, pero deja el
  recorrido visual y la partida completa *sin verificar*.

## Pruebas aún necesarias

1. Lanzar en Windows 11 mediante BAT y en Linux Mint mediante SH.
2. Inicio nueva partida, llegar a jefe, derrotarlo, cruzar umbral, iniciar y cerrar
   la misión en el navegador real.
3. Cargar versiones v1.2/v1.4 y guardar/cargar con tres ranuras manuales.
4. Probar Gamepad API con mando físico (pausa y menús incluidos).
5. Revisar clipping, escalado de personajes, solapamientos y parallax a 720p/1440p.

## Limitaciones conocidas

- Los seis sectores comparten un único mapa world-space, no escenas independientes.
- El diseño de personajes es procedural y aún lejos del acabado de un juego comercial.
- El guardado sigue en `localStorage`; conviene añadir exportación/importación JSON.
- La misión es una pequeña ampliación jugable, no el Reino Carmesí terminado.
- No se realizó publicación en GitHub ni prueba de hardware físico.
