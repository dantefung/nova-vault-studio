/**
 * copy-assets.mjs
 *
 * 把 docs/md 下的静态资源（图片、PDF、视频）复制到 Astro 的 public/ 目录，
 * 使它们在站点上的 URL 与 VitePress 时期完全一致。
 *
 * 为什么不放在 Astro 的 public/ 里直接提交：
 *   - 资源总量约 843 MB，仓库里存两份会让 clone 体积翻倍
 *   - VitePress 时期是构建时从 docs/md 直接产出到 dist，行为一致
 *
 * URL 映射规则（与 docs/md 的目录结构一一对应）：
 *   docs/md/wiki/images/x.png  ->  public/md/wiki/images/x.png   (站点 URL /md/wiki/images/x.png)
 *   docs/md/books/a/b.pdf      ->  public/md/books/a/b.pdf       (站点 URL /md/books/a/b.pdf)
 *
 * 只在缺失或大小不一致时复制，重复构建不会全量重拷。
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'docs/md')
const DEST = path.join(ROOT, 'astro-app/public/md')

const COPY_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif', '.awebp', '.ico',
  '.pdf', '.mp4', '.webm', '.mov', '.mp3', '.wav', '.json', '.txt', '.csv',
])

let copied = 0
let skipped = 0
let bytes = 0

function walk(dir, rel = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    const relPath = rel ? path.join(rel, entry.name) : entry.name
    if (entry.isDirectory()) {
      walk(full, relPath)
      continue
    }
    const ext = path.extname(entry.name).toLowerCase()
    if (!COPY_EXT.has(ext)) continue

    const dest = path.join(DEST, relPath)
    fs.mkdirSync(path.dirname(dest), { recursive: true })

    let stat
    try {
      stat = fs.statSync(dest)
    } catch {
      stat = null
    }
    const srcStat = fs.statSync(full)
    if (stat && stat.size === srcStat.size) {
      skipped++
      continue
    }
    fs.copyFileSync(full, dest)
    copied++
    bytes += srcStat.size
  }
}

if (!fs.existsSync(SRC)) {
  console.error('[copy-assets] 找不到 docs/md，跳过')
  process.exit(1)
}

fs.mkdirSync(DEST, { recursive: true })
walk(SRC)

const mb = (bytes / 1024 / 1024).toFixed(1)
console.log(`[copy-assets] 复制 ${copied} 个文件（${mb} MB），跳过 ${skipped} 个已存在文件`)
