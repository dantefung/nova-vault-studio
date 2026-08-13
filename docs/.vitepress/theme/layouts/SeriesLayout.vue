<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { useBlogIndex } from '../composables/useBlogIndex.js'
import ArticleCard from '../components/ArticleCard.vue'

const route = useRoute()
const { seriesBySlug, articlesBySeries } = useBlogIndex()

const slug = computed(() => route.path.split('/series/')[1]?.replace(/\/$/, '') || '')
const info = computed(() => seriesBySlug(slug.value))
const articles = computed(() => articlesBySeries(slug.value))
</script>

<template>
  <section class="easton-clone-section blog-series">
    <div class="easton-clone-section-head">
      <span>SERIES</span>
      <div class="blog-archive-heading">
        <h1>{{ info?.title || slug }}</h1>
        <p>按系列连续阅读，共 {{ articles.length }} 篇。</p>
      </div>
    </div>
    <div v-if="articles.length" class="blog-row-list">
      <ArticleCard v-for="a in articles" :key="a.path" :article="a" variant="row" />
    </div>
    <p v-else class="blog-empty">这个系列暂时没有文章。</p>
  </section>
</template>
