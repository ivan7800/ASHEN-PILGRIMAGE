# QA v0.7 — Los Umbrales (22-11-2026)

## Cambios verificables
- `chambers.js`: cinco tramos de geometría continua separados por barreras de paso; cada barrera necesita E para atravesarse. Son **cámaras conectadas dentro de un mismo mundo**, no cinco escenas autónomas cargadas en memoria.
- Arquitectura por cámara: cripta, claustro, osario, campanario, arena; fondos y sprites previos conservados.
- Cámara limitada a las coordenadas de la cámara activa; efecto luminoso breve al atravesar el umbral; indicadores de interacción.
- Fuentes luminosas dinámicas con gradientes Canvas cerca de hogueras y protagonista; aura visual morada en enemigo doliente.
- Enemigos sólo actualizan su IA cuando están en la misma cámara que el jugador; estados persistentes anteriores conservados.
- La clave `ashen-pilgrimage-prototype-v01` no ha cambiado; no se han modificado archivos originales del ZIP de entrada.

## Pruebas ejecutadas
- `node --check game.js`, `node --check visual.js`, `node --check chambers.js`: OK.
- `node test-runtime.mjs`: OK, inicialización/22 frames, ataque, pausa.
- `node test-v06.mjs`: OK, guardado anterior, lectura de inscripción, boss con 180 PV, Desvelo, pausa.
- `node test-v07.mjs`: OK, límites de cinco cámaras, destinos de las puertas, transición real con E desde guardado antiguo y persistencia.
- `bash -n JUGAR-LINUX.sh`: OK. `python3 -m py_compile serve.py`: OK.
- Validación posterior del ZIP: `unzip -t`.

## Limitaciones y no verificado
- Chromium headless no completó la captura (expiró tras 13 s). El intento de conexión HTTP de bucle local falló en este entorno; no se certifica la carga en navegador real.
- No se ha probado doble clic en Windows 11 ni Linux Mint físico, ni mando real, ni juego íntegro.
- No se han creado nuevos fotogramas artísticos; se mantienen los atlas 10/6/6 y sus animaciones existentes.
- El combate y los escenarios aún son un prototipo; falta progresión compleja, enemigos especializados, puzles reales, arte final y balance.
- No se ha publicado en GitHub.
