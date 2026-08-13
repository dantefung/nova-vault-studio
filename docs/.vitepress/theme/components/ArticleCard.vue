<script setup>
import { computed } from 'vue'
import ArticleMeta from './ArticleMeta.vue'

const props = defineProps({
  article: { type: Object, required: true },
  variant: { type: String, default: 'default' }, // default | compact | feature | row
})

const a = computed(() => props.article)
const href = computed(() => a.value.path)
const illustrationClass = computed(() => {
  const key = String(a.value.id || a.value.path || a.value.title || '')
  const value = Array.from(key).reduce((sum, char) => sum + char.codePointAt(0), 0)
  return `illustration-${(value % 5) + 1}`
})
</script>

<template>
  <article class="article-card" :class="[`is-${props.variant}`, props.variant === 'feature' && illustrationClass]">
    <div v-if="props.variant === 'feature'" class="article-card-illustration" aria-hidden="true">
      <span></span>
    </div>
    <div class="article-card-body">
      <div class="article-card-meta">
        <ArticleMeta :article="a" size="sm" :linked="false" />
      </div>
      <h3 class="article-card-title"><a :href="href">{{ a.title }}</a></h3>
      <p v-if="a.excerpt && props.variant !== 'compact' && props.variant !== 'row'" class="article-card-excerpt">{{ a.excerpt }}</p>
    </div>
    <span v-if="props.variant === 'row'" class="article-card-arrow" aria-hidden="true">→</span>
  </article>
</template>

<style scoped>
.article-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  min-width: 0;
  padding: 20px 0;
  border-top: 1px solid var(--easton-doc-rule);
  color: var(--easton-doc-ink);
}

.article-card.is-feature {
  grid-template-rows: minmax(150px, 1fr) auto;
  padding: 0;
  border-top: 0;
}

.article-card.is-row {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  padding: 18px 0;
}

.article-card.is-compact {
  padding: 16px 0;
}

.article-card-illustration {
  position: relative;
  min-height: 150px;
  overflow: hidden;
  border: 1px solid var(--easton-doc-rule);
  background: var(--easton-doc-soft);
}

.article-card-illustration::before,
.article-card-illustration::after,
.article-card-illustration span {
  position: absolute;
  display: block;
  content: '';
}

.illustration-1 .article-card-illustration::before {
  inset: 18% 12%;
  border: 1px solid var(--easton-doc-accent);
}
.illustration-1 .article-card-illustration::after {
  top: 0;
  bottom: 0;
  left: 38%;
  border-left: 1px solid var(--easton-doc-rule);
}
.illustration-2 .article-card-illustration::before {
  width: 42%;
  height: 72%;
  right: 10%;
  bottom: 0;
  border: 1px solid var(--easton-doc-accent);
  background: var(--easton-doc-surface);
}
.illustration-2 .article-card-illustration::after {
  width: 58%;
  top: 32%;
  left: 0;
  border-top: 1px solid var(--easton-doc-ink);
}
.illustration-3 .article-card-illustration::before {
  inset: 14%;
  border-top: 1px solid var(--easton-doc-ink);
  border-bottom: 1px solid var(--easton-doc-accent);
}
.illustration-3 .article-card-illustration::after {
  width: 1px;
  height: 100%;
  left: 50%;
  background: var(--easton-doc-rule);
}
.illustration-4 .article-card-illustration::before {
  width: 54%;
  height: 54%;
  top: 12%;
  left: 10%;
  border: 1px solid var(--easton-doc-ink);
}
.illustration-4 .article-card-illustration::after {
  width: 54%;
  height: 54%;
  right: 10%;
  bottom: 12%;
  border: 1px solid var(--easton-doc-accent);
}
.illustration-5 .article-card-illustration::before {
  inset: 0 30%;
  border-right: 1px solid var(--easton-doc-rule);
  border-left: 1px solid var(--easton-doc-rule);
  background: var(--easton-doc-surface);
}
.illustration-5 .article-card-illustration::after {
  right: 0;
  bottom: 28%;
  left: 0;
  border-top: 1px solid var(--easton-doc-accent);
}

.article-card-body {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.article-card-title {
  margin: 0;
  color: var(--easton-doc-ink);
  font-family: var(--blog-heading-font, 'LXGW WenKai', Georgia, serif);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
}

.article-card-title a {
  color: inherit;
  text-decoration: none;
  text-underline-offset: 0.18em;
}

.article-card-title a:hover,
.article-card-title a:focus-visible {
  color: var(--easton-doc-accent);
  text-decoration: underline;
}

.article-card.is-feature .article-card-title {
  font-size: 22px;
}

.article-card-excerpt {
  margin: 0;
  color: var(--easton-doc-body);
  font-size: 14.5px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card.is-row .article-card-body {
  grid-template-columns: minmax(120px, auto) minmax(0, 1fr);
  grid-template-areas:
    'meta title';
  align-items: center;
  gap: 4px 14px;
}

.article-card.is-row .article-card-meta {
  grid-area: meta;
}

.article-card.is-row .article-card-title {
  grid-area: title;
  font-size: 16px;
}

.article-card-arrow {
  color: var(--easton-doc-muted);
  font-size: 18px;
}

.article-card:focus-within .article-card-arrow,
.article-card:hover .article-card-arrow {
  color: var(--easton-doc-accent);
}

@media (max-width: 640px) {
  .article-card.is-row {
    grid-template-columns: 1fr auto;
  }
  .article-card.is-row .article-card-body {
    grid-template-columns: 1fr;
    grid-template-areas:
      'meta'
      'title';
  }
}
</style>
