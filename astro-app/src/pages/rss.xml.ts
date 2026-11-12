/**
 * RSS 订阅源
 *
 * 数据取自 docs/.vitepress/generated/blog-index.json（与博客页同源）。
 * VitePress 时期没有提供 RSS，Astro 迁移时补上。
 */
import blogIndex from '@generated/blog-index.json'

export async function GET({ site }: { site: URL }) {
  const articles = (blogIndex as any).articles ?? []

  const items = articles
    .slice(0, 50)
    .map((a: any) => {
      const url = new URL(a.path, site).href
      return `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      ${a.author ? `<author>${a.author}</author>` : ''}
      <description><![CDATA[${(a.excerpt ?? '').replace(/<!--\s*more\s*-->/g, '').trim()}]]></description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>System Vault 博客</title>
    <link>${site.origin}/md/blog/</link>
    <description>一个作者关于 AI、软件与独立创造的长期笔记。</description>
    <language>zh-CN</language>
    <atom:link href="${site.origin}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
