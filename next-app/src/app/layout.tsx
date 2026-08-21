import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { SYNC_SCRIPT, type LandingTheme } from '@/lib/theme'
import '@/styles/pmaker.css'

export const metadata: Metadata = {
  title: '做产品 PMaker | 学习产品思维，做出真实产品',
  description: 'AI 让更多人能把想法做成产品。做得越快，越要想清楚做什么、怎么做、做完之后怎么改。',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const c = cookieStore.get('vp-landing-theme')
  const theme: LandingTheme = (['pmaker', 'quiet', 'easton', 'easton-clone'] as const).includes(
    (c?.value || 'pmaker') as LandingTheme
  )
    ? ((c?.value as LandingTheme) || 'pmaker')
    : 'pmaker'

  return (
    <html lang="zh-CN" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: SYNC_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
