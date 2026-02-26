import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { MermaidPlugin, MermaidMarkdown } from 'vitepress-plugin-mermaid'
import markdownItMarkmap from './plugins/markdown-it-markmap.js'
import { generateSidebar } from './sidebar.js'

export default defineConfig({
  ignoreDeadLinks: true,
  title: 'System Vault',
  description: '系统知识库 - 凡是过往，皆为序章',
  lastUpdated: true,
  cleanUrls: true,
  lang: 'zh-CN',
  sitemap: {
    hostname: 'https://system-vault.site'
  },
  head: (() => {
    const isCdn = (process.env.VITE_FONT_SOURCE || 'local') === 'cdn'
    const head = [
      ['link', { rel: "icon", type: "image/png", href: "/favicon.png" }],
      ['script', { src: '/_vercel/insights/script.js', defer: '' }],
      ['meta', { name: 'theme-color', content: '#3c8772' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: 'System Vault | 系统知识库' }],
      ['meta', { property: 'og:description', content: '系统知识库 - 凡是过往，皆为序章' }],
    ]
    if (isCdn) {
      head.push(['link', { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' }])
      head.push(['link', { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' }])
    }
    return head
  })(),
  markdown: {
    headers: {
      level: [0, 1]
    },
    config: (md) => {
      md.use(markdownItMarkmap)
      md.use(MermaidMarkdown)
    }
  },
  vite: {
    plugins: [MermaidPlugin()],
    optimizeDeps: { include: ['mermaid'] },
    ssr: { noExternal: ['mermaid'] }
  },
  themeConfig: {
    // 启用页面顶栏搜索
    search: {
      provider: 'local',            // 使用内置的本地全文索引
      options: {
        // flexible 配置可以根据需要定制，例如语言、最大建议条数等
        // lang 参数帮助处理中文分词，默认会自动尝试检测
        // 参见：https://vitepress.dev/guide/search
        maxSuggestions: 10,
      }
    },

    nav: [
      {
        text: '指南',
        link: '/md/guide/getting-started',
      },
      {
        text: '特性',
        link: '/md/features/charts'
      },
      {
        text: '架构',
        link: '/md/architecture/core-principles'
      },
      {
        text: '演进',
        link: '/md/evolution/milestones'
      },
      {
        text: '参考',
        link: '/md/reference/overview'
      },
    ],
    sidebar: {
      '/md/guide/': generateSidebar('docs/md/guide', '/md/guide/'),
      '/md/features/': generateSidebar('docs/md/features', '/md/features/'),
      '/md/architecture/': generateSidebar('docs/md/architecture', '/md/architecture/'),
      '/md/evolution/': generateSidebar('docs/md/evolution', '/md/evolution/'),
      '/md/reference/': generateSidebar('docs/md/reference', '/md/reference/'),
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dantefung/system-vault' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present DANTE FUNG'
    },
  },
});
