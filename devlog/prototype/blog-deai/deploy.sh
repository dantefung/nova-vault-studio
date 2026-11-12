#!/bin/bash
# Blog 去AI味原型 · Vercel 部署脚本
# 用法: VERCEL_TOKEN=<token> ./deploy.sh
# 或者: source ~/.bashrc && ./deploy.sh (如果 VERCEL_TOKEN 已在环境变量中)

set -euo pipefail

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "❌ VERCEL_TOKEN 环境变量未设置"
  echo "用法: VERCEL_TOKEN=<token> $0"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 部署 Blog 去AI味原型到 Vercel ..."
cd "$SCRIPT_DIR"

vercel deploy \
  --token "$VERCEL_TOKEN" \
  --prod \
  --yes

echo "✅ 部署完成"
echo "🌐 https://blog-deai.vercel.app"