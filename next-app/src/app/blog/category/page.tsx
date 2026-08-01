import Link from 'next/link'
import { cookies } from 'next/headers'
import SiteHeader from '@/components/SiteHeader'
import { readLandingThemeFromCookies } from '@/lib/theme'
import { allCategories } from '@/lib/blog-index'

export default async function CategoryIndexPage() {
  const cookieStore = await cookies()
  const theme = readLandingThemeFromCookies(cookieStore)
  const categories = allCategories()

  return (
    <>
      <SiteHeader theme={theme} />
      <main className="container">
        <h1 style={{ margin: '0 0 8px' }}>分类</h1>
        <p className="muted" style={{ margin: '0 0 32px' }}>
          共 {categories.length} 个分类，按文章数倒序。
        </p>

        {categories.length === 0 ? (
          <p className="muted">暂无分类。</p>
        ) : (
          <div className="grid-3">
            {categories.map((c) => (
              <Link key={c.slug} href={`/blog/category/${c.slug}/`} className="article-card">
                <small>{c.slug}</small>
                <h2>{c.title}</h2>
                <p>共 {c.count} 篇文章。</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <footer className="footer">
        <p>System Vault · Next.js rebuild · 主题：{theme}</p>
      </footer>
    </>
  )
}