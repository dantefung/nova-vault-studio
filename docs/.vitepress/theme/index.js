// .vitepress/theme/index.js

// You can directly import Vue files in the theme entry
// VitePress is pre-configured with @vitejs/plugin-vue.
import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import './markmap.css'
import './fonts.css'

function installUrlParsePolyfill() {
  if (typeof window === 'undefined' || typeof URL === 'undefined' || typeof URL.parse === 'function') {
    return
  }

  URL.parse = (input, base) => {
    try {
      if (base == null) {
        return new URL(input)
      }

      const normalizedBase =
        typeof base === 'string'
          ? base
          : typeof base.href === 'string'
            ? base.href
            : String(base)

      return new URL(input, normalizedBase)
    } catch {
      return null
    }
  }
}

function installPromiseWithResolversPolyfill() {
  if (typeof window === 'undefined' || typeof Promise === 'undefined' || typeof Promise.withResolvers === 'function') {
    return
  }

  Promise.withResolvers = () => {
    let resolve
    let reject

    const promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })

    return { promise, resolve, reject }
  }
}

export default {
  ...DefaultTheme,
  // override the Layout with a wrapper component that
  // injects the slots
  Layout: MyLayout,
  enhanceApp(ctx) {
    // keep DefaultTheme behavior
    if (typeof DefaultTheme.enhanceApp === 'function') {
      DefaultTheme.enhanceApp(ctx);
    }
    if (typeof window === 'undefined') return;
    installUrlParsePolyfill()
    installPromiseWithResolversPolyfill()
    // Load fonts according to build-time env (VITE_FONT_SOURCE, VITE_FONT_VARIANT)
    const source = import.meta.env.VITE_FONT_SOURCE || 'local'
    if (source === 'local') {
      import('./fonts-local.js').then(m => m.setupLocalFonts?.()).catch(() => {})
    } else {
      import('./fonts-cdn.js').then(m => m.setupCdnFonts?.()).catch(() => {})
    }
    const init = () => import('./markmap.js').then(m => m.initMarkmap());
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
      setTimeout(init, 0);
    }
  }
}
