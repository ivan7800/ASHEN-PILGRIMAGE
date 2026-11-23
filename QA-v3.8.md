# ASHEN PILGRIMAGE v3.8 — Auditoría de animaciones y combate

**Fecha:** 23/11/2026. **Base:** copia de trabajo de v3.7. **Estado:** candidata de pruebas; **NO** producto certificado ni lanzamiento comercial 4.0. Original v3.7 intacto.

## Evidencia de implementación

- **23 especies únicas conservadas** en `bestiary-v37.js` con 23 índices originales de encuentros normales; jefes e índices 73 y formato de save sin cambios. El nuevo `bestiary-presentation-v38.js` define siete lenguajes visuales legibles (espada, escudo, cazador, aparición, ritual, leviatán y bruto), con pistas de dirección/alcance. No hay colisiones nuevas ni cambios de daño introducidos en v3.8.
- **23 atlas regenerados**, 20 cuadros PNG RGBA 128×160 por especie, en `assets/bestiary-v37/`. La ruta se mantiene para evitar romper el cargador. Contienen recortes anatómicos por secciones, variaciones de locomoción, aviso de ataque, golpes, reacción y muerte. **No son 20 poses anatómicas dibujadas manualmente**; su movimiento combina fragmentos de la ilustración estática original y efectos procedimentales.
- **Animación con estado real:** los enemigos quietos dejan de caminar visualmente en el sitio; el motor calcula desplazamiento real `e.motion` únicamente en memoria. Golpes, telegráficos y muerte conservan las colisiones anteriores. `visual.js` dibuja señales por familia y respeta opción gráfica Rendimiento y reducción de movimiento.
- **Audio diferenciado y accesibilidad:** los siete tipos de criatura emiten hasta dos notas sintetizadas en preparación, ejecución y derrota, mediante el bus de efectos existente y solo si el sonido está activado. `presentation-v35.js` presenta avisos textuales también con audio apagado.
- **Arreglo de combate adicional:** `game.js` ignora enemigos ya derrotados al aplicar el barrido del jugador, evitando reimpactos durante su animación de muerte. La corrección respeta las recompensas y el conteo de bajas.
- **Reproducibilidad:** `tools/remaster-bestiary-v38.py` regenera los sprites desde `art-source/bestiary-v37/concepto-23-enemigos.png`, reconstruyendo primero la base v3.7. Requiere Pillow + NumPy solo al regenerar arte. Los atlas ya están incluidos para jugar.

## Comprobaciones ejecutadas

| Prueba | Resultado | Alcance |
|---|---|---|
| Suites Node.js antiguas y nuevas | **45/45 PASS** | 44 suites heredadas y `test-v38-bestiary-motion.mjs` |
| `tools/qa-v36-preflight.py` | **144/144 PASS** | Sintaxis, recursos estáticos, cabeceras y HTTP local |
| `tools/qa-v38-animation.py` | **PASS** | 23 atlas RGBA; 460 cuadros no vacíos; 14–17 cuadros distintos por especie |
| `tools/qa-v37-browser.py` ejecutado sobre v3.8 | **PASS** | Los 23 encuentros/cámaras correspondientes se muestran, 8 capturas y 3 duelos |
| `tools/qa-v38-browser.py` | **PASS** | 16 capturas del motor: aviso y ataque en 8 criaturas; 0 excepciones JS observadas |
| `tools/qa-v38-combat.py` | **PASS del escenario de QA** | 69 duelos simulados: 23 enemigos × 3 dificultades, jugador inactivo durante 4,8 s |
| Validación Windows 11 físico y Linux Mint físico | **PENDIENTE** | No ejecutados en máquinas objetivo |
| Campaña de principio a fin, tres finales y mando físico | **PENDIENTE** | Ninguna simulación equivale a completarla jugando |

### Resultados de la simulación de 69 duelos

Es una **prueba de integridad y detección de valores extremos, no un balance certificado**. Los encuentros se aíslan con estado de QA; el personaje empieza con 1000 PV para medir los golpes sin reiniciar el escenario. Durante 300 pasos de 16 ms (4,8 segundos), se registraron:

| Dificultad | Mín.–máx. daño recibido | Promedio aproximado | Enemigos que atacan | Casters con proyectil |
|---|---:|---:|---:|---:|
| Peregrino | 14–44 | 27,7 | 23/23 | 10/10 |
| Normal | 19–58 | 38,4 | 23/23 | 10/10 |
| Penitencia | 24–72 | 48,0 | 23/23 | 10/10 |

Datos brutos: `docs/COMBATE-SIMULADO-v3.8.json`. El daño depende del tiempo, posición de combate, invulnerabilidad entre impactos y el personaje quieto; no es DPS real de un jugador. Se observaron cero errores JavaScript en los escenarios de Chromium indicados.

## Procedimiento de comprobación

```bash
# Requiere Node.js 18+ y Python 3.
./VERIFICAR-LINUX.sh                 # Windows: VERIFICAR-WINDOWS.bat

# Optativo: requiere Pillow, NumPy y Chromium + Playwright para gráficos.
python3 tools/qa-v38-animation.py
python3 tools/qa-v38-browser.py
python3 tools/qa-v38-combat.py
python3 tools/remaster-bestiary-v38.py  # REGENERA Y SOBRESCRIBE SOLO los atlas del COPIADO actual
```

Para jugar, `./JUGAR-LINUX.sh` o `JUGAR-WINDOWS.bat` con Python 3. Mantener `http://127.0.0.1:8765/` para la continuidad de `localStorage`; exportar copia JSON de partidas antes de cambiar de equipo/navegador.

## Bloqueos para las fases siguientes

1. **Fase v3.9 — QA manual y equilibrio:** partida completa real de principio a créditos; registrar muerte, curación, telegráficos, uso de habilidades y retrocesos en las 35 cámaras; verificar los ocho jefes y tres finales. Ajustar picos de daño y armadura según evidencia de jugadores. Aún no está completada.
2. **Fase v4.0 — Release final:** lanzadores en Windows 11 y Linux Mint, mando Xbox/PlayStation físico, sesión ≥60 minutos con FPS/RAM medidos, accesibilidad y exportación/importación en navegador de destino, corregir bloqueantes, volver a ejecutar suites y publicar a repositorio confirmado. Aún no está completada.
3. La animación v3.8 mejora legibilidad y variedad, pero no sustituye dirección de animación manual por especie. Para una calidad artística superior serían necesarios cuadros clave dibujados individualmente, pruebas de silueta con diferentes fondos y revisión del ritmo por jugadores.

**Resultado editorial:** lanzamiento comercial NO-GO; distribuir como candidata v3.8 para pruebas. Ni las pruebas en estados inyectados ni una simulación hacen el juego “sin fallos”. No se ha realizado ningún push a GitHub.

## Método y límites de la investigación

**Tipo de artefacto:** aplicación web local (JavaScript ES modules, Canvas 2D, PNG/WebP y lanzadores Bash/BAT/Python); no se analizan binarios nativos. **Herramientas utilizadas:** inspección directa de código, Node.js, Pillow/NumPy para regenerar atlas, Chromium con Playwright y servidor Python local. Se han seguido criterios de trazabilidad del proyecto REVERSE 404, pero **REA no se ha ejecutado**, al no ser necesaria descompilación ni análisis de binarios en esta fase. No se ha modificado ni sobrescrito el ZIP de la v3.7.
