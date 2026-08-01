import Link from 'next/link'
import type { Article } from '@/lib/blog-index'

interface Props {
  recent: Article[]
}

const libraryEntries = [
  { label: '指南', description: '从基础配置到日常工作流，先从这里开始。', href: '/md/guide/getting-started', featured: true },
  { label: 'Wiki', description: '把概念、模式与实践连接成可复用的知识。', href: '/md/wiki/' },
  { label: '专栏', description: '围绕 AI、开发与独立创造的长期思考。', href: '/md/columns/' },
  { label: '书籍', description: '适合慢读、反复查阅与持续积累的书架。', href: '/md/books/' },
  { label: '教程', description: '按步骤完成具体事情的实践材料。', href: '/md/tutorial/' },
  { label: 'AGI', description: '关于智能系统、模型与未来工作的记录。', href: '/md/agi/' },
  { label: '商业', description: '市场、模式、投资与产品判断。', href: '/md/business/' },
  { label: 'Slides', description: '可横向阅读的演示与视觉化内容。', href: '/md/slides/' },
  { label: '知识库总览', description: '从概念与分类开始浏览。', href: '/md/wiki/' },
]

export default function QuietHome({ recent }: Props) {
  return (
    <main className="container">
      <section className="hero">
        <h1>System Vault</h1>
        <p>AI / Dev / Automation 知识库。{recent.length} 篇文章，按主题归档。</p>
        <p style={{ color: 'var(--theme-body)', fontSize: 14 }}>
          右上角可切换 <b>Easton</b> / <b>Easton Clone</b> 风格。
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 22 }}>知识分类入口</h2>
        <div className="grid-3" style={{ marginTop: 16 }}>
          {libraryEntries.map((entry) => (
            <Link key={entry.href} href={entry.href} className="article-card">
              <small>{entry.label}</small>
              <h2>{entry.label}</h2>
              <p>{entry.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 22 }}>最近发布</h2>
        <div className="grid-3" style={{ marginTop: 16 }}>
          {recent.slice(0, 6).map((a) => (
            <Link key={a.path} href={a.path} className="article-card">
              <small>{a.date} · {a.categoryTitle}</small>
              <h2>{a.title}</h2>
              <p>{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export function EastonHome({ recent }: Props) {
  return (
    <main className="container">
      <section className="hero">
        <h1>System Vault</h1>
        <p>Easton 风格的文档知识库首页占位。点击右上角切换到 <code>easton-clone</code> 查看博客化整体首页。</p>
        <div className="tabs">
          <span>分类导航：</span>
          <Link href="/blog/category/agentic-engineer/">Agentic Engineer</Link>
          <Link href="/blog/category/cognition/">认知</Link>
          <Link href="/blog/category/investment/">投资</Link>
        </div>
      </section>
      <section>
        <h2 style={{ fontSize: 22 }}>最近发布</h2>
        <div className="grid-3" style={{ marginTop: 16 }}>
          {recent.slice(0, 6).map((a) => (
            <Link key={a.path} href={a.path} className="article-card">
              <small>{a.date} · {a.categoryTitle}</small>
              <h2>{a.title}</h2>
              <p>{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}