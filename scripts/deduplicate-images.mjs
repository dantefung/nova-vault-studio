#!/usr/bin/env node
/**
 * scripts/deduplicate-images.mjs
 * 
 * 目录内安全去重：
 * 在保持文章目录完全独立（不破坏跨目录自包含）的前提下，
 * 消除同一图片目录内部内容完全相同（SHA256 一致）的重复副本。
 * 
 * 用法：
 *   node scripts/deduplicate-images.mjs          # 预演
 *   node scripts/deduplicate-images.mjs --apply  # 实际执行
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MD_ROOT = path.join(ROOT, 'docs/md')
const APPLY = process.argv.includes('--apply')

function walk(dir, out = []) {
  try {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith('.') || e.name === 'dist' || e.name === 'cache' || e.name === 'node_modules') continue
      const p = path.join(dir, e.name)
      if (e.isDirectory()) walk(p, out)
      else out.push(p)
    }
  } catch {}
  return out
}

const allFiles = walk(MD_ROOT)
const imgFiles = allFiles.filter(f => /\.(webp|png|jpe?g|gif|svg)$/i.test(f))
const mdFiles = allFiles.filter(f => f.endsWith('.md'))

console.log(`[dedup] 扫描到图片文件: ${imgFiles.length} 张`)
console.log(`[dedup] 扫描到 Markdown 文件: ${mdFiles.length} 个`)

// 1. 在每个图片目录内部按 SHA256 分组
const dirGroups = new Map() // dir -> Map(sha256 -> [ { path, base, size } ])
for (const img of imgFiles) {
  const d = path.dirname(img)
  const buf = fs.readFileSync(img)
  const h = crypto.createHash('sha256').update(buf).digest('hex')
  if (!dirGroups.has(d)) dirGroups.set(d, new Map())
  const hMap = dirGroups.get(d)
  if (!hMap.has(h)) hMap.set(h, [])
  hMap.get(h).push({ path: img, base: path.basename(img), size: buf.length })
}

// 2. 统计可去重的重复项，并构建同目录替换表
// dir -> Map(oldBase -> canonicalBase)
const replMap = new Map()
let totalRemovable = 0
let totalSavedBytes = 0
const filesToDelete = []

for (const [dir, hMap] of dirGroups) {
  for (const [h, list] of hMap) {
    if (list.length > 1) {
      // 选取文件名最短且字母序最前的作为主副本
      list.sort((a, b) => a.base.length - b.base.length || a.base.localeCompare(b.base))
      const canonical = list[0]
      const duplicates = list.slice(1)
      if (!replMap.has(dir)) replMap.set(dir, new Map())
      const subMap = replMap.get(dir)
      for (const dup of duplicates) {
        subMap.set(dup.base, canonical.base)
        filesToDelete.push(dup.path)
        totalRemovable++
        totalSavedBytes += dup.size
      }
    }
  }
}

console.log(`[dedup] 发现同目录重复文件: ${totalRemovable} 个`)
console.log(`[dedup] 预计可削减体积: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`)

// 3. 更新 Markdown 引用（如果引用了被删除的副本，重定向到主副本）
let updatedMdCount = 0
let updatedRefCount = 0

// 检查每个 md 文件
for (const md of mdFiles) {
  let content = fs.readFileSync(md, 'utf8')
  let changed = false
  const mdDir = path.dirname(md)

  // 检查是否有与该 md 同级或子级的图片目录存在替换规则
  for (const [imgDir, nameMap] of replMap) {
    for (const [oldName, newName] of nameMap) {
      if (content.includes(oldName)) {
        // 验证该引用解析后的绝对路径是否就是 imgDir/oldName
        // 避免误伤同名但不同目录的图片
        const relPath = path.relative(mdDir, path.join(imgDir, oldName)).split(path.sep).join('/')
        const relNewPath = path.relative(mdDir, path.join(imgDir, newName)).split(path.sep).join('/')
        
        // 检查可能出现的几种引用写法
        const patterns = [
          relPath,
          relPath.startsWith('./') ? relPath.slice(2) : './' + relPath,
          oldName // 同名内联
        ]

        for (const p of patterns) {
          if (content.includes(p)) {
            // 确保是路径上下文（两边是括号、引号或空格）
            const searchStr = `(${p})`
            const replaceStr = `(${p.replace(oldName, newName)})`
            if (content.includes(searchStr)) {
              content = content.split(searchStr).join(replaceStr)
              changed = true
              updatedRefCount++
            }
          }
        }
      }
    }
  }

  if (changed) {
    updatedMdCount++
    if (APPLY) {
      fs.writeFileSync(md, content)
    }
  }
}

console.log(`[dedup] 涉及更新的 Markdown 引用: ${updatedRefCount} 处 (${updatedMdCount} 个文件)`)

// 4. 删除重复副本
if (APPLY) {
  for (const f of filesToDelete) {
    if (fs.existsSync(f)) {
      fs.unlinkSync(f)
    }
  }
  console.log(`[dedup] 成功删除 ${filesToDelete.length} 个重复图片文件！`)
} else {
  console.log(`[dedup] 当前为预演模式。运行 node scripts/deduplicate-images.mjs --apply 执行去重。`)
}
