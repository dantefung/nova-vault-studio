/**
 * build-astro-search-index.mjs
 *
 * 生成 astro-app/public/search-index.json：站内搜索索引。
 *
 * 与 VitePress 时期的 minisearch 全量索引相比：
 *   - 只索引 标题 + 摘要 + 首段 + 分类，不索引全文
 *   - 构建期不渲染页面（VitePress 要渲染 3999 篇才能建索引，
 *     这正是 Vercel 构建内存压力大、需要 partial 降级的原因）
 *   - 索引体积小一个数量级，客户端按需加载
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'docs/md')
const OUT_DIR = path.join(ROOT, 'astro-app/public')
const OUT_FILE = path.join(OUT_DIR, 'search-index.json')

/** 分类名（与侧边栏一致） */
const SECTION_LABELS = {
  guide: '指南',
  wiki: '知识库',
  columns: '专栏',
  books: '书籍',
  business: '商业',
  tutorial: '教程',
  agi: 'AGI',
  slides: '幻灯片',
  sitelog: '站点日志',
  blog: '博客',
}

/** 从正文里取一段可读的摘要 */
function extractExcerpt(body) {
  const lines = body.split('\n')
  const out = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      if (out.length) break
      continue
    }
    if (line.startsWith('#')) continue
    if (line.startsWith('```')) continue
    if (line.startsWith('|')) continue
    if (line.startsWith('>')) continue
    if (line.startsWith('![')) continue
    if (line.startsWith('<')) continue
    // 去掉 markdown 行内标记
    const text = line
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`~]/g, '')
      .replace(/\[\[[^\]|]+\]/g, '')
      .trim()
    if (!text) continue
    out.push(text)
    if (out.join(' ').length > 160) break
  }
  return out.join(' ').slice(0, 200)
}

function frontmatterValue(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))
  if (!m) return ''
  return m[1].trim().replace(/^["']|["']$/g, '')
}

const entries = []

function walk(dir, rel = '') {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name.startsWith('.')) continue
    const full = path.join(dir, item.name)
    const relPath = rel ? path.join(rel, item.name) : item.name
    if (item.isDirectory()) {
      walk(full, relPath)
      continue
    }
    if (!item.name.endsWith('.md')) continue

    const raw = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n')
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/)
    const fm = fmMatch ? fmMatch[1] : ''
    const body = fmMatch ? raw.slice(fmMatch[0].length) : raw

    const id = relPath.split(path.sep).join('/').replace(/\.md$/, '')
    const section = id.split('/')[0] ?? ''

    // 目录页（index.md）不入索引，避免搜到一堆空壳
    if (/(^|\/)index$/.test(id)) continue

    const title =
      frontmatterValue(fm, 'title') ||
      body.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
      id.split('/').pop() ||
      id

    const url = `/md/${id.replace(/\/index$/, '')}`
    const desc =
      frontmatterValue(fm, 'description') || extractExcerpt(body)

    entries.push({
      t: title,
      u: url,
      d: desc,
      c: SECTION_LABELS[section] ?? section,
    })
  }
}

walk(SRC)

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(entries), 'utf8')

const size = (fs.statSync(OUT_FILE).size / 1024).toFixed(0)
console.log(`[build-astro-search-index] ${entries.length} 条索引，${size} KB -> ${path.relative(ROOT, OUT_FILE)}`)
