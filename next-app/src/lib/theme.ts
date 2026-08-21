// src/lib/theme.ts
// 主题切换：pmaker 复刻主题作为默认
// 保留 quiet / easton / easton-clone 作为后备

export const THEMES = ['pmaker', 'quiet', 'easton', 'easton-clone'] as const
export type LandingTheme = (typeof THEMES)[number]

export const COOKIE_NAME = 'vp-landing-theme'
export const LS_NAME = 'vp-landing-theme'

export const THEME_META: Record<LandingTheme, { label: string; desc: string }> = {
  pmaker: { label: 'PMaker', desc: '出版物风格 1:1 复刻自 pmaker.space' },
  quiet: { label: 'Quiet', desc: '默认极简样式' },
  easton: { label: 'Easton', desc: 'Easton 文档内页风格' },
  'easton-clone': { label: 'Easton Clone', desc: 'Easton Clone 整体首页 + 博客化' },
}

export const DEFAULT_THEME: LandingTheme = 'pmaker'

export function parseLandingTheme(raw: string | undefined | null): LandingTheme {
  if (!raw) return DEFAULT_THEME
  const v = raw.trim().toLowerCase()
  return (THEMES as readonly string[]).includes(v) ? (v as LandingTheme) : DEFAULT_THEME
}

export function readLandingThemeFromCookies(
  cookies:
    | { get(name: string): { value?: string } | undefined }
    | Map<string, { value?: string }>
): LandingTheme {
  let c: { value?: string } | undefined
  if ('get' in cookies && typeof (cookies as any).get === 'function') {
    c = (cookies as any).get(COOKIE_NAME)
  } else {
    c = (cookies as Map<string, { value?: string }>).get(COOKIE_NAME)
  }
  return parseLandingTheme(c?.value)
}

export const SYNC_SCRIPT = `
(function(){
  try {
    var ls = localStorage.getItem('${LS_NAME}');
    var m = document.cookie.match(/(?:^|;\\s*)${COOKIE_NAME}=([^;]+)/);
    var current = m ? decodeURIComponent(m[1]) : null;
    if (ls && ls !== current) {
      document.cookie = '${COOKIE_NAME}=' + encodeURIComponent(ls) + '; path=/; max-age=31536000; samesite=lax';
    } else if (!ls && !current) {
      document.cookie = '${COOKIE_NAME}=${DEFAULT_THEME}; path=/; max-age=31536000; samesite=lax';
    }
  } catch(e) {}
})();
`
