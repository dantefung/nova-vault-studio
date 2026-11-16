/**
 * clean-public.mjs
 *
 * 清理 astro-app/public/。
 *
 * 为什么构建前必须清：
 *   Astro 会把 public/ 原样复制到 dist/。dev 阶段为了本地预览会把
 *   843MB 资源（含全部 PDF）复制进 public/，如果构建前不清，
 *   这些文件会被 Astro 原样带进部署产物 —— 既有重复占空间，
 *   又会把两个超过 Cloudflare 25 MiB 上限的 PDF 带进去，
 *   导致部署被直接拒绝。
 *
 *   构建期的静态资源由 integrations/copy-md-assets.mjs 在
 *   astro:build:done 阶段直写 dist/，不经过 public/。
 *
 * 清完之后由 build-astro-search-index.mjs 重新写入 public/search-index.json，
 * 这是唯一需要留在 public/ 的文件（客户端搜索要用）。
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'astro-app/public')

fs.rmSync(PUBLIC_DIR, { recursive: true, force: true })
fs.mkdirSync(PUBLIC_DIR, { recursive: true })

console.log('[clean-public] 已清空 astro-app/public/（构建期静态资源直写 dist/）')
