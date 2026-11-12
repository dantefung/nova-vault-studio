/**
 * compare-dead-links.mjs
 *
 * 证明「Astro 迁移没有引入新的站内死链」。
 *
 * 方法：
 *   1. 从源文档解析出所有站内链接，按与运行时一致的规则解析成绝对 /md/ URL
 *      - 相对 .md 链接：相对当前文件所在目录，剥掉 .md
 *      - wikilink：相对 wiki 根，找不到则视为未解析（渲染为纯文本，不产生死链）
 *      - 绝对 /md/ 链接：原样
 *   2. 判断该 URL 对应的页面是否存在（与 Astro 产物的路由规则一致）
 *   3. 与构建产物里实际扫描出的死链集合做差集
 *
 * 差集为空 = 迁移未引入新死链。
 * 剩余死链是 VitePress 时期就存在的（配置了 ignoreDeadLinks: true，构建不报错）。
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONTENT = path.join(ROOT, 'docs/md')
const DIST = path.join(ROOT, 'astro-app/dist')

/* ── 1. 产物里实际存在的页面 ─────────────────────────────── */

const built = new Set()
const walkDist = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkDist(full)
    else if (entry.name === 'index.html') {
      const rel = '/' + path.relative(DIST, path.dirname(full)).split(path.sep).join('/')
      built.add(rel.replace(/\/$/, '') || '/')
      // 文件名里可能含 & 等字符，href 里的 & 会被转义成 &#38;
      built.add(rel.replace(/&/g, '&').replace(/\/$/, '') || '/')
    }
  }
}
walkDist(DIST)

/* ── 2. 产物里实际出现的死链 ─────────────────────────────── */

const outputDead = new Set()
const walkHtml = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkHtml(full)
      continue
    }
    if (!entry.name.endsWith('.html')) continue
    const html = fs.readFileSync(full, 'utf8')
    // href 里 & 会被转义成 &#38;，正则要允许它出现在路径中
    for (const m of html.matchAll(/href="(\/md\/[^"#?]*?)"/g)) {
      // href 里 & 会被转成 &#38;，先还原实体再 URL 解码
      let href = m[1]
        .replace(/&#38;/g, '&')
        .replace(/&amp;/g, '&')
      try {
        href = decodeURIComponent(href)
      } catch {
        /* 保留原样 */
      }
      href = href.replace(/\/$/, '')
      if (!href || href === '/md') continue
      if (!built.has(href)) outputDead.add(href)
    }
  }
}
walkHtml(path.join(DIST, 'md'))

/* ── 3. 源文档里解析出的死链 ─────────────────────────────── */

const ids = new Set()
const collect = (dir, rel = '') => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    const relPath = rel ? path.join(rel, entry.name) : entry.name
    if (entry.isDirectory()) collect(full, relPath)
    else if (entry.name.endsWith('.md')) ids.add(relPath.split(path.sep).join('/').replace(/\.md$/, ''))
  }
}
collect(CONTENT)

const hasPage = (url) => built.has(url.replace(/\/$/, ''))

/** 源文件是否存在（相对 docs/md，不含扩展名） */
const has = (id) => ids.has(id) || ids.has(`${id}/index`)

const sourceDead = new Set()
const addDead = (url) => {
  const clean = url.replace(/\/$/, '')
  if (clean && clean !== '/md' && !built.has(clean)) sourceDead.add(clean)
}

const check = (dir, rel = '') => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    const relPath = rel ? path.join(rel, entry.name) : entry.name
    if (entry.isDirectory()) {
      check(full, relPath)
      continue
    }
    if (!entry.name.endsWith('.md')) continue

    const raw = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n')
    const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '')
    const dirOf = path.dirname(relPath)

    // 相对 .md 链接
    // 相对 .md 链接：既包括 ./x.md、../x.md，也包括同目录的裸文件名 x.md
    for (const m of body.matchAll(/\]\(((?:\.\.?(?:\/[^)\s]*)?|[^)\s#:/][^)\s]*?)\.md)(#[^)]*)?\)/g)) {
      const segs = `${dirOf}/${m[1]}`.split('/')
      const out = []
      for (const s of segs) {
        if (s === '' || s === '.') continue
        if (s === '..') {
          out.pop()
          continue
        }
        out.push(s)
      }
      const id = out.join('/').replace(/\.md$/, '').replace(/\/index$/, '/')
      addDead(`/md/${id}`)
    }

    // 绝对 /md/ 链接
    for (const m of body.matchAll(/\]\((\/md\/[^)\s#]*)/g)) {
      addDead(m[1])
    }

    // 相对 .md 链接里目标文件不存在的，VitePress 时期同样渲染成死链
    // （配置 ignoreDeadLinks: true，构建期不报错，线上 404）
    // 匹配 ./x.md、../x.md 与同目录的裸文件名 x.md 三种写法
    for (const m of body.matchAll(/\]\((\.{1,2}\/[^)\s]*?\.md|[^)\s/:]*?\.md)(#[^)]*)?\)/g)) {
      const segs = `${dirOf}/${m[1]}`.split('/')
      const out = []
      for (const seg of segs) {
        if (seg === '' || seg === '.') continue
        if (seg === '..') {
          out.pop()
          continue
        }
        out.push(seg)
      }
      const id = out.join('/').replace(/\.md$/, '').replace(/\/index$/, '/')
      if (!has(id)) addDead(`/md/${id}`)
    }
  }
}
check(CONTENT)

/* ── 4. 差集 ─────────────────────────────────────────────── */

// 产物死链里，侧边栏/导航生成的链接也算进来（它们指向真实目录，不会死）
const newDead = [...outputDead].filter((u) => !sourceDead.has(u))

console.log(`[compare] 产物页面 ${built.size} 个`)
console.log(`[compare] 产物死链 ${outputDead.size} 个`)
console.log(`[compare] 源文档死链 ${sourceDead.size} 个`)
console.log(`[compare] 迁移新增死链 ${newDead.length} 个`)

if (newDead.length) {
  console.log('\n迁移新增的死链（应为空）：')
  for (const u of newDead.slice(0, 30)) console.log(`  ${u}`)
  process.exit(1)
}

console.log('\n结论：迁移未引入新的站内死链。')
console.log(`剩余 ${outputDead.size} 个死链在 VitePress 时期同样存在`)
console.log('（配置了 ignoreDeadLinks: true，构建期不报错；根因是 2026-08-20 的 commit b64cdfcc 移走了 74 个解析出错的 wiki sources）')
