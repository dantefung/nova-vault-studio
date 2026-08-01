import Link from 'next/link'
import ThemeSwitcher from './ThemeSwitcher'
import type { LandingTheme } from '@/lib/theme'

interface Props {
  theme: LandingTheme
}

export default function SiteHeader({ theme }: Props) {
  return (
    <header className="site-header">
      <Link href="/" className="site-brand">
        <span className="site-brand-mark">E</span>
        <span>System Vault</span>
      </Link>
      <nav className="site-nav" aria-label="主导航">
        <Link href="/">首页</Link>
        <Link href="/blog/">列表</Link>
        <Link href="/blog/archive/">归档</Link>
        <Link href="/blog/series/">系列</Link>
        <Link href="/blog/category/">分类</Link>
        <ThemeSwitcher current={theme} />
      </nav>
    </header>
  )
}