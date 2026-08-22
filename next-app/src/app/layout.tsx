import type { Metadata } from 'next'
import '@/styles/pmaker.css'

export const metadata: Metadata = {
  title: '做产品 PMaker | 学习产品思维，做出真实产品',
  description: 'AI 让更多人能把想法做成产品。做得越快，越要想清楚做什么、怎么做、做完之后怎么改。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" data-theme="pmaker">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}