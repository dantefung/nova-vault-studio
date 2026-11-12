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
    el.classList.toggle('is-active', el.getAttribute(attr) === value)
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
const currentTheme = document.documentElement.dataset.theme || 'light'
const currentLanding = document.documentElement.dataset.landingTheme || 'quiet'
syncActive('data-theme-value', currentTheme)
syncActive('data-landing-theme-value', currentLanding)
