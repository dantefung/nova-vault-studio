/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Next.js 15: serverComponentsExternalPackages 移到顶层
  serverExternalPackages: ['gray-matter'],
  output: 'standalone',
  // outputFileTracingRoot 故意省略 —— OpenNext 假设 .next/standalone/.next/ 是根
  // 任何显式 outputFileTracingRoot 都会让 Next.js 输出到不同位置
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 把 PMaker 风格 URL 重写到一个内部 handler
  // /learn/xxx, /patterns/xxx, /basics/xxx → /pmaker/[cat]/[slug]
  rewrites: async () => [
    { source: '/learn/:slug', destination: '/pmaker/learn/:slug' },
    { source: '/patterns/:slug', destination: '/pmaker/patterns/:slug' },
    { source: '/basics/:slug', destination: '/pmaker/basics/:slug' },
  ],
}

export default nextConfig

// dev 模式才需要 OpenNext 的 Cloudflare context 注入
// build 模式不需要（next.config.mjs 顶层不要 await async，会导致时序问题）
if (process.env.NEXT_DEV) {
  const { initOpenNextCloudflareForDev } = await import('@opennextjs/cloudflare')
  await initOpenNextCloudflareForDev()
}
