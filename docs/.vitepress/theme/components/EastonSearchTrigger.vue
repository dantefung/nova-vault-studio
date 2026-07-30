<script setup>
import '@docsearch/css'
import { defineAsyncComponent, ref } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'bar',
  },
  label: {
    type: String,
    default: '搜索问题',
  },
})

const VPLocalSearchBox = defineAsyncComponent(() => import('vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue'))
const showSearch = ref(false)

function openSearch() {
  showSearch.value = true
}
</script>

<template>
  <button
    type="button"
    class="easton-search-trigger"
    :class="`is-${props.variant}`"
    aria-label="搜索文章"
    @click="openSearch"
  >
    <span class="easton-search-icon" aria-hidden="true"></span>
    <span class="easton-search-copy">
      <span class="easton-search-label">{{ props.label }}</span>
      <span v-if="props.variant === 'bar'" class="easton-search-placeholder">搜索 System Vault...</span>
    </span>
    <span v-if="props.variant === 'bar'" class="easton-search-shortcut" aria-hidden="true">Ctrl K</span>
  </button>

  <VPLocalSearchBox v-if="showSearch" @close="showSearch = false" />
</template>

<style scoped>
.easton-search-trigger {
  display: inline-flex;
  align-items: center;
  border: 0;
  background: transparent;
  color: var(--clone-ink);
  font: inherit;
  cursor: pointer;
}

.easton-search-icon {
  position: relative;
  width: 14px;
  height: 14px;
  border: 1.6px solid currentColor;
  border-radius: 50%;
}

.easton-search-icon::after {
  position: absolute;
  right: -5px;
  bottom: -4px;
  width: 6px;
  height: 1.6px;
  background: currentColor;
  content: '';
  transform: rotate(45deg);
  transform-origin: left center;
}

.easton-search-copy {
  display: inline-flex;
  min-width: 0;
  align-items: center;
}

.easton-search-label,
.easton-search-placeholder {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.easton-search-trigger.is-nav {
  gap: 7px;
  padding: 0;
  color: var(--clone-body);
  font-size: 13px;
}

.easton-search-trigger.is-nav:hover,
.easton-search-trigger.is-nav:focus-visible {
  color: var(--clone-accent);
}

.easton-search-trigger.is-action {
  gap: 9px;
  padding: 0;
  color: var(--clone-ink);
  text-decoration: none;
}

.easton-search-trigger.is-action::after {
  display: block;
  height: 1px;
  margin-top: 5px;
  background: var(--clone-accent);
  content: '';
}

.easton-search-trigger.is-bar {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 16px;
  width: min(100%, 680px);
  margin-top: 34px;
  padding: 18px 20px;
  border: 1px solid var(--clone-rule);
  border-radius: 999px;
  background: color-mix(in srgb, var(--clone-surface) 82%, transparent);
  box-shadow: 0 18px 45px rgb(36 33 30 / 0.08);
  text-align: left;
}

.easton-search-trigger.is-bar:hover,
.easton-search-trigger.is-bar:focus-visible {
  border-color: var(--clone-accent);
  box-shadow: 0 22px 60px rgb(231 104 61 / 0.14);
}

.easton-search-trigger.is-bar .easton-search-copy {
  display: grid;
  gap: 3px;
}

.easton-search-trigger.is-bar .easton-search-label {
  color: var(--clone-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.easton-search-trigger.is-bar .easton-search-placeholder {
  color: var(--clone-body);
  font-size: 16px;
}

.easton-search-shortcut {
  align-self: center;
  padding: 4px 8px;
  border: 1px solid var(--clone-rule);
  border-radius: 999px;
  color: var(--clone-body);
  font-size: 11px;
  letter-spacing: .08em;
  text-transform: uppercase;
}

@media (max-width: 640px) {
  .easton-search-trigger.is-bar {
    grid-template-columns: auto minmax(0, 1fr);
    gap: 12px;
    padding: 16px;
    border-radius: 22px;
  }

  .easton-search-shortcut {
    display: none;
  }
}
</style>
