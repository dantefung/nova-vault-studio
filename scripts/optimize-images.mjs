#!/usr/bin/env node
/**
 * optimize-images.mjs —— 把 docs/md 下的 PNG/JPG/JPEG 批量转成 WebP，并同步更新 Markdown 引用。
 *
 * 背景：仓库里 11,427 张图片共 1,330 MB，其中 PNG 1,599 MB + JPG 361 MB + JPEG 96 MB，
 * 而 WebP 仅 7 MB。抽样实测 WebP(q80) 体积约为原图的 38.6%，可省约 61.4%。
 *
 * 用法：
 *   node scripts/optimize-images.mjs            # 预演，只报告不改文件
 *   node scripts/optimize-images.mjs --apply    # 实际执行
 *   node scripts/optimize-images.mjs --apply --min-size 4096   # 跳过小于 4KB 的图
 *
 * 安全约定：
 *   - 不动 .gif（可能是动图）、.svg（矢量）、.webp（已是目标格式）
 *   - 只改 docs/md 内部的图片引用；docs/public 与 config.js 的引用不动
 *   - 原图只有在「没有任何引用残留」时才删除
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MD_ROOT = path.join(ROOT, 'docs/md')

const args = process.argv.slice(2)
const APPLY = args.includes('--apply')
const CLEANUP_ONLY = args.includes('--cleanup-only')
const QUALITY = 80
const MIN_SIZE = (() => {
  const i = args.indexOf('--min-size')
  return i >= 0 ? Number(args[i + 1]) : 0
})()

const SKIP_EXT = new Set(['.gif', '.svg', '.webp', '.avif'])
const SRC_EXT = new Set(['.png', '.jpg', '.jpeg'])

/** 递归收集目录下所有文件 */
function walk(dir, out = []) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

/** 收集所有 md 文件（docs/md 内） */
const mdFiles = walk(MD_ROOT).filter((f) => f.toLowerCase().endsWith('.md'))

/** 收集待转换图片 */
const images = walk(MD_ROOT).filter((f) => {
  const ext = path.extname(f).toLowerCase()
  if (!SRC_EXT.has(ext)) return false
  if (SKIP_EXT.has(ext)) return false
  const size = fs.statSync(f).size
  return size >= MIN_SIZE
})

console.log(`[opt-img] md 文件: ${mdFiles.length} 个`)
console.log(`[opt-img] 待转换图片: ${images.length} 张 (quality=${QUALITY}${MIN_SIZE ? `, min-size=${MIN_SIZE}B` : ''})`)

if (!images.length) {
  console.log('[opt-img] 无需转换，退出')
  process.exit(0)
}

/** 预先建立「绝对路径 → 目标 webp 路径」映射 */
const targetMap = new Map()
for (const img of images) {
  targetMap.set(img, img.replace(/\.(png|jpe?g)$/i, '.webp'))
}

