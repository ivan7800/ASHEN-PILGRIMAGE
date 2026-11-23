# QA — ASHEN PILGRIMAGE v2.6: Raíces Eternas y espinas vivas

## Alcance implementado

Proyecto HTML5/JavaScript original, extendido desde v2.5 sin modificar el ZIP original. La quinta región dispone de cuatro sectores (Umbral de la Savia, Hojaclara, Jardín de los Injertos e Invernadero de Carne), Liria, un ritual con tres nombres escuchados mediante Desvelo, nuevos enemigos (Guardianes de Corteza, Videntes de Esporas y Jardinero de Carne), cuatro fondos, atlas independientes y una arena con jefe de dos fases. **No es la campaña completa de siete regiones.**

## Espinas vivas

Cinco parches de espinas en las zonas 22–24, con ciclos desplazados de **3,4 segundos**:

- **Reposo, 1,90 s:** suelo transitable sin daño de espinas.
- **Aviso, 0,65 s:** brotes bajos de color ámbar, resplandor y aviso sonoro opcional; no produce daño.
- **Ataque, 0,85 s:** espinas rojas de hasta aproximadamente 48 px; **12 PV de daño** si se produce solapamiento 2D.

La colisión ahora comprueba coordenadas y altura reales: saltar lo bastante alto o pasar por una plataforma elevada evita el impacto. La invulnerabilidad temporal del personaje evita daño repetido inmediato. El reloj de las trampas se detiene al pausar el juego.

## Pruebas realmente ejecutadas

- **28/28 archivos de pruebas Node superados**: `for f in test-*.mjs; do node "$f" || exit 1; done`.
- `test-v26-roots.mjs`: **15 escenarios de integración**, incluidos entrada condicionada a la victoria anterior, diálogo, ritual, acceso y derrota del jefe, daño de espinas y salto por encima de una trampa activa. Pruebas puras adicionales de tres estados, límites laterales y verticales y aviso por proximidad.
- Sintaxis JavaScript (`node --check` en todos los módulos), Bash (`bash -n`) y Python (`py_compile`) sin errores.
- PNG/WebP de la región abiertos y validados con Pillow; atlas RGBA de 2560×160, 20 celdas de 128×160.
- **Chromium + Playwright autocontenido**: Hojaclara, Jardinero, espinas en estado de aviso y espinas activas renderizados **sin errores JavaScript observados**. Capturas auténticas incluidas en `docs/`. La captura de aviso y la de ataque comprueban el estado interno del reloj para evitar nombres incorrectos.

## Limitaciones y pruebas pendientes

- **HTTP local:** `serve.py` inició un proceso en el entorno, pero una petición a `127.0.0.1:8765` produjo `ConnectionRefusedError`. **No se ha confirmado HTTP 200 en esta ejecución**. Es necesario validar el acceso desde Windows o Linux Mint.
- Recorrido manual completo de la región en navegador HTTP, equilibrio de dificultad y percepción de los avisos durante una partida prolongada.
- Doble clic y ejecución física de los lanzadores en Windows 11, Linux Mint con gestor de archivos y mandos reales.
- Calidad artística de nivel comercial: el arte mezcla fondos compuestos y sprites generados/retocados; no se ha realizado una revisión artesanal de cada fotograma.

## Comprobar en Windows y Linux

1. Extrae completamente el ZIP.
2. Ejecuta `JUGAR-WINDOWS.bat` en Windows o `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh` en Linux con Python 3 instalado.
3. Abre `http://127.0.0.1:8765/` en el navegador; prueba Nueva partida, Continuar, y las tres ranuras antes de avanzar.
4. En Raíces Eternas, observa los cambios **verde → ámbar → rojo**; salta durante el aviso para esquivar las espinas. Comprueba el sonido opcional.
5. Habla con Liria y escucha **Corteza → Savia → Carne** con Desvelo. Comprueba que el jefe permanece bloqueado sin terminar el ritual.
6. Derrota al Jardinero, guarda, reinicia, carga y comprueba el progreso y la Brasa.
7. Comprueba un mando estándar, los menús y las esquivas; anota dificultad y caídas de rendimiento.

**Partidas:** `localStorage` depende del origen HTTP, incluido el puerto. Mantén siempre `127.0.0.1:8765` o el mismo puerto fijo alternativo. Las partidas de puertos antiguos no se migran automáticamente; evita borrar datos del navegador.
