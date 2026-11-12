<script setup>
import { computed } from 'vue'

const props = defineProps({
  article: { type: Object, required: true },
  size: { type: String, default: 'md' }, // sm | md
  linked: { type: Boolean, default: true },
})

const a = computed(() => props.article)
const segments = computed(() => {
  const article = a.value
  const s = []
  if (article.date) s.push({ text: article.date })
  if (article.categoryTitle || article.category) s.push({ text: article.categoryTitle || article.category, href: `/md/blog/category/${article.category}/` })
  if (article.series) s.push({ text: `系列：${article.series}`, href: `/md/blog/series/${article.series}/` })
  if (typeof article.readingTime === 'number') s.push({ text: `${article.readingTime} 分钟` })
  if (article.author) s.push({ text: article.author })
  if (article.source) s.push({ text: article.source })
  return s
})
</script>

<template>
  <div class="article-meta" :class="`is-${props.size}`">
    <template v-for="(seg, i) in segments" :key="i">
      <component
        :is="props.linked && seg.href ? 'a' : 'span'"
        :href="props.linked ? seg.href : undefined"
        class="article-meta-item"
      >
        {{ seg.text }}
      </component>
      <span v-if="i < segments.length - 1" class="article-meta-divider" aria-hidden="true">·</span>
    </template>
  </div>
</template>

<style scoped>
.article-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  color: var(--easton-doc-muted);
  font-size: 14px;
  line-height: 1.5;
}

.article-meta.is-sm {
  font-size: 12.5px;
}

.article-meta-item {
  color: var(--easton-doc-body);
  text-decoration: none;
  transition: color 160ms ease;
}

.article-meta-item:hover {
  color: var(--easton-doc-accent);
}

.article-meta-divider {
  color: var(--easton-doc-rule);
  font-weight: 400;
}
</style>
