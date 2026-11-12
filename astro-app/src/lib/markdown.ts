import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import rehypeSlug from 'rehype-slug'
import docIndex from '../generated/doc-index.json'

/**
 * Markdown 渲染管线。
 *
 * Astro 内置的 remark 管线不含 VitePress 的这些能力，这里补齐：
 *   1. wikilink  `[[concepts/foo]]` -> `/md/wiki/concepts/foo`
 *   2. 相对 .md 链接 `](./sources/x.md)` -> 解析成绝对路径
 *   3. 相对图片 `](../images/x.png)` -> 按 md 文件位置解析成绝对路径
 *   4. 容器块 `::: info ... :::` -> <div class="vp-block info">
 *   5. mermaid 代码块 -> <div class="mermaid">（客户端渲染）
 *   6. markmap 代码块 -> <svg class="markmap-svg">（客户端渲染）
 *   7. VitePress 自定义组件 <PdfViewer> / <HtmlViewer> / <PdfList>
 *      -> 通用自定义元素，由 astro-islands 里的实现接管
 *   8. `<script setup>` / `<template>` —— VitePress 的 Vue 专用块，移除
 *
 * 为什么不用 Astro 内置管线：自定义组件与 wikilink 的行为差异太大，
 * 自建管线能保证 Astro 与 VitePress 渲染结果一致。
 */

const WIKI_LINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
const COMPONENT_MAP = {
  PdfViewer: 'pdf-viewer',
  HtmlViewer: 'html-viewer',
  PdfList: 'pdf-list',
}

/** 全站文档 id 集合（由 scripts/build-astro-doc-index.mjs 生成） */
const DOC_IDS = new Set((docIndex as { ids: string[] }).ids)

/**
 * wikilink 目标解析。
 *
 * 站内 wikilink 有两种约定：
 *   1. `[[concepts/foo]]`     —— 相对 wiki 根（docs/md/wiki/）
 *   2. `[[../foo]]` / `[[./x]]` —— 相对当前文件所在目录
 *
 * 解析不出来（目标文件不存在）时返回 null，调用方保留纯文本 ——
 * VitePress 不支持 wikilink，原本就是原样显示，转成死链反而是倒退。
 */
function resolveWikilink(target: string, currentUrl: string): string | null {
  const clean = target.trim().replace(/\.md$/, '')
  if (!clean) return null

  // 明显不是 wikilink 的内容（数学表达式、代码片段、@提及等）
  if (/^@/.test(clean)) return null

  const candidates: string[] = []

  if (clean.startsWith('./') || clean.startsWith('../')) {
    // 相对当前文件目录
    const currentDir = currentUrl.replace(/^\/md\//, '').replace(/\/+$/, '').split('/').slice(0, -1).join('/')
    const segs = `${currentDir}/${clean}`.split('/')
    const out: string[] = []
    for (const s of segs) {
      if (s === '' || s === '.') continue
      if (s === '..') {
        out.pop()
        continue
      }
      out.push(s)
    }
    candidates.push(out.join('/'))
  } else {
    // 相对 wiki 根
    candidates.push(`wiki/${clean}`)
  }

  for (const id of candidates) {
    const normalized = id.replace(/\/index$/, '')
    if (DOC_IDS.has(id) || DOC_IDS.has(normalized)) {
      const url = id.startsWith('wiki/') ? `/md/${id}` : `/md/${id}`
      return url.replace(/\/index$/, '/')
    }
  }
  return null
}

/**
 * 相对路径解析。
 *
 * baseUrl 是当前文档的 URL，两种形态对应的「所在目录」不同：
 *   - 普通文档  /md/wiki/sources/foo   -> 所在目录是 /md/wiki/sources
 *   - 目录索引  /md/books/xxx/        -> 所在目录就是 /md/books/xxx 本身
 * VitePress 按源文件所在目录解析相对链接，这里保持同样语义，
 * 否则 index.md 里的 ./book/x.md 会被解析到少一层的路径上。
 */
function resolveRelative(baseUrl, url) {
  const isIndex = baseUrl.endsWith('/')
  const baseDir = isIndex
    ? baseUrl.replace(/\/+$/, '')
    : baseUrl.replace(/\/+$/, '').split('/').slice(0, -1).join('/')
  const segments = `${baseDir}/${url}`.split('/')
  const out = []
  for (const seg of segments) {
    if (seg === '' || seg === '.') continue
    if (seg === '..') {
      out.pop()
      continue
    }
    out.push(seg)
  }
  return out.join('/')
}

/**
 * wikilink `[[concepts/foo]]` -> 站内链接节点
 *
 * 注意：这里必须直接产出 mdast 的 link 节点，
 * 不能把 text 里的内容改写成 markdown 语法 —— remark 在解析阶段就把
 * text 节点定型了，事后改写 text 内容只会得到字面量 "[x](y)"。
 */
const wikilinkPlugin = (options) => (tree) => {
  const currentUrl = options.currentUrl || ''
  visit(tree, 'text', (node: any, index, parent: any) => {
    if (!parent || index === undefined) return
    const value: string = node.value
    if (!value.includes('[[')) return

    const children: any[] = []
    let last = 0
    let matched = false

    WIKI_LINK_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = WIKI_LINK_RE.exec(value)) !== null) {
      const href = resolveWikilink(m[1], currentUrl)
      // 解析不出来就保留原文，不制造死链
      if (!href) continue

      matched = true
      if (m.index > last) {
        children.push({ type: 'text', value: value.slice(last, m.index) })
      }
      const text = (m[2] ?? m[1]).trim()
      children.push({
        type: 'link',
        url: href,
        title: null,
        data: { hProperties: { className: ['vp-wikilink'] } },
        children: [{ type: 'text', value: text }],
      })
      last = m.index + m[0].length
    }

    if (!matched) return
    if (last < value.length) {
      children.push({ type: 'text', value: value.slice(last) })
    }
    parent.children.splice(index, 1, ...children)
    return index + children.length
  })
}

