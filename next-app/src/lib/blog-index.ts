// src/lib/blog-index.ts
// 读取 docs/.vitepress/generated/blog-index.json
// 提供查询助手，对应原 VitePress 主题中的 useBlogIndex.js

import fs from 'node:fs'
import path from 'node:path'

const HARD_ROOT = '/home/fenghaolin/workspace/prj/opensource/nova-vault-studio.worktree-next'
const ENV_ROOT = process.env.SYSTEM_VAULT_ROOT
const CWD = process.cwd()

function findRepoRoot(): string {
  const candidates = [
    ENV_ROOT,
    HARD_ROOT,
    CWD,
    path.resolve(CWD, '..'),
    path.resolve(CWD, '../..'),
  ].filter(Boolean) as string[]
  for (const p of candidates) {
    if (fs.existsSync(path.join(p, 'docs/.vitepress/generated/blog-index.json'))) {
      return p
    }
  }
  return CWD
}

const REPO_ROOT = findRepoRoot()
const INDEX_PATH = path.join(REPO_ROOT, 'docs/.vitepress/generated/blog-index.json')

export interface Article {
  id: number
  path: string
  title: string
  date: string
  category: string
  categoryTitle: string
  tags: string[]
  series: string | null
  cover: string | null
  readingTime: number
  featured: boolean
  excerpt: string
  author: string | null
  source: string | null
  url: string | null
  layout: string | null
}

export interface CategoryInfo {
  slug: string
  title: string
  count: number
}

export interface SeriesInfo {
  slug: string
  title: string
  count: number
}

export interface BlogIndex {
  generatedAt: string
  articles: Article[]
  series: SeriesInfo[]
  categories: CategoryInfo[]
}

let cached: BlogIndex | null = null

export function loadBlogIndex(): BlogIndex {
  if (cached) return cached
  // 多路径回退：dev/build/runtime 路径可能不同
  const candidates = [
    INDEX_PATH,
    path.join(process.cwd(), 'docs/.vitepress/generated/blog-index.json'),
    path.join(process.cwd(), '../docs/.vitepress/generated/blog-index.json'),
    path.join(process.cwd(), '../../docs/.vitepress/generated/blog-index.json'),
    HARD_ROOT + '/docs/.vitepress/generated/blog-index.json',
  ]
  let found: string | null = null
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue
    const stat = fs.statSync(p)
    if (stat.size < 1024) continue
    found = p
    break
  }
  if (!found) {
    throw new Error(
      `blog-index.json not found. Run: cd ${REPO_ROOT} && node scripts/build-blog-index.js`
    )
  }
  const raw = fs.readFileSync(found, 'utf8')
  cached = JSON.parse(raw) as BlogIndex
  return cached
}

export function latest(n = 20): Article[] {
  return loadBlogIndex().articles.slice(0, n)
}

export function articleByPath(p: string): Article | null {
  if (!p) return null
  const norm = p.replace(/\/$/, '')
  return (
    loadBlogIndex().articles.find(
      (a) => a.path === norm || a.path === norm + '/'
    ) || null
  )
}

export function articlesByCategory(slug: string): Article[] {
  return loadBlogIndex().articles.filter((a) => a.category === slug)
}

export function articlesBySeries(slug: string): Article[] {
  return loadBlogIndex().articles.filter((a) => a.series === slug)
}

export function categoryBySlug(slug: string): CategoryInfo | null {
  return loadBlogIndex().categories.find((c) => c.slug === slug) || null
}

export function seriesBySlug(slug: string): SeriesInfo | null {
  return loadBlogIndex().series.find((s) => s.slug === slug) || null
}

export function allCategories(): CategoryInfo[] {
  return loadBlogIndex().categories
}

export function allSeries(): SeriesInfo[] {
  return loadBlogIndex().series
}

/** 按年-月分组：返回 { '2026-08': [...], '2026-07': [...] } */
export function archiveGroups(): Record<string, Article[]> {
  const groups: Record<string, Article[]> = {}
  for (const a of loadBlogIndex().articles) {
    const ym = (a.date || '').slice(0, 7)
    if (!ym) continue
    if (!groups[ym]) groups[ym] = []
    groups[ym].push(a)
  }
  return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)))
}

/** 相关文章：同 series > 同 tag > 同 category > 最近 */
export function relatedArticles(p: string, n = 4): Article[] {
  const me = articleByPath(p)
  if (!me) return []
  const idx = loadBlogIndex().articles
  const tagSet = new Set(me.tags || [])
  const candidates = idx.filter((a) => a.path !== me.path)
  function score(a: Article) {
    let s = 0
    if (a.series && a.series === me.series) s += 100
    if (a.category === me.category) s += 10
    if (Array.isArray(a.tags)) {
      for (const t of a.tags) if (tagSet.has(t)) s += 5
    }
    return s
  }
  return candidates
    .map((a) => ({ a, s: score(a) }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s || (y.a.date || '').localeCompare(x.a.date || ''))
    .slice(0, n)
    .map((x) => x.a)
}

/** 上下篇：基于文章在排序列表中的位置 */
export function neighbors(p: string): { prev: Article | null; next: Article | null } {
  const list = loadBlogIndex().articles
  const idx = list.findIndex((a) => a.path === p || a.path === p + '/')
  if (idx < 0) return { prev: null, next: null }
  return {
    prev: idx < list.length - 1 ? list[idx + 1] : null,
    next: idx > 0 ? list[idx - 1] : null,
  }
}

export const REPO_ROOT_PATH = REPO_ROOT