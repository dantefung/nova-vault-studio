/**
 * 站内搜索
 *
 * 索引由 scripts/build-astro-search-index.mjs 在构建期生成
 * （public/search-index.json），客户端做子串匹配。
 *
 * 与 VitePress 时期的差异：VitePress 用 minisearch 做全量分词索引，
 * 3999 篇文档在构建期全部渲染一遍，Vercel 上内存压力大到要降级 partial 模式
 * （见 docs/.vitepress/config.js 的 SEARCH_MODE）。这里只索引标题 + 摘要 + 首段，
 * 索引体积小一个数量级，构建期不渲染正文。
 */

interface SearchEntry {
  /** title */
  t: string
  /** url */
  u: string
  /** description */
  d: string
  /** category */
  c: string
}

let cache: SearchEntry[] | null = null
let loading: Promise<SearchEntry[]> | null = null

function loadIndex(): Promise<SearchEntry[]> {
  if (cache) return Promise.resolve(cache)
  if (!loading) {
    loading = fetch('/search-index.json')
      .then((r) => r.json())
      .then((data: SearchEntry[]) => {
        cache = data
        return data
      })
      .catch(() => [] as SearchEntry[])
  }
  return loading
}

/** 打分：标题命中权重最高，其次摘要，再次分类 */
function score(entry: SearchEntry, query: string): number {
  const q = query.toLowerCase()
  const t = entry.t.toLowerCase()
  const d = entry.d.toLowerCase()

  if (t === q) return 1000
  if (t.startsWith(q)) return 500
  if (t.includes(q)) return 300
  if (d.includes(q)) return 100
  if (entry.c.toLowerCase().includes(q)) return 50
  return 0
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      default: return '&#39;'
    }
  })
}

function highlight(text: string, query: string): string {
  const safe = escapeHtml(text)
  if (!query) return safe
  const idx = safe.toLowerCase().indexOf(query.toLowerCase())
  if (idx < 0) return safe
  return `${safe.slice(0, idx)}<mark>${safe.slice(idx, idx + query.length)}</mark>${safe.slice(idx + query.length)}`
}

export function initSearch(root: HTMLElement) {
  const input = root.querySelector<HTMLInputElement>('.vp-search-input')
  const results = root.querySelector<HTMLElement>('.vp-search-results')
  if (!input || !results) return

  let items: SearchEntry[] = []
  let ready = false

  const render = (query: string) => {
    if (!query.trim()) {
      results.hidden = true
      results.innerHTML = ''
      return
    }
    const q = query.trim()
    const hits = items
      .map((entry) => ({ entry, s: score(entry, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)

    if (!hits.length) {
      results.innerHTML = '<p class="vp-search-empty">没有匹配的结果</p>'
      results.hidden = false
      return
    }

    results.innerHTML = hits
      .map(
        ({ entry }) => `
        <a class="vp-search-item" href="${entry.u}">
          <span class="vp-search-item-title">${highlight(entry.t, q)}</span>
          <span class="vp-search-item-desc">${highlight(entry.d.slice(0, 120), q)}</span>
        </a>`
      )
      .join('')
    results.hidden = false
  }

  const ensureIndex = async () => {
    if (ready) return
    items = await loadIndex()
    ready = true
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  input.addEventListener('input', () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(async () => {
      await ensureIndex()
      render(input.value)
    }, 120)
  })

  input.addEventListener('focus', async () => {
    await ensureIndex()
    if (input.value.trim()) render(input.value)
  })

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target as Node)) {
      results.hidden = true
    }
  })

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      results.hidden = true
      input.blur()
    }
  })
}
