# QA v0.8 — El Lamento de las Cenizas

## Evidencias verificadas
- `node --check game.js visual.js combat.js chambers.js` — sintaxis válida.
- `node test-v08.mjs` — ataques, combos, consumo de resistencia, esquiva y tipos enemigos.
- `node test-v07.mjs` — puertas, cámaras y partida v0.7.
- `node test-v06.mjs` — carga heredada, Desvelo, jefe e inscripciones.
- `node test-runtime.mjs` — 22 fotogramas simulados, ataque y pausa.
- `bash -n JUGAR-LINUX.sh` — válido.
- `python3 -m py_compile serve.py` — válido.
- Comprobación de PNG y WebP con Pillow y prueba de integridad ZIP.

## No verificado
- Navegación automática con Chromium: `net::ERR_BLOCKED_BY_ADMINISTRATOR` al abrir loopback. No es un error atribuido al juego sin evidencia.
- Partida completa, victoria, muerte y todos los caminos: pendientes de navegador real.
- Lanzador BAT y Gamepad API con hardware físico Windows/Linux: pendientes.

## Riesgos abiertos
- Atlas existentes tienen 10/6/6 fotogramas; movimientos y criaturas requieren nuevas hojas de animación para aspirar al estilo cinematográfico final.
- La geometría sigue siendo un mundo compartido con puertas, no mapas diseñados independientemente.
- La IA enemiga es deliberadamente simple; hace falta prueba visual y ajuste de dificultad.
