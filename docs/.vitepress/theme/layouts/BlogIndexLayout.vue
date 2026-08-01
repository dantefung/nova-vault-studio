<script setup>
import { computed, ref } from 'vue'
import { useBlogIndex } from '../composables/useBlogIndex.js'
import ArticleCard from '../components/ArticleCard.vue'

const { latest, articlesByCategory, articlesBySeries, categories, series } = useBlogIndex()

const mode = ref('latest') // latest | category | series

const list = computed(() => {
  if (mode.value === 'latest') return latest(50)
  if (mode.value === 'category') return categories.value
  return series.value
})
</script>

<template>
  <section class="easton-clone-section blog-index">
    <div class="easton-clone-section-head">
      <span>BLOG</span>
      <strong>所有文章、系列与分类的统一入口。</strong>
      <div class="blog-index-tabs">
        <button :class="{ active: mode === 'latest' }" @click="mode = 'latest'">最新</button>
        <button :class="{ active: mode === 'category' }" @click="mode = 'category'">分类</button>
        <button :class="{ active: mode === 'series' }" @click="mode = 'series'">系列</button>
      </div>
    </div>

    <template v-if="mode === 'latest'">
      <div class="blog-grid">
        <ArticleCard v-for="a in list" :key="a.path" :article="a" />
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
