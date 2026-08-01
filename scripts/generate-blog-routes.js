// scripts/generate-blog-routes.js
// 读取 blog-index.json，根据分类与系列生成 /md/blog/ 下的占位 md 文件。
// VitePress 1.6.4 不支持 rewrites，所以必须用真实占位文件接入路由。
// 已有文件不覆盖。
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const INDEX_PATH = path.join(ROOT, 'docs/.vitepress/generated/blog-index.json')
const BLOG_ROOT = path.join(ROOT, 'docs/md/blog')

if (!fs.existsSync(INDEX_PATH)) {
  console.warn('[blog-routes] blog-index.json not found; run generate:blog-index first.')
  process.exit(0)
}

const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'))

function writeIfAbsent(filePath, content) {
  if (fs.existsSync(filePath)) return false
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
  return true
}

function placeholderMd({ title }) {
  return `---
title: ${title}
---
`
}

let created = 0

// 1) 列表页
{
  const file = path.join(BLOG_ROOT, 'index.md')
  if (writeIfAbsent(file, placeholderMd({
    title: '博客',
  }))) created++
}

// 2) 时间归档
{
  const dir = path.join(BLOG_ROOT, 'archive')
  const file = path.join(dir, 'index.md')
  if (writeIfAbsent(file, placeholderMd({
    title: '归档',
  }))) created++
}

// 3) 每个分类一个目录
for (const cat of index.categories || []) {
  const dir = path.join(BLOG_ROOT, 'category', cat.slug)
  const file = path.join(dir, 'index.md')
  if (writeIfAbsent(file, placeholderMd({
    title: cat.title || cat.slug,
  }))) created++
}

// 4) 每个系列一个目录
for (const s of index.series || []) {
  const dir = path.join(BLOG_ROOT, 'series', s.slug)
  const file = path.join(dir, 'index.md')
  if (writeIfAbsent(file, placeholderMd({
    title: s.title || s.slug,
  }))) created++
}

console.log(`[blog-routes] created ${created} placeholder file(s)`)
