// CDN stylesheet loading for LXGW WenKai variants

function setFamilyByVariant(variant) {
  const base = '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif'
  let family
  switch (variant) {
    case 'lite':
      family = `"LXGW WenKai Lite", "LXGW WenKai Screen", "LXGW WenKai", ${base}`
      break
    case 'normal':
      family = `"LXGW WenKai", "LXGW WenKai Screen", "LXGW WenKai Lite", ${base}`
      break
    default:
      // 默认直接使用屏幕阅读加粗版
      family = `"LXGW WenKai Screen", "LXGW WenKai Screen R", "LXGW WenKai", "LXGW WenKai Lite", ${base}`
  }
  document.documentElement.style.setProperty('--vp-font-family-base', family)
}

export function setupCdnFonts() {
  const variant = (import.meta.env.VITE_FONT_VARIANT || 'screen').toLowerCase()
  const href = variant === 'normal'
    ? 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont/style.css'
    : variant === 'lite'
      ? 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont/style.css'
      : 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.css'


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

