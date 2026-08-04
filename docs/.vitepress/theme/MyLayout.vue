<script setup>
import { computed } from 'vue'
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
import { ref, watch } from 'vue'

const route = useRoute()
const { Layout: DefaultLayout } = DefaultTheme
const { currentTheme, currentLandingTheme, getGiscusTheme } = useTheme()
const { articleByPath } = useBlogIndex()

// 判断是否为落地页路由
const isLanding = computed(() => {
  return ['/', '/v2/', '/v3/', '/v4/', '/v5/'].some(p => route.path === p)
})

// 博客路由（/md/blog/）
const isBlog = computed(() => route.path.startsWith('/md/blog/'))

// 保留现有文章目录行为，并让博客索引中的其它内容目录使用文章布局。
const isArticle = computed(() => {
  if (currentLandingTheme.value !== 'easton') return false
  if (isBlog.value || isLanding.value) return false
  return (
    route.path.startsWith('/md/wiki/') ||
    route.path.startsWith('/md/columns/') ||
    route.path.startsWith('/md/business/') ||
    Boolean(articleByPath(route.path))
  )
})

// 普通文档页（非博客、非落地页、非文章）
const isDocPage = computed(() => !isLanding.value && !isBlog.value && !isArticle.value && route.path.startsWith('/md/'))

const docLayoutClasses = computed(() => ({
  'easton-doc-shell': currentLandingTheme.value === 'easton',
}))

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

  <!-- 文章页（easton 风格）：在 VitePress 默认 layout 外面套 Easton 文章壳（Easton 编辑感内页） -->
  <div v-else-if="isArticle" class="doc-layout-shell" :class="docLayoutClasses">
    <DefaultLayout>
      <template #nav-bar-content-after>
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

  <!-- 普通文档页：默认 VitePress layout + Giscus + ThemeSwitcher（仅 easton 主题下注入 ArticleHero/FooterNav） -->
  <div v-else-if="isDocPage" class="doc-layout-shell easton-doc-shell">
    <DefaultLayout>
      <template #nav-bar-content-after>
        <LandingThemeSwitcher />
        <ThemeSwitcher />
        <MobileNavSheet />
      </template>
      <template #doc-top>
        <ArticleHero v-if="currentLandingTheme === 'easton'" />
      </template>
      <template #doc-after>
        <ArticleFooterNav v-if="currentLandingTheme === 'easton'" />
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

  <!-- 兜底：其它路由（404 / 配置页） -->
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
