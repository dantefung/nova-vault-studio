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
      <strong>{{ info?.title || slug }}</strong>
      <span>{{ articles.length }} 篇</span>
    </div>
    <div class="blog-grid">
      <ArticleCard v-for="a in articles" :key="a.path" :article="a" />
    </div>
  </section>
</template>
