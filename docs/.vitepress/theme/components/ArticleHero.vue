<script setup>
/**
 * ArticleHero - easton 主题文章头部 hero
 *
 * 大标题 + kicker badge（category）+ 元信息条（日期 / 阅读时间 / 来源）+ 描述
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import ReadingTime from './ReadingTime.vue'

const { frontmatter, page } = useData()

const displayTitle = computed(() => {
  const value = frontmatter.value?.title || page.value?.title
  return value ? String(value) : ''
})

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

    <h1 class="article-hero-title">{{ displayTitle }}</h1>

    <p v-if="descText" class="article-hero-description">{{ descText }}</p>

    <div class="article-hero-meta">
      <span v-if="dateStr" class="article-hero-meta-item">
        {{ dateStr }}
      </span>
      <ReadingTime />
      <span v-if="sourceLabel" class="article-hero-meta-item">
        {{ sourceLabel }}
      </span>
      <span v-if="authorLabel" class="article-hero-meta-item">
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
  box-sizing: border-box;
  width: auto;
  max-width: var(--easton-reading-width, 820px);
  margin: 0 auto 32px;
  padding: 12px 42px 28px;
  border-bottom: 1px solid var(--easton-doc-rule, #d7cec2);
}

.article-hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0;
  margin-bottom: 16px;
  color: var(--easton-doc-accent, #e7683d);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.article-hero-kicker-mark {
  width: 18px;
  height: 1px;
  background: var(--easton-doc-accent, #e7683d);
}

.article-hero-title {
  margin: 0 0 12px;
  font-family: 'LXGW WenKai', Georgia, serif;
  font-size: clamp(2rem, 3.3vw, 3rem);
  font-weight: 700;
  line-height: 1.16;
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
  gap: 0;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--easton-doc-muted, #9b8c7f);
}

.article-hero-meta-item {
  display: inline-flex;
  align-items: center;
}

.article-hero-meta > * + *::before {
  content: '/';
  margin: 0 9px;
  color: var(--easton-doc-rule, #d7cec2);
}

.article-hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0 12px;
}

.article-hero-tag {
  padding: 0;
  color: var(--easton-doc-body, #6e655c);
  font-size: 12px;
}

@media (max-width: 960px) {
  .article-hero {
    width: auto;
    max-width: none;
    margin: 0 0 28px;
    padding: 12px 30px 24px;
  }
}

@media (max-width: 640px) {
  .article-hero {
    padding: 8px 18px 22px;
  }

  .article-hero-title {
    font-size: clamp(1.9rem, 10vw, 2.5rem);
  }
}
</style>
