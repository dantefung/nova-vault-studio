/**
 * 主题状态管理（VitePress 时期 useTheme.js 的 Astro 版本）
 *
 * 两套主题体系：
 *   1. 站点主题 vp-theme：light / dark / sepia —— 影响全文配色
 *   2. 落地页主题 landing-theme：quiet / easton —— 影响首页与文档内页的版式
 *
 * 关键点：两套主题都必须在首屏渲染前同步应用（inline script），
 * 否则会出现 VitePress 1.6.4 时期的「首页白屏」——
 * 那次白屏的根因就是 SSR 阶段读不到 localStorage/cookie，
 * 渲染出与客户端不一致的 DOM。Astro 侧改为「CSS 变量 + data 属性」，
 * 主题切换只改 html 上的属性，不触发任何 DOM 结构变化，从根上消除这类问题。
 */

export const THEMES = ['light', 'dark', 'sepia'] as const
export type Theme = (typeof THEMES)[number]

export const LANDING_THEMES = ['quiet', 'easton'] as const
export type LandingTheme = (typeof LANDING_THEMES)[number]

export const THEME_STORAGE_KEY = 'vp-theme'
export const LANDING_STORAGE_KEY = 'vp-landing-theme'

export const THEME_META: Record<Theme, { label: string; desc: string }> = {
  light: { label: 'Light', desc: '默认浅色' },
  dark: { label: 'Dark', desc: '深色模式' },
  sepia: { label: 'Sepia', desc: '纸卷护眼' },
}

export const LANDING_THEME_META: Record<LandingTheme, { label: string; desc: string }> = {
  quiet: { label: 'Quiet', desc: '极简版式' },
  easton: { label: 'Easton', desc: 'Easton 文档内页风格' },
}

/**
 * 首屏同步脚本。
 *
 * 在 <head> 里同步执行（不带 defer），保证首帧就是最终主题，不闪白。
 * 逻辑与 VitePress 时期 config.js 的 head script 保持一致。
 */
export const THEME_INIT_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (!t || ['light','dark','sepia'].indexOf(t) === -1) {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = t;
    if (t === 'dark') document.documentElement.classList.add('dark');

    var l = localStorage.getItem('${LANDING_STORAGE_KEY}');
    if (!l || ['quiet','easton'].indexOf(l) === -1) l = 'quiet';
    document.documentElement.dataset.landingTheme = l;
  } catch(e) {}
})();
`

/** Giscus 评论主题映射（与 VitePress 时期 getGiscusTheme 一致） */
export function giscusTheme(theme: string): string {
  if (theme === 'dark') return 'dark_dimmed'
  return 'light'
}
