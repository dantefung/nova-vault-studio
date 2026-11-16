/**
 * copy-md-assets.mjs
 *
 * Astro 集成：构建完成后把 docs/md 的静态资源直接写进 dist/md/。
 *
 * 复制两类内容：
 *   1. docs/md/** 的非 markdown 资源 -> dist/md/**（站点 URL 前缀 /md/）
 *   2. docs/public/**                -> dist/**   （favicon / slides / robots.txt 等）
 *
 * 为什么不在构建前复制到 public/：
 *   public/ 的内容会被 Vite 原样复制到 dist/，资源等于被读写两趟
 *   （站内 843MB + 72MB，构建 I/O 与临时磁盘都翻倍）。直写 dist 少一整轮拷贝。
 *
 * 为什么 PDF 默认排除（--pdf skip）：
 *   站内 111 个 PDF 全部通过 <PdfViewer repo-path="..."> 引用，
 *   生产环境按既有策略走 GitHub Raw（VitePress 时期的 utils/pdf-url.js 就是这么做的）。
 *   排除后产物从 1.4GB 降到约 1.1GB，同时消除两个超过 Cloudflare 25MiB
 *   单文件上限的 PDF（32 MiB / 40 MiB）。
 *
 * dev server 仍走 public/（npm run dev 会先复制一份到 public/），
 * 因为 dev 下 PDF 需要本地副本。
 */

import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '../..')

export default function copyMdAssets() {
  return {
    name: 'nova-copy-md-assets',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        try {
          execFileSync(
            process.execPath,
            [path.join(REPO_ROOT, 'scripts/copy-assets.mjs'), '--target', 'dist', '--pdf', 'skip'],
            { cwd: REPO_ROOT, stdio: 'inherit' }
          )
          logger.info('静态资源已直写 dist/md/')
        } catch (err) {
          logger.error(`静态资源复制失败：${err.message}`)
          throw err
        }
      },
    },
  }
}
