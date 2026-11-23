# ASHEN PILGRIMAGE v1.2 RC — QA (22-11-2026)

## Auditoría basada en v1.1 RC
- Antes: la carga del único guardado se ejecutaba al importar `game.js`, sin título ni selección.
- Antes: el botón Nueva partida eliminaba directamente la única clave localStorage.
- Antes: `save()` sobreescribía siempre la misma partida y no distinguía autosave/manual.
- Antes: no existían guardar/cargar/eliminar por ranuras, confirmaciones ni menú de pausa completo.

## Modificaciones
- Menú inicial en HTML/CSS/DOM: Continuar, Nueva partida, Cargar, Opciones, Controles, Gestión de partidas.
- Menú pausa: Reanudar, Guardar, Cargar, Opciones, Controles, Gestión de partidas, Volver al título.
- `save-manager.js`: 1 autoguardado y 3 ranuras manuales independientes, formato v2 y validación.
- Importación conservadora de `ashen-pilgrimage-prototype-v01` a autoguardado si no existe autoguardado v2. No elimina la clave heredada.
- Guardar/cargar/borrar y nueva partida con confirmaciones cuando procede.
- Botones accesibles por teclado mediante elementos `button` y gestión de foco básica.
- No se han cambiado los lanzadores `.bat`, `.sh` ni `serve.py`.

## Pruebas ejecutadas
- `node test-runtime.mjs`, `node test-v06.mjs`, `node test-v07.mjs`, `node test-v08.mjs`, `node test-v09.mjs`, `node test-v10.mjs`, `node test-v11.mjs`, `node test-v11-integration.mjs`: PASS.
- `node test-v12-menu.mjs`: PASS: navegación principal y de pausa, confirmar/cancelar, guardar/cargar, borrar.
- `node test-v12-save.mjs`: PASS: migración, aislamiento de ranuras, datos dañados y esquema.
- `node --check game.js` y `node --check save-manager.js`: PASS.
- `python3 -m py_compile serve.py`: PASS.
- `bash -n JUGAR-LINUX.sh`: PASS.
- Chromium Playwright: no verificable en este entorno (`ERR_BLOCKED_BY_ADMINISTRATOR` al navegar a `file://`); requiere prueba visual real en navegador.
- Windows 11, Linux Mint y mando físico: no ejecutados.

## Validación manual recomendada
1. Abrir `JUGAR-WINDOWS.bat` o `JUGAR-LINUX.sh` e ir a la URL local que muestre el lanzador.
2. Verificar título y botón Continuar inactivo si no hay partidas.
3. Nueva partida; mover al personaje; `Esc`; guardar en ranura 1; reanudar y avanzar.
4. Volver al título; cargar ranura 1; verificar posición y progreso.
5. Nueva partida con confirmación; verificar que ranura 1 persiste y autosave empieza desde el principio.
6. Borrar ranura 1 con confirmación; comprobar que ya no aparece para cargar.
7. Probar teclado, mando, audio, cambio de tamaño y persistencia después de cerrar/reabrir.

## Limitaciones
- `localStorage` no es un guardado portable entre navegadores o perfiles y puede perderse al limpiar datos del sitio.
- No hay exportación/importación de guardados a archivo aún ni sincronización en la nube.
- Los ajustes de audio no persisten entre sesiones.
- No hay soporte completo de navegación por mando dentro del menú HTML.
- No hay validación de una partida completa de principio a fin en un navegador real.
