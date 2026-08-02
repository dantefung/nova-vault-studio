<script setup>
/**
 * ArticleFooterNav - 文章末尾上一篇 / 下一篇 导航
 *
 * 通过 VitePress 的 frontmatter.nav（navigation）拿 prev/next。
 * SSR 安全：仅读 frontmatter 字段，不读 DOM。
 */
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const prev = computed(() => {
  const nav = frontmatter.value?.nav
  return Array.isArray(nav) ? (nav[0] || null) : null
})

const next = computed(() => {
  const nav = frontmatter.value?.nav
  return Array.isArray(nav) ? (nav[1] || null) : null
})
</script>

<template>
  <nav v-if="prev || next" class="article-footer-nav">
    <a v-if="prev" class="article-footer-nav-item is-prev" :href="prev.link">
      <span class="article-footer-nav-label">← 上一篇</span>
      <span class="article-footer-nav-title">{{ prev.text }}</span>
    </a>
    <span v-else class="article-footer-nav-spacer"></span>
    <a v-if="next" class="article-footer-nav-item is-next" :href="next.link">
      <span class="article-footer-nav-label">下一篇 →</span>
      <span class="article-footer-nav-title">{{ next.text }}</span>
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
