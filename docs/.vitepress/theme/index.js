// .vitepress/theme/index.js

import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import HomeLayout from './layouts/HomeLayout.vue'
import BlogIndexLayout from './layouts/BlogIndexLayout.vue'
import SeriesLayout from './layouts/SeriesLayout.vue'
import CategoryArchiveLayout from './layouts/CategoryArchiveLayout.vue'
import ArchiveLayout from './layouts/ArchiveLayout.vue'
import BlogArticleShell from './layouts/BlogArticleShell.vue'
import { createMermaidRenderer } from 'vitepress-mermaid-renderer'
import { h, nextTick } from 'vue'
import { setupTheme } from './composables/useTheme.js'
import './markmap.css'
import './fonts.css'
import './themes.css'
import './custom.css'
import './override.css'
import './navigation-fix.css'
import './easton-doc.css'
import './easton-blog.css'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp(ctx) {
    if (typeof DefaultTheme.enhanceApp === 'function') {
      DefaultTheme.enhanceApp(ctx)
    }
    // 全局注册博客组件，让占位 md 里可以直接 <BlogIndex /> 等
    ctx.app.component('BlogIndex', BlogIndexLayout)
    ctx.app.component('BlogSeries', SeriesLayout)
    ctx.app.component('BlogCategory', CategoryArchiveLayout)
    ctx.app.component('BlogArchive', ArchiveLayout)
    ctx.app.component('BlogArticleShell', BlogArticleShell)
    if (typeof window === 'undefined') return
    installUrlParsePolyfill()
    installPromiseWithResolversPolyfill()

    // mermaid 运行时渲染优化 - 延迟到组件挂载后初始化
    if (typeof window !== 'undefined') {
      const initMermaidWithTheme = () => {
        // 从 HTML 元素读取主题状态
        const isDark = document.documentElement.classList.contains('dark')
        createMermaidRenderer({
          theme: isDark ? 'dark' : 'default',
        })
      }
      
      // 初始化
      nextTick(() => initMermaidWithTheme())
      
      // 监听主题变化
      const observer = new MutationObserver(() => {
        initMermaidWithTheme()
      })
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      })
    }

    setupTheme()
    const source = import.meta.env.VITE_FONT_SOURCE || 'local'
    if (source === 'local') {
      import('./fonts-local.js').then(m => m.setupLocalFonts?.()).catch(() => {})
    } else {
      import('./fonts-cdn.js').then(m => m.setupCdnFonts?.()).catch(() => {})
    }
    const init = () => import('./markmap.js').then(m => m.initMarkmap())
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true })
    } else {
      setTimeout(init, 0)
    }
    // 修复导航交互问题
    import('./fix-navigation.js').then(m => m.fixNavigation?.()).catch(() => {})
  }
}

function installUrlParsePolyfill() {
  if (typeof URL === 'undefined' || typeof URL.parse === 'function') return
  URL.parse = (input, base) => {
    try {
      if (!base) return new URL(input)
      return new URL(input, typeof base === 'string' ? base : base.href || String(base))
    } catch { return null }
  }
}

function installPromiseWithResolversPolyfill() {
  if (typeof Promise === 'undefined' || typeof Promise.withResolvers === 'function') return
  Promise.withResolvers = () => {
    let resolve, reject
    const promise = new Promise((res, rej) => { resolve = res; reject = rej })
    return { promise, resolve, reject }
  }
}
