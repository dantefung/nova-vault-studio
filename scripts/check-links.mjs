/**
 * check-links.mjs
 *
 * 迁移后的链接完整性检查。
 *
 * 检查两件事：
 *   1. 构建产物内部的站内链接是否都指向真实存在的页面
 *   2. 源文档里的相对 .md 链接是否都解析到了真实文件
 *
 * VitePress 时期配置了 ignoreDeadLinks: true，死链不会报错，
 * 迁移时如果不做全量校验，很容易把既有的坏链接一起带到新站。
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'astro-app/dist')
const CONTENT = path.join(ROOT, 'docs/md')

let errors = 0

/* ── 1. 构建产物内的站内链接 ─────────────────────────────── */

if (!fs.existsSync(DIST)) {
  console.error('[check-links] 找不到 astro-app/dist，请先构建')
  process.exit(1)
}

/** 产物里所有可访问的 URL */
const built = new Set()
const walkDist = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDist(full)
    } else if (entry.name === 'index.html') {
      const rel = '/' + path.relative(DIST, path.dirname(full)).split(path.sep).join('/')
      built.add(rel.replace(/\/$/, '') || '/')
    }
  }
}
walkDist(DIST)

const broken = new Map()
const walkHtml = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkHtml(full)
      continue
    }
    if (!entry.name.endsWith('.html')) continue
    const html = fs.readFileSync(full, 'utf8')
    for (const m of html.matchAll(/href="(\/md\/[^"#?]*)/g)) {
      // href 里的中文是 URL 编码的，解码后再比对
      let href
      try {
        href = decodeURIComponent(m[1])
      } catch {
        href = m[1]
      }
      href = href.replace(/\/$/, '')
      if (!href || href === '/md') continue
      if (!built.has(href)) {
        broken.set(href, (broken.get(href) ?? 0) + 1)
      }
    }
  }
}
walkHtml(path.join(DIST, 'md'))

console.log(`[check-links] 产物页面 ${built.size} 个`)
if (broken.size) {
  errors += broken.size
  console.log(`[check-links] 站内死链 ${broken.size} 个：`)
  const sorted = [...broken.entries()].sort((a, b) => b[1] - a[1])
  for (const [href, count] of sorted.slice(0, 40)) {
    console.log(`  ${href}  (${count} 次)`)
  }
  if (sorted.length > 40) console.log(`  ... 其余 ${sorted.length - 40} 个省略`)
} else {
  console.log('[check-links] 站内链接全部可达')
}

/* ── 2. 源文档的相对 .md 链接 ───────────────────────────── */

const docIds = new Set()
const collect = (dir, rel = '') => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    const relPath = rel ? path.join(rel, entry.name) : entry.name
    if (entry.isDirectory()) collect(full, relPath)
    else if (entry.name.endsWith('.md')) docIds.add(relPath.split(path.sep).join('/').replace(/\.md$/, ''))
  }
}
collect(CONTENT)

const missingRel = new Map()
const checkRel = (dir, rel = '') => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    const relPath = rel ? path.join(rel, entry.name) : entry.name
    if (entry.isDirectory()) {
      checkRel(full, relPath)
      continue
    }
    if (!entry.name.endsWith('.md')) continue

    const raw = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n')
    const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '')
    const dirOf = path.dirname(relPath)

    for (const m of body.matchAll(/\]\((\.{1,2}\/[^)\s]*?\.md)(#[^)]*)?\)/g)) {
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
      const id = out.join('/').replace(/\.md$/, '')
      if (!docIds.has(id) && !docIds.has(`${id}/index`)) {
        missingRel.set(target, (missingRel.get(target) ?? 0) + 1)
      }
    }
  }
}
checkRel(CONTENT)

console.log(`[check-links] 源文档相对 .md 链接缺失目标 ${missingRel.size} 个`)
if (missingRel.size) {
  const sorted = [...missingRel.entries()].sort((a, b) => b[1] - a[1])
  for (const [href, count] of sorted.slice(0, 20)) {
    console.log(`  ${href}  (${count} 次)`)
  }
}

console.log(errors ? `[check-links] 完成，发现 ${errors} 类问题` : '[check-links] 完成，无死链')
process.exit(errors ? 1 : 0)
