import type { CollectionEntry } from 'astro:content'

/**
 * 内容路径工具。
 *
 * VitePress 时期站点根是 docs/，其中 md/ 子目录通过 cleanUrls 暴露为 /md/<path>。
 * 迁移到 Astro 后保持同样的 URL 形状，避免 4000+ 条既有链接与搜索结果全部失效：
 *   docs/md/wiki/sources/foo.md  ->  /md/wiki/sources/foo
 *   docs/md/blog/index.md        ->  /md/blog/
 */

export type DocEntry = CollectionEntry<'docs'>

/** 去掉尾部斜杠的规范化路径 */
export function normalizePath(path: string): string {
  return path.replace(/\/+$/, '')
}

/**
 * collection entry id -> 站点 URL
 *
 * glob loader 的 id 是相对 base 的路径（不含扩展名），例如
 * `wiki/sources/foo` 或 `blog/index`。index 需要还原成目录形式。
 */
export function entryToUrl(entry: DocEntry): string {
  const raw = entry.id.replace(/\/index$/, '/')
  return `/md/${raw}`
}

/** URL -> collection entry id（用于反查） */
export function urlToEntryId(url: string): string {
  const path = normalizePath(url).replace(/^\/md\//, '')
  return path
}

/**
 * 站内绝对链接归一化。
 *
 * 正文里存在两种本地链接写法：
 *   1. `](./sources/foo.md)` —— 相对当前文件的 .md 链接
 *   2. `](/md/wiki/sources/foo)` —— 已是站点绝对路径
 * 第 1 类在 VitePress 里由其自身处理；Astro 渲染 Markdown 时不会，
 * 所以需要在渲染层把相对 .md 链接按当前文件位置解析成绝对路径。
 */
export function resolveRelativeMdLink(currentUrl: string, href: string): string | null {
  if (!href.endsWith('.md')) return null
  const currentDir = normalizePath(currentUrl).split('/').slice(0, -1).join('/')
  const segments = `${currentDir}/${href}`.split('/')
  const out: string[] = []
  for (const seg of segments) {
    if (seg === '' || seg === '.') continue
    if (seg === '..') {
      out.pop()
      continue
    }
    out.push(seg)
  }
  let path = out.join('/')
  path = path.replace(/\.md$/, '')
  // 目录 index：foo/index -> foo/
  path = path.replace(/\/index$/, '/')
  return path.startsWith('/') ? path : `/${path}`
}

/** 取出正文里的首个 H1，用作缺失 title 时的兜底 */
export function firstHeading(body: string): string | null {
  const m = body.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : null
}

/** 标题兜底链：frontmatter.title -> 首个 H1 -> 文件名 */
export function resolveTitle(entry: DocEntry, body?: string): string {
  const fm = entry.data?.title?.trim()
  if (fm) return fm
  if (body) {
    const h = firstHeading(body)
    if (h) return h
  }
  const last = entry.id.split('/').pop() ?? entry.id
  return last
}

/** 标题里的盘古之白修正：中文与英文/数字之间补半角空格 */
export function padTitle(text: string): string {
  return text.replace(/([\u4e00-\u9fa5])([A-Za-z0-9])/g, '$1 $2').replace(/([A-Za-z0-9])([\u4e00-\u9fa5])/g, '$1 $2')
}
