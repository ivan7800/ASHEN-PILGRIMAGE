# ASHEN PILGRIMAGE v3.7 · Guía de los 23 enemigos

**Total de encuentros:** 73. **Sustituciones de diseño/comportamiento:** 23. Los ocho jefes no cambian de índice.

| Nº | Enemigo | Región | Índice interno | Rol | Característica |
|---:|---|---|---:|---|---|
| 1 | Peregrino Corrompido | Criptas | 0 | Espadachín en duelo | Cuerpo a cuerpo |
| 2 | Guardia de Vespera | Valdren | 10 | Escudo frontal | Escudo frontal |
| 3 | Fanático del Sol | Heliófago | 65 | Invocador solar | Proyectil, Agota resistencia |
| 4 | Carroñero de Cripta | Criptas | 2 | Emboscada veloz | Embestida |
| 5 | Perro de Ceniza | Criptas | 5 | Carga en carrera | Embestida |
| 6 | Espectro Lamentoso | Criptas | 7 | Proyectiles espectrales | Proyectil, Agota resistencia |
| 7 | Monje Degollado | Ossara | 26 | Verdugo de alcance largo | Cuerpo a cuerpo |
| 8 | Verme de la Salmuera | Salmuera | 35 | Escupe sal abisal | Proyectil |
| 9 | Ahogado sin Nombre | Salmuera | 37 | Hostigador húmedo | Cuerpo a cuerpo |
| 10 | Sirena Putrefacta | Salmuera | 40 | Canto agotador | Proyectil, Agota resistencia |
| 11 | Náufrago Encadenado | Salmuera | 34 | Golpe pesado de ancla | Agota resistencia |
| 12 | Esporador Fúngico | Brezaluna | 18 | Esporas a distancia | Proyectil, Agota resistencia |
| 13 | Plaga de la Costra | Brezaluna | 19 | Enjambre acosador | Embestida |
| 14 | Matriarca de Esporas | Brezaluna | 23 | Esporas lentas y tenaces | Armadura, Proyectil, Agota resistencia |
| 15 | Gólem de Sal | Salmuera | 39 | Coloso acorazado | Armadura |
| 16 | Cuervo del Abismo | Cumbres | 58 | Hostigador aéreo | Proyectil |
| 17 | Vigía de Ruina | Ossara | 28 | Centinela inamovible | Escudo frontal |
| 18 | Heraldo del Vacío | Heliófago | 68 | Rito de largo alcance | Proyectil, Agota resistencia |
| 19 | Abominación de las Sigilas | Hojaclara | 47 | Monstruo pesado | Armadura |
| 20 | El Desfigurado | Cumbres | 60 | Bruto aplastante | Armadura, Agota resistencia |
| 21 | Tejedor de Sueños | Ossara | 29 | Hechicería agotadora | Proyectil, Agota resistencia |
| 22 | Corruptor de Nombres | Ossara | 30 | Magia de olvido | Proyectil, Agota resistencia |
| 23 | La Carne Devota | Heliófago | 70 | Horror devorador | Armadura, Agota resistencia |

## Dirección artística

La lámina original se ha convertido a atlas de 20 celdas. Se han creado animaciones de recorte mediante transformaciones de una ilustración fuente; no son ciclos esqueléticos dibujados a mano. El mundo mantiene los fondos de v3.6. La legibilidad se ha comprobado con ocho capturas de Chromium.

## Compatibilidad

Los guardados de 9, 12, 17, 21, 24, 26, 32, 36, 44, 53, 57, 64 y 73 posiciones siguen validados. Cada posición antigua conserva su HP/alive al cargar, pero recibe el nuevo tipo si es una de las 23 sustituidas. Los jefes permanecen en las posiciones 8, 16, 21, 31, 43, 52, 63 y 72. Se recomienda exportar JSON antes de actualizar.
