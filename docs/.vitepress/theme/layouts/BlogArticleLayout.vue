<script setup>
/**
 * BlogArticleLayout - 文章详情页占位布局
 *
 * 设计：内容正文由父级 VitePress DefaultLayout 渲染；此组件
 * 仅作为 BlogLayout 的兜底（如果将来 `/md/blog/article` 路径
 * 被触发也能优雅展示，不重复渲染 Content）。
 */
import { useRoute } from 'vitepress'
import ArticleMeta from '../components/ArticleMeta.vue'
import ArticleNav from '../components/ArticleNav.vue'
import RelatedArticles from '../components/RelatedArticles.vue'
import { useBlogIndex } from '../composables/useBlogIndex.js'

const route = useRoute()
const { articleByPath } = useBlogIndex()
const article = articleByPath(route.path)
</script>

<template>
  <article v-if="article" class="blog-article-standalone">
    <header class="blog-article-standalone-head">
      <h1>{{ article.title }}</h1>
      <ArticleMeta :article="article" />
    </header>
    <ArticleNav :path="article.path" />
    <RelatedArticles :path="article.path" :n="4" />
    <p class="blog-article-standalone-hint">
      这是博客详情页占位组件；正常路径下文章正文由 VitePress DefaultLayout 提供。
    </p>
  </article>
  <div v-else class="blog-article-standalone-empty">
    未识别的文章路径：<code>{{ route.path }}</code>
  </div>
</template>

<style scoped>
.blog-article-standalone {
  display: grid;
  gap: 24px;
  max-width: 880px;
  margin: 0 auto;
}
.blog-article-standalone-head {
  display: grid;
  gap: 8px;
}
.blog-article-standalone-head h1 {
  margin: 0;
  color: var(--easton-doc-ink);
  font-family: 'LXGW WenKai', Georgia, serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.05;
}
.blog-article-standalone-hint {
  margin: 0;
  color: var(--easton-doc-muted);
  font-size: 13px;
}
.blog-article-standalone-empty {
  max-width: 720px;
  margin: 0 auto;
  padding: 28px;
  border-radius: 22px;
  background: color-mix(in srgb, var(--easton-doc-soft) 50%, transparent);
  color: var(--easton-doc-body);
  font-size: 14.5px;
}
.blog-article-standalone-empty code {
  padding: 1px 6px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--easton-doc-soft) 80%, transparent);
  color: var(--easton-doc-ink);
}
</style>