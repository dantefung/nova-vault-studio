<script setup>
import { computed, ref } from 'vue'
import { useBlogIndex } from '../composables/useBlogIndex.js'
import ArticleCard from '../components/ArticleCard.vue'

const { latest, categories, series } = useBlogIndex()

const mode = ref('latest')

const list = computed(() => {
  if (mode.value === 'latest') return latest(50)
  if (mode.value === 'category') return categories.value
  return series.value
})
</script>

<template>
  <section class="easton-clone-section blog-index">
    <div class="editorial-head">
      <span class="editorial-kicker">WRITING & FIELD NOTES</span>
      <h1 class="editorial-title">文章与工作记录</h1>
      <p class="editorial-desc">关于 AI、开发、产品与长期学习。这里保留结论，也保留结论形成之前的路径。</p>
      <div class="editorial-tabs" role="tablist" aria-label="文章索引方式">
        <button :class="{ on: mode === 'latest' }" role="tab" :aria-selected="mode === 'latest'" @click="mode = 'latest'">最新文章</button>
        <button :class="{ on: mode === 'category' }" role="tab" :aria-selected="mode === 'category'" @click="mode = 'category'">分类</button>
        <button :class="{ on: mode === 'series' }" role="tab" :aria-selected="mode === 'series'" @click="mode = 'series'">系列</button>
      </div>
    </div>

    <template v-if="mode === 'latest'">
      <div class="editorial-index">
        <ArticleCard v-for="a in list" :key="a.path" :article="a" variant="editorial" />
      </div>
    </template>

    <template v-else-if="mode === 'category'">
      <div class="editorial-subindex">
        <a v-for="c in list" :key="c.slug" :href="`/md/blog/category/${c.slug}/`" class="editorial-subindex-item">
          <b>{{ c.title }}</b>
          <span>{{ c.count }} 篇</span>
          <i aria-hidden="true">→</i>
        </a>
      </div>
    </template>

    <template v-else>
      <div class="editorial-subindex">
        <a v-for="s in list" :key="s.slug" :href="`/md/blog/series/${s.slug}/`" class="editorial-subindex-item">
          <b>{{ s.title }}</b>
          <span>{{ s.count }} 篇</span>
          <i aria-hidden="true">→</i>
        </a>
      </div>
    </template>
  </section>
</template>
