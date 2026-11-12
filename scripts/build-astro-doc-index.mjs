/**
 * build-astro-doc-index.mjs
 *
 * 生成 astro-app/src/generated/doc-index.json：全站文档路径清单。
 *
 * 用途：wikilink 解析。
 * 站内有 4000+ 处 `[[concepts/xxx]]` 形式的 wikilink，其中一部分指向
 * 不存在的文件（历史上遗留）。构建时如果不做存在性判断，这些链接会变成死链。
 *
 * 判定规则：
 *   - 目标存在 -> 渲染成站内链接
 *   - 目标不存在 -> 保留为纯文本（与 VitePress 时期行为一致，
 *     VitePress 不支持 wikilink，原样显示 [[xxx]]）
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'docs/md')
const OUT_DIR = path.join(ROOT, 'astro-app/src/generated')
const OUT_FILE = path.join(OUT_DIR, 'doc-index.json')

/** 全部文档的 id（相对 docs/md，不含扩展名） */
const ids = new Set()

function walk(dir, rel = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    const relPath = rel ? path.join(rel, entry.name) : entry.name
    if (entry.isDirectory()) {
      walk(full, relPath)
    } else if (entry.name.endsWith('.md')) {
      ids.add(relPath.split(path.sep).join('/').replace(/\.md$/, ''))
    }
  }
}

walk(SRC)

const payload = { ids: Array.from(ids).sort() }
fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(payload), 'utf8')

console.log(`[build-astro-doc-index] ${payload.ids.length} 篇文档 -> ${path.relative(ROOT, OUT_FILE)}`)
