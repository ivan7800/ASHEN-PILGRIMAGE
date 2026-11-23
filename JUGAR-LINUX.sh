#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
if ! command -v python3 >/dev/null 2>&1; then
  echo 'ERROR: Se necesita Python 3. Instálalo desde el gestor de paquetes de tu distribución.' >&2
  read -r -p 'Pulsa Intro para salir...' _ || true
  exit 1
fi
exec python3 "$DIR/serve.py" "$@"
