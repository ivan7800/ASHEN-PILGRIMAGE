# QA v1.9 — El sendero de las voces

## Alcance
Se incorporan dos sectores iniciales del Bosque de las Voces tras el Rey de Valdren, cuatro Custodios de Raíz, la guardiana Aina y una misión basada en Desvelo. No es la región completa.

## Recorrido manual a verificar en navegador real
1. Iniciar/cargar, derrotar al Rey, aproximarse al límite oriental de la Plaza y pulsar E.
2. Entrar en Sendero de Raíces; comprobar cámara, fondo y controles. Hablar con Aina cerca de x=9120.
3. Cruzar a la Arboleda del Eco (puerta en x=9840). Vencer a los custodios de x=10260 y 10720, activar Desvelo (Q) y recoger la memoria cerca de x=10025 con E.
4. Regresar al Sendero y hablar con Aina para completar la misión. Guardar manualmente, volver al título y cargar.
5. Comprobar inventario (I), mapa (M), Gamepad API, volumen, enemigos y portales en ambos sentidos.

## Pruebas de integración
`node test-v19-integration.mjs` reproduce el umbral desde Valdren, el diálogo con Aina, la recogida en Desvelo y la entrega, usando el bucle de actualización del juego con Canvas simulado.

## Comprobaciones automatizadas
- Ejecutar `node test-v19-forest.mjs` y las pruebas heredadas. Pruebas antiguas que asumen 8 salas o 17 enemigos necesitan revisar sus expectativas; no afirmar que pasan sin ejecutarlas.
- `node --check` sobre los módulos, `bash -n JUGAR-LINUX.sh` y `python3 -m py_compile serve.py`.

## Limitaciones
No equivale a una partida completa con navegador y mando físico. Los nuevos fondos son ilustración procedural, no pixel art artesanal, y la nueva guardiana deriva de un atlas original existente. La campaña completa sigue pendiente.

## Ejecuciones en este entorno
- 19 suites `test-*.mjs`: superadas (incluye integración bosque).
- Sintaxis: `node --check` de todos los JS, `bash -n`, compilación sintáctica Python: correctas.
- Servidor HTTP: 200 para HTML, módulos y los 4 nuevos recursos.
- Chromium/Playwright: `ERR_BLOCKED_BY_ADMINISTRATOR` al navegar a loopback; no hay captura ni partida gráfica comprobada.
