<script setup>
import { useBlogIndex } from '../composables/useBlogIndex.js'

const props = defineProps({
  path: { type: String, required: true },
})

const { neighbors } = useBlogIndex()
const { prev, next } = neighbors(props.path)
</script>

<template>
  <nav v-if="prev || next" class="article-nav" aria-label="上一篇 / 下一篇">
    <a v-if="prev" class="article-nav-item" :href="prev.path">
      <span class="article-nav-label">← 上一篇</span>
      <span class="article-nav-title">{{ prev.title }}</span>
    </a>
    <span v-else class="article-nav-spacer"></span>
    <a v-if="next" class="article-nav-item is-next" :href="next.path">
      <span class="article-nav-label">下一篇 →</span>
      <span class="article-nav-title">{{ next.title }}</span>
    </a>
  </nav>
</template>

<style scoped>
.article-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 36px;
}

.article-nav-item {
  display: grid;
  gap: 6px;
  padding: 18px 20px;
  border: 1px solid var(--easton-doc-rule);
  border-radius: 18px;
  background: color-mix(in srgb, var(--easton-doc-surface) 92%, transparent);
  color: var(--easton-doc-ink);
  text-decoration: none;
  transition: border-color 180ms ease, box-shadow 180ms ease;
}

.article-nav-item:hover {
  border-color: color-mix(in srgb, var(--easton-doc-accent) 50%, var(--easton-doc-rule));
  box-shadow: var(--easton-doc-shadow);
}

.article-nav-item.is-next {
  text-align: right;
}

.article-nav-label {
  color: var(--easton-doc-muted);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.article-nav-title {
  font-family: 'LXGW WenKai', Georgia, serif;
  font-size: 16px;
  font-weight: 600;
}

.article-nav-spacer {
  display: block;
}

@media (max-width: 640px) {
  .article-nav {
    grid-template-columns: 1fr;
  }
  .article-nav-item.is-next {
    text-align: left;
  }
}
</style>