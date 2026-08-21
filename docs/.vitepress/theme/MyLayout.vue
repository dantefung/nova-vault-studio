<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Giscus from '@giscus/vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import LandingThemeSwitcher from './components/LandingThemeSwitcher.vue'
import MobileNavSheet from './components/MobileNavSheet.vue'
import ArticleHero from './components/ArticleHero.vue'
import ArticleFooterNav from './components/ArticleFooterNav.vue'
import HomeLayout from './layouts/HomeLayout.vue'
import BlogLayout from './layouts/BlogLayout.vue'
import BlogArticleShell from './layouts/BlogArticleShell.vue'
import { useTheme } from './composables/useTheme.js'
import { useBlogIndex } from './composables/useBlogIndex.js'

const route = useRoute()
const { Layout: DefaultLayout } = DefaultTheme
const { currentTheme, currentLandingTheme, getGiscusTheme } = useTheme()
const { articleByPath } = useBlogIndex()
const SIDEBAR_STORAGE_KEY = 'easton-article-sidebar-collapsed'
const isArticleSidebarCollapsed = ref(true)

onMounted(() => {
  try {
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    isArticleSidebarCollapsed.value = saved === 'false' ? false : true
  } catch {
    isArticleSidebarCollapsed.value = true
  }
})

function toggleArticleSidebar() {
  isArticleSidebarCollapsed.value = !isArticleSidebarCollapsed.value
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isArticleSidebarCollapsed.value))
  } catch {
    // Current-session state remains usable when storage is unavailable.
  }
}

// 判断是否为落地页路由
const isLanding = computed(() => {
  return ['/', '/v2/', '/v3/', '/v4/', '/v5/'].some(p => route.path === p)
})

// 博客路由（/md/blog/）
const isBlog = computed(() => route.path.startsWith('/md/blog/'))

// 路由决定稳定 DOM，landing theme 只切换文章增强视觉，避免 hydration 分支不一致。
const isArticlePath = computed(() => {
  if (isBlog.value || isLanding.value) return false
  return (
    route.path.startsWith('/md/wiki/') ||
    route.path.startsWith('/md/columns/') ||
    route.path.startsWith('/md/business/') ||
    Boolean(articleByPath(route.path))
  )
})

// 普通文档页（非博客、非落地页、非文章）
const isDocPage = computed(() => !isLanding.value && !isBlog.value && !isArticlePath.value && route.path.startsWith('/md/'))

// Giscus 状态
const giscusKey = ref(1)
const giscusTheme = ref('light')

watch(currentTheme, (theme) => {
  giscusTheme.value = getGiscusTheme(theme)
  giscusKey.value++
}, { immediate: true })
</script>

<template>
  <!-- 落地页：使用自定义 HomeLayout -->
  <HomeLayout v-if="isLanding" />

  <!-- 博客页（/md/blog/）：列表 / 系列 / 分类 / 时间归档 -->
  <BlogLayout v-else-if="isBlog" />

  <!-- 文章页（cubxxw 编辑风格） -->
  <div
    v-else-if="isArticlePath"
    class="doc-layout-shell cubxxw-article-shell"
    :class="{ 'is-sidebar-collapsed': isArticleSidebarCollapsed }"
  >
    <DefaultLayout>
      <template #nav-bar-content-after>
        <button
          type="button"
          class="cubxxw-sidebar-toggle"
          :aria-expanded="String(!isArticleSidebarCollapsed)"
          aria-controls="VPSidebarNav"
          @click="toggleArticleSidebar"
        >
          {{ isArticleSidebarCollapsed ? '目录' : '收起' }}
        </button>
        <LandingThemeSwitcher />
        <ThemeSwitcher />
        <MobileNavSheet />
      </template>
      <template #doc-top>
        <ArticleHero />
      </template>
      <template #doc-after>
        <BlogArticleShell />
        <div class="giscus">
          <Giscus
            :key="giscusKey"
            host="https://giscus.app"
            repo="plantree/press-comment"
            repoId="R_kgDOIDNWUs4CRlY7"
            category="General"
            categoryId="DIC_kwDOIDNWUs4CRlY7"
            :theme="giscusTheme"
            lang="zh-CN"
            loading="lazy"
            strict="1"
            mapping="title"
            crossorigin="anonymous"
          />
        </div>
      </template>
    </DefaultLayout>
  </div>

  <!-- 普通文档页 -->
  <div v-else-if="isDocPage" class="doc-layout-shell cubxxw-doc-shell">
    <DefaultLayout>
      <template #nav-bar-content-after>
        <LandingThemeSwitcher />
        <ThemeSwitcher />
        <MobileNavSheet />
      </template>
      <template #doc-top>
        <ArticleHero v-if="currentLandingTheme === 'cubxxw'" />
      </template>
      <template #doc-after>
        <ArticleFooterNav v-if="currentLandingTheme === 'cubxxw'" />
        <div class="giscus">
          <Giscus
            :key="giscusKey"
            host="https://giscus.app"
            repo="plantree/press-comment"
            repoId="R_kgDOIDNWUs4CRlY7"
            category="General"
            categoryId="DIC_kwDOIDNWUs4CRlY7"
            :theme="giscusTheme"
            lang="zh-CN"
            loading="lazy"
            strict="1"
            mapping="title"
            crossorigin="anonymous"
          />
        </div>
      </template>
    </DefaultLayout>
  </div>

  <!-- 兜底：其它路由 -->
  <DefaultLayout v-else>
    <template #nav-bar-content-after>
      <LandingThemeSwitcher />
      <ThemeSwitcher />
      <MobileNavSheet />
    </template>
  </DefaultLayout>
</template>

<style>
img.pv { margin-top: 1em; }
div.giscus { margin-top: 2em; }
</style>
