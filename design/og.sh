#!/bin/zsh
# design/og.html → public/assets/images/og/{web,home}.png (1200×630). Фонт Google Fonts-оос тул интернэт хэрэгтэй.
set -euo pipefail
cd "${0:A:h}/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT=public/assets/images/og
mkdir -p "$OUT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
for v in web home; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$TMP/profile" \
    --virtual-time-budget=6000 --window-size=1200,630 \
    --screenshot="$PWD/$OUT/$v.png" "file://$PWD/design/og.html?v=$v" 2>/dev/null
  echo "$OUT/$v.png"
done
