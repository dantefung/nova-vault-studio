<script setup>
import { computed } from 'vue'

const props = defineProps({
  article: { type: Object, required: true },
  size: { type: String, default: 'md' }, // sm | md
})

const a = props.article
const segments = computed(() => {
  const s = []
  if (a.date) s.push({ icon: '📅', text: a.date })
  if (a.categoryTitle || a.category) s.push({ icon: '📂', text: a.categoryTitle || a.category, href: `/md/blog/category/${a.category}/` })
  if (a.series) s.push({ icon: '🧵', text: `系列：${a.series}`, href: `/md/blog/series/${a.series}/` })
  if (typeof a.readingTime === 'number') s.push({ icon: '⏱', text: `${a.readingTime} 分钟` })
  if (a.author) s.push({ icon: '✍️', text: a.author })
  if (a.source) s.push({ icon: '🗂', text: a.source })
  return s
})
</script>

<template>
  <div class="article-meta" :class="`is-${props.size}`">
    <span v-if="a.featured" class="article-meta-badge">编辑精选</span>
    <template v-for="(seg, i) in segments" :key="i">
      <component
        :is="seg.href ? 'a' : 'span'"
        :href="seg.href || undefined"
        class="article-meta-item"
      >
        <span class="article-meta-icon" aria-hidden="true">{{ seg.icon }}</span>
        <span class="article-meta-text">{{ seg.text }}</span>
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--easton-doc-body);
  text-decoration: none;
  transition: color 160ms ease;
}

.article-meta-item:hover {
  color: var(--easton-doc-accent);
}

.article-meta-icon {
  font-size: 0.95em;
}

.article-meta-badge {
  padding: 3px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--easton-doc-accent) 14%, transparent);
  color: var(--easton-doc-accent);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.article-meta-divider {
  color: var(--easton-doc-rule);
  font-weight: 400;
}
</style>