<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import LandingThemeSwitcher from '../components/LandingThemeSwitcher.vue'
import { useTheme } from '../composables/useTheme.js'

const route = useRoute()
const { currentTheme, currentLandingTheme } = useTheme()

const isLanding = computed(() =>
  ['/', '/v2/', '/v3/', '/v4/', '/v5/'].includes(route.path),
)

const libraryEntries = [
  { label: '指南', description: '从基础配置到日常工作流，先从这里开始。', href: '/md/guide/getting-started', featured: true },
  { label: 'Wiki', description: '把概念、模式与实践连接成可复用的知识。', href: '/md/wiki/' },
  { label: '专栏', description: '围绕 AI、开发与独立创造的长期思考。', href: '/md/columns/' },
  { label: '书籍', description: '适合慢读、反复查阅与持续积累的书架。', href: '/md/books/' },
  { label: '教程', description: '按步骤完成具体事情的实践材料。', href: '/md/tutorial/' },
  { label: 'AGI', description: '关于智能系统、模型与未来工作的记录。', href: '/md/agi/' },
  { label: '商业', description: '市场、模式、投资与产品判断。', href: '/md/business/' },
  { label: 'Slides', description: '可横向阅读的演示与视觉化内容。', href: '/md/slides/' },
  { label: '知识库总览', description: '从概念与分类开始浏览。', href: '/md/wiki/' },
]

const recentUpdates = [
  {
    title: 'Happy Coder：用手机远程操控 Claude Code',
    href: '/md/guide/claude-code/happy-coder-remote-control',
    meta: '指南 · 2026-07-29',
  },
  {
    title: '网站分析与关键词挖掘：核心转折点全部突破',
    href: '/md/columns/indie-hub/seo/keyword-analysis/keyword-breakthrough-round-15',
    meta: '专栏 · 2026-07-27',
  },
  {
    title: '网站分析与关键词挖掘：全部技术指标概念',
    href: '/md/columns/indie-hub/seo/keyword-analysis/keyword-metrics-overview',
    meta: '专栏 · 2026-07-27',
  },
  {
    title: 'Cloudflare Tunnel 完全指南',
    href: '/md/columns/indie-hub/seo/building/cloudflare-tunnel-guide',
    meta: '专栏 · 2026-07-26',
  },
]
</script>

<template>
  <div v-if="isLanding" class="vp-landing" :class="[`theme-${currentTheme}`, `landing-theme-${currentLandingTheme}`]">
    <header class="landing-nav">
      <div class="landing-nav-inner">
        <a href="/" class="landing-logo">System Vault</a>
        <nav class="landing-nav-links" aria-label="站点导航">
          <a href="/md/guide/getting-started">开始阅读</a>
          <a href="https://github.com/dantefung/nova-vault-studio" target="_blank" rel="noreferrer">GitHub</a>
          <LandingThemeSwitcher />
          <ThemeSwitcher />
        </nav>
      </div>
    </header>

    <main class="landing-main">
      <section class="library-hero" aria-labelledby="library-title">
        <p class="library-kicker">A PERSONAL KNOWLEDGE LIBRARY</p>
        <h1 id="library-title">A personal knowledge library</h1>
        <p class="library-lead">把零散知识，整理成可以反复使用的系统。</p>
        <p class="library-description">AI、开发、商业、书籍与长期学习的工作记录。安静地阅读，清楚地找到下一步。</p>
        <a href="/md/guide/getting-started" class="library-hero-action">开始阅读 <span aria-hidden="true">→</span></a>
      </section>

      <section class="library-section library-start" aria-labelledby="library-start-title">
        <div class="library-section-heading">
          <p class="library-kicker">EXPLORE THE LIBRARY</p>
          <h2 id="library-start-title">知识分类入口</h2>
        </div>
        <div class="library-entry-grid">
          <a v-for="entry in libraryEntries" :key="entry.href" :href="entry.href" class="library-entry" :class="{ 'is-featured': entry.featured }">
            <span class="library-entry-label">{{ entry.label }}</span>
            <span class="library-entry-description">{{ entry.description }}</span>
            <span class="library-entry-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section class="library-section library-recent" aria-labelledby="library-recent-title">
        <div class="library-section-heading">
          <p class="library-kicker">RECENTLY ADDED</p>
          <h2 id="library-recent-title">最近更新</h2>
        </div>
        <div class="library-recent-list">
          <a v-for="item in recentUpdates" :key="item.href" :href="item.href" class="library-recent-item">
            <span class="library-recent-title">{{ item.title }}</span>
            <span class="library-recent-meta">{{ item.meta }}</span>
            <span class="library-entry-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>

    <footer class="landing-footer">
      <span>© 2024-present DANTE FUNG · MIT License</span>
    </footer>
  </div>

  <slot v-else />
</template>
