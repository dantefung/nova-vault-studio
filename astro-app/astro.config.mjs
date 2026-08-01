// astro.config.mjs
// System Vault Astro 重构
// - output: 'server' 让首页可以读 cookie 决定 landingTheme
// - Node adapter (standalone) 让 npm start 可以直接跑
// - 保留 vitepress 内容目录作为内容源（content dir alias）

import { defineConfig } from 'astro/config'
import node from '@astrojs/node'

// repo 根目录（astro-app 的父目录）
const REPO_ROOT = new URL('..', import.meta.url).pathname

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { host: '127.0.0.1', port: 4321 },
  site: 'http://127.0.0.1:4321',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  vite: {
    resolve: {
      alias: {
        '@repo': REPO_ROOT,
        '@content': REPO_ROOT + 'docs/md',
      },
    },
    // VitePress 主题已经被排除，但仍需给 markdown-it 留 SSR 路径
    ssr: {
      noExternal: ['@fontsource/lxgw-wenkai'],
    },
  },
})