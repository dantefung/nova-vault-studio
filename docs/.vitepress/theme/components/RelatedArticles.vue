<script setup>
import { computed } from 'vue'
import { useBlogIndex } from '../composables/useBlogIndex.js'
import ArticleCard from './ArticleCard.vue'

const props = defineProps({
  path: { type: String, required: true },
  n: { type: Number, default: 4 },
})

const { relatedArticles } = useBlogIndex()
const list = computed(() => relatedArticles(props.path, props.n))
</script>

<template>
  <section v-if="list.length" class="related-articles">
    <header class="related-articles-head">
      <span class="related-articles-overline">RELATED</span>
      <h3 class="related-articles-title">相关文章</h3>
    </header>
    <div class="related-articles-grid">
      <ArticleCard
        v-for="a in list"
        :key="a.path"
        :article="a"
        variant="compact"
      />
    </div>
  </section>
</template>

<style scoped>
.related-articles {
  margin-top: 56px;
  padding-top: 32px;
  border-top: 1px solid var(--easton-doc-rule);
}

.related-articles-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 18px;
}

.related-articles-overline {
  color: var(--easton-doc-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.related-articles-title {
  margin: 0;
  color: var(--easton-doc-ink);
  font-family: 'LXGW WenKai', Georgia, serif;
  font-size: 22px;
  font-weight: 600;
}

.related-articles-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 720px) {
  .related-articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>