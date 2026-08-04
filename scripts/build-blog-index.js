/**
 * build-blog-index.js
 *
 * 扫描预定义的内容目录，解析 frontmatter，生成博客索引：
 *   docs/.vitepress/generated/blog-index.json
 *   docs/.vitepress/generated/blog-index.js
 *
 * 设计目标：
 *   - 不引入新依赖（手写轻量 frontmatter 解析）
 *   - 支持扁平 YAML 结构；复杂结构降级为 null
 *   - 按目录推断分类；缺失字段有兜底
 *   - series 字段优先于目录名推断
 */

import fs from 'fs'
import path from 'path'

const CWD = process.cwd()

const BLOG_DIRS = [
  'docs/md/wiki/sources',
  'docs/md/wiki/journal',
  'docs/md/wiki/read-later',
  'docs/md/guide/research',
  'docs/md/columns/agentic-engineer',
  'docs/md/columns/ai-agent',
  'docs/md/columns/cognition',
  'docs/md/columns/content-engineering',
  'docs/md/columns/harness-engineering',
  'docs/md/columns/investment',
  'docs/md/columns/opc',
  'docs/md/columns/social-media',
  'docs/md/columns/vibe-coding',
  'docs/md/columns/indie-hub',
  'docs/md/business',
]

const DIR_TO_CATEGORY = {
  'docs/md/wiki/sources': { slug: 'sources', title: '资料源' },
  'docs/md/wiki/journal': { slug: 'journal', title: '日志' },
  'docs/md/wiki/read-later': { slug: 'read-later', title: '稍后读' },
  'docs/md/guide/research': { slug: 'research', title: '研究方法' },
  'docs/md/columns/agentic-engineer': { slug: 'agentic-engineer', title: 'Agentic Engineer' },
  'docs/md/columns/ai-agent': { slug: 'ai-agent', title: 'AI Agent' },
  'docs/md/columns/cognition': { slug: 'cognition', title: '认知' },
  'docs/md/columns/content-engineering': { slug: 'content-engineering', title: '内容工程' },
  'docs/md/columns/harness-engineering': { slug: 'harness-engineering', title: 'Harness Engineering' },
  'docs/md/columns/investment': { slug: 'investment', title: '投资' },
  'docs/md/columns/opc': { slug: 'opc', title: 'OPC 一人公司' },
  'docs/md/columns/social-media': { slug: 'social-media', title: '社交媒体' },
  'docs/md/columns/vibe-coding': { slug: 'vibe-coding', title: 'Vibe Coding' },
  'docs/md/columns/indie-hub': { slug: 'indie-hub', title: 'Indie Hub' },
  'docs/md/business': { slug: 'business', title: '商业' },
}

const CATEGORY_ORDER = [
  'sources', 'journal', 'agentic-engineer', 'ai-agent', 'cognition',
  'content-engineering', 'harness-engineering', 'investment', 'opc',
  'social-media', 'vibe-coding', 'indie-hub', 'business', 'research', 'read-later',
]

const OUTPUT_DIR = path.join(CWD, 'docs/.vitepress/generated')
const OUTPUT_JSON = path.join(OUTPUT_DIR, 'blog-index.json')
const OUTPUT_JS = path.join(OUTPUT_DIR, 'blog-index.js')

/** 解析扁平 frontmatter；不引入 gray-matter。 */
function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const fm = {}
  const lines = m[1].split(/\r?\n/)
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line || line.startsWith('#')) continue
    const kv = line.match(/^([\w-]+)\s*:\s*(.*)$/)
    if (!kv) continue
    let v = kv[2].trim()
    // 去掉尾注释
    const hashIdx = v.indexOf('#')
    if (hashIdx >= 0 && !/^["'].*#.*["']$/.test(v)) {
      v = v.slice(0, hashIdx).trim()
    }
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1)
    else if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1)
    else if (v === 'true') v = true
    else if (v === 'false') v = false
    else if (v === 'null') v = null
    else if (/^-?\d+$/.test(v)) v = parseInt(v, 10)
    else if (v.startsWith('[') && v.endsWith(']')) {
      try {
        v = JSON.parse(v.replace(/'/g, '"'))
      } catch {
        // 降级：简单 split
        v = v.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
      }
    }
    fm[kv[1]] = v
  }
  return fm
}

