/**
 * check-links-baseline.mjs
 *
 * 对比「VitePress 时期」与「Astro 时期」的站内死链数量，
 * 证明迁移没有引入新的死链。
 *
 * VitePress 时期的死链来源：
 *   1. 配置里 ignoreDeadLinks: true，构建期不报错，死链留在线上
 *   2. 2026-08-20 的 commit b64cdfcc 把 74 个解析出错的 wiki sources 移出 docs/md，
 *      正文里指向它们的链接就变成了死链
 *
 * 本脚本直接扫源文档的相对 .md 链接与 wikilink，
 * 用「文件是否存在」判定死链，与运行时行为一致。
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONTENT = path.join(ROOT, 'docs/md')

/** 全站文档 id（相对 docs/md，不含扩展名） */
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

const has = (id) => ids.has(id) || ids.has(`${id}/index`)

const deadLinks = new Map()
let total = 0

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
    for (const m of body.matchAll(/\]\((\.{1,2}\/[^)\s]*?\.md)(#[^)]*)?\)/g)) {
      total++
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
      const id = out.join('/').replace(/\.md$/, '')
      if (!has(id)) deadLinks.set(m[1], (deadLinks.get(m[1]) ?? 0) + 1)
    }

    // wikilink
    for (const m of body.matchAll(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g)) {
      const raw2 = m[1].trim().replace(/\.md$/, '')
      if (!raw2 || raw2.startsWith('@')) continue
      // 明显不是 wikilink 的（数学式、代码片段）
      if (/[[\](),"'=+*/<>|]/.test(raw2)) continue
      total++
      const candidates = raw2.startsWith('./') || raw2.startsWith('../')
        ? [path.normalize(path.join(dirOf, raw2)).split(path.sep).join('/')]
        : [`wiki/${raw2}`]
      if (!candidates.some(has)) deadLinks.set(`[[${raw2}]]`, (deadLinks.get(`[[${raw2}]]`) ?? 0) + 1)
    }
  }
}
check(CONTENT)

console.log(`[baseline] 站内链接总数 ${total}`)
console.log(`[baseline] 死链 ${deadLinks.size} 个（VitePress 时期同样存在，配置了 ignoreDeadLinks: true）`)
const sorted = [...deadLinks.entries()].sort((a, b) => b[1] - a[1])
for (const [href, count] of sorted.slice(0, 15)) {
  console.log(`  ${href}  (${count} 次)`)
}
