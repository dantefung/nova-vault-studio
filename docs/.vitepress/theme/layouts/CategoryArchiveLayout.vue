<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { useBlogIndex } from '../composables/useBlogIndex.js'
import ArticleCard from '../components/ArticleCard.vue'

const route = useRoute()
const { categoryBySlug, articlesByCategory } = useBlogIndex()

const slug = computed(() => route.path.split('/category/')[1]?.replace(/\/$/, '') || '')
const info = computed(() => categoryBySlug(slug.value))
const articles = computed(() => articlesByCategory(slug.value))
</script>

<template>
  <section class="easton-clone-section blog-category">
    <div class="easton-clone-section-head">
      <span>CATEGORY</span>
      <strong>{{ info?.title || slug }}</strong>
      <span>{{ articles.length }} 篇</span>
    </div>
    <div class="blog-grid">
      <ArticleCard v-for="a in articles" :key="a.path" :article="a" />
    </div>
  </section>
</template>
