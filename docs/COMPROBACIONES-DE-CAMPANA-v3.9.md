# Matriz técnica de progresión — v3.9

**Método:** inspección de reglas puras y llamadas del motor. Los 35 sectores se cubren por sus límites en `chambers.js`; los requisitos de salida están en `campaign-progression-v39.js`. La matriz verifica condiciones de puertas, **no** el recorrido continuo por un humano.

| Tramo | Requisito probado | Casos críticos |
| --- | --- | --- |
| Criptas → Valdren | Guardián derrotado y capítulo cerrado | sin derrotar al Guardián, bloqueo |
| Valdren → Bosque | badajo, promesa, Rey derrotado | sin promesa, bloqueo |
| Brezaluna → Ossara | memoria y tres ecos, Madre derrotada | memoria incompleta, bloqueo |
| Ossara → Salmuera | fragmento, epitafios **1→0→2**, Archivero derrotado | orden incorrecto, bloqueo |
| Salmuera → Raíces | Marín, mareas baja→alta→baja y ecos 0→1→2, Novia derrotada | mareas y ecos incorrectos, bloqueo |
| Hojaclara → Cumbres | Liria, tres injertos, Jardinero derrotado | rito incompleto, bloqueo |
| Cumbres → Trono | Elda, tres resonadores, Gigante derrotado | puentes y santuario cerrados |
| Trono → Primer Testigo | Santa, sellos **0→1→2**, las seis brasas | falta un sello o una brasa, bloqueo |
| Tres epílogos | liberar / custodiar / extinguir | escritura y lectura desde título |

Las puertas de vuelta a la cámara anterior no exigen repetir jefes. La entrada a una cámara superior sí conserva sus restricciones. Las salidas solo se activan con el jugador en el suelo. Los guardados mantienen los **73 índices de enemigos**, ocho jefes y el formato anterior.

## Plan de aceptación humana

Usar `docs/CRITERIOS-LANZAMIENTO-v3.6.md` como checklist no rellenado. Conservar vídeo/captura, versión, sistema, cámara, tiempo, enemigo, condición de historia y resultado. Marcar una casilla solo tras una comprobación real en ese escenario.
