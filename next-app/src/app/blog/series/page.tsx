import Link from 'next/link'
import { cookies } from 'next/headers'
import SiteHeader from '@/components/SiteHeader'
import { readLandingThemeFromCookies } from '@/lib/theme'
import { allSeries, articlesBySeries } from '@/lib/blog-index'

export default async function SeriesIndexPage() {
  const cookieStore = await cookies()
  const theme = readLandingThemeFromCookies(cookieStore)
  const series = allSeries()

  return (
    <>
      <SiteHeader theme={theme} />
      <main className="container">
        <h1 style={{ margin: '0 0 8px' }}>系列</h1>
        <p className="muted" style={{ margin: '0 0 32px' }}>
          共 {series.length} 个系列，按文章数倒序。
        </p>

        {series.length === 0 ? (
          <p className="muted">暂无系列。</p>
        ) : (
          <div className="grid-3">
            {series.map((s) => {
              const sample = articlesBySeries(s.slug).slice(0, 3)
              return (
                <Link key={s.slug} href={`/blog/series/${s.slug}/`} className="article-card">
                  <small>{s.title}</small>
                  <h2>{s.title}</h2>
                  <p>共 {s.count} 篇。{sample.length} 个示例：</p>
                  {sample.length > 0 && (
                    <ul style={{ margin: '8px 0 0', padding: '0 0 0 16px', color: 'var(--theme-body)', fontSize: 13 }}>
                      {sample.map((a) => (
                        <li key={a.path}>{a.title}</li>
                      ))}
                    </ul>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </main>
      <footer className="footer">
        <p>System Vault · Next.js rebuild · 主题：{theme}</p>
      </footer>
    </>
  )
}