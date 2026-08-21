import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 禁用 turbopack 缓存
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
