/**
 * build-astro-nav.mjs
 *
 * 在 Astro 构建前生成导航与侧边栏数据（astro-app/src/generated/nav.json）。
 *
 * 为什么不直接在 Astro 组件里现算：
 *   - 侧边栏是「每个目录一份」的映射（40+ 个扫描根），每次请求现算会重复扫盘
 *   - 站点有 3999 篇文档，sidebar 树 + nav 一次性生成后由 Astro 静态导入
 *
 * 侧边栏生成逻辑与 VitePress 共用 scripts/lib/sidebar-core.mjs，避免两边漂移。
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  generateSidebar,
  generateNavItems,
  generateNavItemsFromFiles,
  generateSidebarMappingForSubdirectories,
  generateBookNavItems,
} from './lib/sidebar-core.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'astro-app/src/generated')
const OUT_FILE = path.join(OUT_DIR, 'nav.json')

// 与 docs/.vitepress/config.js 的 themeConfig.sidebar 保持一致
const sidebar = {
  '/md/guide/': generateSidebar('docs/md/guide', '/md/guide/'),
  '/md/sitelog/features/': generateSidebar('docs/md/sitelog/features', '/md/sitelog/features/'),
  '/md/sitelog/architecture/': generateSidebar('docs/md/sitelog/architecture', '/md/sitelog/architecture/'),
  '/md/sitelog/evolution/': generateSidebar('docs/md/sitelog/evolution', '/md/sitelog/evolution/'),
  '/md/sitelog/reference/': generateSidebar('docs/md/sitelog/reference', '/md/sitelog/reference/'),
  '/md/sitelog/dev-log/': generateSidebar('docs/md/sitelog/dev-log', '/md/sitelog/dev-log/'),
  '/md/tutorial/': generateSidebar('docs/md/tutorial', '/md/tutorial/'),
  '/md/agi/': generateSidebar('docs/md/agi', '/md/agi/'),
  '/md/books/': generateBookNavItems('docs/md/books', '/md/books/'),
  '/md/wiki/': [
    { text: 'Wiki 知识库', items: [{ text: '知识库总览', link: '/md/wiki/' }] },
    { text: '核心概念', collapsed: false, items: generateSidebar('docs/md/wiki/concepts', '/md/wiki/concepts/') },
    { text: '模式与方法论', collapsed: false, items: generateSidebar('docs/md/wiki/patterns', '/md/wiki/patterns/') },
    { text: '产品与工具', collapsed: false, items: generateSidebar('docs/md/wiki/products', '/md/wiki/products/') },
    { text: '原始文档 (Sources)', collapsed: false, items: generateSidebar('docs/md/wiki/sources', '/md/wiki/sources/') },
    { text: '对比分析', collapsed: false, items: generateSidebar('docs/md/wiki/comparisons', '/md/wiki/comparisons/') },
    { text: '日记', collapsed: false, items: generateSidebar('docs/md/wiki/journal', '/md/wiki/journal/') },
    { text: '稍后读', collapsed: false, items: generateSidebar('docs/md/wiki/read-later', '/md/wiki/read-later/') },
  ],
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
  ...generateSidebarMappingForSubdirectories('docs/md/wiki/read-later', '/md/wiki/read-later/'),
}

// 与 docs/.vitepress/config.js 的 themeConfig.nav 保持一致
const nav = [
  {
    text: '资源中心',
    items: [
      { text: 'AI 编程资源', link: '/md/resources/' },
      { text: 'Claude Code 资源', link: '/md/guide/ai/claude-code-resources/' },
    ],
  },
  {
    text: '文档',
    items: [
      { text: '指南', link: '/md/guide/getting-started' },
      { text: '特性', link: '/md/sitelog/features/charts' },
      { text: '架构', link: '/md/sitelog/architecture/core-principles' },
      { text: '演进', link: '/md/sitelog/evolution/milestones' },
      { text: '参考', link: '/md/sitelog/reference/overview' },
    ],
  },
  {
    text: '书籍',
    items: [
      { text: '书籍库', link: '/md/books/' },
      ...generateBookNavItems('docs/md/books', '/md/books/'),
    ],
  },
  { text: '教程', items: generateNavItems('docs/md/tutorial', '/md/tutorial/') },
  { text: 'AGI 教程', items: generateNavItems('docs/md/agi', '/md/agi/') },
  { text: '博客', link: '/md/blog/' },
  {
    text: '知识库',
    items: [
      { text: '知识库总览', link: '/md/wiki/' },
      { text: '核心概念', link: '/md/wiki/concepts/' },
      { text: '模式与方法论', link: '/md/wiki/patterns/' },
      { text: '产品与工具', link: '/md/wiki/products/' },
      { text: '原始文档', link: '/md/wiki/sources/' },
      { text: '对比分析', link: '/md/wiki/comparisons/' },
      { text: '日记', link: '/md/wiki/journal/' },
      { text: '稍后读', link: '/md/wiki/read-later/' },
    ],
  },
  {
    text: '商业',
    items: [
      { text: '商业分析总览', link: '/md/business/' },
      { text: '市场分析', link: '/md/business/market-analysis/' },
    ],
  },
  {
    text: '专栏',
    items: [
      { text: '专栏总览', link: '/md/columns/' },
      { text: 'Agentic Engineer 专栏', link: '/md/columns/agentic-engineer/' },
      { text: 'Vibe Coding 专栏', link: '/md/columns/vibe-coding/' },
      { text: 'Harness Engineering 专栏', link: '/md/columns/harness-engineering/' },
      { text: 'Lenny 通讯', link: '/md/columns/lenny-newsletter/' },
      { text: '绘图指南', link: '/md/columns/drawing/' },
      { text: 'OPC 一人公司', link: '/md/columns/opc/' },
      { text: '投资专栏', link: '/md/columns/investment/' },
      { text: 'SEO 建站', link: '/md/columns/indie-hub/seo/' },
    ],
  },
  { text: '幻灯片', items: [{ text: '演示文稿', link: '/md/slides/' }] },
]

const payload = { nav, sidebar }

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), 'utf8')

const sidebarKeys = Object.keys(sidebar).length
console.log(`[build-astro-nav] nav: ${nav.length} 组, sidebar: ${sidebarKeys} 个扫描根 -> ${path.relative(ROOT, OUT_FILE)}`)
