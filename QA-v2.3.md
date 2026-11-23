# QA v2.3 — Revisión de Ossara y coherencia visual

## Evidencia ejecutada (22 noviembre 2026)

- Revisión del código de la v2.2: el Archivero anunciaba el ataque con una elipse sin dirección; la fase 2 sobreescribía la preparación con 0,42 s.
- Corregido mediante `archivist-presentation.js`: telegráfico lineal en dirección real de ataque y alcance coherente con `shouldStrike`; preparación 0,88 s (fase 1) y 0,67 s (fase 2).
- Audio sintetizado adicional para golpe inminente, ejecución y cambio de fase; se respeta el consentimiento de audio existente.
- Revisadas cinco salas iniciales: `assets/room-{crypt,cloister,ossuary,bell,arena}.webp`; fuentes sin modificar en `art-source/v22-crypt-rooms/`. Transformación reproducible en `tools/remaster-crypts-v23.py`.
- Corregida la nomenclatura del HUD: Prólogo / Región I Valdren / Región II Bosque / Región III Ossara.
- 25 scripts `test-*.mjs` pasan con Node.js (batería disponible; comprende pruebas unitarias y escenarios con DOM simulado). `node --check` correcto en archivos afectados.
- Prueba Playwright real intentada con `python browser-v21.py`: **NO SUPERADA**. Chromium rechaza la navegación con `ERR_BLOCKED_BY_ADMINISTRATOR`; no se obtuvo imagen de gameplay real.

## Prueba manual pendiente, obligatoria antes de publicar como versión estable

1. Descomprimir el ZIP; ejecutar `JUGAR-WINDOWS.bat` en Windows o `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh` en Linux.
2. Iniciar partida nueva; atravesar las cinco cámaras del prólogo y comprobar contraste de personaje/enemigos delante de cada fondo, escala correcta y ausencia de obstáculos invisibles.
3. Llegar a Ossara, hablar con el Velador, derrotar centinelas, activar Desvelo, recuperar inscripción y regresar.
4. En Ossara interior, hablar con Neria y activar con `Q`+`E` los tres epitafios en orden **Hueso, Ceniza, Silencio**; comprobar que el acceso al Archivero está inicialmente cerrado.
5. Frente al Archivero: comparar la dirección de la banda de peligro con el golpe real. Verificar 0,88 s aprox. en fase 1 y 0,67 s aprox. en fase 2; no asegurar un tiempo exacto medido sin instrumentar FPS.
6. Activar sonido voluntariamente; verificar los avisos, y comprobar silencio cuando se desactiva.
7. Morir durante el combate, continuar desde hoguera, guardar/cargar en ranuras y derrotar al Archivero; comprobar que la Brasa de Ossara persiste.
8. Repetir con mando físico; anotar latencia, fallos de navegación, salud y número de intentos. Completar al menos una sesión con teclado y otra con mando.

## Limitaciones

No se ha probado un recorrido completo sobre hardware Windows/Linux, mando físico ni una captura real del navegador. Las pruebas simuladas no prueban legibilidad ni dificultad subjetiva. Las cinco salas revisadas conservan el arte base y no se han redibujado artesanalmente. No se ha publicado GitHub.