/** 相对 .md 链接 -> 绝对路径 */
const relativeLinkPlugin = (options) => (tree) => {
  const currentUrl = options.currentUrl
  if (!currentUrl) return
  visit(tree, 'link', (node) => {
    const url = node.url || ''
    if (!url.endsWith('.md')) return
    if (url.startsWith('/') || /^[a-z]+:/i.test(url)) return
    node.url = '/' + resolveRelative(currentUrl, url).replace(/\.md$/, '').replace(/\/index$/, '/')
  })
}

/** 相对图片 -> 绝对路径（与 VitePress 的解析规则一致） */
const imagePathPlugin = (options) => (tree) => {
  const currentUrl = options.currentUrl
  if (!currentUrl) return
  visit(tree, 'image', (node) => {
    const url = node.url || ''
    if (!url || url.startsWith('/') || /^[a-z]+:/i.test(url) || url.startsWith('#')) return
    node.url = '/' + resolveRelative(currentUrl, url)
  })
}

/** ```mermaid -> <div class="mermaid"> */
const mermaidPlugin = () => (tree) => {
  visit(tree, 'code', (node, index, parent) => {
    if (!parent || index === undefined) return
    if (node.lang !== 'mermaid') return
    parent.children[index] = {
      type: 'paragraph',
      data: { hName: 'div', hProperties: { className: 'mermaid' } },
      children: [{ type: 'text', value: node.value }],
    }
  })
}

/**
 * ```markmap -> markmap 占位 svg（与 VitePress 的 markdown-it 插件产物一致）
 * 客户端由 astro-islands/markmap.ts 渲染。
 */
const markmapPlugin = () => (tree) => {
  let seq = 0
  visit(tree, 'code', (node, index, parent) => {
    if (!parent || index === undefined) return
    if (node.lang !== 'markmap') return
    const params = (node.meta || '').trim()
    const mh = params.match(/height=(\d+)/)
    const height = mh ? Number(mh[1]) : 560
    const isFull = /(?:^|\s)(?:full|width(?:=|-|_)full)(?:\s|$)/.test(params)
    const id = `mm-${seq++}`
    const style = mh ? `height:${height}px` : `min-height:${height}px`
    const cls = `markmap-container${isFull ? ' markmap-full-bleed' : ''}`
    const fixedAttr = mh ? ' data-fixed-height' : ''
    parent.children[index] = {
      type: 'html',
      value: `<div class="${cls}"${fixedAttr} style="${style}"><svg id="${id}" class="markmap-svg" data-code="${encodeURIComponent(node.value)}"></svg></div>`,
    }
  })
}

/**
 * VitePress 自定义组件 -> 通用自定义元素。
 * 组件本体由 astro-islands 的实现负责（pdf-viewer / html-viewer / pdf-list）。
 */
const vitepressComponentPlugin = () => (tree) => {
  visit(tree, 'html', (node, index, parent) => {
    if (!parent || index === undefined) return
    const value = node.value.trim()
    const m = value.match(/^<([A-Z][A-Za-z]*)\b([\s\S]*?)\/?>(?:<\/([A-Z][A-Za-z]*)>)?$/)
    if (!m) return
    const tag = COMPONENT_MAP[m[1]]
    if (!tag) return

    // 同时支持 src="x" 与 Vue 绑定写法 :src="x"
    const props = []
    const attrRe = /(?::)?([\w-]+)\s*=\s*"([^"]*)"/g
    let am
    while ((am = attrRe.exec(m[2] || '')) !== null) {
      const key = am[1].toLowerCase()
      props.push(`data-${key}="${am[2]}"`)
    }

    parent.children[index] = {
      type: 'html',
      value: `<${tag}${props.length ? ' ' + props.join(' ') : ''}></${tag}>`,
    }
  })
}

