// src/app/pmaker/[cat]/[slug]/page.tsx
// PMaker 详情页静态路由（CF Pages + output:'export'）
// 内容来源：docs/md/pmaker-detail/*.md（build-time 读取）

import { readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { PMakerArticle } from '@/components/pmaker/PMakerArticle'
import { PMAKER_MAPPING } from '@/data/pmaker-mapping'

interface Props {
  params: Promise<{ cat: string; slug: string }>
}

// docs/md/pmaker-detail/learn__glossary.html
const DETAIL_DIR = join(process.cwd(), '..', 'docs', 'md', 'pmaker-detail')

function loadArticle(href: string) {
  // learn/glossary.html → learn__glossary.html
  const fileName = href.replace('/', '__')
  const fullPath = join(DETAIL_DIR, fileName)
  try {
    const raw = readFileSync(fullPath, 'utf-8')
    const parsed = matter(raw)
    return {
      title: (parsed.data.title as string) || href,
      content: parsed.content,
      source: parsed.data.source as string | undefined,
      date: parsed.data.date as string | undefined,
    }
  } catch (e) {
    return null
  }
}

export function generateStaticParams() {
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