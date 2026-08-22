/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ['gray-matter'],
  // 纯静态导出（CF Pages 部署）
  // URL 改成 /learn/glossary 形式（不带 .html），匹配 file-based routing
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig