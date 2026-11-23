# Lanzadores de ASHEN PILGRIMAGE v2.9

## Linux Mint / Ubuntu

En terminal, dentro de esta carpeta:

```bash
chmod +x JUGAR-LINUX.sh
./JUGAR-LINUX.sh
```

También puedes elegir **Ejecutar** al hacer doble clic si tu gestor de archivos lo permite. Necesita Python 3, sin dependencias Python adicionales.

## Windows 10/11

Doble clic en `JUGAR-WINDOWS.bat`. Debes tener Python 3 instalado y disponible mediante `py -3` o `python`. El BAT muestra errores y no reintenta ejecutar otro servidor si el primero falla.

## Acceso y guardados

Ambos lanzadores sirven archivos exclusivamente en la interfaz local de bucle `127.0.0.1` y abren de forma predeterminada **http://127.0.0.1:8765/** en tu navegador. El puerto se mantiene fijo para proteger los guardados de `localStorage`, que pertenecen a un origen HTTP concreto (incluido el puerto).

Si otro proceso utiliza `8765`, el lanzador muestra un error en lugar de cambiar silenciosamente a otro puerto. Cierra el proceso anterior o utiliza un puerto fijo alternativo **siempre el mismo**:

```bash
python3 serve.py --port 8766
```

En Windows, `JUGAR-WINDOWS.bat --port 8766`. En Linux, `./JUGAR-LINUX.sh --port 8766`.

**Nota sobre partidas previas:** las partidas antiguas hechas con versiones de puerto aleatorio no aparecen automáticamente en `:8765`, porque pertenecen a otro origen del navegador. Reabrir la URL/puerto original, si todavía la conoces, puede permitir acceder a esas partidas; no borres el almacenamiento del navegador. Si el navegador borra los datos, la partida puede perderse.

Mantén abierta la terminal mientras juegas. Ctrl+C detiene el servidor. Si no se abre el navegador automáticamente, introduce la URL mostrada en la consola.

Estos lanzadores **no son** binarios `.exe` o `.AppImage`: ejecutan el videojuego HTML5 en el navegador local. No requieren elevar privilegios.
