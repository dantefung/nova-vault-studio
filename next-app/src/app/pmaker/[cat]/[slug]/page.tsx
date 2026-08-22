// src/app/pmaker/[cat]/[slug]/page.tsx
// PMaker 风格 URL 的统一处理点
// 由 next.config.mjs 的 rewrites 把 /learn/xxx /patterns/xxx /basics/xxx
// 重写到 /pmaker/[cat]/[slug]
//
// 内容来源：build-time 嵌入到 .ts（CF Workers 不能读 fs，JSON import
// 在 OpenNext bundle 里被 tree-shake 掉，所以 hardcode 成 TS const）

import matter from 'gray-matter'
import { PMakerArticle } from '@/components/pmaker/PMakerArticle'
import { PMAKER_CONTENT_DATA } from '@/data/pmaker-content-inline'

const PMAKER_CONTENT: Record<string, string> = PMAKER_CONTENT_DATA

interface Props {
  params: Promise<{ cat: string; slug: string }>
}

function loadArticle(href: string) {
  const raw = PMAKER_CONTENT[href]
  if (!raw) return null
  const parsed = matter(raw)
  return {
    title: (parsed.data.title as string) || href,
    content: parsed.content,
    source: parsed.data.source as string | undefined,
    date: parsed.data.date as string | undefined,
  }
}

export async function generateStaticParams() {
  const { PMAKER_MAPPING } = await import('@/data/pmaker-mapping')
  return Object.keys(PMAKER_MAPPING).map((href) => {
    const clean = href.replace(/\.html$/, '')
    const parts = clean.split('/')
    return { cat: parts[0], slug: parts[1] }
  })
}

export default async function PMakerPage({ params }: Props) {
  const { cat, slug } = await params
  const pmakerHref = `${cat}/${slug}.html`
  const article = loadArticle(pmakerHref)
  return <PMakerArticle pmakerHref={pmakerHref} article={article} />
}