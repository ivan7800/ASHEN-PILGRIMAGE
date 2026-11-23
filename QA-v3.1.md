# QA v3.1 — Auditoría y Estabilidad

Fecha: 2026-11-23. Base: ZIP v3.0 El Trono del Sol Muerto, extraído en una carpeta de trabajo; **original no modificado**. Motor: HTML5 Canvas + módulos JavaScript. No se ha ejecutado REA (no necesario para inspeccionar este código fuente original).

## Hallazgos demostrados y correcciones

| Hallazgo en v3.0 | Riesgo | Corrección v3.1 | Evidencia |
|---|---|---|---|
| Solo `localStorage` y sin backup exportable | Perder progreso al cambiar origen, perfil o borrar datos | Copia JSON de auto + 3 ranuras, importación validada, confirmada y reversible | `test-v31-backups.mjs`, `test-v31-menu.mjs`, Chromium |
| Guardado corrupto indistinguible de ranura vacía | Sobrescritura accidental y diagnóstico confuso | Estado «Dañada (conservada)», bloqueo de carga y aviso; borrado solo con confirmación | `test-v31-menu.mjs` |
| Archivo importado podía reemplazar progreso sin validar | Pérdida de datos | Valida todas las ranuras, comprueba formato y límite 2 MB, rollback ante fallos | `save-portability.js`, `test-v31-backups.mjs` |
| Consulta del desenlace basada solo en la partida más reciente | Desaparece del menú al empezar otra partida | `latestEnding` encuentra también finales en ranuras manuales | `test-v31-backups.mjs` |
| Al perder foco, teclas retenidas podían seguir activas | Movimiento involuntario al regresar | Vacía `keys`, `pressed` y el estado previo del mando antes de pausar | `tools/qa-v31-browser.py` |
| Orden de guardados con marca de tiempo inválida | Selección incoherente de Continuar | Ordena fechas inválidas como fecha más antigua | `save-manager.js` |

## Pruebas ejecutadas (no inferidas)

- **Base de referencia:** `for f in test-*.mjs; do node "$f" || exit 1; done` en la v3.0 extraída: **32/32**.
- **Después de los cambios:** el mismo comando: **34/34** (32 anteriores + `test-v31-backups.mjs` + `test-v31-menu.mjs`).
- `node --check` de todos los JavaScript, `python3 -m py_compile` de servidor y scripts QA, `bash -n JUGAR-LINUX.sh`.
- `python3 tools/qa-v31-http.py`: servidor Python escuchando en loopback y `HTTP 200` en `/`, `/game.js`, `/save-portability.js` y `/assets/firstwitness-v30.png`. `X-Content-Type-Options: nosniff` comprobado.
- `python3 tools/qa-v30-browser.py`: Chromium autocontenido de v3.1; finales, recursos del Trono y simulación de 180 cuadros. **Daño en simulación de jefe: 100→4 PV, indicio de revisar equilibrio en partida humana; no se ha modificado a ciegas.**
- `python3 tools/qa-v31-browser.py`: Chromium autocontenido, descarga JSON real, selector de archivo, cancelación, restauración, continuidad, pérdida de foco, **35/35 escenas** visitadas por estados preparados, **9 capturas de muestra** en las siete regiones. No hubo errores JS observados. Estas escenas no son una partida libre de principio a fin.
- `zipfile.testzip`: integridad del ZIP y comprobación de entradas, registro SHA-256 del entregable.

## Limitaciones importantes

- **No se ha jugado la campaña completa sin atajos desde nueva partida hasta los créditos.** Las escenas se preparan mediante estados de QA; el control de progresión se comprueba por pruebas unitarias y de integración históricas, pero falta la prueba humana continuada.
- **No se ha probado un mando físico** ni una sesión real en Windows 11 o Linux Mint. El shell Linux se puede probar en este entorno, pero no equivale a esas máquinas.
- No hay mediciones fiables de FPS/RAM en hardware de destino ni auditoría completa de accesibilidad, dificultad o contenido de 25–35 h.
- El aspecto de los primeros escenarios conserva figuras geométricas sobre fondos más detallados; la **homogeneización artística sigue pendiente**. Las capturas de QA no son certificación de calidad artística.
- Los guardados de **otros puertos** no pueden verse automáticamente desde `127.0.0.1:8765`: exportar desde el origen antiguo y volver a importar desde el nuevo.
- El JSON exportado se guarda localmente: el jugador debe comprobar que el navegador lo descargó antes de borrar datos.
- Esta actualización NO modifica gameplay, mapas, colisiones, patrones de jefes, daño ni reglas de misión sin un defecto reproducido. Tampoco publica en GitHub.

## Reproducir

```bash
cd ashen-pilgrimage
for f in test-*.mjs; do node "$f" || exit 1; done
python3 tools/qa-v31-http.py
python3 tools/qa-v31-browser.py  # opcional: playwright, chromium y Pillow
```

Para el recorrido en hardware real usar `docs/CHECKLIST-MANUAL-v3.1.md` y anotar defectos reproducibles. Arrancar Windows con `JUGAR-WINDOWS.bat`; en Linux Mint, `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh`.
