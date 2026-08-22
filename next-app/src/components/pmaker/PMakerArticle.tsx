// src/components/pmaker/PMakerArticle.tsx
// PMaker 详情页视觉壳：crumbs + stage + doc + secnav + prose + related
// 内容来自 docs/md/pmaker-detail/（build-time 静态导入）

import Link from 'next/link'
import MarkdownIt from 'markdown-it'
import { TopBar } from './TopBar'
import { Foot } from './Foot'
import { CATS } from '@/data/pmaker'
import { GRADIENTS } from '@/data/pmaker'
import { PMAKER_MAPPING } from '@/data/pmaker-mapping'

const md = new MarkdownIt({ html: true, linkify: true, typographer: false })

interface Article {
  title: string
  content: string
  source?: string
  date?: string
}

interface Props {
  pmakerHref: string
  article: Article | null
}

function stripHtml(s: string): string {
  return s.replace(/\.html$/, '')
}

function getSiblingHrefs(cat: string, currentHref: string) {
  return Object.entries(PMAKER_MAPPING)
    .filter(([_, m]) => m.cat === cat)
    .map(([href, m]) => ({ href, ...m }))
    .slice(0, 8)
}

function getRelatedArticles(cat: string, currentHref: string) {
  const siblings = getSiblingHrefs(cat, currentHref)
  return siblings
    .filter((s) => s.href !== currentHref)
    .slice(0, 4)
    .map((s) => {
      const cat = CATS[s.cat]
      return {
        href: '/' + stripHtml(s.href),
        name: getCardTitle(s.href) || s.href,
        catName: cat?.name || '',
      }
    })
}

function getCardTitle(href: string): string | null {
  for (const cid in CATS) {
    const cat = CATS[cid]
    for (const row of cat.rows) {
      for (const card of row.cards) {
        if (card.href === href || ('/' + card.href) === href) {
          return card.name
        }
      }
    }
  }
  return null
}

export function PMakerArticle({ pmakerHref, article }: Props) {
  const mapping = PMAKER_MAPPING[pmakerHref]
  const cat = mapping?.cat || 'basics'
  const cardTitle = getCardTitle(pmakerHref) || article?.title || '未命名文章'
  const catInfo = CATS[cat]
  const stageBg = GRADIENTS[cat]?.g || '#f4f3f1'
  const related = mapping ? getRelatedArticles(mapping.cat, pmakerHref) : []

  const html = article ? md.render(article.content) : ''

  const navItems = mapping ? getSiblingHrefs(mapping.cat, pmakerHref).map((s) => ({
    href: '/' + stripHtml(s.href),
    name: getCardTitle(s.href) || s.href,
    active: s.href === pmakerHref,
  })) : []

  return (
    <>
      <TopBar />

      <nav className="crumb">
        <Link href="/#top">PMaker</Link>
        <span>›</span>
        {catInfo && (
          <>
            <Link href={`/#${cat}`}>{catInfo.name}</Link>
            <span>›</span>
          </>
        )}
        <span className="crumb__here">{cardTitle}</span>
      </nav>

      <section className="stage">
        <div className="stage__inner" style={{ background: stageBg }}>
          <div style={{ textAlign: 'center', maxWidth: 720 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--ink-faint)', textTransform: 'uppercase', marginBottom: 12 }}>
              {catInfo?.name || cat}
            </div>
            <h1 style={{
              fontFamily: 'var(--serif)',
              fontSize: '40px',
              lineHeight: 1.4,
              letterSpacing: '0.01em',
              fontWeight: 400,
              margin: 0,
              color: 'var(--ink)',
            }}>
              {cardTitle}
            </h1>
          </div>
        </div>
      </section>

      <main className="doc">
        {navItems.length > 0 && (
          <nav className="secnav">
            <div className="secnav__list">
              <div style={{
                fontSize: 11,
                letterSpacing: '0.12em',
                color: 'var(--ink-faint)',
                textTransform: 'uppercase',
                marginBottom: 4,
                fontWeight: 700,
              }}>
                {catInfo?.name}
              </div>
              {navItems.map((n) => (
                <Link key={n.href} href={n.href} className={n.active ? 'is-active' : ''}>
                  {n.name}
                </Link>
              ))}
            </div>
          </nav>
        )}

        {article ? (
          <article className="prose">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </article>
        ) : (
          <article className="prose">
            <div className="symptoms">
              <div className="symptoms__label">状态</div>
              <ul>
                <li>该文章暂未抓到</li>
              </ul>
            </div>
            <p>
              <code>{pmakerHref}</code> 内容缺失。请重新运行 <code>scripts/fetch-pmaker-details.py</code>。
            </p>
          </article>
        )}

        {related.length > 0 && (
          <section className="related" style={{ marginTop: 80 }}>
            {related.map((r) => (
              <Link key={r.href} href={r.href} className="related__item">
                <div className="related__art" aria-hidden="true">
                  <div style={{
                    height: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'rgba(22,21,26,.4)',
                    fontSize: 13,
                    fontFamily: 'var(--serif)',
                  }}>
                    {r.catName}
                  </div>
                </div>
                <h3 className="related__name">{r.name}</h3>
                <p className="related__why">来自「{r.catName}」章节的相关模式</p>
              </Link>
            ))}
          </section>
        )}
      </main>

      <Foot />
    </>
  )
}