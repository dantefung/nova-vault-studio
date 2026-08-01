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
    default: '搜索文章',
  },
  placeholder: {
    type: String,
    default: '搜索 System Vault...',
  },
  shortcut: {
    type: String,
    default: 'Ctrl K',
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
    class="easton-search"
    :class="`is-${props.variant}`"
    :aria-label="props.label"
    @click="openSearch"
  >
    <svg class="easton-search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
      <circle cx="9" cy="9" r="6" />
      <line x1="13.5" y1="13.5" x2="17.5" y2="17.5" stroke-linecap="round" />
    </svg>

    <span v-if="props.variant === 'bar'" class="easton-search-body">
      <span class="easton-search-label">{{ props.label }}</span>
      <span class="easton-search-placeholder">{{ props.placeholder }}</span>
    </span>
    <span v-else-if="props.variant === 'action'" class="easton-search-action-label">{{ props.label }}</span>
    <span v-else class="easton-search-nav-label">{{ props.label }}</span>

    <kbd v-if="props.variant === 'bar'" class="easton-search-shortcut" aria-hidden="true">{{ props.shortcut }}</kbd>
    <span v-else-if="props.variant === 'nav'" class="easton-search-nav-shortcut" aria-hidden="true">{{ props.shortcut }}</span>
  </button>

  <VPLocalSearchBox v-if="showSearch" @close="showSearch = false" />
</template>

<style scoped>
.easton-search {
  --easton-search-bg: color-mix(in srgb, var(--easton-doc-surface, #fffaf3) 96%, transparent);
  --easton-search-border: var(--easton-doc-rule, #d7cec2);
  --easton-search-ink: var(--easton-doc-ink, #24211e);
  --easton-search-body: var(--easton-doc-body, #6e655c);
  --easton-search-accent: var(--easton-doc-accent, #e7683d);
  --easton-search-shadow: 0 6px 22px rgb(36 33 30 / 0.06);
  --easton-search-shadow-hover: 0 14px 36px rgb(231 104 61 / 0.18);

  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--easton-search-body);
  font: inherit;
  cursor: pointer;
  transition: color 180ms ease;
}

.easton-search-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: var(--easton-search-body);
  transition: color 180ms ease;
}

.easton-search:hover .easton-search-icon {
  color: var(--easton-search-accent);
}

/* nav: 紧凑按钮 + 右侧 kbd 提示 */
.easton-search.is-nav {
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  color: var(--easton-search-body);
  font-size: 13.5px;
}

.easton-search.is-nav:hover,
.easton-search.is-nav:focus-visible {
  color: var(--easton-search-ink);
  background: color-mix(in srgb, var(--easton-search-accent) 8%, transparent);
}

.easton-search.is-nav .easton-search-icon {
  width: 16px;
  height: 16px;
}

.easton-search-nav-shortcut {
  padding: 2px 7px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--easton-search-border) 60%, transparent);
  color: var(--easton-search-body);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
}

/* action: 中等按钮，文字 + 图标 + 下划线 */
.easton-search.is-action {
  gap: 10px;
  padding: 8px 4px;
  color: var(--easton-search-ink);
  font-family: 'LXGW WenKai', Georgia, serif;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
}

.easton-search.is-action::after {
  display: block;
  height: 1px;
  margin-top: 4px;
  background: var(--easton-search-accent);
  content: '';
}

/* bar: 大圆角胶囊，居中 label + placeholder，右侧 kbd */
.easton-search.is-bar {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  width: min(100%, 680px);
  margin-top: 32px;
  padding: 18px 22px;
  border: 1px solid var(--easton-search-border);
  border-radius: 999px;
  background: var(--easton-search-bg);
  box-shadow: var(--easton-search-shadow);
  text-align: left;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.easton-search.is-bar:hover,
.easton-search.is-bar:focus-visible {
  border-color: color-mix(in srgb, var(--easton-search-accent) 50%, var(--easton-search-border));
  box-shadow: var(--easton-search-shadow-hover);
  transform: translateY(-1px);
}

.easton-search.is-bar .easton-search-icon {
  width: 22px;
  height: 22px;
}

.easton-search-body {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.easton-search-label {
  color: var(--easton-search-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.easton-search-placeholder {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--easton-search-body);
  font-family: 'LXGW WenKai', Georgia, serif;
  font-size: 16px;
}

.easton-search-shortcut {
  align-self: center;
  padding: 5px 10px;
  border: 1px solid var(--easton-search-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--easton-search-bg) 70%, transparent);
  color: var(--easton-search-body);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11.5px;
  letter-spacing: 0.04em;
}

/* 移动端 */
@media (max-width: 768px) {
  .easton-search.is-nav {
    padding: 8px 12px;
    min-height: 44px;
    min-width: 44px;
    justify-content: center;
  }
  .easton-search.is-nav .easton-search-nav-shortcut {
    display: none;
  }
  .easton-search.is-nav .easton-search-nav-label {
    display: none;
  }
}

@media (max-width: 640px) {
  .easton-search.is-bar {
    grid-template-columns: auto minmax(0, 1fr);
    gap: 12px;
    padding: 14px 18px;
    border-radius: 22px;
  }
  .easton-search.is-bar .easton-search-shortcut {
    display: none;
  }
  .easton-search.is-bar .easton-search-icon {
    width: 18px;
    height: 18px;
  }
}
</style>