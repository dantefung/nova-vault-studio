import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { SYNC_SCRIPT, type LandingTheme } from '@/lib/theme'
import '@/styles/global.css'
import '@/styles/easton-clone.css'

export const metadata: Metadata = {
  title: 'System Vault — AI / Dev / Automation',
  description: '系统知识库 - 凡是过往，皆为序章',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 服务端读 cookie；首次访问无 cookie 时为 'quiet'
  const cookieStore = await cookies()
  const c = cookieStore.get('vp-landing-theme')
  const theme: LandingTheme = (['quiet', 'easton', 'easton-clone'] as const).includes(
    (c?.value || 'quiet') as LandingTheme
  )
    ? ((c?.value as LandingTheme) || 'quiet')
    : 'quiet'

  return (
    <html lang="zh-CN" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* 客户端脚本：localStorage → cookie 同步；早于 body 渲染前执行 */}
        <script dangerouslySetInnerHTML={{ __html: SYNC_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  )
}