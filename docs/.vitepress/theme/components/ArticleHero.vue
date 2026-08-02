<script setup>
/**
 * ArticleHero - easton 主题文章头部 hero
 *
 * 大标题 + kicker badge（category）+ 元信息条（日期 / 阅读时间 / 来源）+ 描述
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import ReadingTime from './ReadingTime.vue'

const { frontmatter, title } = useData()

const dateStr = computed(() => {
  const d = frontmatter.value?.date
  if (!d) return null
  if (typeof d === 'string') return d.slice(0, 10)
  return String(d).slice(0, 10)
})

const sourceLabel = computed(() => {
  const s = frontmatter.value?.source
  if (!s) return null
  return String(s)
})

const authorLabel = computed(() => {
  const a = frontmatter.value?.author
  if (!a) return null
  return String(a)
})

const descText = computed(() => {
  const d = frontmatter.value?.description
  return d ? String(d) : null
})

const categoryText = computed(() => {
  const c = frontmatter.value?.category
  return c ? String(c) : null
})

const tagList = computed(() => {
  const t = frontmatter.value?.tags
  if (Array.isArray(t)) return t
  if (typeof t === 'string') return t.split(',').map(s => s.trim()).filter(Boolean)
  return []
})
</script>

<template>
  <header class="article-hero">
    <div v-if="categoryText" class="article-hero-kicker">
      <span class="article-hero-kicker-mark"></span>
      {{ categoryText }}
    </div>

    <h1 class="article-hero-title">{{ title }}</h1>

    <p v-if="descText" class="article-hero-description">{{ descText }}</p>

    <div class="article-hero-meta">
      <span v-if="dateStr" class="article-hero-meta-item">
        <span class="article-hero-meta-icon" aria-hidden="true">📅</span>
        {{ dateStr }}
      </span>
      <ReadingTime />
      <span v-if="sourceLabel" class="article-hero-meta-item">
        <span class="article-hero-meta-icon" aria-hidden="true">🗂</span>
        {{ sourceLabel }}
      </span>
      <span v-if="authorLabel" class="article-hero-meta-item">
        <span class="article-hero-meta-icon" aria-hidden="true">✍️</span>
        {{ authorLabel }}
      </span>
    </div>

    <div v-if="tagList.length" class="article-hero-tags">
      <span v-for="t in tagList" :key="t" class="article-hero-tag">#{{ t }}</span>
    </div>
  </header>
</template>

<style scoped>
.article-hero {
  padding: 12px 0 28px;
  border-bottom: 1px dashed var(--easton-doc-rule, #d7cec2);
  margin-bottom: 32px;
}

.article-hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 8px;
  margin-bottom: 14px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--easton-doc-accent, #e7683d) 12%, transparent);
  color: var(--easton-doc-accent, #e7683d);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.article-hero-kicker-mark {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--easton-doc-accent, #e7683d);
}

.article-hero-title {
  margin: 0 0 12px;
  font-family: 'LXGW WenKai', Georgia, serif;
  font-size: clamp(2rem, 4.5vw, 3.4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--easton-doc-ink, #24211e);
}

.article-hero-description {
  margin: 0 0 18px;
  font-size: 17px;
  line-height: 1.55;
  color: var(--easton-doc-body, #6e655c);
}

.article-hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--easton-doc-muted, #9b8c7f);
}

.article-hero-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.article-hero-meta-icon {
  font-size: 0.95em;
}

.article-hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.article-hero-tag {
  padding: 3px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--easton-doc-soft, #eee5d8) 50%, transparent);
  color: var(--easton-doc-body, #6e655c);
  font-size: 12px;
}
</style>
