// Local WOFF2-only loading using @fontsource assets
import w300 from '@fontsource/lxgw-wenkai/files/lxgw-wenkai-latin-300-normal.woff2'
import w700 from '@fontsource/lxgw-wenkai/files/lxgw-wenkai-latin-700-normal.woff2'

export function setupLocalFonts() {
  // Preload WOFF2 to reduce FOIT
  try {
    for (const href of [w300, w700]) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.href = href
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    }
  } catch (_) {}

  // Inject @font-face with WOFF2 only
  try {
    const css = `@font-face{font-family:'LXGW WenKai';font-style:normal;font-display:swap;font-weight:300;src:url(${w300}) format('woff2');}
@font-face{font-family:'LXGW WenKai';font-style:normal;font-display:swap;font-weight:700;src:url(${w700}) format('woff2');}`
    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-local-fonts', 'lxgw-wenkai')
    styleEl.textContent = css
    document.head.appendChild(styleEl)
  } catch (_) {}

  // Ensure the primary family prefers the standard WenKai when local
  try {
    document.documentElement.style.setProperty(
      '--vp-font-family-base',
      '"LXGW WenKai", "LXGW WenKai Lite", "LXGW WenKai Screen", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif'
    )
  } catch (_) {}
}

