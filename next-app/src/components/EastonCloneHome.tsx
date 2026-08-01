import Link from 'next/link'
import type { Article, SeriesInfo, CategoryInfo } from '@/lib/blog-index'

interface Props {
  featured: Article[]
  recentList: Article[]
  topCategories: CategoryInfo[]
  featuredSeries: SeriesInfo[]
}

export default function EastonCloneHome({ featured, recentList, topCategories, featuredSeries }: Props) {
  return (
    <main className="easton-clone-page">
      <section className="easton-clone-hero">
        <p className="easton-clone-overline">AI · DEV · AUTOMATION</p>
        <h1>AI、开发、自动化<br />与独立产品笔记。</h1>
        <p>文章、指南、工具与项目笔记，覆盖 AI、开发、自动化、知识管理与独立创造。</p>
        <div className="easton-clone-actions">
          <Link href="/blog/">浏览列表</Link>
          <Link href="/blog/archive/">分类归档</Link>
        </div>
        <div className="easton-clone-search-bar">
          <span aria-hidden="true">🔍</span>
          <span>搜索问题（暂未启用）</span>
        </div>
      </section>

      <section className="easton-clone-entry">
        <div className="easton-clone-section-head">
          <span>阅读入口</span>
          <strong>从最新内容、长期专题或分类目录开始浏览。</strong>
        </div>
        <div className="easton-clone-entry-grid">
          <Link href="/blog/"><b>最新文章</b><span>查看最近发布和更新笔记</span><i>→</i></Link>
          <Link href="/blog/series/"><b>系列</b><span>按长期主题系统阅读内容</span><i>→</i></Link>
          <Link href="/blog/category/"><b>分类</b><span>按 AI、开发和商业主题浏览</span><i>→</i></Link>
        </div>
      </section>

      {featuredSeries.length > 0 && (
        <section className="easton-clone-section">
          <div className="easton-clone-section-head">
            <span>精选系列专题</span>
            <strong>每个专题都有完整的阅读路径，从第一篇系统读起。</strong>
            <Link href="/blog/series/">浏览系列 →</Link>
          </div>
          <div className="easton-clone-series-grid">
            {featuredSeries.map((s, i) => (
              <Link key={s.slug} href={`/blog/series/${s.slug}/`} className={`easton-clone-series-card tone-${i % 3}`}>
                <div className="easton-clone-art"><span>{['CODE', 'AGENT', 'SOLO'][i % 3]}</span></div>
                <small>{s.title} · {s.count} 篇</small>
                <h2>{s.title}</h2>
                <p>共 {s.count} 篇，按发布时间排序，从第一篇系统读起。</p>
                <b>从第 1 篇开始 →</b>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="easton-clone-section">
          <div className="easton-clone-section-head">
            <span>编辑精选</span>
            <strong>最近发布、值得优先阅读的文章、指南和项目笔记。</strong>
            <Link href="/blog/">查看全部 →</Link>
          </div>
          <div className="easton-clone-featured-grid">
            {featured.map((item) => (
              <Link key={item.path} href={item.path} className="easton-clone-featured-card">
                <div className="easton-clone-featured-art"></div>
                <small>{item.date} · {item.categoryTitle || item.category}</small>
                <h2>{item.title}</h2>
                <p>{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {recentList.length > 0 && (
        <section className="easton-clone-section" id="latest">
          <div className="easton-clone-section-head">
            <span>最新文章</span>
            <strong>最近发布的 AI、开发和独立产品笔记。</strong>
          </div>
          <div className="easton-clone-latest-list">
            {recentList.map((item) => (
              <Link key={item.path} href={item.path}>
                <span>{item.date}</span>
                <span>{item.categoryTitle || item.category}</span>
                <b>{item.title}</b>
                <i>↗</i>
              </Link>
            ))}
          </div>
        </section>
      )}

      {topCategories.length > 0 && (
        <section className="easton-clone-section easton-clone-categories">
          <div className="easton-clone-section-head">
            <span>按分类浏览</span>
            <strong>从开发、AI 与数字创作三个方向进入内容。</strong>
          </div>
          <div className="easton-clone-category-grid">
            {topCategories.map((cat) => (
              <Link key={cat.slug} href={`/blog/category/${cat.slug}/`}>
                <span className="easton-clone-category-icon">✦</span>
                <h2>{cat.title}</h2>
                <b>{cat.count}</b>
                <p>围绕实践、工具、工作流和长期积累的内容。</p>
                <span>进入{cat.title} →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}