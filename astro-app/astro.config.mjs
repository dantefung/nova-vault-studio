// astro.config.mjs
// System Vault —— Astro 静态站点
//
// 迁移要点：
// - output: 'static'，全站预渲染成静态 HTML（Vercel 静态托管，无 Node 运行时）
// - 内容源仍是仓库根的 docs/md，通过 content collection 的 glob loader 读取
// - docs/md 下的图片与 PDF 由 public/ 之外的 assets 管线处理（见 scripts/copy-assets.mjs）
// - 站点路由前缀保持 /md/**，与 VitePress 时期的 URL 完全一致，避免既有链接失效

import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// repo 根目录（astro-app 的父目录）
const REPO_ROOT = new URL('..', import.meta.url).pathname

export default defineConfig({
  site: 'https://vault.moneylab.ccwu.cc',
  output: 'static',
  // VitePress 用 cleanUrls：目录索引页带尾斜杠（/md/wiki/），普通页面不带（/md/wiki/sources/foo）。
  // 站内 3000+ 条链接按这个约定写，ignore 让两种写法都能命中，避免历史链接 404。
  trailingSlash: 'ignore',
  build: {
    // 目录式输出：/md/foo/ -> dist/md/foo/index.html
    format: 'directory',
    // 4000+ 页面时并发拉高会吃掉大量内存，压到 4 与 VitePress 时期一致
    concurrency: 4,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/v2/') && !page.includes('/v3/'),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  markdown: {
    // 站点自带的 Markdown 管线在 src/lib/markdown.ts（需要处理 VitePress 专有语法）
    // 这里仅对 Astro 自身的 .md（如内联说明）保留默认行为
    syntaxHighlight: 'shiki',
  },
  image: {
    // 站点内的 464MB 图片已经过 sharp 压缩（见 scripts/optimize-images.mjs），
    // 且构建期有 check-image-size 钩子守住 500KB 上限。
    // 再让 Astro 的资产管线过一遍既慢又会触发 SVG 元数据解析错误，
    // 因此关掉优化：图片按原样经 public/ 提供，URL 与 VitePress 时期一致。
    service: { entrypoint: 'astro/assets/services/noop' },
  },
  vite: {
    resolve: {
      alias: {
        '@repo': REPO_ROOT,
        '@content': REPO_ROOT + 'docs/md',
        // VitePress 时期生成的数据（blog-index / resource-nav 等）。
        // 用别名而非相对路径，避免页面层级不同导致 ../ 层级算错。
        '@generated': REPO_ROOT + 'docs/.vitepress/generated',
      },
    },
    ssr: {
      noExternal: ['@fontsource/lxgw-wenkai'],
    },
    // docs/md 下有 4000+ 文件，Vite 的 glob 扫描要放开
    server: {
      fs: {
        allow: [REPO_ROOT],
      },
    },
  },
})
