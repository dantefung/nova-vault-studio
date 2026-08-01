<script setup>
import { computed } from 'vue'
import { useBlogIndex } from '../composables/useBlogIndex.js'
import ArticleCard from '../components/ArticleCard.vue'

const { archiveGroups } = useBlogIndex()
const groups = computed(() => archiveGroups())
</script>

<template>
  <section class="easton-clone-section blog-archive">
    <div class="easton-clone-section-head">
      <span>ARCHIVE</span>
      <strong>按年-月归档</strong>
    </div>
    <div v-for="g in groups" :key="g.slug" class="blog-archive-group">
      <h2>{{ g.slug }}</h2>
      <span>{{ g.count }} 篇</span>
      <div class="blog-grid">
        <ArticleCard v-for="a in g.items" :key="a.path" :article="a" />
      </div>
    </div>
  </section>
</template>
