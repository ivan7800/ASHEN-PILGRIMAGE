# QA v0.6 — Las Cinco Cámaras

## Verificado en entorno aislado (22-11-2026)

- `node --check game.js` y `node --check visual.js`: sintaxis correcta.
- `node test-runtime.mjs`: inicialización, 22 fotogramas simulados, entrada de combate y pausa.
- `node test-v06.mjs`: importación del guardado heredado, lectura y persistencia de un pergamino, persistencia de los 180 PV del jefe, Desvelo y pausa.
- `bash -n JUGAR-LINUX.sh` y `python3 -m py_compile serve.py`: correctos.
- Lanzador Windows inspeccionado estáticamente, **no ejecutado** en Windows.

## Cambios en el comportamiento

- Cinco sectores con cartelas narrativas al entrar, sin alterar el mapa físico ya existente.
- Cuatro inscripciones interactuables con `E`, permanentes en `localStorage`.
- Jefe de la Fosa sube a 180 PV y comienza una segunda fase a mitad de vida: mayor velocidad, anticipación más corta y embestidas; iconografía roja.
- Conservado el identificador de guardado desde v0.1 y validación actualizada para el nuevo máximo de PV.
- Indicador de barra de vida del jefe y contador de inscripciones.

## Pendiente de QA real

- Recorrido del principio al final en navegador con teclado y mando, especialmente geometría de plataformas, daño, colisiones y tiempos.
- Comprobación visual del diseño, superposición de textos en diferentes resoluciones y rendimiento prolongado.
- Lanzadores de doble clic en Windows 11 y Linux Mint físicos.
- Ajuste de balance de dificultad. Los sectores son narrativos; **todavía no son cinco salas físicas independientes**.
- Sin publicación remota.