/** 移除 VitePress 的 Vue 专用块（<script setup> / <template>） */
const vueBlockPlugin = () => (tree) => {
  visit(tree, 'html', (node, index, parent) => {
    if (!parent || index === undefined) return
    const value = node.value
    if (/^\s*<script setup\b[\s\S]*?<\/script>\s*$/i.test(value)) {
      parent.children[index] = { type: 'text', value: '' }
      return
    }
    const tpl = value.match(/^\s*<template>([\s\S]*?)<\/template>\s*$/i)
    if (tpl) {
      parent.children[index] = { type: 'text', value: tpl[1] }
    }
  })
}

/**
 * `::: type 标题 ... :::` 容器块。
 *
 * remark 没有 markdown-it-container 的等价物。VitePress 的容器块在源码里是
 * 「::: info 标题」起头、若干段落、最后一行「:::」结束的整体块。
 * remark 会把整个块解析成**一个段落**（行内文本），因此这里按段落处理：
 * 首段文本以 ::: type 开头时，把整段的文本按行切开重建为容器结构。
 */
const CONTAINER_TYPE_RE = /^(info|tip|warning|danger|details|raw)\b\s*(.*)$/

const containerPlugin = () => (tree) => {
  visit(tree, 'paragraph', (node, index, parent) => {
    if (!parent || index === undefined) return
    // 容器块在 remark 里是单个段落，文本里带换行
    const text = node.children
      .filter((c) => c.type === 'text')
      .map((c) => c.value)
      .join('')
    const raw = node.children.length === 1 && node.children[0].type === 'text' ? node.children[0].value : null
    if (raw === null) return

    const lines = raw.split('\n')
    const first = lines[0]
    const m = first.match(/^:::\s*(info|tip|warning|danger|details|raw)\s*(.*)$/)
    if (!m) return

    const type = m[1]
    const title = m[2].trim()
    const bodyLines = lines.slice(1)
    // 去掉结尾的 :::
    while (bodyLines.length && /^:::\s*$/.test(bodyLines[bodyLines.length - 1].trim())) bodyLines.pop()
    const bodyText = bodyLines.join('\n')

    const children = []
    if (title) {
      children.push({
        type: 'paragraph',
        data: { hName: 'p', hProperties: { className: 'vp-block-title' } },
        children: [{ type: 'text', value: title }],
      })
    }
    if (bodyText.trim()) {
      children.push(...parseInlineMarkdown(bodyText))
    }

    parent.children[index] = {
      type: 'paragraph',
      data: { hName: 'div', hProperties: { className: ['vp-block', type] } },
      children,
    }
  })
}

/**
 * 解析一段 markdown 为 mdast 子节点列表。
 * 容器块内部内容需要重新走一遍完整管线（链接/图片/wikilink 解析都要生效）。
 */
function parseInlineMarkdown(content) {
  const p = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(wikilinkPlugin, { currentUrl: PARSE_CONTEXT.currentUrl })
    .use(relativeLinkPlugin, { currentUrl: PARSE_CONTEXT.currentUrl })
    .use(imagePathPlugin, { currentUrl: PARSE_CONTEXT.currentUrl })
    .use(mermaidPlugin)
    .use(markmapPlugin)
    .use(vitepressComponentPlugin)
    .use(vueBlockPlugin)
  const tree = p.parse(content)
  const hast = p.runSync(tree, { path: PARSE_CONTEXT.currentUrl })
  return hast.children
}

/** 解析上下文（容器块内部解析需要知道当前文件 URL） */
const PARSE_CONTEXT = { currentUrl: '' }

/**
 * 渲染一篇 markdown 为 HTML。
 *
 * @param {string} body        markdown 正文（不含 frontmatter）
 * @param {string} currentUrl  该文档的站点 URL，用于解析相对链接与图片
 */
export function renderMarkdown(body, currentUrl) {
  PARSE_CONTEXT.currentUrl = currentUrl

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(wikilinkPlugin, { currentUrl: PARSE_CONTEXT.currentUrl })
    .use(relativeLinkPlugin, { currentUrl })
    .use(imagePathPlugin, { currentUrl })
    .use(mermaidPlugin)
    .use(markmapPlugin)
    .use(vitepressComponentPlugin)
    .use(vueBlockPlugin)
    .use(containerPlugin)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })

  const mdast = processor.parse(body)
  const hast = processor.runSync(mdast, { path: currentUrl })
  return processor.stringify(hast)
}

/** 抽取标题（frontmatter 缺失时兜底） */
export function extractTitle(body) {
  const m = body.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : null
}

/** 抽取标题层级（用于右侧大纲） */
export function extractHeadings(body) {
  const headings = []
  const re = /^(#{1,6})\s+(.+)$/gm
  let m
  while ((m = re.exec(body)) !== null) {
    const depth = m[1].length
    const text = m[2].trim()
    const slug = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    headings.push({ depth, text, slug })
  }
  return headings
}
