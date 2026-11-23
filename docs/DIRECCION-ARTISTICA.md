# ASHEN PILGRIMAGE — Personajes v1.3

**Dirección:** híbrido Gothic Pilgrim + Engraved Night.

El archivo `CONCEPTO-PIXEL-ART.png` es una **ilustración de referencia**, no un atlas recortable ni una captura de partida.

## Implementación jugable

- Siete PNG independientes con fondo transparente.
- Cada atlas tiene doce celdas consecutivas de 128 × 160 px, generadas desde una retícula base 64 × 80 y ampliadas sin interpolación.
- El código del juego dibuja mediante `drawImage`, sin suavizado, y conserva hitboxes anteriores.
- El protagonista tiene cuatro poses de andar, dos de respirar, una de salto, una de esquiva y cuatro de ataque.
- Los enemigos comparten la convención de cuadros para anticipación, ataque y daño.
- Maera, Ser Caldris y Santa Sin Rostro son encuentros narrativos; la Santa se presenta solo durante Desvelo.

## Limitaciones reconocidas

El arte actual es pixel art sintético detallado, no ilustración rotoscopiada ni sprites hechos a mano fotograma por fotograma. Los NPC todavía no tienen árboles de diálogo ni misiones propias. La pantalla de menú sigue el diseño anterior. Faltan pruebas completas de partida y verificación física del mando.
