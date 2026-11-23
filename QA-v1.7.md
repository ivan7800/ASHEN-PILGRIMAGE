# QA — ASHEN PILGRIMAGE v1.7 RC, La Sentencia Visible

## Evidencia local

- Inspección directa de `game.js`, `combat.js`, `effects.js`, `visual.js` y el atlas `assets/king-v16.png` de la v1.6.
- `node --check` en todos los módulos JS: correcto.
- 16 suites `test-*.mjs`, incluida `test-v17-clarity.mjs`: superadas.
- `bash -n JUGAR-LINUX.sh`: correcto; `python -m py_compile serve.py`: correcto.
- Peticiones HTTP 200 a HTML, JS y atlas del jefe en servidor local.
- Intento real Chromium/Playwright: **no superado** por `net::ERR_BLOCKED_BY_ADMINISTRATOR` al navegar a `127.0.0.1`. No se certifica captura visual ni recorrido completo en navegador.
- Windows 11, Linux Mint y mando real: **no ejecutados** en sus respectivos equipos.

## Cambios

- `boss-clarity.js`: reglas explícitas para anticipación, rango, fases y dirección del Rey.
- `game.js`: ventana de aviso de al menos 0,54 s en fase II y 0,74 s en fase I; bandas de peligro actualizadas mientras prepara ataque; HUD del jefe sobre fondo oscuro.
- `effects.js`: nueva señal de ataque direccional con límite de alcance, flechas y progreso.
- `visual.js`: arena con menos obstáculos en primer plano, menor viñeteado y resalte adicional de la silueta del Rey.
- `test-v17-clarity.mjs`: regresiones de límites temporales, direcciones, banda y limpieza del aviso.

## Límites conocidos

- Las señales de combate se verifican en cálculo y renderizado simulado; falta probar si se entienden durante una partida real.
- No hay telemetría de dificultad ni evaluación con jugadores; no se afirma que el combate esté equilibrado.
- No se han creado nuevos sprites en esta revisión; se preservan los atlas v1.6.
- La campaña completa de siete regiones sigue sin estar implementada.
