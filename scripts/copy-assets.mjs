/**
 * copy-assets.mjs
 *
 * 把 docs/md 下的静态资源（图片、PDF、视频）复制到站点产物中，
 * 使它们在站点上的 URL 与 VitePress 时期完全一致：
 *
 *   docs/md/wiki/images/x.png  ->  /md/wiki/images/x.png
 *   docs/md/books/a/b.pdf      ->  /md/books/a/b.pdf
 *
 * 两个目标目录（--target）：
 *   public  —— 复制到 astro-app/public/，供 dev server 与静态托管使用
 *   dist    —— 直接写进 astro-app/dist/，构建期一步到位
 *
 * 复制两类内容：
 *   1. docs/md/** 的非 markdown 资源 -> <target>/md/**（站点 URL 前缀 /md/）
 *   2. docs/public/**                -> <target>/**   （站点 URL 根，favicon/slides/robots.txt 等）
 *
 * 为什么构建要走 dist 直写（--target dist）：
 *   走 public/ 会被 Vite 再复制一遍到 dist/，843MB 资源被读写两趟，
 *   构建 I/O 与临时磁盘占用都翻倍。直写 dist 少一整轮拷贝。
 *
 * PDF 策略（--pdf keep | skip）：
 *   keep —— 全部复制（本地预览用，生产不推荐，见下）
 *   skip —— 只复制「被正文以相对路径直接链接」的 PDF，其余跳过
 *
 *   为什么生产可以跳过大部分 PDF：
 *     站内 111 个 PDF 全部通过 <PdfViewer repo-path="..."> 引用，
 *     而 VitePress 时期的生产策略就是走 GitHub Raw（utils/pdf-url.js 的
 *     resolvePdfUrl 在 PROD 分支返回 raw.githubusercontent.com 地址），
 *     本地副本只在 dev 用。
 *
 *     顺带解决 Cloudflare 的硬限制：单文件上限 25 MiB，
 *     站内有两个 PDF 是 32 MiB / 40 MiB，直接部署会被拒绝。
 *
 * 用法：
 *   node scripts/copy-assets.mjs --target public --pdf keep
 *   node scripts/copy-assets.mjs --target dist   --pdf skip
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'docs/md')
const PUBLIC_SRC = path.join(ROOT, 'docs/public')
const ASTRO_DIR = path.join(ROOT, 'astro-app')

const args = process.argv.slice(2)
const getArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}
const hasFlag = (name) => args.includes(`--${name}`)

const TARGET = getArg('target', 'public')
const PDF_MODE = getArg('pdf', TARGET === 'dist' ? 'skip' : 'keep')
const FORCE = hasFlag('force')

if (!['public', 'dist'].includes(TARGET)) {
  console.error(`[copy-assets] --target 只能是 public 或 dist，收到：${TARGET}`)
  process.exit(1)
}
if (!['keep', 'skip'].includes(PDF_MODE)) {
  console.error(`[copy-assets] --pdf 只能是 keep 或 skip，收到：${PDF_MODE}`)
  process.exit(1)
}

const DEST = TARGET === 'dist' ? path.join(ASTRO_DIR, 'dist') : path.join(ASTRO_DIR, 'public')
/** docs/md 的资源落在 md/ 前缀下（站点 URL /md/...） */
const MD_DEST = path.join(DEST, 'md')

const COPY_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif', '.awebp', '.ico',
  '.pdf', '.mp4', '.webm', '.mov', '.mp3', '.wav', '.json', '.txt', '.csv',
])

/**
 * 被正文以相对路径直接链接的 PDF（必须保留在站点产物里）。
 *
 * 判定方式：扫全部 md，找形如 `](xxx.pdf)` 的相对链接并按文件位置解析。
 * 形如 `<PdfViewer repo-path="...">` 的引用不算 —— 生产走 GitHub Raw。
 */
const DIRECT_LINKED_PDFS = new Set()

function collectDirectLinkedPdfs(dir, rel = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    const relPath = rel ? path.join(rel, entry.name) : entry.name
    if (entry.isDirectory()) {
      collectDirectLinkedPdfs(full, relPath)
      continue
    }
    if (!entry.name.endsWith('.md')) continue

    const raw = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n')
    const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '')
    const dirOf = path.dirname(relPath)

    // markdown 链接：](相对路径.pdf)
    for (const m of body.matchAll(/\]\(((?:\.{1,2}\/)?[^)\s#:]*?\.pdf)(#[^)]*)?\)/g)) {
      const target = m[1]
      const segs = `${dirOf}/${target}`.split('/')
      const out = []
      for (const s of segs) {
        if (s === '' || s === '.') continue
        if (s === '..') {
          out.pop()
          continue
        }
        out.push(s)
      }
      DIRECT_LINKED_PDFS.add(out.join('/'))
    }
  }
}

