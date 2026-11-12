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
      <div class="blog-archive-heading">
        <h1>时间归档</h1>
        <p>文章按月份排列，保留写作与学习的时间线。</p>
      </div>
    </div>
    <div v-if="groups.length" class="blog-archive-list">
      <section v-for="g in groups" :key="g.slug" class="blog-archive-group">
        <div class="blog-archive-anchor">
          <h2>{{ g.slug }}</h2>
          <span>{{ g.count }} 篇</span>
        </div>
        <div class="blog-row-list">
          <ArticleCard v-for="a in g.items" :key="a.path" :article="a" variant="row" />
        </div>
      </section>
    </div>
    <p v-else class="blog-empty">归档中暂时没有文章。</p>
  </section>
</template>
