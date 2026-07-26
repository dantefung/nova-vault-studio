// CDN stylesheet loading for LXGW WenKai variants

function setFamilyByVariant(variant) {
  const base = '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif'
  let family
  switch (variant) {
    case 'screen':
      family = `"LXGW WenKai Screen", "LXGW WenKai", "LXGW WenKai Lite", ${base}`
      break
    case 'lite':
      family = `"LXGW WenKai Lite", "LXGW WenKai", "LXGW WenKai Screen", ${base}`
      break
    default:
      family = `"LXGW WenKai", "LXGW WenKai Lite", "LXGW WenKai Screen", ${base}`
  }
  document.documentElement.style.setProperty('--vp-font-family-base', family)
}

export function setupCdnFonts() {
  const variant = (import.meta.env.VITE_FONT_VARIANT || 'normal').toLowerCase()
  const href = variant === 'screen'
    ? 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont/style.css'
    : variant === 'lite'
      ? 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont/style.css'
      : 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont/style.css'

  // Preconnect to CDN
  try {
    for (const l of [
      ['preconnect', 'https://cdn.jsdelivr.net'],
      ['dns-prefetch', 'https://cdn.jsdelivr.net']
    ]) {
      const link = document.createElement('link')
      link.rel = l[0]
      link.href = l[1]
      if (l[0] === 'preconnect') link.crossOrigin = ''
      document.head.appendChild(link)
    }
  } catch (_) {}

  // Load stylesheet
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)

  setFamilyByVariant(variant)
}

