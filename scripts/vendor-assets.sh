#!/usr/bin/env bash
# Copia i font (Inter, Sora) da node_modules dentro assets/, cosi' il sito
# non carica nulla da Google Fonts o da CDN esterni.
# Uso: npm install && npm run vendor
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/fonts
for fam in inter sora; do
  for sub in latin latin-ext; do
    cp "node_modules/@fontsource-variable/$fam/files/$fam-$sub-wght-normal.woff2" assets/fonts/
  done
done
echo "Font locali copiati in assets/fonts"
