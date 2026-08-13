<script setup>
import { computed, ref } from 'vue'
import { useBlogIndex } from '../composables/useBlogIndex.js'
import ArticleCard from '../components/ArticleCard.vue'

const { index, featuredArticles, categories, series } = useBlogIndex()

const mode = ref('latest') // latest | category | series

const articles = computed(() => index.value.articles)
const featured = computed(() => {
  const selected = []
  const paths = new Set()
  for (const article of [...featuredArticles(5), ...articles.value]) {
    if (!article?.path || paths.has(article.path)) continue
    paths.add(article.path)
    selected.push(article)
    if (selected.length === 5) break
  }
  return selected
})
const allArticles = computed(() => {
  const featuredPaths = new Set(featured.value.map(article => article.path))
  return articles.value.filter(article => !featuredPaths.has(article.path))
})

const list = computed(() => {
  if (mode.value === 'category') return categories.value
  return series.value
})
</script>

<template>
  <section class="easton-clone-section blog-index">
    <div class="easton-clone-section-head">
      <span>BLOG / NOTES ON BUILDING</span>
      <div class="blog-index-intro">
        <h1>持续写作，整理正在发生的变化。</h1>
        <p>这里记录 AI、软件与独立创作。精选文章适合初次阅读，完整目录保留每一次思考的时间顺序。</p>
      </div>
      <div class="blog-index-tabs">
        <button :class="{ active: mode === 'latest' }" :aria-pressed="mode === 'latest'" @click="mode = 'latest'">最新</button>
        <button :class="{ active: mode === 'category' }" :aria-pressed="mode === 'category'" @click="mode = 'category'">分类</button>
        <button :class="{ active: mode === 'series' }" :aria-pressed="mode === 'series'" @click="mode = 'series'">系列</button>
      </div>
    </div>

    <template v-if="mode === 'latest'">
      <section v-if="featured.length" class="blog-featured" aria-labelledby="featured-title">
        <div class="blog-subhead"><span>01</span><h2 id="featured-title">编辑精选</h2></div>
        <div class="blog-featured-grid">
          <ArticleCard v-for="a in featured" :key="a.path" :article="a" variant="feature" />
        </div>
      </section>
      <section class="blog-all" aria-labelledby="all-title">
        <div class="blog-subhead"><span>02</span><h2 id="all-title">全部文章</h2></div>
        <div v-if="allArticles.length" class="blog-row-list">
          <ArticleCard v-for="a in allArticles" :key="a.path" :article="a" variant="row" />
        </div>
        <p v-else class="blog-empty">暂无更多文章。</p>
      </section>
    </template>

    <template v-else-if="mode === 'category'">
      <div class="blog-directory">
        <a v-for="(c, index) in list" :key="c.slug" :href="`/md/blog/category/${c.slug}/`" class="blog-tile">
          <em>{{ String(index + 1).padStart(2, '0') }}</em>
          <b>{{ c.title }}</b>
          <span>{{ c.count }} 篇</span>
          <i>→</i>
        </a>
      </div>
    </template>

    <template v-else>
      <div class="blog-directory">
        <a v-for="(s, index) in list" :key="s.slug" :href="`/md/blog/series/${s.slug}/`" class="blog-tile">
          <em>{{ String(index + 1).padStart(2, '0') }}</em>
          <b>{{ s.title }}</b>
          <span>{{ s.count }} 篇</span>
          <i>→</i>
        </a>
      </div>
    </template>
  </section>
</template>
