# Plan de prueba manual — ASHEN PILGRIMAGE v3.3

## Preparación (Windows 11 o Linux Mint)

1. Descomprime el ZIP en una carpeta nueva. No sustituyas tu instalación habitual antes de exportar una copia JSON.
2. Inicia con `JUGAR-WINDOWS.bat` (Windows) o `chmod +x JUGAR-LINUX.sh && ./JUGAR-LINUX.sh` (Linux); requiere Python 3 y un navegador moderno.
3. Comprueba en `http://127.0.0.1:8765/` que aparecen menú y **Opciones → Dificultad: Normal**.
4. Exporta las partidas JSON desde el menú; verifica que el fichero exista y se pueda importar después de confirmarlo.
5. Para repetir jefes concretos, guarda en una ranura manual junto a la hoguera previa a cada jefe. No utilices guardados manipulados como evidencia de completar la campaña.

## Matriz de combatibilidad de jefes

| Jefe | Región | Prueba manual imprescindible |
|---|---|---|
| Guardián de la Fosa | Prólogo | Fase 2: advertencia direccional 0,60 s, esquiva detrás, sin golpe hacia atrás |
| Rey de las Nueve Exequias | Valdren | Dos fases; banda de ataque y embestida; pausa durante aviso |
| Madre de los Mil Nombres | Bosque | Fase 2: advertencia direccional, proyectiles y animación legible |
| Archivero Ciego | Ossara | Distancia de los ataques, fase 2, puertas selladas y recompensa |
| Novia del Abismo | Salmuera | Ataques y oxígeno bajo el agua; cambios de marea |
| Jardinero de Carne | Raíces Eternas | Esquiva, espinas, daño al saltar sobre trampas |
| Gigante que Escucha | Cumbres | Martillazo y onda de choque evitable mediante salto |
| Primer Testigo | Trono del Sol Muerto | Onda solar, dos fases, última decisión y créditos |

## Sesión de equilibrio (30 minutos por dificultad y dispositivo)

- Registra nivel, equipo, teclado o mando, modo, 3 intentos por jefe, golpes recibidos, esquivas fallidas, número de ampollas y duración del combate.
- Comprueba **Peregrino → Normal → Penitencia** y que el selector responde desde el menú principal y el de pausa. Una misma fuente de 30 de daño debe quitar 23, 30 y 38 PV respectivamente (si no hay invulnerabilidad temporal).
- Comprueba que los golpes comunes exponen una advertencia antes de ejecutar el daño; si el personaje cruza detrás durante la preparación, el ataque direccional no debe dañarlo por la espalda.
- Ataque encadenado: tres golpes, costes existentes de 18/21/29 de resistencia y tiempos de recuperación 0,30/0,35/0,50 s.
- Esquiva: prueba coste, duración de invulnerabilidad, interacción con ataque y regeneración de resistencia.
- Repite al menos un combate con `Opciones → Gráficos → Legibilidad alta`; la UI y las franjas de peligro deben poder leerse en todas las regiones.
- Con mando estándar: A salto, X ataque, B esquiva, Y interacción, Start pausa y navegación de opciones. Desconecta/reconecta en el menú.
- Cierra el navegador, vuelve a abrir desde el lanzador y carga la ranura; la dificultad debería conservarse en ese mismo origen, pero podrá volver a Normal si importas las partidas en otro equipo.

**Criterio de salida:** ninguna puerta bloqueada sin explicación, ningún daño cuerpo a cuerpo desde detrás fuera de solape, cero pérdida de guardados, y patrones visibles antes del daño. Para declarar un equilibrio jugable satisfactorio faltan pruebas humanas; las suites automatizadas no lo sustituyen.
