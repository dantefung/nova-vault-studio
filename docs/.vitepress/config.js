import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { MermaidPlugin, MermaidMarkdown } from 'vitepress-plugin-mermaid'
import markdownItMarkmap from './plugins/markdown-it-markmap.js'
import { generateSidebar, generateNavItems, generateNavItemsFromFiles, generateSidebarMappingForSubdirectories, generateBookNavItems } from './sidebar.js'

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
    // 禁用内嵌 HTML 解析，避免包含类似“<”的代码片段导致编译错误
    html: false,
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
        text: '文档',
        items: [
          {
            text: '指南',
            link: '/md/guide/getting-started',
          },
          {
            text: '特性',
            link: '/md/sitelog/features/charts'
          },
          {
            text: '架构',
            link: '/md/sitelog/architecture/core-principles'
          },
          {
            text: '演进',
            link: '/md/sitelog/evolution/milestones'
          },
          {
            text: '参考',
            link: '/md/sitelog/reference/overview'
          }
        ]
      },
      {
        text: '书籍',
        items: [
          { text: '书籍库', link: '/md/books/' },
          ...generateBookNavItems('docs/md/books', '/md/books/')
        ]
      },
      {
        text: '教程',
        items: generateNavItems('docs/md/tutorial', '/md/tutorial/')
      },
      {
        text: 'AGI',
        items: generateNavItems('docs/md/agi', '/md/agi/')
      }
    ],
    sidebar: {
      '/md/guide/': generateSidebar('docs/md/guide', '/md/guide/'),
      '/md/sitelog/features/': generateSidebar('docs/md/sitelog/features', '/md/sitelog/features/'),
      '/md/sitelog/architecture/': generateSidebar('docs/md/sitelog/architecture', '/md/sitelog/architecture/'),
      '/md/sitelog/evolution/': generateSidebar('docs/md/sitelog/evolution', '/md/sitelog/evolution/'),
      '/md/sitelog/reference/': generateSidebar('docs/md/sitelog/reference', '/md/sitelog/reference/'),
      '/md/tutorial/': generateSidebar('docs/md/tutorial', '/md/tutorial/'),
      '/md/agi/': generateSidebar('docs/md/agi', '/md/agi/'),
      '/md/books/': generateBookNavItems('docs/md/books', '/md/books/'),
      ...generateSidebarMappingForSubdirectories('docs/md/tutorial', '/md/tutorial/'),
      ...generateSidebarMappingForSubdirectories('docs/md/agi', '/md/agi/')
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