/** 找出所有 md 中形如 ](path) 的图片引用 */
const REF_RE = /(!\[[^\]]*\]|\[[^\]]*\])\(([^)\s]+)(\s+"[^"]*")?\)/g
/** 引用式定义：[label]: path（行首） */
const DEFL_RE = /^(\s*\[[^\]]+\]:\s*)([^\s]+\.(?:png|jpe?g))(\s*)$/gim
/** md 内联的 HTML <img src="..."> */
const HTML_IMG_RE = /(<img[^>]*\ssrc=")([^"]+\.(?:png|jpe?g))(")/gi

/** 引用路径中需要改扩展名的匹配（大小写不敏感） */
function resolveRef(mdFile, refPath) {
  if (/^(https?:)?\/\//.test(refPath)) return null // 外链
  if (refPath.startsWith('data:')) return null
  const clean = refPath.split('#')[0].split('?')[0]
  if (!clean) return null
  if (!/\.(png|jpe?g)$/i.test(clean)) return null
  // 绝对路径（相对站点根）跳过：docs/public 下的资源
  if (clean.startsWith('/')) return null
  const abs = path.resolve(path.dirname(mdFile), clean)
  return abs
}

let refTotal = 0
let refWillChange = 0
const refChanges = new Map() // mdFile -> [[oldRef, newRef]]

for (const md of mdFiles) {
  const text = fs.readFileSync(md, 'utf8')
  const changes = []
  let m
  REF_RE.lastIndex = 0
  while ((m = REF_RE.exec(text)) !== null) {
    const rawRef = m[2]
    refTotal += 1
    const abs = resolveRef(md, rawRef)
    if (!abs) continue
    const target = targetMap.get(abs)
    if (!target) continue
    refWillChange += 1
    const newRef = path.relative(path.dirname(md), target).split(path.sep).join('/')
    changes.push([rawRef, newRef])
  }
  // 引用式定义
  DEFL_RE.lastIndex = 0
  while ((m = DEFL_RE.exec(text)) !== null) {
    const rawRef = m[2]
    refTotal += 1
    const abs = resolveRef(md, rawRef)
    if (!abs) continue
    const target = targetMap.get(abs)
    if (!target) continue
    refWillChange += 1
    const newRef = path.relative(path.dirname(md), target).split(path.sep).join('/')
    changes.push([rawRef, newRef])
  }
  // 内联 HTML <img src="...">
  HTML_IMG_RE.lastIndex = 0
  while ((m = HTML_IMG_RE.exec(text)) !== null) {
    const rawRef = m[2]
    refTotal += 1
    const abs = resolveRef(md, rawRef)
    if (!abs) continue
    const target = targetMap.get(abs)
    if (!target) continue
    refWillChange += 1
    const newRef = path.relative(path.dirname(md), target).split(path.sep).join('/')
    changes.push([rawRef, newRef])
  }
  if (changes.length) refChanges.set(md, changes)
}

console.log(`[opt-img] 图片引用总数: ${refTotal}，需要改扩展名: ${refWillChange}，涉及 ${refChanges.size} 个 md`)
let origBytes = 0
let newBytes = 0
let converted = 0
let skipped = 0
let failed = 0
const failedImgs = new Set()

if (!CLEANUP_ONLY) {
for (const [img, target] of targetMap) {
  const origSize = fs.statSync(img).size
  origBytes += origSize
  try {
    const buf = await sharp(img, { animated: false })
      .webp({ quality: QUALITY, effort: 5 })
      .toBuffer()
    newBytes += buf.length
    if (APPLY) {
      fs.writeFileSync(target, buf)
    }
    converted += 1
  } catch (err) {
    // 转换失败：保留原图，且**不改它的引用**（否则会留下指向不存在 .webp 的死链）
    newBytes += origSize
    failedImgs.add(img)
    failed += 1
    console.warn(`  ! 转换失败 ${path.relative(ROOT, img)}: ${err.message}`)
  }
}
}

// 转换失败的文件从「需要改扩展名」的目标里剔除
for (const img of failedImgs) {
  targetMap.delete(img)
  for (const [md, changes] of refChanges) {
    const filtered = changes.filter(([oldRef]) => {
      const abs = resolveRef(md, oldRef)
      return abs !== img
    })
    if (filtered.length) refChanges.set(md, filtered)
    else refChanges.delete(md)
  }
}

// ---- 更新 md 引用 ----
if (APPLY) {
  for (const [md, changes] of refChanges) {
    let text = fs.readFileSync(md, 'utf8')
    for (const [oldRef, newRef] of changes) {
      // 只替换精确匹配（避免误伤同名子串）
      text = text.split(oldRef).join(newRef)
    }
    fs.writeFileSync(md, text)
  }
  console.log(`[opt-img] 已更新 ${refChanges.size} 个 md 的引用`)
}

console.log('')
console.log(`[opt-img] 原始合计: ${(origBytes / 1048576).toFixed(1)} MB`)
console.log(`[opt-img] WebP 合计: ${(newBytes / 1048576).toFixed(1)} MB`)
console.log(`[opt-img] 节省: ${(((origBytes - newBytes) / 1048576)).toFixed(1)} MB (${(((1 - newBytes / origBytes) * 100)).toFixed(1)}%)`)
console.log(`[opt-img] 转换成功 ${converted} 张，失败 ${failed} 张（失败者保留原格式）`)

if (!APPLY) {
  console.log('')
  console.log('[opt-img] 这是预演，未修改任何文件。确认后加 --apply 执行。')
} else {
  console.log('')
  console.log('[opt-img] 原图暂未删除——请确认构建与引用校验通过后再运行：')
  console.log('[opt-img]   node scripts/optimize-images.mjs --cleanup')
}

// ---- 清理模式：删除已无引用的原图 ----
if (args.includes('--cleanup') || CLEANUP_ONLY) {
  console.log('')
  console.log('[opt-img] --- 清理模式 ---')
  // 收集 docs/ 下所有文本文件里出现过的图片引用（解析成绝对路径）
  const textFiles = walk(path.join(ROOT, 'docs')).filter((f) => {
    const ext = path.extname(f).toLowerCase()
    return ['.md', '.vue', '.js', '.ts', '.css', '.html', '.json'].includes(ext)
  })
  const referenced = new Set()
  const refPathRe = /[^\s"'()<>[\]]+\.(?:png|jpe?g|gif|svg|webp)/gi
  for (const tf of textFiles) {
    if (tf.includes('/dist/') || tf.includes('/cache/')) continue
    let text
    try {
      text = fs.readFileSync(tf, 'utf8')
    } catch {
      continue
    }
    let m
    refPathRe.lastIndex = 0
    while ((m = refPathRe.exec(text)) !== null) {
      const raw = m[0]
      if (/^(https?:)?\/\//.test(raw)) continue
      const abs = path.resolve(path.dirname(tf), raw.split('#')[0].split('?')[0])
      referenced.add(abs)
    }
  }

  let freed = 0
  let removed = 0
  let kept = 0
  for (const img of targetMap.keys()) {
    if (!fs.existsSync(img)) continue
    if (referenced.has(img)) {
      kept += 1
      continue
    }
    const size = fs.statSync(img).size
    fs.unlinkSync(img)
    freed += size
    removed += 1
  }
  console.log(`[opt-img] 删除无引用原图 ${removed} 张（${(freed / 1048576).toFixed(1)} MB）`)
  console.log(`[opt-img] 保留仍被引用的原图 ${kept} 张`)
  // 清理空目录
  for (const img of targetMap.keys()) {
    let dir = path.dirname(img)
    while (dir.startsWith(MD_ROOT) && dir !== MD_ROOT) {
      try {
        if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir)
        else break
      } catch {
        break
      }
      dir = path.dirname(dir)
    }
  }
}
