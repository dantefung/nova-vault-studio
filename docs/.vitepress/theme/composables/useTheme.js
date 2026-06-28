/**
 * useTheme - 主题状态管理 + localStorage 持久化
 */
import { ref, readonly } from 'vue'

const STORAGE_KEY = 'vp-theme'
const THEMES = ['light', 'dark', 'sepia']

// 当前主题 ref（模块级单例）
const currentTheme = ref('light')
let initialized = false

// 初始化：从 localStorage 读取，兜底跟随系统
function initTheme() {
  if (typeof window === 'undefined') return
  if (initialized) return
  initialized = true

  let saved = localStorage.getItem(STORAGE_KEY)
  if (!saved || !THEMES.includes(saved)) {
    saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  currentTheme.value = saved
  applyTheme(saved)
}

// 应用主题到 DOM
function applyTheme(name) {
  if (typeof document === 'undefined') return

  document.documentElement.dataset.theme = name

  // VitePress 用 .dark class 控制暗色模式
  if (name === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 设置主题
function setTheme(name) {
  if (!THEMES.includes(name)) return
  currentTheme.value = name
  localStorage.setItem(STORAGE_KEY, name)
  applyTheme(name)
}

// 切换到下一个主题（循环）
function toggleTheme() {
  const idx = THEMES.indexOf(currentTheme.value)
  const next = THEMES[(idx + 1) % THEMES.length]
  setTheme(next)
  return next
}

// Giscus 主题映射
function getGiscusTheme(theme) {
  const map = {
    light: 'light',
    dark: 'dark_dimmed',
    sepia: 'light'
  }
  return map[theme] || 'light'
}

// 自动初始化（SSR 安全）
export function setupTheme() {
  initTheme()
}

export function useTheme() {
  return {
    currentTheme: readonly(currentTheme),
    setTheme,
    toggleTheme,
    getGiscusTheme,
    THEMES
  }
}
