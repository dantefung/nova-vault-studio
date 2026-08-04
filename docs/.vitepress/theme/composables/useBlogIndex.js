/**
 * useBlogIndex - 运行时读取博客索引（由 scripts/build-blog-index.js 预生成）
 */
import { ref, readonly, computed } from 'vue'
import blogIndex from '../../generated/blog-index.js'

const index = ref(blogIndex)

function articleByPath(path) {
  if (!path) return null
  // 同时支持带 / 末尾和不带
  const norm = path.replace(/\/$/, '')
  return index.value.articles.find(a => a.path === norm || a.path === norm + '/') || null
}

function articlesByCategory(slug) {
  if (!slug) return []
  return index.value.articles.filter(a => a.category === slug)
}

function articlesBySeries(slug) {
  if (!slug) return []
  return index.value.articles.filter(a => a.series === slug)
}

function categoryBySlug(slug) {
  return index.value.categories.find(c => c.slug === slug) || null
}

function seriesBySlug(slug) {
  return index.value.series.find(s => s.slug === slug) || null
}

function latest(n = 20) {
  return index.value.articles.slice(0, n)
}

function featuredArticles(n = 6) {
  return index.value.articles.filter(a => a.featured).slice(0, n)
}

function articlesByTag(tag) {
  return index.value.articles.filter(a => Array.isArray(a.tags) && a.tags.includes(tag))
}

function topTags(n = 30) {
  const m = new Map()
  for (const a of index.value.articles) {
    for (const t of a.tags || []) {
      m.set(t, (m.get(t) || 0) + 1)
    }
  }
  return Array.from(m.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([slug, count]) => ({ slug, count }))
}

/** 相关文章：同 series > 同 tag > 同 category > 最近，按优先级去重 */
function relatedArticles(path, n = 4) {
  const me = articleByPath(path)
  if (!me) return []
  const candidates = index.value.articles.filter(a => a.path !== me.path)
  const tagSet = new Set(me.tags || [])

  function score(a) {
    let s = 0
    if (a.series && a.series === me.series) s += 100
    if (a.category === me.category) s += 10
    if (Array.isArray(a.tags)) {
      for (const t of a.tags) if (tagSet.has(t)) s += 5
    }
    return s
  }

  return candidates
    .map(a => ({ a, s: score(a) }))
    .sort((x, y) => y.s - x.s || (y.a.date || '').localeCompare(x.a.date || ''))
    .slice(0, n)
    .map(x => x.a)
}

/** 时间归档：按年-月分组 */
function archiveGroups() {
  const groups = new Map()
  for (const a of index.value.articles) {
    const d = a.date || 'unknown'
    const ym = d.slice(0, 7) // YYYY-MM
    if (!groups.has(ym)) groups.set(ym, [])
    groups.get(ym).push(a)
  }
  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([ym, items]) => ({ slug: ym, title: ym, count: items.length, items }))
}

function neighbors(path) {
  const list = index.value.articles
  const idx = list.findIndex(a => a.path === path || a.path === path + '/')
  if (idx < 0) return { prev: null, next: null }
  return {
    prev: idx < list.length - 1 ? list[idx + 1] : null,
    next: idx > 0 ? list[idx - 1] : null,
  }
}

export function useBlogIndex() {
  return {
    index: readonly(index),
    articleByPath,
    articlesByCategory,
    articlesBySeries,
    articlesByTag,
    categoryBySlug,
    seriesBySlug,
    latest,
    featuredArticles,
    topTags,
    relatedArticles,
    archiveGroups,
    neighbors,
  }
}
