import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { MermaidPlugin, MermaidMarkdown } from 'vitepress-plugin-mermaid'
import markdownItMarkmap from './plugins/markdown-it-markmap.js'
import { generateSidebar, generateNavItems, generateNavItemsFromFiles, generateSidebarMappingForSubdirectories, generateBookNavItems } from './sidebar.js'

const SEARCH_RENDER_SIZE_LIMIT = 200_000
const isLowMemoryBuild = process.env.VERCEL === '1' || process.env.VITEPRESS_LOW_MEMORY_BUILD === '1'
const enableLocalSearch = process.env.VITEPRESS_DISABLE_LOCAL_SEARCH !== '1'

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;')
}

export default defineConfig({
  ignoreDeadLinks: true,
  buildConcurrency: isLowMemoryBuild ? 4 : 16,
  title: 'System Vault',
  description: '系统知识库 - 凡是过往，皆为序章',
  lastUpdated: true,
  cleanUrls: true,
  lang: 'zh-CN',
  async theme() {
    const teek = (await import('vitepress-theme-teek')).default
    const { default: defaultTheme } = await import('vitepress/theme')
    return Object.assign({}, teek, { extends: defaultTheme })
  },
  sitemap: {
    hostname: 'https://system-vault.site'
  },
  head: (() => {
    const isCdn = (process.env.VITE_FONT_SOURCE || 'local') === 'cdn'
    const isProd = process.env.NODE_ENV === 'production'
    const head = [
      ['link', { rel: "icon", type: "image/png", href: "/favicon.png" }],
      ['meta', { name: 'theme-color', content: '#3c8772' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: 'System Vault | 系统知识库' }],
      ['meta', { property: 'og:description', content: '系统知识库 - 凡是过往，皆为序章' }],
    ]
    // 防闪烁脚本：页面加载前同步设置主题（同步执行，无 async/defer）
    head.push(['script', {}, `(function(){var t=localStorage.getItem('vp-theme');if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;if(t==='dark')document.documentElement.classList.add('dark')})()`])
    // 只在生产环境加载 Vercel Insights
    if (isProd) {
      head.push(['script', { src: '/_vercel/insights/script.js', defer: '' }])
    }
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
    highlight: (str) => escapeHtml(str),
    // 启用内嵌 HTML 解析，以支持在 Markdown 中使用 Vue 组件（例如 <PdfViewer /> 和 <script setup>）
    html: true,
    config: (md) => {
      md.use(markdownItMarkmap)
      md.use(MermaidMarkdown)
    }
  },
  vite: {
    plugins: [MermaidPlugin()],
    optimizeDeps: { include: ['mermaid'] },
    ssr: { noExternal: ['mermaid'] },
    assetsInclude: ['**/*.awebp'],
  },
  themeConfig: {
    // Vercel 构建内存有限；本地搜索会额外渲染所有页面生成索引。
    search: enableLocalSearch ? {
      provider: 'local',            // 使用内置的本地全文索引
      options: {
        // flexible 配置可以根据需要定制，例如语言、最大建议条数等
        // lang 参数帮助处理中文分词，默认会自动尝试检测
        // 参见：https://vitepress.dev/guide/search
        maxSuggestions: 10,
        async _render(src, env, md) {
          if (env.frontmatter?.search === false) return ''
          if (src.length > SEARCH_RENDER_SIZE_LIMIT) return ''
          return md.render(src, env)
        },
      }
    } : undefined,

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
      },
      {
        text: 'Wiki',
        items: [
          { text: '知识库总览', link: '/md/wiki/' },
          { text: '核心概念', link: '/md/wiki/concepts/' },
          { text: '模式与方法论', link: '/md/wiki/patterns/' },
          { text: '产品与工具', link: '/md/wiki/products/' },
          { text: '原始文档', link: '/md/wiki/sources/' },
          { text: '对比分析', link: '/md/wiki/comparisons/' },
          { text: '日记', link: '/md/wiki/journal/' },
          { text: '稍后读', link: '/md/wiki/read-later/' },
        ]
      },
      {
        text: '商业',
        items: [
          { text: '商业分析总览', link: '/md/business/' },
          { text: '市场分析', link: '/md/business/market-analysis/' },
        ]
      },
      {
        text: '专栏',
        items: [
          { text: '专栏总览', link: '/md/columns/' },
          { text: 'Agentic Engineer', link: '/md/columns/agentic-engineer/' },
          { text: 'Vibe Coding', link: '/md/columns/vibe-coding/' },
          { text: 'Harness Engineering', link: '/md/columns/harness-engineering/' },
          { text: "Lenny's Newsletter", link: '/md/columns/lenny-newsletter/' },
          { text: '绘图指南', link: '/md/columns/drawing/' },
          { text: 'OPC 一人公司', link: '/md/columns/opc/' },
          { text: '投资专栏', link: '/md/columns/investment/' },
          { text: 'SEO 建站', link: '/md/columns/indie-hub/seo/' },
        ]
      },
      {
        text: 'Slides',
        items: [
          { text: '演示文稿', link: '/md/slides/' },
        ]
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
      '/md/wiki/': [
        {
          text: 'Wiki 知识库',
          items: [
            { text: '知识库总览', link: '/md/wiki/' },
          ]
        },
        {
          text: '核心概念',
          collapsed: false,
          items: generateSidebar('docs/md/wiki/concepts', '/md/wiki/concepts/')
        },
        {
          text: '模式与方法论',
          collapsed: false,
          items: generateSidebar('docs/md/wiki/patterns', '/md/wiki/patterns/')
        },
        {
          text: '产品与工具',
          collapsed: false,
          items: generateSidebar('docs/md/wiki/products', '/md/wiki/products/')
        },
        {
          text: '原始文档 (Sources)',
          collapsed: false,
          items: generateSidebar('docs/md/wiki/sources', '/md/wiki/sources/')
        },
        {
          text: '对比分析',
          collapsed: false,
          items: generateSidebar('docs/md/wiki/comparisons', '/md/wiki/comparisons/')
        },
        {
          text: '日记',
          collapsed: false,
          items: generateSidebar('docs/md/wiki/journal', '/md/wiki/journal/')
        },
        {
          text: '稍后读',
          collapsed: false,
          items: generateSidebar('docs/md/wiki/read-later', '/md/wiki/read-later/')
        }
      ],
      '/md/wiki/concepts/': generateSidebar('docs/md/wiki/concepts', '/md/wiki/concepts/'),
      '/md/wiki/patterns/': generateSidebar('docs/md/wiki/patterns', '/md/wiki/patterns/'),
      '/md/wiki/products/': generateSidebar('docs/md/wiki/products', '/md/wiki/products/'),
      '/md/wiki/comparisons/': generateSidebar('docs/md/wiki/comparisons', '/md/wiki/comparisons/'),
      '/md/wiki/sources/': generateSidebar('docs/md/wiki/sources', '/md/wiki/sources/'),
      '/md/business/': generateSidebar('docs/md/business', '/md/business/'),
      '/md/columns/': generateSidebar('docs/md/columns', '/md/columns/'),
      '/md/slides/': generateSidebar('docs/md/slides', '/md/slides/'),
      ...generateSidebarMappingForSubdirectories('docs/md/books', '/md/books/'),
      ...generateSidebarMappingForSubdirectories('docs/md/tutorial', '/md/tutorial/'),
      ...generateSidebarMappingForSubdirectories('docs/md/agi', '/md/agi/'),
      ...generateSidebarMappingForSubdirectories('docs/md/business', '/md/business/'),
      ...generateSidebarMappingForSubdirectories('docs/md/columns', '/md/columns/'),
      ...generateSidebarMappingForSubdirectories('docs/md/slides', '/md/slides/'),
      ...generateSidebarMappingForSubdirectories('docs/md/wiki/journal', '/md/wiki/journal/'),
      ...generateSidebarMappingForSubdirectories('docs/md/wiki/read-later', '/md/wiki/read-later/')
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dantefung/nova-vault-studio' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present DANTE FUNG'
    },
  },
});
