// Local WOFF2 loading using @fontsource assets and Screen font fallback
import w500 from '@fontsource/lxgw-wenkai/files/lxgw-wenkai-latin-500-normal.woff2'
import w700 from '@fontsource/lxgw-wenkai/files/lxgw-wenkai-latin-700-normal.woff2'

export function setupLocalFonts() {
  // Preload WOFF2 to reduce FOIT
  try {
    for (const href of [w500, w700]) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.href = href
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    }
  } catch (_) {}

  // Inject @font-face with WOFF2 for LXGW WenKai fallback
  try {
    const css = `@font-face{font-family:'LXGW WenKai';font-style:normal;font-display:swap;font-weight:400;src:url(${w500}) format('woff2');}\n@font-face{font-family:'LXGW WenKai';font-style:normal;font-display:swap;font-weight:500;src:url(${w500}) format('woff2');}\n@font-face{font-family:'LXGW WenKai';font-style:normal;font-display:swap;font-weight:700;src:url(${w700}) format('woff2');}`
    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-local-fonts', 'lxgw-wenkai')
    styleEl.textContent = css
    document.head.appendChild(styleEl)
  } catch (_) {}

  // Ensure the primary family prefers LXGW WenKai Screen first
  try {
    document.documentElement.style.setProperty(
      '--vp-font-family-base',
      '\"LXGW WenKai Screen\", \"LXGW WenKai Screen R\", \"LXGW WenKai\", \"LXGW WenKai Lite\", \"Noto Sans SC\", \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif'
    )
  } catch (_) {}
}

