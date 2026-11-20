/**
 * 主题切换的客户端逻辑
 *
 * 切换只改 html 上的 data-theme / data-landing-theme，
 * 所有视觉差异由 CSS 变量承载 —— 不重排 DOM，因此不会闪白，
 * 也不会出现 VitePress 1.6.4 时期「服务端渲染的分支与客户端不一致」导致的白屏。
 */

const THEME_KEY = 'vp-theme'
const LANDING_KEY = 'vp-landing-theme'

const THEMES = ['light', 'dark', 'sepia']
const LANDING_THEMES = ['quiet', 'easton']

function applyTheme(name: string) {
  if (!THEMES.includes(name)) return
  const root = document.documentElement
  root.dataset.theme = name
  root.classList.toggle('dark', name === 'dark')
  try {
    localStorage.setItem(THEME_KEY, name)
  } catch {}
  syncActive('data-theme-value', name)
  document.dispatchEvent(new CustomEvent('vp:theme-change', { detail: name }))
}

function applyLandingTheme(name: string) {
  if (!LANDING_THEMES.includes(name)) return
  document.documentElement.dataset.landingTheme = name
  try {
    localStorage.setItem(LANDING_KEY, name)
  } catch {}
  syncActive('data-landing-theme-value', name)
  document.dispatchEvent(new CustomEvent('vp:landing-theme-change', { detail: name }))
}

function syncActive(attr: string, value: string) {
  document.querySelectorAll(`[${attr}]`).forEach((el) => {
    const on = el.getAttribute(attr) === value
    el.classList.toggle('is-active', on)
    // 图标按钮的选中态由 Tailwind 的 aria-pressed: 变体承载，
    // 所以这里必须同步 aria-pressed，不能只切 class
    el.setAttribute('aria-pressed', String(on))
  })
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  const themeBtn = target.closest('[data-theme-value]')
  if (themeBtn) {
    applyTheme(themeBtn.getAttribute('data-theme-value')!)
    return
  }
  const landingBtn = target.closest('[data-landing-theme-value]')
  if (landingBtn) {
    applyLandingTheme(landingBtn.getAttribute('data-landing-theme-value')!)
  }
})

// 初始化按钮的 active 状态
function syncCurrent() {
  const currentTheme = document.documentElement.dataset.theme || 'light'
  const currentLanding = document.documentElement.dataset.landingTheme || 'quiet'
  syncActive('data-theme-value', currentTheme)
  syncActive('data-landing-theme-value', currentLanding)
}

syncCurrent()
// View Transitions 换页后脚本不会重跑，新插入的按钮要重新同步选中态
document.addEventListener('astro:page-load', syncCurrent)
