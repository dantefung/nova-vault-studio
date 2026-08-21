#!/usr/bin/env bash
# Cloudflare 部署脚本
# 解决 Next.js 15 standalone 输出到奇怪路径（.next/standalone/<absolute>/.next/）
# 与 OpenNext 假设的 (.next/standalone/.next/) 不匹配的问题
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> 1. Build Next.js (standalone mode)"
npm run build 2>&1 | tail -20

echo ""
echo "==> 2. Locate real pages-manifest.json (any depth)"
REAL_MANIFEST=$(find .next/standalone -name "pages-manifest.json" -path "*/server/*" | head -1)
if [ -z "$REAL_MANIFEST" ]; then
  echo "ERROR: pages-manifest.json not found anywhere in .next/standalone"
  exit 1
fi
echo "Found: $REAL_MANIFEST"

echo ""
echo "==> 3. Symlink to OpenNext expected path"
EXPECTED_DIR=".next/standalone/.next/server"
EXPECTED_FILE="$EXPECTED_DIR/pages-manifest.json"
mkdir -p "$EXPECTED_DIR"
rm -f "$EXPECTED_FILE"
REAL_DIR=$(dirname "$REAL_MANIFEST")
ln -s "$(realpath "$REAL_MANIFEST")" "$EXPECTED_FILE"
echo "Linked: $EXPECTED_FILE -> $(realpath "$REAL_MANIFEST")"

echo ""
echo "==> 4. OpenNext build (Cloudflare Workers bundle)"
npx opennextjs-cloudflare build 2>&1 | tail -20

echo ""
echo "==> 5. Verify .open-next/ output"
ls -la .open-next/ 2>&1 | head -10
echo ""
echo "Build complete! Run 'npx opennextjs-cloudflare deploy' to push to Cloudflare"
