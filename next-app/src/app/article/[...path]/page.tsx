import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import SiteHeader from '@/components/SiteHeader'
import { readLandingThemeFromCookies } from '@/lib/theme'
import { loadAllArticles, articleByUrlPath } from '@/lib/article-loader'
import { relatedArticles, neighbors } from '@/lib/blog-index'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: true, linkify: true, typographer: false })

export async function generateStaticParams() {
  return loadAllArticles().map((a) => ({
    path: a.urlPath.replace(/^\/md\//, '').split('/'),
  }))
}

interface Props {
  params: Promise<{ path: string[] }>
}

export default async function ArticlePage({ params }: Props) {
  const { path: pathParts } = await params
  const urlPath = '/md/' + (pathParts || []).join('/')
  const article = articleByUrlPath(urlPath)
  const cookieStore = await cookies()
  const theme = readLandingThemeFromCookies(cookieStore)
  const related = article ? relatedArticles(urlPath, 4) : []
  const nb = article ? neighbors(urlPath) : { prev: null, next: null }

  if (!article) {
    return (
      <>
        <SiteHeader theme={theme} />
        <main className="container" style={{ maxWidth: 780 }}>
          <p className="muted">文章不存在。</p>
          <Link href="/">← 返回首页</Link>
        </main>
      </>
    )
  }

  const fm = article.frontmatter

  return (
    <>
      <SiteHeader theme={theme} />
      <main className="container" style={{ maxWidth: 780 }}>
        <nav style={{ fontSize: 13, marginBottom: 24 }}>
          <Link href="/">首页</Link> ·{' '}
          <Link href="/blog/">列表</Link>
          {fm.category && (
            <>
              {' · '}
              <Link href={`/blog/category/${fm.category}/`}>分类</Link>
            </>
          )}
        </nav>

        <article
          style={{
            background: 'var(--theme-surface)',
            padding: 32,
            borderRadius: 16,
            border: '1px solid var(--theme-rule)',
          }}
        >
          <header
            style={{
              marginBottom: 24,
              borderBottom: '1px solid var(--theme-rule)',
              paddingBottom: 16,
            }}
          >
            <small className="muted">
              {fm.date || ''}
              {fm.source ? ` · 来源 ${fm.source}` : ''}
              {fm.author ? ` · ${fm.author}` : ''}
              {fm.readingTime ? ` · ${fm.readingTime} 分钟` : ''}
            </small>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 32, margin: '8px 0' }}>
              {fm.title || 'Untitled'}
            </h1>
          </header>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: md.render(article.content) }}
          />
        </article>

        {(nb.prev || nb.next) && (
          <nav
            style={{
              marginTop: 32,
              display: 'flex',
              gap: 16,
              justifyContent: 'space-between',
            }}
          >
            <div style={{ flex: 1 }}>
              {nb.next && (
                <Link
                  href={nb.next.path}
                  className="article-card"
                  style={{ display: 'block' }}
                >
                  <small>← 上一篇</small>
                  <h2 style={{ fontSize: 15, margin: '4px 0' }}>{nb.next.title}</h2>
                </Link>
              )}
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              {nb.prev && (
                <Link
                  href={nb.prev.path}
                  className="article-card"
                  style={{ display: 'block' }}
                >
                  <small>下一篇 →</small>
                  <h2 style={{ fontSize: 15, margin: '4px 0' }}>{nb.prev.title}</h2>
                </Link>
              )}
            </div>
          </nav>
        )}

        {related.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 18 }}>相关文章</h2>
            <div className="grid-2" style={{ marginTop: 12 }}>
              {related.map((r) => (
                <Link key={r.path} href={r.path} className="article-card">
                  <small>{r.date} · {r.categoryTitle}</small>
                  <h2>{r.title}</h2>
                  <p>{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <footer className="footer">
        <p>System Vault · Next.js rebuild · 主题：{theme}</p>
      </footer>
    </>
  )
}