<script setup>
/**
 * ArticleFooterNav - 文章末尾上一篇 / 下一篇 导航
 *
 * 依赖 VitePress 的 prev/next links
 */
import { useRoute, useData } from 'vitepress'
import { useBlogIndex } from '../composables/useBlogIndex.js'
import { computed, onMounted, ref } from 'vue'

const route = useRoute()
const { theme } = useData()
const { articleByPath } = useBlogIndex()

const prev = ref(null)
const next = ref(null)

onMounted(() => {
  // 优先用 VitePress 默认 sidebar 的 prev/next links
  const navLinks = theme.value.sidebar?.[route.path] || []
  // 兜底用 blog-index 找相邻文章
  if (navLinks.length === 0) {
    const cur = articleByPath(route.path)
    // 简单 fallback：找相同 category 的前后
    const currentIdx = cur ? findIndex(cur.path) : -1
    if (currentIdx >= 0) {
      next.value = currentIdx > 0 ? { text: indexed[currentIdx - 1].title, link: indexed[currentIdx - 1].path } : null
      prev.value = currentIdx < indexed.length - 1 ? { text: indexed[currentIdx + 1].title, link: indexed[currentIdx + 1].path } : null
    }
  }
})

const prev2 = computed(() => prev.value)
const next2 = computed(() => next.value)
</script>

<template>
  <nav v-if="prev2 || next2" class="article-footer-nav">
    <a v-if="prev2" class="article-footer-nav-item is-prev" :href="prev2.link">
      <span class="article-footer-nav-label">← 上一篇</span>
      <span class="article-footer-nav-title">{{ prev2.text }}</span>
    </a>
    <span v-else class="article-footer-nav-spacer"></span>
    <a v-if="next2" class="article-footer-nav-item is-next" :href="next2.link">
      <span class="article-footer-nav-label">下一篇 →</span>
      <span class="article-footer-nav-title">{{ next2.text }}</span>
    </a>
  </nav>
</template>

<style scoped>
.article-footer-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px dashed var(--easton-doc-rule, #d7cec2);
}

.article-footer-nav-item {
  display: grid;
  gap: 4px;
  padding: 16px 20px;
  border: 1px solid var(--easton-doc-rule, #d7cec2);
  border-radius: 16px;
  background: color-mix(in srgb, var(--easton-doc-surface, #fffaf3) 80%, transparent);
  color: var(--easton-doc-ink, #24211e);
  text-decoration: none;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.article-footer-nav-item:hover {
  border-color: color-mix(in srgb, var(--easton-doc-accent, #e7683d) 50%, var(--easton-doc-rule));
  box-shadow: 0 6px 20px rgba(36, 33, 30, 0.08);
}

.article-footer-nav-item.is-next {
  text-align: right;
}

.article-footer-nav-label {
  color: var(--easton-doc-muted, #9b8c7f);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.article-footer-nav-title {
  font-family: 'LXGW WenKai', Georgia, serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--easton-doc-ink, #24211e);
}

.article-footer-nav-spacer {
  display: block;
}

@media (max-width: 640px) {
  .article-footer-nav {
    grid-template-columns: 1fr;
  }
  .article-footer-nav-item.is-next {
    text-align: left;
  }
}
</style>
