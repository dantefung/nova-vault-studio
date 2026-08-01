import Link from 'next/link'
import { cookies } from 'next/headers'
import SiteHeader from '@/components/SiteHeader'
import { readLandingThemeFromCookies } from '@/lib/theme'
import { archiveGroups } from '@/lib/blog-index'

export default async function ArchivePage() {
  const cookieStore = await cookies()
  const theme = readLandingThemeFromCookies(cookieStore)
  const groups = archiveGroups()

  return (
    <>
      <SiteHeader theme={theme} />
      <main className="container">
        <h1 style={{ margin: '0 0 8px' }}>时间归档</h1>
        <p className="muted" style={{ margin: '0 0 32px' }}>
          按年-月倒序，共 {Object.keys(groups).length} 个月。
        </p>

        {Object.entries(groups).map(([ym, articles]) => (
          <section key={ym} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, borderBottom: '1px solid var(--theme-rule)', paddingBottom: 8 }}>
              {ym} <span className="muted" style={{ fontSize: 14, fontWeight: 400 }}>· {articles.length} 篇</span>
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {articles.map((a) => (
                <li key={a.path}>
                  <Link
                    href={a.path}
                    style={{ display: 'flex', gap: 16, alignItems: 'baseline', padding: '6px 0' }}
                  >
                    <span className="muted" style={{ fontSize: 13, minWidth: 80 }}>{a.date}</span>
                    <span style={{ flex: 1 }}>
                      <b style={{ fontSize: 15 }}>{a.title}</b>
                      <span className="muted" style={{ fontSize: 13, marginLeft: 8 }}>{a.categoryTitle}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <footer className="footer">
        <p>System Vault · Next.js rebuild · 主题：{theme}</p>
      </footer>
    </>
  )
}