<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Giscus from '@giscus/vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import LandingThemeSwitcher from './components/LandingThemeSwitcher.vue'
import HomeLayout from './layouts/HomeLayout.vue'
import { useTheme } from './composables/useTheme.js'
import { ref, watch } from 'vue'

const route = useRoute()
const { Layout: DefaultLayout } = DefaultTheme
const { currentTheme, currentLandingTheme, getGiscusTheme } = useTheme()

// 判断是否为落地页路由
const isLanding = computed(() => {
  return ['/', '/v2/', '/v3/', '/v4/', '/v5/'].some(p => route.path === p)
})

const docLayoutClasses = computed(() => ({
  'easton-doc-shell': currentLandingTheme.value === 'easton-clone',
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

  <!-- 文档页：使用 VitePress 默认完整布局 + Giscus + ThemeSwitcher -->
  <div v-else class="doc-layout-shell" :class="docLayoutClasses">
    <DefaultLayout>
      <template #nav-bar-content-after>
        <LandingThemeSwitcher />
        <ThemeSwitcher />
      </template>
      <template #doc-after>
        <div class="giscus">
          <Giscus
            :key="giscusKey"
            host="https://giscus.app"
            repo="plantree/press-comment"
            repoId="R_kgDOIDNWUg"
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
</template>

<style>
img.pv { margin-top: 1em; }
div.giscus { margin-top: 2em; }
</style>
