# Publicación de ASHEN PILGRIMAGE v4.0 RC en main

Este paquete contiene el **juego completo**, los recursos de ejecución, el arte fuente, los documentos de QA y los lanzadores. El repositorio de destino es <https://github.com/ivan7800/ASHEN-PILGRIMAGE>.

El repositorio se comprobó vacío el 23/11/2026. **No se ha publicado remotamente desde el entorno de ChatGPT**: no tiene conexión Git de salida, y el conector no admite transferir todo este proyecto binario. Los scripts adjuntos sí realizan el `git push` desde tu equipo con tu propia autenticación GitHub.

## Publicación Windows 11

1. Descomprime toda la carpeta `ashen-pilgrimage` en un disco local (evita OneDrive durante el primer push).
2. Instala Git for Windows (<https://git-scm.com/downloads/win>), que incluye Git Credential Manager.
3. Configura tu identidad Git (una sola vez): `git config --global user.name "Tu nombre"` y `git config --global user.email "tu-correo@example.com"`.
4. Ejecuta `PUBLICAR-GITHUB-WINDOWS.bat`. Autoriza el acceso a GitHub cuando Git Credential Manager abra el navegador.
5. Comprueba en el repositorio remoto `index.html`, `game.js`, `assets/`, `art-source/`, `tools/`, `docs/` y los lanzadores.

## Publicación Linux Mint

```bash
sudo apt install git
# Solo si aún no están configurados:
git config --global user.name "Tu nombre"
git config --global user.email "tu-correo@example.com"
chmod +x PUBLICAR-GITHUB-LINUX.sh
./PUBLICAR-GITHUB-LINUX.sh
```

La autenticación HTTPS requiere credenciales de GitHub habilitadas (por ejemplo `gh auth login` y `gh auth setup-git`). GitHub no permite contraseñas de cuenta como credencial Git HTTPS.

## Protección

- Si `main` ya tiene algún commit, el script se detiene en vez de sobrescribirlo.
- No usa `force push`, no reescribe el historial remoto y no altera ningún repositorio existente.
- El primer `git push` crea `main` en un repositorio vacío. Si GitHub introduce commits simultáneamente, el push normal se rechazará.
- No cargues credenciales ni archivos `.env`; están excluidos mediante `.gitignore`.

## Versión

Es la candidata **v4.0 RC**, no una certificación comercial de partida humana completa o hardware real. Ver `QA-v4.0.md` y `docs/CRITERIOS-LANZAMIENTO-v4.0.md`.
