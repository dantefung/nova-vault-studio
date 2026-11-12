/**
 * PDF 书籍清单接口
 *
 * 数据来自 scripts/generate-pdf-pages.js 生成的 manifest
 * （docs/.vitepress/theme/data/pdf-manifest.js），转成 JSON 提供给客户端。
 *
 * 客户端的 <pdf-list> 自定义元素据此渲染左侧目录。
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '../../..')

export async function GET() {
  const manifestPath = path.join(REPO_ROOT, 'docs/.vitepress/theme/data/pdf-manifest.js')

  if (!fs.existsSync(manifestPath)) {
    return new Response('[]', {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  const raw = fs.readFileSync(manifestPath, 'utf8')
  // 形如：export default [ ... ]
  const start = raw.indexOf('[')
  const end = raw.lastIndexOf(']')
  const json = start >= 0 && end > start ? raw.slice(start, end + 1) : '[]'

  return new Response(json, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
