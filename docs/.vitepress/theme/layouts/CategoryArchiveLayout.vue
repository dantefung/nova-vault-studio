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
      <div class="blog-archive-heading">
        <h1>{{ info?.title || slug }}</h1>
        <p>这一分类收录 {{ articles.length }} 篇文章。</p>
      </div>
    </div>
    <div v-if="articles.length" class="blog-row-list">
      <ArticleCard v-for="a in articles" :key="a.path" :article="a" variant="row" />
    </div>
    <p v-else class="blog-empty">这个分类暂时没有文章。</p>
  </section>
</template>
