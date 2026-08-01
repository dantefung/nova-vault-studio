import Link from 'next/link'
import { cookies } from 'next/headers'
import SiteHeader from '@/components/SiteHeader'
import { readLandingThemeFromCookies } from '@/lib/theme'
import { latest, allCategories, allSeries, articlesByCategory, articlesBySeries } from '@/lib/blog-index'

interface PageProps {
  searchParams: Promise<{ view?: string }>
}

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const cookieStore = await cookies()
  const theme = readLandingThemeFromCookies(cookieStore)
  const sp = await searchParams
  const rawView = sp?.view || 'latest'
  const view: 'latest' | 'category' | 'series' =
    rawView === 'category' || rawView === 'series' ? rawView : 'latest'

  type Item = {
    path: string
    title: string
    date: string
    excerpt: string
    categoryTitle: string
    sub?: string
  }
  let items: Item[] = []
  let subtitle = '最近发布的所有文章'
  let viewTitle = '最新文章'

  if (view === 'category') {
    viewTitle = '按分类浏览'
    subtitle = '所有分类的文章合并展示'
    for (const cat of allCategories()) {
      const arr = articlesByCategory(cat.slug).slice(0, 3)
      for (const a of arr) items.push({ ...a, sub: cat.title })
    }
  } else if (view === 'series') {
    viewTitle = '按系列浏览'
    subtitle = '所有系列的文章合并展示'
    for (const s of allSeries()) {
      const arr = articlesBySeries(s.slug).slice(0, 3)
      for (const a of arr) items.push({ ...a, sub: s.title })
    }
  } else {
    items = latest(50) as any
  }

  return (
    <>
      <SiteHeader theme={theme} />
      <main className="container">
        <div className="flex between mb-8">
          <div>
            <h1 style={{ margin: 0 }}>博客</h1>
            <p className="muted" style={{ margin: '4px 0 0' }}>{subtitle}</p>
          </div>
          <div className="tabs" role="tablist">
            <Link href="/blog/" className={view === 'latest' ? 'active' : ''}>最新</Link>
            <Link href="/blog/?view=category" className={view === 'category' ? 'active' : ''}>分类</Link>
            <Link href="/blog/?view=series" className={view === 'series' ? 'active' : ''}>系列</Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {items.map((a) => (
            <Link
              key={a.path}
              href={a.path}
              className="article-card"
              style={{ borderRadius: 0, borderLeft: 0, borderRight: 0 }}
            >
              <small>
                {a.date} · {a.categoryTitle}
                {a.sub ? ` · ${a.sub}` : ''}
              </small>
              <h2>{a.title}</h2>
              <p>{a.excerpt}</p>
            </Link>
          ))}
        </div>

        {items.length === 0 && <p className="muted">暂无文章。</p>}
      </main>
      <footer className="footer">
        <p>System Vault · Next.js rebuild · 主题：{theme}</p>
      </footer>
    </>
  )
}