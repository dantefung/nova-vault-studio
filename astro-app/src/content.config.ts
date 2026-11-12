import { defineCollection, z } from 'astro:content'
import docsLoader from './lib/docs-loader'

/**
 * 日期字段的宽松解析。
 *
 * 站内 date 有多种写法：ISO（2026-10-29）、中文（2026年10月29日 08:00）、
 * 甚至只写年份（2025年）。z.coerce.date() 只认 ISO，
 * 遇到中文格式会让整个构建失败 —— 3999 篇里就有 247 篇这种写法。
 * normalize-dates.mjs 已在构建前统一改写，这里仍保留宽松解析作为双保险。
 */
const looseDate = z
  .union([z.string(), z.date(), z.number()])
  .optional()
  .transform((v) => {
    if (v === undefined || v === null) return undefined
    if (v instanceof Date) return v
    if (typeof v === 'number') return new Date(v)
    const s = String(v).trim()
    if (!s) return undefined
    const m = s.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日(?:\s+(\d{1,2}):(\d{2}))?/)
    if (m) {
      const [, y, mo, d, hh = '0', mi = '0'] = m
      return new Date(Number(y), Number(mo) - 1, Number(d), Number(hh), Number(mi))
    }
    const t = Date.parse(s)
    return Number.isNaN(t) ? s : new Date(t)
  })

/**
 * 全站内容集合。
 *
 * 内容源仍是仓库里的 docs/md/（单一事实来源，VitePress 侧暂不删除，便于并行对照与回滚）。
 * 用自定义 loader（src/lib/docs-loader.ts）而非 astro/loaders 的 glob：
 * glob loader 会让 astro:assets 接管 md 里的图片并做 sharp 优化，
 * 站内大量 SVG 会让构建因 NoImageMetadata 中断，且图片本就该按
 * VitePress 时期的原路径提供（/md/.../images/x.png），不能哈希化。
 *
 * schema 宽容：frontmatter 是历史积累的，字段缺失很多（3999 篇里 104 篇没有 title、
 * 791 篇没有 date）。硬校验会在构建期炸掉全站，所以：
 *   - title 缺失不报错，渲染时回退到首个 H1 / 文件名
 *   - date 允许各种写法，解析失败时保留原字符串
 *   - 未识别的字段一律放行（passthrough），避免新字段阻断构建
 */
const docs = defineCollection({
  loader: docsLoader,
  schema: z
    .object({
      title: z.string().optional(),
      date: looseDate,
      source: z.string().optional(),
      url: z.string().optional(),
      author: z.string().optional(),
      description: z.string().optional(),
      coverImage: z.string().optional(),
      image: z.string().optional(),
      tags: z.union([z.array(z.string()), z.string()]).optional(),
      draft: z.boolean().optional(),
      series: z.string().optional(),
      icon: z.string().optional(),
      sort: z.union([z.number(), z.string()]).optional(),
      updated: looseDate,
      created: looseDate,
      createdAt: looseDate,
      part: z.union([z.number(), z.string()]).optional(),
    })
    .passthrough(),
})

export const collections = { docs }
