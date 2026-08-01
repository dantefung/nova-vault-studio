'use client'

import { useRouter } from 'next/navigation'
import { THEMES, THEME_META, type LandingTheme } from '@/lib/theme'

interface Props {
  current: LandingTheme
}

export default function ThemeSwitcher({ current }: Props) {
  const router = useRouter()

  function setTheme(t: LandingTheme) {
    try {
      localStorage.setItem('vp-landing-theme', t)
    } catch {}
    document.cookie = `vp-landing-theme=${encodeURIComponent(t)}; path=/; max-age=31536000; samesite=lax`
    // 服务端读 cookie 后下次 SSR 就会正确
    router.refresh()
  }

  return (
    <div className="theme-switch" role="group" aria-label="切换首页风格">
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          data-theme-target={t}
          className={t === current ? 'active' : ''}
          title={THEME_META[t].desc}
          onClick={() => setTheme(t)}
        >
          {THEME_META[t].label}
        </button>
      ))}
    </div>
  )
}