let copied = 0
let skipped = 0
let pdfSkipped = 0
let bytes = 0

function walk(dir, destRoot, rel = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    const relPath = rel ? path.join(rel, entry.name) : entry.name
    if (entry.isDirectory()) {
      walk(full, destRoot, relPath)
      continue
    }

    const ext = path.extname(entry.name).toLowerCase()
    if (!COPY_EXT.has(ext)) continue

    if (ext === '.pdf' && PDF_MODE === 'skip' && !DIRECT_LINKED_PDFS.has(relPath)) {
      pdfSkipped++
      continue
    }

    const dest = path.join(destRoot, relPath)
    fs.mkdirSync(path.dirname(dest), { recursive: true })

    const srcStat = fs.statSync(full)
    let stat = null
    try {
      stat = fs.statSync(dest)
    } catch {
      /* 不存在 */
    }
    if (!FORCE && stat && stat.size === srcStat.size) {
      skipped++
      continue
    }
    fs.copyFileSync(full, dest)
    copied++
    bytes += srcStat.size
  }
}

/** docs/public 的内容原样复制到目标根（favicon / slides / robots.txt 等） */
function copyPublic() {
  if (!fs.existsSync(PUBLIC_SRC)) return
  for (const entry of fs.readdirSync(PUBLIC_SRC, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(PUBLIC_SRC, entry.name)
    const dest = path.join(DEST, entry.name)
    if (entry.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true })
      for (const sub of fs.readdirSync(full, { withFileTypes: true })) {
        const subFull = path.join(full, sub.name)
        const subDest = path.join(dest, sub.name)
        if (sub.isDirectory()) {
          fs.cpSync(subFull, subDest, { recursive: true })
        } else {
          fs.copyFileSync(subFull, subDest)
          copied++
        }
      }
    } else {
      fs.copyFileSync(full, dest)
      copied++
    }
  }
}

if (!fs.existsSync(SRC)) {
  console.error('[copy-assets] 找不到 docs/md，跳过')
  process.exit(1)
}

collectDirectLinkedPdfs(SRC)

if (TARGET === 'dist' && !fs.existsSync(path.join(ASTRO_DIR, 'dist'))) {
  console.error('[copy-assets] dist/ 还不存在（需要在 astro build 之后执行）')
  process.exit(1)
}

fs.mkdirSync(DEST, { recursive: true })
walk(SRC, MD_DEST)
copyPublic()

/**
 * 超过 Cloudflare 单文件上限（25 MiB）的文件会被部署直接拒绝，
 * 这里显式检查并报错，避免到部署阶段才发现。
 */
const LIMIT = 25 * 1024 * 1024
const oversized = []
const scanOversized = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      scanOversized(full)
      continue
    }
    const size = fs.statSync(full).size
    if (size > LIMIT) {
      oversized.push({ path: path.relative(ROOT, full), size })
    }
  }
}
scanOversized(DEST)

const mb = (bytes / 1024 / 1024).toFixed(1)
const pdfNote =
  PDF_MODE === 'skip'
    ? `，跳过 ${pdfSkipped} 个仅经 repo-path 引用（生产走 GitHub Raw）的 PDF`
    : ''
console.log(
  `[copy-assets] target=${TARGET} pdf=${PDF_MODE}：复制 ${copied} 个文件（${mb} MB），跳过 ${skipped} 个已存在文件${pdfNote}`
)
if (DIRECT_LINKED_PDFS.size) {
  // 只统计磁盘上真实存在的（部分直接链接指向的文件本身已缺失，属既有死链）
  const existing = [...DIRECT_LINKED_PDFS].filter((p) => fs.existsSync(path.join(SRC, p)))
  const missing = DIRECT_LINKED_PDFS.size - existing.length
  const note = missing ? `（另有 ${missing} 个链接目标文件本身不存在，属既有死链）` : ''
  console.log(`[copy-assets] 保留 ${existing.length} 个被正文直接链接的 PDF${note}`)
}
if (oversized.length) {
  const list = oversized.map((f) => `  ${(f.size / 1024 / 1024).toFixed(1)} MiB  ${f.path}`).join('\n')
  if (TARGET === 'dist') {
    // dist 是部署产物，超过上限会被 Cloudflare 直接拒绝，必须在本地就拦下
    console.error(`[copy-assets] 以下文件超过 Cloudflare 单文件上限 25 MiB，部署会被拒绝：\n${list}`)
    process.exit(1)
  }
  // dev 的 public/ 保留完整 PDF（含大文件）以便本地预览，不阻断
  console.warn(`[copy-assets] 以下文件超过 25 MiB（仅 dev 本地副本，部署产物不含）：\n${list}`)
}
