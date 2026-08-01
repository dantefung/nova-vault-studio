<script setup>
import { computed } from 'vue'
import { useBlogIndex } from '../composables/useBlogIndex.js'

const props = defineProps({
  slug: { type: String, required: true },
  currentPath: { type: String, default: '' },
})

const { articlesBySeries, seriesBySlug } = useBlogIndex()
const series = computed(() => seriesBySlug(props.slug))
const items = computed(() => articlesBySeries(props.slug))

function idxOf(path) {
  return items.value.findIndex(a => a.path === path || a.path === path + '/')
}
const currentIdx = computed(() => idxOf(props.currentPath))
</script>

<template>
  <aside v-if="series" class="series-progress">
    <header class="series-progress-head">
      <span class="series-progress-overline">SERIES</span>
      <h3 class="series-progress-title">{{ series.title }}</h3>
      <span class="series-progress-count">{{ series.count }} 篇</span>
    </header>
    <ol class="series-progress-list">
      <li
        v-for="(a, i) in items"
        :key="a.path"
        :class="{
          'is-current': currentIdx >= 0 && i === currentIdx,
          'is-past': currentIdx >= 0 && i < currentIdx,
        }"
      >
        <a :href="a.path">
          <span class="series-progress-marker" aria-hidden="true">{{ i + 1 }}</span>
          <span class="series-progress-name">{{ a.title }}</span>
        </a>
      </li>
    </ol>
  </aside>
</template>

<style scoped>
.series-progress {
  padding: 22px;
  border: 1px solid var(--easton-doc-rule);
  border-radius: 22px;
  background: color-mix(in srgb, var(--easton-doc-surface) 92%, transparent);
  box-shadow: var(--easton-doc-shadow);
  position: sticky;
  top: 96px;
}

.series-progress-head {
  display: grid;
  gap: 4px;
  margin-bottom: 14px;
}

.series-progress-overline {
  color: var(--easton-doc-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.series-progress-title {
  margin: 0;
  color: var(--easton-doc-ink);
  font-family: 'LXGW WenKai', Georgia, serif;
  font-size: 20px;
  font-weight: 600;
}

.series-progress-count {
  color: var(--easton-doc-muted);
  font-size: 12px;
}

.series-progress-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.series-progress-list li a {
  display: grid;
  grid-template-columns: 28px 1fr;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  color: var(--easton-doc-body);
  text-decoration: none;
  transition: background 180ms ease, color 180ms ease;
}

.series-progress-list li a:hover {
  background: color-mix(in srgb, var(--easton-doc-soft) 60%, transparent);
  color: var(--easton-doc-ink);
}

.series-progress-list li.is-current a {
  background: color-mix(in srgb, var(--easton-doc-accent) 14%, transparent);
  color: var(--easton-doc-accent);
}

.series-progress-list li.is-past a {
  color: var(--easton-doc-muted);
}

.series-progress-marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--easton-doc-soft) 60%, transparent);
  color: var(--easton-doc-body);
  font-size: 12px;
  font-weight: 600;
}

.series-progress-list li.is-current .series-progress-marker {
  background: var(--easton-doc-accent);
  color: white;
}

.series-progress-name {
  font-size: 14px;
  line-height: 1.4;
}
</style>