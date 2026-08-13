<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import LandingThemeSwitcher from '../components/LandingThemeSwitcher.vue'
import MobileNavSheet from '../components/MobileNavSheet.vue'
import EastonSearchTrigger from '../components/EastonSearchTrigger.vue'
import BlogIndexLayout from './BlogIndexLayout.vue'
import SeriesLayout from './SeriesLayout.vue'
import CategoryArchiveLayout from './CategoryArchiveLayout.vue'
import ArchiveLayout from './ArchiveLayout.vue'
import { useTheme } from '../composables/useTheme.js'

const route = useRoute()
const { currentTheme, currentLandingTheme } = useTheme()

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
        <MobileNavSheet />
      </nav>
    </header>

    <main class="blog-main">
      <BlogIndexLayout v-if="view === 'index'" />
      <SeriesLayout v-else-if="view === 'series'" />
      <CategoryArchiveLayout v-else-if="view === 'category'" />
      <ArchiveLayout v-else-if="view === 'archive'" />
    </main>

    <footer class="easton-clone-footer">
      <div>
        <a href="/" class="easton-clone-brand">
          <span>System Vault</span>
        </a>
        <p>一个作者关于 AI、软件与独立创作的长期笔记。</p>
      </div>
      <div>
        <a href="/">首页</a>
        <a href="/md/blog/">文章</a>
        <a href="/md/blog/archive/">归档</a>
        <a href="/md/guide/">指南</a>
        <a href="/md/agi/">AGI</a>
        <a href="/md/business/">商业</a>
        <span>© 2024-present</span>
      </div>
    </footer>
  </div>
</template>
