# ASHEN PILGRIMAGE 1.0

Juego de acción y exploración dark fantasy para navegador, con estética híbrida de pixel art y grabado medieval.

## Estado

**Versión 1.0 publicada y verificada.**

Incluye:

- Campaña principal con 35 cámaras y siete regiones.
- Tres finales persistentes.
- 23 enemigos con bestiario y animaciones de combate.
- Ocho jefes regionales/finales.
- Guardado automático, tres ranuras manuales y copias JSON.
- Menús, opciones gráficas y de accesibilidad.
- Audio ambiental y efectos configurables.
- Soporte de teclado y compatibilidad con Gamepad API.
- Lanzadores para Windows y Linux.
- Código fuente, recursos gráficos, fuentes artísticas, herramientas y pruebas.
- Despliegue público mediante GitHub Pages.

## Jugar

Windows: doble clic en `JUGAR-WINDOWS.bat`.

Linux:

```bash
chmod +x JUGAR-LINUX.sh
./JUGAR-LINUX.sh
```

Requiere Python 3 y un navegador moderno. Mantén `http://127.0.0.1:8765/` para conservar las partidas del navegador.

## Verificación

```bash
./VERIFICAR-LINUX.sh
```

La verificación publicada incluye 49 suites Node y 145 comprobaciones técnicas. La matriz y las limitaciones están documentadas en `QA-v4.0.md` y `docs/CRITERIOS-LANZAMIENTO-v4.0.md`.

La campaña, los controles y el despliegue se han verificado técnicamente. La compatibilidad física con cada modelo de mando, Windows 11 y Linux Mint concretos depende del equipo del usuario.

## Enlaces

- Juego: https://ivan7800.github.io/ASHEN-PILGRIMAGE/
- Repositorio: https://github.com/ivan7800/ASHEN-PILGRIMAGE
- Historial de publicación: `PUBLICACION-GITHUB.md`
