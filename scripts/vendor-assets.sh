#!/usr/bin/env bash
# Copia font (Inter, Sora) e hls.js da node_modules dentro assets/, cosi' il sito
# non carica nulla da Google Fonts o da CDN esterni.
# Uso: npm install && npm run vendor
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/fonts assets/js/vendor
for fam in inter sora; do
  for sub in latin latin-ext; do
    cp "node_modules/@fontsource-variable/$fam/files/$fam-$sub-wght-normal.woff2" assets/fonts/
  done
done
cp node_modules/hls.js/dist/hls.min.js assets/js/vendor/hls.min.js
echo "Asset locali copiati in assets/fonts e assets/js/vendor"
