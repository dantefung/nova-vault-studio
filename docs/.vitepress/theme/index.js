// .vitepress/theme/index.js

import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import HomeLayout from './layouts/HomeLayout.vue'
import PdfList from './components/PdfList.vue'
import PdfViewer from './components/PdfViewer.vue'
import './markmap.css'
import './fonts.css'
import './themes.css'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  enhanceApp(ctx) {
    if (typeof DefaultTheme.enhanceApp === 'function') {
      DefaultTheme.enhanceApp(ctx)
    }
    ctx.app.component('PdfList', PdfList)
    ctx.app.component('PdfViewer', PdfViewer)
    if (typeof window === 'undefined') return
    installUrlParsePolyfill()
    installPromiseWithResolversPolyfill()
    import('./composables/useTheme.js').then(m => m.setupTheme?.()).catch(() => {})
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
