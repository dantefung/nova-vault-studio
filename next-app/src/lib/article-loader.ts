// src/lib/article-loader.ts
// 通过 fs walk 加载所有 markdown
// SSR 模式下直接用 fs，不需要 build-time glob。

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { REPO_ROOT_PATH } from './blog-index'

const CONTENT_DIRS = [
  'docs/md/wiki/sources',
  'docs/md/wiki/journal',
  'docs/md/wiki/read-later',
  'docs/md/columns',
  'docs/md/business',
]

export interface LoadedArticle {
  urlPath: string
  filePath: string
  frontmatter: Record<string, any>
  content: string
  excerpt: string
}

function toUrlPath(absFile: string): string {
  const idx = absFile.lastIndexOf('docs/md/')
  if (idx < 0) return '/'
  const rel = absFile.slice(idx + 'docs/md/'.length).replace(/\.md$/, '')
  return '/md/' + rel
}

function* walkMarkdown(dir: string): Generator<string> {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walkMarkdown(full)
    } else if (entry.isFile() && /\.md$/i.test(entry.name) && !/^index\./i.test(entry.name)) {
      yield full
    }
  }
}

let cached: LoadedArticle[] | null = null

export function loadAllArticles(): LoadedArticle[] {
  if (cached) return cached
  const out: LoadedArticle[] = []
  for (const relDir of CONTENT_DIRS) {
    const absDir = path.join(REPO_ROOT_PATH, relDir)
    if (!fs.existsSync(absDir)) continue
    for (const absFile of walkMarkdown(absDir)) {
      const raw = fs.readFileSync(absFile, 'utf8')
      if (!raw.trim()) continue
      let data: any = {}
      let content = raw
      try {
        const parsed = matter(raw)
        data = parsed.data
        content = parsed.content
      } catch {
        // ignore
      }
      out.push({
        urlPath: toUrlPath(absFile),
        filePath: absFile,
        frontmatter: data,
        content,
        excerpt: data.excerpt || content.slice(0, 200).replace(/\s+/g, ' ').trim(),
      })
    }
  }
  out.sort((a, b) => {
    const da = String(a.frontmatter.date || '')
    const db = String(b.frontmatter.date || '')
    return db.localeCompare(da)
  })
  cached = out
  return out
}

export function articleByUrlPath(urlPath: string): LoadedArticle | null {
  const norm = urlPath.replace(/\/$/, '')
  return (
    loadAllArticles().find(
      (a) => a.urlPath === norm || a.urlPath === norm + '/'
    ) || null
  )
}