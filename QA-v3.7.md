# ASHEN PILGRIMAGE v3.7 — QA DE BESTIARIO Y ESTADO DE LANZAMIENTO

Fecha: 23/11/2026. Base: copia de trabajo de v3.6; original conservado. Motor: Canvas 2D, JS ES modules, servidor Python 3 en `127.0.0.1:8765`. Estado: **candidata para pruebas**, no «sin fallos» ni release comercial certificada.

## Evidencia / hechos

- **23 criaturas originales integradas en encuentros existentes.** `bestiary-v37.js` es el catálogo único de especie, posición, región, silueta, colisión y estilo de combate. **No aumenta** el número de enemigos de 73, ni reordena posiciones, ni modifica los índices de los ocho jefes. Se han reemplazado 23 encuentros normales previamente repetidos.
- **23 atlas** PNG RGBA 2560×160 en `assets/bestiary-v37/`, 20 celdas de 128×160 cada uno. Generados desde el concepto de pixel art guardado en `art-source/bestiary-v37/concepto-23-enemigos.png`, mediante `tools/build-bestiary-v37.py` (Pillow + NumPy). Las celdas son animación recortada/transformada (respiración, paso, anticipación, golpe, impacto, disolución), **no** 20 poses dibujadas a mano por enemigo.
- **Diferenciación mecánica comprobable:** 10 perfiles de proyectil; 2 escudos con reducción frontal; 3 enemigos con avance de embestida; armaduras para criaturas grandes; alcance, velocidad, tiempos de anticipación, daño, retirada y drenaje de resistencia por especie.
- **Menú «Bestiario · 23 criaturas»** en título y pausa; muestra nombre, región y comportamiento. Se identifica si el sector ya fue visitado, sin guardar datos adicionales.
- **Formato de guardados compatible:** se conservan arrays de 73 enemigos y los índices de progresión. Ni `save-manager.js` ni los datos de las ranuras se alteran. Los antiguos guardados se cargan con sus HP y derrotas anteriores; los tipos visuales y su perfil de ataque se corresponden con la nueva versión.

## Verificaciones

| Prueba | Resultado | Interpretación |
|---|---|---|
| Suites heredadas de v3.6 | 43/43 PASS | Regresiones de campaña, guardado, combate, audio, exploración y menús |
| Nueva suite `test-v37-bestiary.mjs` | 1/1 PASS | 23 identificadores y posiciones únicas, atlas, perfil, defensa frontal, ataques, validación de guardados antiguos |
| QA preflight `tools/qa-v36-preflight.py` | 143/143 PASS | Recursos originales, sintaxis y HTTP local; el atlas nuevo se valida en la suite v3.7 |
| Chromium autocontenido `tools/qa-v37-browser.py` | PASS | 23 recursos con carga confirmada, 23 cámaras de aparición preparadas de QA, 8 capturas, menú del bestiario, 3 duelos simulados dentro del bucle real |
| Chromium — Perro de Ceniza | PASS | Observado aviso y ejecución de embestida; mínimo de vida 52/100 durante duelo simulado |
| Chromium — Tejedor de Sueños | PASS | Observado aviso y proyectil; resistencia mínima 84/100, vida mínima 64/100 |
| Chromium — Guardia de Vespera | PASS | Observado aviso de ataque cuerpo a cuerpo; defensa frontal comprobada por prueba unitaria |
| Errores JavaScript observados en la muestra | 0 | No demuestra ausencia de errores fuera de los recorridos evaluados |
| ZIP y checksum | Verificar en distribución | Comprobación de integridad independiente |

## Cómo reproducir

```bash
for t in test-*.mjs; do node "$t" || exit 1; done
python3 tools/qa-v36-preflight.py
python3 tools/qa-v37-browser.py
python3 tools/build-bestiary-v37.py # opcional: necesita Pillow y NumPy
```

Para ejecutar el juego: `JUGAR-WINDOWS.bat` en Windows, o `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh` en Linux Mint con Python 3. Mantener siempre el mismo origen local evita perder visibilidad de las partidas guardadas en localStorage. Exportar copias JSON antes de cambiar de navegador o puerto.

## Limitaciones y tareas pendientes

1. **Partida completa desde cero a créditos y los tres finales, sin estados inyectados:** NO comprobada. El test de Chromium coloca al personaje al lado de cada enemigo: verifica renderizado y duelos concretos, pero no la progresión real.
2. **Balance de los 23 enemigos en una partida humana:** NO certificado. Las nuevas criaturas sustituyen encuentros previos y pueden producir nuevos picos de dificultad, en especial armaduras y drenajes de resistencia.
3. **Animación premium definitiva:** los atlas de 20 celdas derivan de una postura de origen, transformada en posiciones de combate. Se recomienda animación anatómica específica y revisión manual de silueta/hitbox en la v3.8 si se busca acabado comercial.
4. **Mando físico y hardware Windows 11 / Linux Mint reales:** NO comprobados en este entorno. Lanzadores conservados, no ejecutados aquí en los sistemas destino.
5. **Sesión de 60 minutos, FPS, memoria, audio en escenarios largos y accesibilidad completa:** pendiente.
6. **Publicación GitHub:** no realizada; no se aportó un repositorio de destino para esta entrega.

## Fases después de v3.7

- **v3.8 — Animación y comportamiento fino:** acciones específicas por esqueleto/silueta, señales de golpe únicas, revisión de colisiones y animación de muerte, variedad acústica.
- **v3.9 — Balance y QA de campaña:** sesiones reales con tres dificultades; medir tiempo a muerte, consumo de ampollas, progresión y FPS, corregir incidencias reproducibles.
- **v4.0 — Candidata definitiva:** matrices de 35 cámaras, 8 jefes y tres finales, QA Windows 11/Linux Mint + mando físico, exportación/recuperación, aceptación y publicación si cumple criterios.

**Criterio de salida: NO-GO comercial** mientras permanezca pendiente `docs/CRITERIOS-LANZAMIENTO-v3.6.md` y las nuevas pruebas de balance.