/** 取文件首段纯文本作为 excerpt。 */
function extractExcerpt(content) {
  // 先去掉 frontmatter
  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
  const lines = body.split(/\r?\n/)
  const buf = []
  for (const line of lines) {
    const t = line.trim()
    if (!t) {
      if (buf.length) break
      continue
    }
    if (t.startsWith('#') || t.startsWith('!') || t.startsWith('>')) continue
    buf.push(t.replace(/[*_`>]+/g, '').trim())
    if (buf.join('').length > 200) break
  }
  const text = buf.join(' ').replace(/\s+/g, ' ').trim()
  return text.length > 200 ? text.slice(0, 200) + '…' : text
}

/** 估算阅读时长（中文按 500 字 / 分钟；空白视为非字符）。 */
function estimateReadingTime(content) {
  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
  const cn = (body.match(/[一-龥]/g) || []).length
  const en = (body.replace(/[一-龥]/g, '').match(/\S+/g) || []).length
  const minutes = Math.max(1, Math.round(cn / 500 + en / 250))
  return minutes
}

/** 解析日期字符串：接受 "YYYY-MM-DD" / "YYYY-MM-DD HH:mm" / 中文自由格式（兜底 null）。 */
function normalizeDate(s) {
  if (!s) return null
  const m = String(s).match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (m) {
    return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`
  }
  return null
}

/** 递归枚举所有 .md（除 index.*）。 */
function* walkMarkdown(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walkMarkdown(full)
    } else if (entry.isFile() && /\.md$/i.test(entry.name) && !/^index\./i.test(entry.name)) {
      yield full
    }
  }
}

function urlPathFor(absFile, rootDir, linkPrefix) {
  const rel = path.relative(rootDir, absFile).replace(/\\/g, '/').replace(/\.md$/, '')
  return linkPrefix + rel
}

function safeCategoryMeta(relDir) {
  return DIR_TO_CATEGORY[relDir] || { slug: 'uncategorized', title: '未分类' }
}

function main() {
  const articles = []
  const seriesMap = new Map() // slug -> { slug, title, count }
  const categoryMap = new Map() // slug -> { slug, title, count }
  let articleId = 0

  for (const relDir of BLOG_DIRS) {
    const rootDir = path.join(CWD, relDir)
    if (!fs.existsSync(rootDir)) continue
    // relDir 形如 docs/md/wiki/sources → linkPrefixClean = /md/wiki/sources/
    const trimmed = relDir.replace(/^docs\/md\//, '') // wiki/sources
    const linkPrefixClean = '/md/' + trimmed + '/'

    const catMeta = safeCategoryMeta(relDir)
    categoryMap.set(catMeta.slug, { ...catMeta, count: 0 })

    for (const filePath of walkMarkdown(rootDir)) {
      const content = fs.readFileSync(filePath, 'utf8')
      const fm = parseFrontmatter(content)
      const stat = fs.statSync(filePath)

      const title = fm.title || path.basename(filePath, '.md')
      const date = normalizeDate(fm.date) || stat.mtime.toISOString().slice(0, 10)
      const tags = Array.isArray(fm.tags) ? fm.tags : []
      const series = fm.series ? String(fm.series) : null
      const cover = fm.cover ? String(fm.cover) : null
      const featured = fm.featured === true
      const excerpt = fm.excerpt ? String(fm.excerpt) : extractExcerpt(content)
      const readingTime = typeof fm.readingTime === 'number' ? fm.readingTime : estimateReadingTime(content)
      const author = fm.author ? String(fm.author) : null
      const source = fm.source ? String(fm.source) : null
      const url = fm.url ? String(fm.url) : null
      const layout = fm.layout ? String(fm.layout) : null

      const article = {
        id: ++articleId,
        path: urlPathFor(filePath, rootDir, linkPrefixClean),
        title,
        date,
        category: catMeta.slug,
        categoryTitle: catMeta.title,
        tags,
        series,
        cover,
        readingTime,
        featured,
        excerpt,
        author,
        source,
        url,
        layout,
      }
      articles.push(article)

      if (series) {
        const cur = seriesMap.get(series) || { slug: series, title: series, count: 0 }
        cur.count++
        seriesMap.set(series, cur)
      }

      const catCount = categoryMap.get(catMeta.slug)
      catCount.count++
    }
  }

  // 排序
  articles.sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  // 系列补 title（用首篇文章所在目录名美化）
  for (const [slug, info] of seriesMap.entries()) {
    const sample = articles.find(a => a.series === slug)
    if (sample) {
      // 从 slug 转 title：kebab-case → Title Case
      info.title = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
    }
  }

  // 分类按预设顺序
  const categories = CATEGORY_ORDER
    .map(slug => categoryMap.get(slug))
    .filter(Boolean)
  // 兜底：未列举的分类
  for (const [slug, info] of categoryMap.entries()) {
    if (!categories.find(c => c.slug === slug)) categories.push(info)
  }

  const series = Array.from(seriesMap.values()).sort((a, b) => b.count - a.count)

  const data = {
    generatedAt: new Date().toISOString(),
    articles,
    series,
    categories,
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(data, null, 2), 'utf8')

  // JS 模块导出：避免巨大字符串拼接
  const jsBody = `// Auto-generated by scripts/build-blog-index.js. Do not edit.
export default ${JSON.stringify(data, null, 2)};
`
  fs.writeFileSync(OUTPUT_JS, jsBody, 'utf8')

  console.log(`Blog index built: ${articles.length} articles, ${series.length} series, ${categories.length} categories`)
}

export { parseFrontmatter, extractExcerpt, estimateReadingTime, normalizeDate }

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
