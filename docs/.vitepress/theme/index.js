import theme from '@duxweb/vitepress-theme'
import '@duxweb/vitepress-theme/dist/index.css'
import MyLayout from './MyLayout.vue'
import HomeLayout from './layouts/HomeLayout.vue'
import './markmap.css'
import './fonts.css'
import './themes.css'

export default {
  extends: theme,
  Layout: MyLayout,
  enhanceApp(ctx) {
    if (typeof theme.enhanceApp === 'function') {
      theme.enhanceApp(ctx)
    }
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
