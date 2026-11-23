# Matriz de aceptación — ASHEN PILGRIMAGE v3.6

**Estado inicial: PENDIENTE DE PRUEBA HUMANA COMPLETA.** Las 35 cámaras se han renderizado por separado en Chromium, pero esta matriz **no** queda automáticamente aprobada por las capturas.

## Recorrido obligatorio

Desde «Nueva partida» en dificultad Normal, sin modificar estado ni usar teletransporte de pruebas, atravesar cada umbral, completar los puzles/encargos, derrotar a cada jefe, usar campamentos, guardar y volver a cargar. Después repetir las tres elecciones del final con ranuras separadas. Para cada cámara, comprobar colisión, audio, enemigos, visibilidad, HUD, salida y retorno.

| Nº | Cámara | Entrar/salir jugando | Combate y legibilidad | Guardar/retomar | Observaciones |
|---:|---|:---:|:---:|:---:|---|
| 01 | Cripta de los Peregrinos | ☐ | ☐ | ☐ | |
| 02 | Claustro en Ruinas | ☐ | ☐ | ☐ | |
| 03 | Osario Menor | ☐ | ☐ | ☐ | |
| 04 | Campanario Caído | ☐ | ☐ | ☐ | |
| 05 | Fosa del Guardián | ☐ | ☐ | ☐ | |
| 06 | Valdren · Murallas del Exilio | ☐ | ☐ | ☐ | |
| 07 | Valdren · Barrio de los Tizones | ☐ | ☐ | ☐ | |
| 08 | Valdren · Plaza de las Exequias | ☐ | ☐ | ☐ | |
| 09 | Bosque de las Voces · Sendero de Raíces | ☐ | ☐ | ☐ | |
| 10 | Bosque de las Voces · Arboleda del Eco | ☐ | ☐ | ☐ | |
| 11 | Bosque de las Voces · Refugio de las Luciérnagas | ☐ | ☐ | ☐ | |
| 12 | Bosque de las Voces · Santuario de los Mil Nombres | ☐ | ☐ | ☐ | |
| 13 | Ossara · Atrio de los Huesos | ☐ | ☐ | ☐ | |
| 14 | Ossara · Archivo de las Ausencias | ☐ | ☐ | ☐ | |
| 15 | Ossara · Coro de los Sin Nombre | ☐ | ☐ | ☐ | |
| 16 | Ossara · Cámara del Archivero | ☐ | ☐ | ☐ | |
| 17 | Salmuera · Puerto de las Campanas | ☐ | ☐ | ☐ | |
| 18 | Salmuera · Muelle Hundido | ☐ | ☐ | ☐ | |
| 19 | Salmuera · Galerías Sumergidas | ☐ | ☐ | ☐ | |
| 20 | Salmuera · Sala de las Compuertas | ☐ | ☐ | ☐ | |
| 21 | Salmuera · Capilla de los Ahogados | ☐ | ☐ | ☐ | |
| 22 | Salmuera · Trono de la Novia | ☐ | ☐ | ☐ | |
| 23 | Raíces Eternas · Umbral de la Savia | ☐ | ☐ | ☐ | |
| 24 | Hojaclara · Aldea de la Corteza | ☐ | ☐ | ☐ | |
| 25 | Raíces Eternas · Jardín de los Injertos | ☐ | ☐ | ☐ | |
| 26 | Raíces Eternas · Invernadero de Carne | ☐ | ☐ | ☐ | |
| 27 | Cumbres del Silencio · Paso de los Ecos | ☐ | ☐ | ☐ | |
| 28 | Cumbres del Silencio · Monasterio del Hielo Inmóvil | ☐ | ☐ | ☐ | |
| 29 | Cumbres del Silencio · Escalinata de las Campanas | ☐ | ☐ | ☐ | |
| 30 | Cumbres del Silencio · Observatorio del Eco | ☐ | ☐ | ☐ | |
| 31 | Cumbres del Silencio · Santuario del Gigante | ☐ | ☐ | ☐ | |
| 32 | Trono del Sol Muerto · Umbral de la Santa | ☐ | ☐ | ☐ | |
| 33 | Trono del Sol Muerto · Galería de los Soles Rotos | ☐ | ☐ | ☐ | |
| 34 | Trono del Sol Muerto · Altar de las Siete Brasas | ☐ | ☐ | ☐ | |
| 35 | Trono del Sol Muerto · Cámara del Primer Testigo | ☐ | ☐ | ☐ | |

## Bloqueantes antes de publicar versión final

- [ ] Completar desde cero las 35 cámaras y acceder a los créditos sin variables de QA ni edición de archivos.
- [ ] Registrar ocho combates principales, ambas fases, daños, telegráficos y muertes; sin bloqueos ni atajos involuntarios.
- [ ] Obtener los tres finales en partidas separadas, guardar, salir y volver a cargar cada uno.
- [ ] Probar restauración de un JSON exportado en otra instalación/puerto; probar fichero dañado y cancelación.
- [ ] Validar `JUGAR-WINDOWS.bat` y `VERIFICAR-WINDOWS.bat` mediante doble clic en Windows 11 real.
- [ ] Validar `JUGAR-LINUX.sh` y `VERIFICAR-LINUX.sh` en Linux Mint real, con permisos de ejecución.
- [ ] Probar mando Xbox/PlayStation: menús, pausa, saltos, ataque, esquiva, desconexión y reconexión.
- [ ] Test de sesión prolongada (al menos 60 minutos por sistema objetivo), registrar FPS reales, uso de RAM/CPU y audio.
- [ ] Comprobar accesibilidad: texto 140 %, reducción de movimiento, avisos, teclado y contraste en jefes.
- [ ] Corregir bloqueantes, ejecutar las suites otra vez, conservar evidencias y generar un nuevo hash SHA-256.

## Registro de incidencias sugerido

Guardar `fecha`, `versión`, `SO/navegador`, `cámara`, `dispositivo`, `pasos`, `esperado`, `observado`, `captura/vídeo`, `gravedad`, `causa`, `corrección` y `prueba de regresión`. No declarar aprobado un caso sin evidencia reproducible.
