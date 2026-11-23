# QA v2.0 — Los Tres Nombres

## Evidencia local comprobada

- `node --check` sobre todos los módulos JavaScript.
- Pruebas automatizadas (21 archivos `test-*.mjs`) de regresión, menús, guardados, combates, Valdren, Aina y nuevo Bosque.
- Escenario simulado de integración: interacción con el tercer eco, entrada al santuario y derrota de la Madre.
- Nuevos atlas y fondos verificados como PNG RGBA/WebP válidos.
- El intento de comprobar HTTP local desde este entorno obtuvo `ConnectionRefusedError`; no se declara HTTP 200 en esta versión.
- No se han modificado las versiones previas ni publicado en GitHub.

## Ruta de QA manual

1. Desde el menú principal, crear una partida o cargar un guardado válido de v1.9.
2. Completar la Cripta y Valdren, vencer al Rey y abrir el umbral del Bosque.
3. Hablar con Aina, derrotar a los Custodios y recuperar la memoria con Desvelo.
4. Regresar a Aina y obtener la Memoria de Brezaluna.
5. Entrar al Refugio y activar la hoguera en `x=11320`.
6. Con Desvelo, escuchar las tres piedras en orden Duelo (derecha), Nombre (izquierda), Promesa (centro).
7. Comprobar que hacerlo fuera de orden reinicia el progreso, sin bloquear la partida.
8. Entrar al Santuario, luchar con la Madre, observar la segunda fase y su derrota.
9. Consultar el inventario y regresar a Aina para el epílogo.
10. Guardar en una ranura manual, cerrar y reabrir; confirmar la persistencia de la victoria.
11. Repetir con mando conectado: cruceta/joystick, A, X, B, Y, Start y Select; anotar incidencias de dificultad y legibilidad.

## Pendientes y limitaciones

- Chromium en el entorno automatizado rechazó la navegación local con `ERR_BLOCKED_BY_ADMINISTRATOR`; por tanto, no se ha completado una partida real en navegador.
- Los lanzadores Windows BAT y Linux SH conservan su código, pero no se han probado con doble clic ni mando físico.
- El equilibrio de dificultad y la dirección artística necesitan revisión visual humana en un navegador real.
- Las escenas son sectores del mismo mundo persistente, no niveles independientes.
