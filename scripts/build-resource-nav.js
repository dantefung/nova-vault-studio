/**
 * build-resource-nav.js
 *
 * 将 docs/md/guide/ai/ai-programming-resources.md 解析为结构化导航数据：
 *   docs/.vitepress/generated/resource-nav.json
 *   docs/.vitepress/generated/resource-nav.js
 *
 * 设计目标：
 *   - 不引入新依赖，手写轻量 Markdown 解析
 *   - 以 H2 为分类、H3 为分组；列表项支持嵌套子项；表格行视为条目
 *   - 容错优先：解析不出的形态降级为纯文本条目，绝不抛错
 */

import fs from 'fs'
import path from 'path'

const CWD = process.cwd()
const SOURCE = path.join(CWD, 'docs/md/guide/ai/ai-programming-resources.md')
const SOURCE_ROUTE_DIR = '/md/guide/ai/'
const OUTPUT_DIR = path.join(CWD, 'docs/.vitepress/generated')
const OUTPUT_JSON = path.join(OUTPUT_DIR, 'resource-nav.json')
const OUTPUT_JS = path.join(OUTPUT_DIR, 'resource-nav.js')

function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

/** 去掉行内 Markdown 标记，保留可读文本。 */
function plain(text) {
  if (!text) return ''
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 解析链接目标，区分外链 / 站内路径。 */
function resolveUrl(raw) {
  if (!raw) return { href: '', external: false }
  const url = String(raw).trim()
  if (/^https?:\/\//i.test(url)) return { href: url, external: true }
  if (url.startsWith('/')) return { href: url.replace(/\.md$/, ''), external: false }
  if (url.startsWith('#')) return { href: url, external: false }
  const clean = url.replace(/^\.\//, '').replace(/\.md$/, '')
  return { href: SOURCE_ROUTE_DIR + clean, external: false }
}

/** 解析一个列表项（内容为 "- " 之后的文本）。 */
function parseListItem(content) {
  let m = content.match(/^\[([^\]]+)\]\(([^)]+)\)\s*(.*)$/)
  if (m) {
    const rest = (m[3] || '').replace(/^\s*[—–-]\s*/, '')
    return { title: plain(m[1]), ...resolveUrl(m[2]), desc: plain(rest) }
  }
  m = content.match(/^\*\*(.+?)\*\*\s*(（[^）]*）)?\s*(.*)$/)
  if (m) {
    const rest = (m[3] || '').replace(/^\s*[—–-]\s*/, '')
    return { title: plain(m[1]) + (m[2] || ''), href: '', external: false, desc: plain(rest), bold: true }
  }
  return { title: plain(content), href: '', external: false, desc: '', bold: false }
}

/** 解析表格数据行。 */
function parseTableRow(line) {
  const cells = line.split('|').slice(1, -1).map(c => c.trim())
  if (!cells.length) return null
  const link = cells[0].match(/^\[([^\]]+)\]\(([^)]+)\)$/)
  const base = link
    ? { title: plain(link[1]), ...resolveUrl(link[2]) }
    : { title: plain(cells[0]), href: '', external: false }
  return {
    ...base,
    desc: plain(cells[1] || ''),
    tag: cells[2] ? plain(cells[2]) : '',
    children: [],
  }
}

