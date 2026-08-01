// src/lib/theme.ts
// landingTheme cookie 解析 + 风格元数据
// 这是修复 VitePress 1.6.4 首页白屏的核心：SSR 阶段读 cookie 而非 localStorage

export const THEMES = ['quiet', 'easton', 'easton-clone'] as const
export type LandingTheme = (typeof THEMES)[number]

export const COOKIE_NAME = 'vp-landing-theme'
export const LS_NAME = 'vp-landing-theme'

export const THEME_META: Record<LandingTheme, { label: string; desc: string }> = {
  quiet: { label: 'Quiet', desc: '默认极简样式' },
  easton: { label: 'Easton', desc: 'Easton 文档内页风格' },
  'easton-clone': { label: 'Easton Clone', desc: 'Easton Clone 整体首页 + 博客化' },
}

export function parseLandingTheme(raw: string | undefined | null): LandingTheme {
  if (!raw) return 'quiet'
  const v = raw.trim().toLowerCase()
  return (THEMES as readonly string[]).includes(v) ? (v as LandingTheme) : 'quiet'
}

/** 从 Next.js cookies() API 中读取 */
export function readLandingThemeFromCookies(cookies: { get(name: string): { value?: string } | undefined } | Map<string, { value?: string }>): LandingTheme {
  let c: { value?: string } | undefined
  if ('get' in cookies && typeof (cookies as any).get === 'function') {
    c = (cookies as any).get(COOKIE_NAME)
  } else {
    c = (cookies as Map<string, { value?: string }>).get(COOKIE_NAME)
  }
  return parseLandingTheme(c?.value)
}

/**
 * 客户端脚本：localStorage → cookie 同步
 * Next.js server-side 没有 localStorage，需要客户端把选择写到 cookie，
 * 下一次请求 SSR 才能拿到正确风格。
 */
export const SYNC_SCRIPT = `
(function(){
  try {
    var ls = localStorage.getItem('${LS_NAME}');
    var m = document.cookie.match(/(?:^|;\\s*)${COOKIE_NAME}=([^;]+)/);
    var current = m ? decodeURIComponent(m[1]) : null;
    if (ls && ls !== current) {
      document.cookie = '${COOKIE_NAME}=' + encodeURIComponent(ls) + '; path=/; max-age=31536000; samesite=lax';
    }
  } catch(e) {}
})();
`