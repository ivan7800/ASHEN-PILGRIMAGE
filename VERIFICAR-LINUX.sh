#!/usr/bin/env bash
# Comprobaciones automatizadas; NO equivale a probar con mando ni completar la campaña.
set -euo pipefail
DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"
if ! command -v python3 >/dev/null 2>&1; then echo 'ERROR: se requiere Python 3 para los chequeos.' >&2;exit 1;fi
if ! command -v node >/dev/null 2>&1; then echo 'ERROR: Node.js 18+ es necesario para las suites de QA, pero no para jugar.' >&2;exit 1;fi
echo 'ASHEN PILGRIMAGE | QA automatizada'
for file in test-*.mjs; do node "$file" || exit 1; done
python3 tools/qa-v36-preflight.py
echo 'OK v4.0 RC. Pendiente: campana humana, Windows 11, Linux Mint y mando fisico.'
