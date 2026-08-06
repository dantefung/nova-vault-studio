<script setup>
import { computed, ref } from 'vue'
import { useBlogIndex } from '../composables/useBlogIndex.js'
import ArticleCard from '../components/ArticleCard.vue'

const { latest, articlesByCategory, articlesBySeries, categories, series } = useBlogIndex()

const mode = ref('latest')

const list = computed(() => {
  if (mode.value === 'latest') return latest(50)
  if (mode.value === 'category') return categories.value
  return series.value
})

const leadArticle = computed(() => mode.value === 'latest' ? (list.value[0] || null) : null)
const sideArticle = computed(() => mode.value === 'latest' ? (list.value[1] || null) : null)
const storyArticles = computed(() => mode.value === 'latest' ? list.value.slice(2) : [])

const latestDate = computed(() => {
  if (!list.value.length) return ''
  return list.value[0].date || ''
})
</script>

<template>
  <section class="easton-clone-section blog-index">
    <div class="magazine-masthead">
      <span class="magazine-kicker">BLOG</span>
      <h1 class="magazine-headline">系统、工具与独立创造</h1>
      <p class="magazine-description">一份持续更新的个人技术刊物。</p>
      <div class="magazine-tabs">
        <button :class="{ active: mode === 'latest' }" @click="mode = 'latest'">最新</button>
        <button :class="{ active: mode === 'category' }" @click="mode = 'category'">分类</button>
        <button :class="{ active: mode === 'series' }" @click="mode = 'series'">系列</button>
      </div>
    </div>

    <template v-if="mode === 'latest'">
      <div class="issue-line">
        <b>本期文章</b>
        <span class="meta">{{ latestDate }}</span>
      </div>
      <div v-if="leadArticle" class="magazine-lead-grid" :class="{ 'is-single': !sideArticle }">
        <ArticleCard :article="leadArticle" variant="lead" />
        <ArticleCard v-if="sideArticle" :article="sideArticle" variant="side" />
      </div>
      <div class="magazine-story-grid">
        <ArticleCard v-for="a in storyArticles" :key="a.path" :article="a" variant="story" />
      </div>
    </template>

    <template v-else-if="mode === 'category'">
      <div class="blog-grid">
        <a v-for="c in list" :key="c.slug" :href="`/md/blog/category/${c.slug}/`" class="blog-tile">
          <b>{{ c.title }}</b>
          <span>{{ c.count }} 篇</span>
          <i>→</i>
        </a>
      </div>
    </template>

    <template v-else>
      <div class="blog-grid">
        <a v-for="s in list" :key="s.slug" :href="`/md/blog/series/${s.slug}/`" class="blog-tile">
          <b>{{ s.title }}</b>
          <span>{{ s.count }} 篇</span>
          <i>→</i>
        </a>
      </div>
    </template>
  </section>
</template>
