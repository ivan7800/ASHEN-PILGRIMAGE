# ASHEN PILGRIMAGE v3.4 — registro de cierre de exploración

**Base utilizada para la v3.5:** copia local de v3.4, construida sobre v3.3. No se modificaron archivos originales ni se publicó en GitHub.

## Funciones incorporadas en la fase 4

- Ocho relicarios opcionales (uno en el prólogo y uno en cada reino), revelados con Desvelo; sus efectos afectan a combate, esquiva, regeneración, curación, oxígeno o daño de espinas.
- Tres pasajes de ida y vuelta que requieren progresión regional previa y se guardan sin abrir puertas de misión antes de tiempo.
- Mapa e inventario con hallazgos y pistas. Las nuevas listas se validan en los guardados y se incluyen en las copias JSON.

## Pruebas ejecutadas

Antes de la fase 5, se ejecutaron **39/39** archivos `test-*.mjs` de la copia de v3.4. Incluyen las regresiones anteriores, `test-v34-exploration.mjs` y `test-v34-integration.mjs`. También se comprobó sintaxis con `node --check game.js`.

Esto **no** es una prueba humana del recorrido completo ni garantiza que todos los secretos se descubran de forma natural. En v3.5 se conservan íntegros los datos y mecánicas de la fase 4.
