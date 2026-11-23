# Guía de animación y lectura de ataques · v3.8

Los 23 enemigos se agrupan en siete familias de presentación. La especie conserva su índice, PV, perfil de combate y zona de v3.7; **familia visual** y **IA de especie** son conceptos independientes.

| Familia visual | Enemigos | Aviso visible | Qué observar al esquivar |
|---|---|---|---|
| Espada | Peregrino Corrompido, Monje Degollado, Ahogado sin Nombre | Arco de corte | Ataque frontal, evita el frente |
| Escudo | Guardia de Vespera, Vigía de Ruina | Contorno defensivo | Castiga por la espalda, donde no se aplica reducción frontal |
| Cazador | Carroñero de Cripta, Perro de Ceniza, Plaga de la Costra | Flecha rasante | Embestida recta; salir de la trayectoria |
| Aparición | Espectro Lamentoso, Cuervo del Abismo | Tres líneas etéreas | Proyectil de trayectoria horizontal |
| Ritual | Fanático del Sol, Sirena Putrefacta, Esporador Fúngico, Matriarca de Esporas, Heraldo del Vacío, Tejedor de Sueños, Corruptor de Nombres | Sello circular de magia | Proyectil y, en varios casos, drenaje de resistencia |
| Leviatán | Verme de la Salmuera, Abominación de las Sigilas, La Carne Devota | Marca de embocadura | Avance, ataque de zona o embestida próxima según la especie |
| Bruto | Náufrago Encadenado, Gólem de Sal, El Desfigurado | Golpe vertical hacia el suelo | Evita el alcance corto y la armadura del enemigo |

### Cómo valorar el resultado

1. Abre el juego y entra en una partida, accede al menú **Bestiario · 23 criaturas** y comprueba los nombres y zonas.
2. En cada región deja preparar un ataque a un enemigo nuevo: la **figura del telegráfico debe corresponder a su familia**, sin tapar completamente la silueta.
3. Verifica al menos un enemigo de escudo, uno a distancia y uno de embestida con las dificultades Normal y Penitencia.
4. Comprueba los tres ajustes gráficos y la opción **Reducir movimiento**: los ataques siguen siendo comprensibles sin sacudidas ni partículas.
5. Exporta una copia JSON, cierra el juego, vuelve a abrirlo e importa el guardado en una instancia de pruebas; ni los 23 índices ni los progresos deben perderse.

Los dibujos de la v3.8 son pixel art basado en **cut-out por regiones** y efectos propios, no sustitutos de animación tradicional cuadro a cuadro. Las imágenes `VISTA-REAL-ANIMACIONES-v3.8.jpg` y `BESTIARIO-ANIMACION-v3.8.jpg` muestran, respectivamente, capturas del juego real y las celdas de los atlas.
