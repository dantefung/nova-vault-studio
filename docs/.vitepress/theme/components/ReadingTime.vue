<script setup>
/**
 * ReadingTime - 阅读时间徽章
 *
 * 优先读 frontmatter.readingTime（分钟），否则按 200 字/分钟估算
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
const estimatedMinutes = ref(1)

function updateEstimate() {
  if (typeof document === 'undefined') return
  const text = document.querySelector('.vp-doc')?.textContent || ''
  const cnCount = (text.match(/[一-龥]/g) || []).length
  const enCount = (text.match(/[A-Za-z]+/g) || []).length
  estimatedMinutes.value = Math.max(1, Math.round(cnCount / 400 + enCount / 200))
}

const readingMinutes = computed(() => {
  const fm = frontmatter.value?.readingTime
  if (typeof fm === 'number' && fm > 0) return fm
  return estimatedMinutes.value
})

onMounted(updateEstimate)
watch(() => page.value?.relativePath, () => nextTick(updateEstimate))
</script>

<template>
  <span class="reading-time" :title="`约 ${readingMinutes} 分钟阅读`">
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

</style>
