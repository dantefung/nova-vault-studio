<script setup>
/**
 * ReadingTime - 阅读时间徽章
 *
 * 优先读 frontmatter.readingTime（分钟），否则按 200 字/分钟估算
 */
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, source } = useData()

const readingMinutes = computed(() => {
  const fm = frontmatter.value?.readingTime
  if (typeof fm === 'number' && fm > 0) return fm
  // 估算：去掉 frontmatter + markdown 标记，按字符数
  const text = (source.value || '').replace(/^---[\s\S]*?---/, '').replace(/[#>*`_\-\[\]\(\)!]/g, '')
  const cnCount = (text.match(/[一-龥]/g) || []).length
  const enCount = (text.match(/[A-Za-z]+/g) || []).length
  const minutes = Math.max(1, Math.round(cnCount / 400 + enCount / 200))
  return minutes
})
</script>

<template>
  <span class="reading-time" :title="`约 ${readingMinutes} 分钟阅读`">
    <span class="reading-time-icon" aria-hidden="true">⏱</span>
    {{ readingMinutes }} 分钟
  </span>
</template>

<style scoped>
.reading-time {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--easton-doc-muted, #9b8c7f);
}

.reading-time-icon {
  font-size: 0.95em;
}
</style>
