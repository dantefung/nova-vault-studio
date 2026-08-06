<script setup>
import { computed } from 'vue'
import ArticleMeta from './ArticleMeta.vue'

const props = defineProps({
  article: { type: Object, required: true },
  variant: { type: String, default: 'default' }, // default | compact | feature | row | editorial
})

const a = props.article
const href = computed(() => a.path)
const category = computed(() => a.categoryTitle || a.category || '')
const categoryHref = computed(() => a.category ? `/md/blog/category/${a.category}/` : '')
const readingTime = computed(() => typeof a.readingTime === 'number' ? `${a.readingTime} 分钟` : '')
const displayDate = computed(() => a.date?.replaceAll('-', '.') || '')
const excerpt = computed(() => a.excerpt?.replace(/<!--\s*more[\s\S]*$/i, '').trim() || '')
</script>

<template>
  <article v-if="props.variant === 'editorial'" class="article-card is-editorial">
    <div class="article-card-meta">
      <time v-if="a.date" :datetime="a.date">{{ displayDate }}</time>
      <a v-if="categoryHref" :href="categoryHref">{{ category }}</a>
      <span v-else-if="category">{{ category }}</span>
    </div>
    <div class="article-card-body">
      <h2 class="article-card-title"><a :href="href">{{ a.title }}</a></h2>
      <p v-if="excerpt" class="article-card-excerpt">{{ excerpt }}</p>
    </div>
    <span v-if="readingTime" class="article-card-reading-time">{{ readingTime }}</span>
  </article>

  <a v-else class="article-card" :class="`is-${props.variant}`" :href="href">
    <div v-if="props.variant === 'feature' || props.variant === 'default'" class="article-card-cover" aria-hidden="true">
      <span class="article-card-cover-mark">{{ (a.categoryTitle || a.category || '文').slice(0, 1) }}</span>
    </div>
    <div class="article-card-body">
      <div class="article-card-meta">
        <ArticleMeta :article="a" size="sm" />
      </div>
      <h3 class="article-card-title">{{ a.title }}</h3>
      <p v-if="excerpt && props.variant !== 'compact' && props.variant !== 'row'" class="article-card-excerpt">{{ excerpt }}</p>
      <div v-if="Array.isArray(a.tags) && a.tags.length && props.variant !== 'row'" class="article-card-tags">
        <span v-for="t in a.tags.slice(0, 4)" :key="t" class="article-card-tag">#{{ t }}</span>
      </div>
    </div>
    <span v-if="props.variant === 'row'" class="article-card-arrow" aria-hidden="true">→</span>
  </a>
</template>

<style scoped>
.article-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 22px;
  border: 1px solid var(--easton-doc-rule);
  border-radius: 22px;
  background: color-mix(in srgb, var(--easton-doc-surface) 92%, transparent);
  color: var(--easton-doc-ink);
  text-decoration: none;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.article-card.is-default,
.article-card.is-feature {
  grid-template-columns: 100px 1fr;
  gap: 20px;
  align-items: start;
}

.article-card.is-row {
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 18px 22px;
}

.article-card.is-compact {
  padding: 18px;
}

.article-card:not(.is-editorial):hover {
  border-color: color-mix(in srgb, var(--easton-doc-accent) 60%, var(--easton-doc-rule));
  box-shadow: var(--easton-doc-shadow);
  transform: translateY(-2px);
}

.article-card-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--easton-doc-accent) 28%, transparent), transparent 60%),
    linear-gradient(140deg, color-mix(in srgb, var(--easton-doc-accent) 16%, var(--easton-doc-soft)), var(--easton-doc-soft));
  color: var(--easton-doc-accent);
}

.article-card-cover-mark {
  font-family: 'LXGW WenKai', Georgia, serif;
  font-size: 44px;
  font-weight: 700;
  line-height: 1;
}

.article-card-body {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.article-card-title {
  margin: 0;
  color: var(--easton-doc-ink);
  font-family: 'LXGW WenKai', Georgia, serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
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

.article-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.article-card-tag {
  padding: 2px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--easton-doc-soft) 70%, transparent);
  color: var(--easton-doc-body);
  font-size: 11.5px;
}

.article-card.is-row .article-card-body {
  grid-template-columns: 110px 1fr;
  grid-template-areas:
    'meta title'
    '. meta';
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
  transition: color 180ms ease, transform 180ms ease;
}

.article-card:hover .article-card-arrow {
  color: var(--easton-doc-accent);
  transform: translateX(2px);
}

.article-card.is-editorial {
  grid-template-columns: 150px minmax(0, 1fr) 74px;
  gap: 34px;
  padding: 28px 0 30px;
  border: 0;
  border-bottom: 1px solid var(--easton-doc-rule);
  border-radius: 0;
  background: transparent;
}

.is-editorial .article-card-meta {
  display: grid;
  align-content: start;
  gap: 3px;
  color: var(--easton-doc-muted);
  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: .03em;
}

.is-editorial .article-card-meta a {
  color: var(--easton-doc-body);
  text-decoration: none;
}

.is-editorial .article-card-body {
  gap: 10px;
}

.is-editorial .article-card-title {
  font-size: clamp(24px, 3vw, 38px);
  font-weight: 400;
  line-height: 1.16;
}

.is-editorial .article-card-title a {
  color: inherit;
  text-decoration: none;
}

.is-editorial .article-card-excerpt {
  line-height: 1.65;
  -webkit-line-clamp: 2;
}

.article-card-reading-time {
  justify-self: end;
  padding-top: 4px;
  color: var(--easton-doc-muted);
  font-family: Georgia, serif;
  font-size: 13px;
  font-style: italic;
  white-space: nowrap;
}

.is-editorial a:hover,
.is-editorial a:focus-visible {
  color: var(--easton-doc-accent);
}

.is-editorial a:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 4px;
}

@media (max-width: 700px) {
  .article-card.is-editorial {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px 18px;
    padding: 22px 0 24px;
  }

  .is-editorial .article-card-meta {
    grid-column: 1 / -1;
    grid-auto-flow: column;
    justify-content: start;
    gap: 12px;
  }

  .is-editorial .article-card-title {
    font-size: clamp(23px, 7vw, 32px);
  }

  .is-editorial .article-card-excerpt {
    font-size: 14px;
  }

  .article-card-reading-time {
    grid-column: 2;
    grid-row: 2;
  }
}

@media (max-width: 640px) {
  .article-card.is-default,
  .article-card.is-feature {
    grid-template-columns: 1fr;
  }
  .article-card-cover {
    width: 100%;
    height: 80px;
  }
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
