# ASHEN PILGRIMAGE v3.6 RC — QA FINAL Y PREPARACIÓN DE LANZAMIENTO

**Fecha:** 23/11/2026. **Origen:** copia del ZIP v3.5; se preserva intacto. **Motor:** Canvas + JavaScript ES modules, servidor Python 3 en `127.0.0.1:8765`, BAT Windows y Bash Linux. **Decisión:** candidata de pruebas, NO versión final certificada.

## Hallazgos y cambios comprobables

1. `save-manager.js`: la migración de un guardado histórico **solo escribe si el autoguardado no existe**. Antes, un JSON corrupto devolvía `null` y podía ser sobrescrito en la migración. Ahora se conserva el dato dañado y se ofrece la recuperación manual de la copia.
2. `game.js`: «Nueva partida» solicita confirmación cuando el autoguardado está dañado, aunque no haya partidas válidas. Advierte de que **sobrescribirá** ese autoguardado si el jugador acepta. «Cancelar» conserva el contenido original. Las ranuras manuales siguen intactas.
3. `JUGAR-WINDOWS.bat`: verifica que el ejecutable `py -3` tiene realmente Python 3. Si no, prueba la opción `python`; evita fallar cuando existe un lanzador `py` inutilizable. **El BAT no ha podido ejecutarse en un Windows físico aquí.**
4. `VERIFICAR-WINDOWS.bat` y `VERIFICAR-LINUX.sh`: nuevos comprobadores locales de QA. Necesitan Node.js y Python 3 (el juego solo necesita Python 3). No publican ni modifican datos de usuarios.
5. `test-v36-*.mjs` y `tools/qa-v36-preflight.py`: regresión de migración no destructiva, confirmación de nueva partida, selección de Python, sintaxis, recursos y HTTP local.
6. `tools/qa-v36-browser.py`: prueba las confirmaciones de autoguardado corrupto, crear/guardar/continuar y dibuja **las 35 cámaras** en Chromium con módulos/recursos autocontenidos. Guarda 9 muestras de pantalla y el menú de aviso.

## Resultados obtenidos

| Verificación | Resultado | Qué demuestra |
|---|---|---|
| 43 suites Node (`test-*.mjs`) | **43/43 PASS** | Reglas y regresiones automatizadas, incluidos 3 tests nuevos |
| Preflight (`tools/qa-v36-preflight.py`) | **142/142 PASS** | Sintaxis JS/Bash/Python, referencias de recursos, HTTP local y puerto fijo |
| `./VERIFICAR-LINUX.sh` en este contenedor | **PASS** | Automatiza suites + preflight; no sustituye Linux Mint físico |
| `JUGAR-LINUX.sh --no-browser` en este contenedor | **PASS · HTTP 200** | Lanzador Linux ejecutado en el entorno, no en un equipo Linux Mint físico |
| Chromium autocontenido | **PASS parcial** | Menú corrupto, cancelación, confirmación, guardado, continuar, dibujo de 35 salas |
| Errores JS observados en esos escenarios | **0** | No demuestra ausencia global de bugs |
| Dibujado de 35 estados de cámara | **35/35** | Se renderiza cada sala; **no es recorrerlas jugando** |
| Microbenchmark de `draw()` por cámara | **~2–3 ms medio, ~4–5 ms p95** | Solo coste de esa llamada en este contenedor; NO FPS, ni hardware de usuario |
| Windows 11, Linux Mint y mando físico | **NO VERIFICADO** | Requiere ejecución con equipos reales |
| Partida humana de inicio a créditos con tres finales | **NO VERIFICADA** | Bloqueante para certificación de lanzamiento |
| Calidad artística, accesibilidad total, dificultad percibida | **NO CERTIFICADAS** | Requiere sesiones manuales y revisión especializada |

## Cómo reproducir

```bash
# Dentro de ashen-pilgrimage, desde Linux:
chmod +x VERIFICAR-LINUX.sh JUGAR-LINUX.sh
./VERIFICAR-LINUX.sh
python3 tools/qa-v36-browser.py   # opcional: requiere Playwright y Chromium instalados
./JUGAR-LINUX.sh
```

Windows: `JUGAR-WINDOWS.bat` para jugar, `VERIFICAR-WINDOWS.bat` para ejecutar suites y preflight. Python 3 obligatorio para jugar; Node.js 18+ y Python 3 para QA. Evita ejecutar ambos verificadores a la vez si tu equipo tiene poca memoria. El servidor usa `127.0.0.1` por defecto; no abre el juego a la red local ni envía partidas fuera del equipo.

## Limitaciones del entorno

- Chromium bloquea navegar directamente a la URL HTTP local con `ERR_BLOCKED_BY_ADMINISTRATOR`. En la prueba autocontenida se ejecuta código real empaquetado en una página de memoria. El servidor HTTP ha respondido **HTTP 200 a `urllib` en el contenedor**, pero **no se ha certificado la carga HTTP normal desde Chromium**.
- Las capturas se generan con posiciones de prueba. **No** se marcan como prueba de completar jefes, puzles, misiones o secretos sin ayuda.
- No se ha ejecutado el lanzador `.bat` ni se ha conectado un mando físico; la automatización no constituye un certificado para Windows/Linux Mint del usuario.
- Las animaciones, escenas, sonido y objetivos de duración no se han validado de manera continua y humana. No estimar 25–35 horas sin datos.

## Criterio de salida

**NO-GO para etiquetar «versión final comercial»** hasta completar `docs/CRITERIOS-LANZAMIENTO-v3.6.md`. Puede distribuirse como **RC de pruebas** con guardados exportables y estas limitaciones visibles. No se ha publicado en GitHub.
