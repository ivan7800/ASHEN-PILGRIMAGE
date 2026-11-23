# ASHEN PILGRIMAGE v3.9 — Progresión, colisiones y comprobación de los tres finales

Fecha: 23/11/2026. Base: **copia completa de v3.8**, sin sobrescribir el original. Estado: **CANDIDATA DE QA; NO-GO para v4.0 final**.

## Cambios técnicos confirmados

1. **Detección de golpes tras cargas:** `combat.js` ya no falla automáticamente cuando los centros del Portador y el enemigo coinciden. El golpe frontal permite un margen de solapamiento de `min(player.w, enemy.w)/2` y contempla la mitad del ancho enemigo al extremo del alcance; los enemigos enteramente a la espalda siguen fuera de rango. No se han cambiado HP, daño recibido ni las estadísticas de los 23 enemigos. Prueba: `test-v39-progression.mjs`.
2. **Reglas de progresión centralizadas:** `campaign-progression-v39.js` es la única autoridad de las puertas delanteras, y `game.js` la utiliza realmente. Se han preservado los requisitos previos de Valdren, Brezaluna, Ossara, Salmuera, Hojaclara, Cumbres y Trono; los regresos continúan abiertos. Sin cambio de ubicaciones, posiciones ni save schema.
3. **Cobertura de la estructura completa:** 35 cámaras, 34 puertas delanteras y 34 regresos contrastados. De esas puertas delanteras, 24 requieren condiciones narrativas; también hay 25 comprobaciones explícitas de intentos prematuros (algunos duplican una puerta con distintas condiciones).
4. **Los tres desenlaces en el runtime:** desde un estado preparado justo antes del altar final, `test-v39-ending-ui.mjs` elige **liberar, custodiar y extinguir** en tres procesos de prueba independientes. Confirma UI, guardado (`phase=won`), créditos y acceso al epílogo desde el título. La prueba de regresión valida también tres ranuras y el transporte JSON de estos finales.
5. **Limpieza de dependencias:** retiradas importaciones ya no utilizadas por el motor tras extraer las reglas de puertas.

## Evidencia y límites de las pruebas

| Verificación | Resultado | Qué NO demuestra |
| --- | --- | --- |
| Suites Node (`test-*.mjs`) | **47/47 PASS** | No reproduce jugar sin automatización |
| `tools/qa-v36-preflight.py` | **145/145 PASS** | Solo archivos, sintaxis, lanzadores en análisis y HTTP |
| `tools/qa-v38-animation.py` | **PASS**: 23 atlas, 460 fotogramas no vacíos | No verifica calidad del movimiento percibida por jugadores |
| `tools/qa-v39-browser.py` | **PASS**: 16 capturas de ataques en ocho criaturas, 0 errores JS detectados | Preparación de poses inyectada, no encuentros jugados desde cero |
| `tools/qa-v36-browser.py` | **PASS**: 35/35 cámaras y guardar/continuar | Usa estados preparados y navegador autocontenido |
| `tools/qa-v38-combat.py` | **PASS**: 69 duelos (23 × 3 dificultades), 0 excepciones JS observadas | Jugador inmóvil; no es evaluación de dificultad real |
| `test-v39-ending-ui.mjs` | **PASS**: 3/3 elecciones desde menús reales simulados en DOM | Estado anterior al desenlace preparado por QA |
| `test-v39-progression.mjs` | **PASS**: 34+34 portales, 24 puertas condicionadas, 25 negativas, tres finales guardados | Flags de progreso preparados; no completa las misiones manualmente |
| Windows 11 físico / Linux Mint físico / mando físico | **PENDIENTE** | No se accede a ese hardware desde el entorno |
| Campaña humana 35/35, 8 jefes, 3 finales | **PENDIENTE** | Ninguna de estas suites equivale a una partida completa |
| FPS, latencia y RAM durante 60 minutos | **PENDIENTE** | Render de un solo frame no equivale a rendimiento sostenido |

### Resultados de estrés de enemigos, heredados y repetidos en v3.9

| Dificultad | Intervalo daño en duelos de 4,8 s con jugador inmóvil |
| --- | ---: |
| Peregrino | 14–44 |
| Normal | 19–58 |
| Penitencia | 24–72 |

Estos números son del **escenario de prueba**, no estadísticas de victorias o de jugador humano. Los 10 arquetipos de lanzamiento de proyectil dispararon. No se han ajustado las estadísticas basándose únicamente en ellos para evitar cambios arbitrarios de dificultad.

## Reproducir las pruebas

Desde el directorio raíz del juego, con Node.js 18+ y Python 3:

```bash
for f in test-*.mjs; do node "$f" || exit 1; done
python3 tools/qa-v36-preflight.py
```

Con Pillow, Chromium y Playwright instalados (y NumPy si se usa el generador de sprites):

```bash
python3 tools/qa-v38-animation.py
python3 tools/qa-v36-browser.py
python3 tools/qa-v39-browser.py
python3 tools/qa-v38-combat.py
```

**Instalación:** descomprimir conservando la carpeta, ejecutar `JUGAR-WINDOWS.bat` en Windows o `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh` en Linux. Python 3 es necesario; Node.js solo para pruebas. Mantener la dirección `http://127.0.0.1:8765/` para que el navegador acceda a las mismas partidas de `localStorage`. **Se recomienda exportar JSON antes de actualizar**.

## Trabajo pendiente para v4.0

1. Completar **una partida humana completa** en Normal sin saltos de QA y registrar los ocho jefes y las 35 cámaras, con muertes, curación y patrones visibles.
2. Comprobar los tres finales con tres guardados independientes logrados mediante el recorrido real; cerrar, reiniciar y recuperarlos.
3. Ejecutar los dos lanzadores y verificadores en **Windows 11** y **Linux Mint**, con un mando Xbox/PlayStation conectado.
4. Medir FPS, RAM, CPU y audio en sesiones prolongadas (al menos una hora por equipo objetivo); accesibilidad y escalado de textos.
5. Corregir fallos encontrados; repetir aceptación, generar nuevas evidencias y publicar únicamente con repositorio autorizado y sin `force push`.

**No se ha utilizado REA**, porque se trata de código fuente JavaScript disponible, no de un binario que haya que descompilar. No se ha publicado en GitHub. Los ZIP originales y guardados del usuario no se han tocado.