function slugify(text, index) {
  const ascii = String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${ascii || 'section'}-${index}`
}

function countItems(items) {
  let n = 0
  for (const item of items) {
    n += 1
    if (item.children?.length) n += countItems(item.children)
  }
  return n
}

function parse(content) {
  const categories = []
  const diagnostics = []
  let category = null
  let group = null
  const stack = []
  let inTable = false
  let tableRowCount = 0
  let docTitle = 'AI 编程资源导航'
  let docDescription = ''

  const fmMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)
  const rawText = fmMatch ? content.slice(fmMatch[0].length) : content
  const lineOffset = fmMatch ? (fmMatch[0].match(/\n/g) || []).length : 0
  const lines = rawText.split(/\r?\n/)
  let lineNo = 0

  /** 记录一条格式问题；line 为源文件真实行号（含 frontmatter 偏移）。 */
  const report = (idx, message) => diagnostics.push({ line: idx + lineOffset, message })

  for (const rawLine of lines) {
    lineNo += 1
    const line = rawLine.replace(/\s+$/, '')
    if (!line.trim()) {
      inTable = false
      continue
    }

    if (/^-{3,}\s*$/.test(line.trim()) || /^<!--/.test(line.trim())) {
      inTable = false
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      const level = heading[1].length
      const text = plain(heading[2])
      stack.length = 0
      inTable = false
      if (level > 3) {
        report(lineNo, `标题层级过深（H${level}），导航页最深支持 H3：${text}`)
        continue
      }
      if (level === 1) {
        docTitle = text
      } else if (level === 2) {
        category = { slug: slugify(text, categories.length), title: text, desc: '', note: '', groups: [] }
        categories.push(category)
        group = { title: '', note: '', items: [] }
        category.groups.push(group)
      } else if (level === 3 && category) {
        group = { title: text, note: '', items: [] }
        category.groups.push(group)
      }
      continue
    }

    const quote = line.match(/^>\s?(.*)$/)
    if (quote) {
      const text = plain(quote[1])
      if (!text) continue
      if (group && group.title && group.items.length === 0 && !group.note) {
        group.note = text
      } else if (category && category.desc) {
        category.note = category.note ? `${category.note} ${text}` : text
      } else if (category) {
        category.desc = text
      } else if (!docDescription) {
        docDescription = text
      }
      continue
    }

    if (/^\|/.test(line.trim())) {
      if (!inTable) {
        inTable = true
        tableRowCount = 0
      }
      if (/^\|[\s:|-]+\|$/.test(line.trim())) continue
      tableRowCount += 1
      if (tableRowCount === 1) continue
      const cells = line.split('|').slice(1, -1)
      if (cells.length < 2) {
        report(lineNo, '表格每行至少需要两列（链接 | 说明）')
        continue
      }
      if (category && group) {
        const item = parseTableRow(line)
        if (item) group.items.push(item)
      }
      continue
    }
    inTable = false

    const wrongBullet = line.match(/^\s*([*+])\s+/)
    if (wrongBullet) {
      report(lineNo, `列表符号应使用 "-"，检测到 "${wrongBullet[1]}"`)
      continue
    }

    const listItem = rawLine.match(/^(\s*)-\s+(.*)$/)
    if (listItem) {
      if (!category || !group) {
        report(lineNo, '列表项出现在任何 H2 分类之前')
        continue
      }
      const indent = listItem[1].replace(/\t/g, '  ').length
      const node = { ...parseListItem(listItem[2]), children: [] }
      if (stack.length === 0 && !node.href && !node.bold) {
        report(lineNo, `条目缺少链接且未加粗，疑似漏写 Markdown 链接：${node.title}`)
      }
      while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop()
      const container = stack.length ? stack[stack.length - 1].node.children : group.items
      container.push(node)
      stack.push({ indent, node })
      continue
    }

    report(lineNo, `无法解析的行（不会进入导航页）：${line.trim().slice(0, 60)}`)
  }

  for (const cat of categories) {
    for (const g of cat.groups) {
      if (g.title && !g.items.length && !g.note) {
        report(0, `分组「${g.title}」（分类「${cat.title}」）没有任何条目`)
      }
    }
    if (cat.groups.every(g => !g.items.length && !g.note)) {
      report(0, `分类「${cat.title}」没有任何条目`)
    }
  }

  const cleanCategories = categories
    .map(cat => ({
      ...cat,
      groups: cat.groups.filter(g => g.items.length || g.note),
    }))
    .filter(cat => cat.groups.length)

  return { docTitle, docDescription, categories: cleanCategories, diagnostics }
}

function main() {
  const checkMode = process.argv.includes('--check')
  if (!fs.existsSync(SOURCE)) {
    console.error(`[resource-nav] source not found: ${SOURCE}`)
    process.exit(1)
  }
  const raw = fs.readFileSync(SOURCE, 'utf8')
  const parsed = parse(raw)

  if (parsed.diagnostics.length) {
    const rel = path.relative(CWD, SOURCE)
    for (const d of parsed.diagnostics) {
      const loc = d.line ? `${rel}:${d.line}` : rel
      console.error(`[resource-nav] ${loc}: ${d.message}`)
    }
    if (checkMode) {
      console.error(`[resource-nav] 格式检查失败：${parsed.diagnostics.length} 处问题`)
      process.exit(1)
    }
    console.error(`[resource-nav] 警告：${parsed.diagnostics.length} 处格式问题，已降级解析`)
  }

  if (checkMode) {
    console.log('[resource-nav] 格式检查通过')
    return
  }

  let totalItems = 0
  for (const cat of parsed.categories) {
    cat.count = cat.groups.reduce((sum, g) => sum + countItems(g.items), 0)
    totalItems += cat.count
  }

  const data = {
    generatedAt: new Date().toISOString(),
    source: 'docs/md/guide/ai/ai-programming-resources.md',
    title: parsed.docTitle,
    description: parsed.docDescription,
    stats: { categories: parsed.categories.length, items: totalItems },
    categories: parsed.categories,
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(data, null, 2), 'utf8')
  fs.writeFileSync(
    OUTPUT_JS,
    `// Auto-generated by scripts/build-resource-nav.js. Do not edit.\nexport default ${JSON.stringify(data, null, 2)};\n`,
    'utf8',
  )

  console.log(
    `[resource-nav] built: ${data.stats.categories} categories, ${data.stats.items} items`,
  )
}

export { parse, plain, resolveUrl, parseListItem }

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
