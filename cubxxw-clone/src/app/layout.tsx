import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nova Vault · 公开的实践与思想档案",
    template: "%s | Nova Vault",
  },
  description: "把真实实践，沉淀成能穿越时间的知识。AI、工程、独立开发与长期思考。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${notoSerifSC.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#350003" />
      </head>
      <body className="min-h-screen flex flex-col bg-paper text-ink font-body">
        {children}
      </body>
    </html>
  );
}
