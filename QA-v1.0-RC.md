# QA v1.0 RC — El Último Umbral

## Evidencia local

Ejecutados con Node.js en la carpeta del juego:

```bash
node test-runtime.mjs
node test-v06.mjs
node test-v07.mjs
node test-v08.mjs
node test-v09.mjs
node test-v10.mjs
```

Además: `node --check *.js` (ejecutar individualmente), `bash -n JUGAR-LINUX.sh`, `python3 -m py_compile serve.py`, `unzip -t`.

## Pendientes explícitos

- Probar final del capítulo, derrota y resurrección en Chrome/Firefox real.
- Verificar que las ilustraciones y las partículas permanecen legibles en tamaños de pantalla y escalados diferentes.
- Validar gamepad real y arranque con doble clic en Windows 11 y Linux Mint.
- Probar si aparecen artefactos visuales o problemas de rendimiento después de sesiones largas.
- Mejorar hitboxes sincronizadas con fotogramas: los daños del jugador siguen aplicándose al iniciar el golpe; los enemigos siguen golpeando al finalizar su telegráfico.

## Limitaciones

Los efectos de muerte no constituyen animaciones profesionales por fotogramas. No se ha publicado en GitHub.
