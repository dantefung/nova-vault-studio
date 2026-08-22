#!/usr/bin/env bash
# Post-build: 把 out/pmaker/{learn,patterns,basics}/ 移到 out/{learn,patterns,basics}/
# 因为 output:'export' 不支持 rewrites，URL 路径直接是 file path
set -euo pipefail

cd "$(dirname "$0")/.."

OUT="out"
if [ ! -d "$OUT/pmaker" ]; then
  echo "out/pmaker not found, skip"
  exit 0
fi

for cat in learn patterns basics; do
  if [ -d "$OUT/pmaker/$cat" ]; then
    mkdir -p "$OUT/$cat"
    cp -r "$OUT/pmaker/$cat/." "$OUT/$cat/"
    echo "  Moved $OUT/pmaker/$cat → $OUT/$cat/"
  fi
done

echo "Done. URLs now map directly: /learn/xxx, /patterns/xxx, /basics/xxx"