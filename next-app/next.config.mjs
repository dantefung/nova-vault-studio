/** @type {import('next').NextConfig} */
const REPO_ROOT = new URL('..', import.meta.url).pathname

const nextConfig = {
  reactStrictMode: false,
  // Next.js 15: serverComponentsExternalPackages 移到顶层
  serverExternalPackages: ['gray-matter'],
  outputFileTracingRoot: REPO_ROOT,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig