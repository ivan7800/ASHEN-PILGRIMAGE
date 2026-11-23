# Audio, interfaz y mando — Guía v3.5

## Sonido

Entrar en **Opciones → Sonido: activado** para iniciar Web Audio, o pulsar el botón «Audio». Los canales comienzan silenciados hasta que el usuario los habilita. Ajustes disponibles: General (multiplica todo), Ambiente musical (paisaje sonoro sintetizado por región) y Efectos (espadas, avisos de jefes, curación y señales de puzles). Cada volumen avanza en pasos de 25 puntos y cicla desde 100 a 0. Al apagar el audio el mezclador se silencia inmediatamente; no requiere descargas de música ni conexión.

## Accesibilidad y menús

- **Avisos visuales de sonido:** superposición temporal en el borde inferior cuando se anuncia un ataque, un recuerdo erróneo, un cambio de fase o una victoria. Funciona incluso con sonido apagado. Se puede desactivar.
- **Texto del menú:** 100, 120 o 140 %. El menú es desplazable con ventana pequeña o a mayor escala. No cambia el texto del HUD dibujado dentro del Canvas.
- **Reducir movimiento:** elimina la sacudida de cámara, reduce destellos/partículas y simplifica el seguimiento de cámara. No elimina todos los movimientos ambientales.
- **Gráficos:** Cinematográfico, Legibilidad alta o Rendimiento (heredados de v3.2).
- **Teclado en menús:** Tab, flechas arriba/abajo, Inicio, Fin, Enter y Esc. Cuando un botón se selecciona por teclado o mando, el enfoque visible acompaña al elemento.
- **Pantalla completa:** solicita fullscreen al navegador. Puede rechazarse por permisos, contexto de incrustación o políticas. Esc sale del modo.
- **Mando estándar:** cruceta/stick para desplazamiento, A confirmar/saltar, B volver/esquivar, X atacar, Y interactuar, Start pausa, Select autoguardar, LB inventario, LT mapa. Al desconectar, el juego pausa y muestra un aviso; no borra partidas.

## Guardado y compatibilidad

Los ajustes nuevos se almacenan bajo la clave local `ashen-pilgrimage-presentation-v35`. Se aplican en cada inicio y **no modifican el esquema de partidas**, el autoguardado ni las copias JSON. Un navegador nuevo utiliza valores por defecto y el audio permanece desactivado hasta que se habilite.

## Qué falta para una versión final

Pruebas de experiencia con mando real, lectores de pantalla, subtitulado narrativo completo, música más elaborada por zona, latencia y mezcla de audio en altavoces/auriculares, y verificación del recorrido completo en Windows 11/Linux Mint.
