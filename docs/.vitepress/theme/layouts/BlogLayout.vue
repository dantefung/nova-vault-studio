<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import LandingThemeSwitcher from '../components/LandingThemeSwitcher.vue'
import EastonSearchTrigger from '../components/EastonSearchTrigger.vue'
import BlogIndexLayout from './BlogIndexLayout.vue'
import BlogArticleLayout from './BlogArticleLayout.vue'
import SeriesLayout from './SeriesLayout.vue'
import CategoryArchiveLayout from './CategoryArchiveLayout.vue'
import ArchiveLayout from './ArchiveLayout.vue'
import { useTheme } from '../composables/useTheme.js'

const route = useRoute()
const { currentTheme, currentLandingTheme } = useTheme()

// 路由分发
const view = computed(() => {
  const p = route.path
  if (p.startsWith('/md/blog/series/')) return 'series'
  if (p.startsWith('/md/blog/category/')) return 'category'
  if (p.startsWith('/md/blog/archive')) return 'archive'
  if (p === '/md/blog/' || p === '/md/blog/index') return 'index'
  return 'index'
})
</script>

<template>
  <div class="easton-clone-page blog-page" :class="[`theme-${currentTheme}`, `landing-theme-${currentLandingTheme}`]">
    <header class="easton-clone-header">
      <a href="/" class="easton-clone-brand">
        <span class="easton-clone-mark">E</span>
        <span>System Vault</span>
      </a>
      <nav aria-label="博客导航" class="easton-clone-nav">
        <a href="/">首页</a>
        <a href="/md/blog/">列表</a>
        <a href="/md/blog/category/sources/">分类</a>
        <a href="/md/blog/archive/">归档</a>
        <EastonSearchTrigger variant="nav" label="搜索文章" />
        <LandingThemeSwitcher />
        <ThemeSwitcher />
      </nav>
    </header>

    <main class="blog-main">
      <BlogIndexLayout v-if="view === 'index'" />
      <SeriesLayout v-else-if="view === 'series'" />
      <CategoryArchiveLayout v-else-if="view === 'category'" />
      <ArchiveLayout v-else-if="view === 'archive'" />
      <BlogArticleLayout v-else />
    </main>

    <footer class="easton-clone-footer">
      <div>
        <a href="/" class="easton-clone-brand">
          <span class="easton-clone-mark">E</span>
          <span>System Vault</span>
        </a>
        <p>AI、开发、自动化与独立产品构建笔记。</p>
      </div>
      <div>
        <b>导航</b>
        <a href="/">首页</a>
        <a href="/md/blog/">列表</a>
        <a href="/md/blog/archive/">归档</a>
      </div>
      <div>
        <b>资源</b>
        <a href="/md/guide/">指南</a>
        <a href="/md/agi/">AGI</a>
        <a href="/md/business/">商业</a>
      </div>
      <div>
        <b>许可</b>
        <span>MIT License</span>
        <span>© 2024-present</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.blog-fallback {
  max-width: 720px;
  margin: 0 auto;
  padding: 28px;
  border-radius: 22px;
  background: color-mix(in srgb, var(--easton-doc-soft) 50%, transparent);
  color: var(--easton-doc-body);
  font-size: 14.5px;
}
.blog-fallback code {
  padding: 1px 6px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--easton-doc-soft) 80%, transparent);
  color: var(--easton-doc-ink);
}
</style>
