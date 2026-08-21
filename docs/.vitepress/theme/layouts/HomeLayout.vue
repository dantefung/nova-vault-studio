<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import LandingThemeSwitcher from '../components/LandingThemeSwitcher.vue'
import MobileNavSheet from '../components/MobileNavSheet.vue'
import { useTheme } from '../composables/useTheme.js'

const route = useRoute()
const { currentTheme, currentLandingTheme } = useTheme()

const isLanding = computed(() =>
  ['/', '/v2/', '/v3/', '/v4/', '/v5/'].includes(route.path),
)

// cubxxw 风格的知识库入口
const libraryEntries = [
  { label: '指南', description: '从基础配置到日常工作流，先从这里开始。', href: '/md/guide/getting-started', featured: true },
  { label: 'Wiki', description: '把概念、模式与实践连接成可复用的知识。', href: '/md/wiki/' },
  { label: '专栏', description: '围绕 AI、开发与独立创造的长期思考。', href: '/md/columns/' },
  { label: '书籍', description: '适合慢读、反复查阅与持续积累的书架。', href: '/md/books/' },
  { label: '教程', description: '按步骤完成具体事情的实践材料。', href: '/md/tutorial/' },
  { label: 'AGI', description: '关于智能系统、模型与未来工作的记录。', href: '/md/agi/' },
  { label: '商业', description: '市场、模式、投资与产品判断。', href: '/md/business/' },
  { label: 'Slides', description: '可横向阅读的演示与视觉化内容。', href: '/md/slides/' },
]

// 最新文章数据（从 blog index 动态获取会更好，这里先用静态）
const recentPosts = [
  { title: 'AI 让我更聪明，也让我更晚碰到现实', date: '2026-08-20', cat: '成长', href: '/md/wiki/sources/flipkart-ai-seo-strategy.md' },
  { title: '2026 AI Agent 必备 Skills 大全', date: '2026-08-21', cat: 'AI', href: '/md/wiki/sources/ai-agent-skills-collection.md' },
  { title: 'Flipkart 如何用 AI 让私域消息被疯狂转发', date: '2026-08-20', cat: 'SEO', href: '/md/wiki/sources/flipkart-ai-seo-strategy.md' },
]
</script>

<template>
  <div v-if="isLanding" class="cubxxw-landing" :class="`theme-${currentTheme}`">
    <!-- 导航 -->
    <header class="cubxxw-nav">
      <a href="/" class="cubxxw-nav-logo">Nova Vault</a>
      <nav class="cubxxw-nav-links" aria-label="站点导航">
        <a href="/md/guide/getting-started">指南</a>
        <span class="separator" aria-hidden="true">·</span>
        <a href="/md/wiki/">Wiki</a>
        <span class="separator" aria-hidden="true">·</span>
        <a href="/md/columns/">专栏</a>
        <span class="separator" aria-hidden="true">·</span>
        <a href="/md/blog/">博客</a>
        <span class="separator" aria-hidden="true">·</span>
        <a href="https://github.com/dantefung/nova-vault-studio" target="_blank" rel="noreferrer">GitHub</a>
        <LandingThemeSwitcher />
        <ThemeSwitcher />
        <MobileNavSheet />
      </nav>
    </header>

    <!-- Hero -->
    <section class="cubxxw-hero">
      <p class="cubxxw-hero-kicker">A PERSONAL KNOWLEDGE VAULT</p>
      <h1>凡是过往，皆为序章</h1>
      <p class="cubxxw-hero-lead">
        AI、工程、独立开发与长期思考的公开档案。
        把零散知识，整理成可以反复使用的系统。
      </p>
      <a href="/md/guide/getting-started" class="cubxxw-hero-action">
        开始阅读 <span aria-hidden="true">→</span>
      </a>
    </section>

    <div class="cubxxw-divider"><hr /></div>

    <!-- 分类入口 -->
    <section class="cubxxw-categories">
      <div class="cubxxw-section-header">
        <span class="cubxxw-section-num">01</span>
        <h2 class="cubxxw-section-title">知识分类</h2>
        <a href="/md/wiki/" class="cubxxw-section-action">查看全部 →</a>
      </div>
      <div class="cubxxw-category-grid">
        <a v-for="entry in libraryEntries" :key="entry.href" :href="entry.href" class="cubxxw-category-item" :class="{ 'is-featured': entry.featured }">
          <span class="cubxxw-category-label">{{ entry.label }}</span>
          <span class="cubxxw-category-desc">{{ entry.description }}</span>
          <span class="cubxxw-category-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>

    <div class="cubxxw-divider"><hr /></div>

    <!-- 最新文章 -->
    <section class="cubxxw-recent">
      <div class="cubxxw-section-header">
        <div>
          <span class="cubxxw-section-num">02</span>
          <h2 class="cubxxw-section-title">最新文章</h2>
        </div>
        <a href="/md/blog/" class="cubxxw-section-action">全部归档 →</a>
      </div>
      <div class="cubxxw-recent-list">
        <a v-for="post in recentPosts" :key="post.href" :href="post.href" class="cubxxw-recent-item">
          <span class="cubxxw-recent-date">{{ post.date }}</span>
          <span class="cubxxw-recent-title">{{ post.title }}</span>
          <span class="cubxxw-recent-cat">{{ post.cat }}</span>
        </a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="cubxxw-footer">
      <span>© 2026 Nova Vault · 由 VitePress 驱动</span>
      <div class="cubxxw-footer-links">
        <a href="/md/wiki/">Wiki</a>
        <a href="/md/columns/">专栏</a>
        <a href="/md/books/">书籍</a>
        <a href="https://github.com/dantefung/nova-vault-studio" target="_blank" rel="noreferrer">GitHub</a>
        <a href="/feed.xml">RSS</a>
      </div>
    </footer>
  </div>

  <slot v-else />
</template>
