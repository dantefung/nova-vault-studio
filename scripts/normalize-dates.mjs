/**
 * normalize-dates.mjs
 *
 * 规范 frontmatter 的 date 字段，使全站 frontmatter 符合 Astro content collection 的 schema。
 *
 * 背景：站内 date 有三种写法共存
 *   1. ISO：        "2026-10-29"                （主流，3200+ 篇）
 *   2. 中文：       "2023年9月24日 21:51"         （247 篇，采集脚本原样写入）
 *   3. 残缺：       "2025年"                     （2 篇，只有年份）
 * 第 2 种让 z.coerce.date() 直接抛错，整站构建会挂；第 3 种即使不报错也是错的。
 *
 * 统一转成 "YYYY-MM-DD"（有时分秒则保留 "YYYY-MM-DD HH:mm"）。
 * 只改 date 字段，不动其它 frontmatter，也不改正文。
 *
 * 幂等：已经是 ISO 的不动，重复跑不会产生二次改动。
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONTENT_ROOT = path.join(ROOT, 'docs/md')

let changed = 0
let checked = 0

function normalizeDate(value) {
  const v = value.trim().replace(/^["']|["']$/g, '').trim()
  if (!v) return null

  // 已经是 ISO 日期（前 10 位是 YYYY-MM-DD）
  const isoMatch = v.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    // 校验是否是合法日期
    const d = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T00:00:00Z`)
    if (!Number.isNaN(d.getTime())) return null // 已规范，无需改动
    return null
  }

  // 中文日期：2023年9月24日 21:51 / 2023年9月24日 / 2023年
  const cn = v.match(/^(\d{4})年(?:(\d{1,2})月)?(?:(\d{1,2})日)?(?:\s*(\d{1,2}):(\d{2}))?/)
  if (cn) {
    const year = Number(cn[1])
    const month = cn[2] ? Number(cn[2]) : 1
    const day = cn[3] ? Number(cn[3]) : 1
    const hh = cn[4] ? Number(cn[4]) : 0
    const mm = cn[5] ? Number(cn[5]) : 0

    if (month < 1 || month > 12 || day < 1 || day > 31) return null

    const pad = (n) => String(n).padStart(2, '0')
    const base = `${year}-${pad(month)}-${pad(day)}`
    // 只有年份时退化为该年 1 月 1 日，保证可排序、可解析
    const withTime = cn[4] ? ` ${pad(hh)}:${pad(mm)}` : ''
    return `${base}${withTime}`
  }

  // 其他格式（斜杠等）交给 Date 自行解析
  const parsed = new Date(v)
  if (Number.isNaN(parsed.getTime())) return null
  const pad = (n) => String(n).padStart(2, '0')
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
      continue
    }
    if (!entry.name.endsWith('.md')) continue

    const raw = fs.readFileSync(full, 'utf8')
    const normalized = raw.replace(/\r\n/g, '\n')
    const fmMatch = normalized.match(/^---\n([\s\S]*?)\n---\n/)
    if (!fmMatch) continue

    checked++
    const frontmatter = fmMatch[1]
    const dm = frontmatter.match(/^(date:\s*)(.*)$/m)
    if (!dm) continue

    const normalizedDate = normalizeDate(dm[2])
    if (!normalizedDate) continue

    const newFrontmatter = frontmatter.replace(/^(date:\s*)(.*)$/m, `$1"${normalizedDate}"`)
    const next = `---\n${newFrontmatter}\n---\n${normalized.slice(fmMatch[0].length)}`
    fs.writeFileSync(full, next, 'utf8')
    changed++
    if (changed <= 5) console.log(`  ${path.relative(ROOT, full)}: ${dm[2].trim()} -> "${normalizedDate}"`)
  }
}

if (!fs.existsSync(CONTENT_ROOT)) {
  console.error('[normalize-dates] 找不到 docs/md，跳过')
  process.exit(1)
}

walk(CONTENT_ROOT)
console.log(`[normalize-dates] 检查 ${checked} 篇，改写 ${changed} 篇 date 字段`)
