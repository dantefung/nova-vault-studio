import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import SiteHeader from '@/components/SiteHeader'
import { readLandingThemeFromCookies } from '@/lib/theme'
import { allCategories, categoryBySlug, articlesByCategory } from '@/lib/blog-index'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return allCategories().map((c) => ({ slug: c.slug }))
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params
  const cat = categoryBySlug(slug)
  if (!cat) return notFound()
  const articles = articlesByCategory(slug)

  const cookieStore = await cookies()
  const theme = readLandingThemeFromCookies(cookieStore)

  return (
    <>
      <SiteHeader theme={theme} />
      <main className="container">
        {!cat && <p className="muted">分类不存在。</p>}
        {cat && (
          <>
            <Link href="/blog/category/" style={{ fontSize: 13 }}>← 全部分类</Link>
            <h1 style={{ margin: '8px 0 8px' }}>{cat.title}</h1>
            <p className="muted" style={{ margin: '0 0 32px' }}>
              共 {articles.length} 篇，按发布时间倒序。
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {articles.map((a) => (
                <Link
                  key={a.path}
                  href={a.path}
                  className="article-card"
                  style={{ borderRadius: 0, borderLeft: 0, borderRight: 0 }}
                >
                  <small>
                    {a.date}
                    {a.series ? ` · 系列 ${a.series}` : ''}
                  </small>
                  <h2>{a.title}</h2>
                  <p>{a.excerpt}</p>
                </Link>
              ))}
            </div>

            {articles.length === 0 && <p className="muted">该分类暂无文章。</p>}
          </>
        )}
      </main>
      <footer className="footer">
        <p>System Vault · Next.js rebuild · 主题：{theme}</p>
      </footer>
    </>
  )
}