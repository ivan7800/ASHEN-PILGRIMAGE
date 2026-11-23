#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
REPO='https://github.com/ivan7800/ASHEN-PILGRIMAGE.git'
echo 'ASHEN PILGRIMAGE — Publicación segura en main'
command -v git >/dev/null || { echo 'ERROR: instala Git antes de publicar.' >&2; exit 1; }
if [[ -d .git ]]; then
  echo 'ERROR: esta carpeta ya contiene un repositorio Git. Revisa los cambios antes de publicar.' >&2
  exit 1
fi
if [[ -z "$(git config --global user.name || true)" || -z "$(git config --global user.email || true)" ]]; then
  echo 'ERROR: configura tu identidad Git primero:' >&2
  echo 'git config --global user.name "Tu nombre"' >&2
  echo 'git config --global user.email "tu-correo@example.com"' >&2
  exit 1
fi
# Requiere autenticación HTTPS con permisos de escritura; Git Credential Manager o gh auth login.
echo 'Comprobando acceso y que main no contiene trabajo previo...'
heads="$(git ls-remote --heads "$REPO" refs/heads/main)" || { echo 'ERROR: GitHub no accesible o autenticación fallida.' >&2; exit 1; }
if [[ -n "$heads" ]]; then
  echo 'BLOQUEADO: main ya contiene commits. No se sobrescribirá ni se hará force push.' >&2
  exit 1
fi
# El repositorio debe seguir vacío cuando se hace el push. Si otro actor lo inicializa, Git rechazará la operación.
git init -b main
git remote add origin "$REPO"
git add -A
git diff --cached --check
git commit -m 'feat: import ASHEN PILGRIMAGE v4.0 RC complete source, assets and QA'
git push -u origin main
printf '\nPUBLICADO. Comprobar: https://github.com/ivan7800/ASHEN-PILGRIMAGE/tree/main\n'
