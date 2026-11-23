# QA — ASHEN PILGRIMAGE v1.4

## Evidencia comprobada en el entorno de construcción

- 12 archivos `test-*.mjs` ejecutados con Node.js 22.16.0: todos superados después de actualizar pruebas de referencias de sprites sustituidos.
- `node --check` correcto para `visual.js`, `game.js`, `animation-state.js`.
- Atlas PNG nuevos: 2560 × 160 píxeles cada uno, 20 cuadros de 128 × 160; transparencia RGBA.
- `animation-state.js` verifica reposo, caminar, salto, esquiva, ataque, daño, fase dos y derrota mediante `test-v14.mjs`.
- Compatibilidad de flujo de menú y guardados en las pruebas heredadas v1.2.
- Chromium con navegación `file://` rechazó la apertura con `ERR_BLOCKED_BY_ADMINISTRATOR`: NO equivale a comprobar la representación del juego real.

## Limitaciones

- Las imágenes son sprites pixel art programáticos originales, no ilustraciones dibujadas a mano fotograma a fotograma. La calidad y el refinamiento aún no igualan las láminas conceptuales.
- No hay prueba de juego completo, mando físico ni doble clic real en Windows 11 / Linux Mint.
- Las cinco cámaras pertenecen a un capítulo inicial; no se han implementado las siete regiones de campaña.
- El código de los lanzadores se conserva sin cambios de funcionamiento.

## QA manual recomendado

1. Arrancar con `JUGAR-WINDOWS.bat` o `JUGAR-LINUX.sh` y revisar que aparezca el menú inicial.
2. Nueva partida → mover y observar 4 fases de caminata, salto, esquiva, cuatro fotogramas de ataque y daño al recibir un golpe.
3. Avanzar al Guardián: revisar anticipación, golpe, transición bajo 50 % de vida, segunda fase y cuatro poses de derrota.
4. Guardar en ranura 1; volver al título; cargar; confirmar continuidad del estado.
5. Verificar menús y partida con gamepad, cambios de ventana y ambos sistemas operativos.
