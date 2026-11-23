# ASHEN PILGRIMAGE v2.1 — Registro de verificación

## Evidencias comprobadas

- **23/23 scripts `test-*.mjs`** terminan correctamente con Node.js 22.16.0, incluidas pruebas heredadas, guardados v2.0 y tres escenarios de integración de Ossara (entrar, recoger inscripción, entregarla).
- Sintaxis de los módulos JavaScript, `serve.py` y lanzador Bash válida.
- Servidor Python iniciado en puerto dinámico sobre `127.0.0.1`; respuestas HTTP 200 para inicio, módulos nuevos, WebP y PNG nuevos.
- Siete recursos atlas PNG v2.1 verificados, incluyendo cinco conversiones de recursos originales 4×5 con 20 celdas de 128×160. Fondo WebP de Ossara generado a partir de un recurso original.
- Conversor incluido y fuentes visuales preservadas para reproducción y modificación.
- ZIP: comprobar CRC/integridad después de construir.

## Límites de cobertura

- Navegación automática de Chromium: **bloqueada** con `ERR_BLOCKED_BY_ADMINISTRATOR`, incluso cuando se intentó interceptar un origen de pruebas. No hay captura de juego verificada ni recorrido completo en navegador.
- No se ha probado Windows 11, Linux Mint ni mando físico; no se puede garantizar estabilidad real, latencia del audio, dificultad ni visibilidad con hardware real.
- La composición de `docs/VISTA-PREVIA-v2.1.png` combina recursos y no es screenshot del motor.
- No se han realizado mediciones de rendimiento ni equilibrio estadístico.

## Ruta manual recomendada

1. Iniciar una partida o cargar un guardado de v2.0; comprobar que los tres slots y el autoguardado siguen intactos.
2. Abrir Bosque, hablar con Aina y completar la memoria; activar Desvelo y escuchar Duelo → Nombre → Promesa.
3. Vencer a la Madre; comprobar anticipación visual en ambas fases y sonido *solo si* audio está activado.
4. Salir por el umbral oriental del Santuario; antes de vencer a la Madre, confirmar que la puerta no permite entrar en Ossara.
5. En Ossara, hablar con Velador, derrotar ambos centinelas, activar Desvelo en x≈14630, recoger la inscripción y entregarla al Velador.
6. Guardar manualmente, salir al título, cargar y comprobar misión, posición, enemigos y objetos persistidos.
7. Abrir el mapa en pantalla pequeña y comprobar que las 13 zonas se ven en dos filas sin desbordamiento.
8. Activar/desactivar sonido, comprobar pausas, pérdida de foco y que no comienza audio sin interacción expresa.
9. Repetir con mando conectado. Documentar nombre y modelo, FPS, latencia y errores visibles.

## Fuera de alcance

Ossara solo tiene un atrio, no la región completa ni el Archivero Ciego. Arte y animación secundarios siguen siendo derivados de materiales del juego, no sprites definitivos pintados a mano.
