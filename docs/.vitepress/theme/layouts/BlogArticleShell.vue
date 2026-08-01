<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { useBlogIndex } from '../composables/useBlogIndex.js'
import ArticleMeta from '../components/ArticleMeta.vue'
import ArticleNav from '../components/ArticleNav.vue'
import RelatedArticles from '../components/RelatedArticles.vue'
import SeriesProgress from '../components/SeriesProgress.vue'

const route = useRoute()
const { articleByPath } = useBlogIndex()

const article = computed(() => articleByPath(route.path))
</script>

<template>
  <div v-if="article" class="blog-article-shell">
    <header class="blog-article-shell-head">
      <a v-if="article.category" class="blog-article-shell-eyebrow" :href="`/md/blog/category/${article.category}/`">
        {{ article.categoryTitle || article.category }}
      </a>
      <ArticleMeta :article="article" />
    </header>

    <div class="blog-article-shell-grid">
      <div class="blog-article-shell-main">
        <ArticleNav :path="article.path" />
        <RelatedArticles :path="article.path" :n="4" />
      </div>
      <aside v-if="article.series" class="blog-article-shell-aside">
        <SeriesProgress :slug="article.series" :current-path="article.path" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.blog-article-shell {
  display: grid;
  gap: 28px;
  margin-top: 32px;
}

.blog-article-shell-head {
  display: grid;
  gap: 8px;
  padding: 24px 28px;
  border: 1px solid var(--easton-doc-rule);
  border-radius: 22px;
  background: color-mix(in srgb, var(--easton-doc-surface) 88%, transparent);
}

.blog-article-shell-eyebrow {
  color: var(--easton-doc-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-decoration: none;
}

.blog-article-shell-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 28px;
  align-items: start;
}

.blog-article-shell-main {
  display: grid;
  gap: 24px;
  min-width: 0;
}

@media (max-width: 960px) {
  .blog-article-shell-grid {
    grid-template-columns: 1fr;
  }
}
</style>
