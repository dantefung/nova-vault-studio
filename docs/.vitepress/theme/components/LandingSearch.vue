<script setup>
import '@docsearch/css'
import { defineAsyncComponent, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'hero', // 'hero' | 'nav'
  },
  placeholder: {
    type: String,
    default: '搜索知识库、专栏、源码…',
  },
  shortcut: {
    type: String,
    default: '⌘K',
  },
})

const VPLocalSearchBox = defineAsyncComponent(() =>
  import('vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue')
)

const searchEnabled = __LOCAL_SEARCH_ENABLED__
const showSearch = ref(false)

function openSearch() {
  showSearch.value = true
}

function handleKeydown(e) {
  if (!searchEnabled) return
  // ⌘K or Ctrl+K
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    showSearch.value = true
    return
  }
  // "/" when not focused on an input/editable element
  if (e.key === '/' && !isEditing(e)) {
    e.preventDefault()
    showSearch.value = true
  }
}

function isEditing(e) {
  const el = e.target
  if (!el) return false
  const tag = el.tagName
  return (
    el.isContentEditable ||
    tag === 'INPUT' ||
    tag === 'SELECT' ||
    tag === 'TEXTAREA'
  )
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <!-- Hero 搜索栏：契合知识库极简杂志风，双向绑定设计系统变量 -->
  <button
    v-if="searchEnabled && props.variant === 'hero'"
    type="button"
    class="landing-search-hero"
    aria-label="搜索知识库"
    @click="openSearch"
  >
    <span class="landing-search-hero-left">
      <svg
        class="landing-search-icon"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        aria-hidden="true"
      >
        <circle cx="9" cy="9" r="6" />
        <line x1="13.5" y1="13.5" x2="17.5" y2="17.5" stroke-linecap="round" />
      </svg>
      <span class="landing-search-placeholder">{{ props.placeholder }}</span>
    </span>
    <kbd class="landing-search-kbd" aria-hidden="true">{{ props.shortcut }}</kbd>
  </button>

  <!-- 顶栏导航轻量搜索按钮 -->
  <button
    v-else-if="searchEnabled && props.variant === 'nav'"
    type="button"
    class="landing-search-nav"
    aria-label="全局搜索"
    @click="openSearch"
  >
    <svg
      class="landing-search-icon"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6" />
      <line x1="13.5" y1="13.5" x2="17.5" y2="17.5" stroke-linecap="round" />
    </svg>
    <span class="landing-search-nav-text">搜索</span>
    <kbd class="landing-search-nav-kbd" aria-hidden="true">{{ props.shortcut }}</kbd>
  </button>

  <VPLocalSearchBox
    v-if="searchEnabled && showSearch"
    @close="showSearch = false"
  />
</template>

<style scoped>
/* ==========================================================================
   Hero 搜索栏 - 彻底遵从 --library-* 设计系统
   ========================================================================== */
.landing-search-hero {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: min(100%, 460px);
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid var(--library-border);
  border-radius: 8px;
  background: var(--library-surface);
  color: var(--library-muted);
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.03);
  transition: border-color 160ms ease, box-shadow 160ms ease, color 160ms ease;
}

.landing-search-hero:hover,
.landing-search-hero:focus-visible {
  border-color: var(--library-primary);
  box-shadow: 0 4px 14px var(--library-hover-shadow);
  color: var(--library-body);
  outline: none;
}

.landing-search-hero-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1 1 auto;
}

.landing-search-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: var(--library-muted);
  transition: color 160ms ease;
}

.landing-search-hero:hover .landing-search-icon {
  color: var(--library-primary);
}

.landing-search-placeholder {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13.5px;
  color: var(--library-muted);
}

.landing-search-kbd {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 22px;
  padding: 0 6px;
  border: 1px solid var(--library-border);
  border-radius: 5px;
  background: var(--library-bg);
  color: var(--library-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: -0.01em;
}

/* ==========================================================================
   顶栏导航轻量搜索按钮
   ========================================================================== */
.landing-search-nav {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--library-body);
  font-family: inherit;
  font-size: 13.5px;
  line-height: 1.4;
  cursor: pointer;
  transition: color 160ms ease, background-color 160ms ease, border-color 160ms ease;
}

.landing-search-nav:hover,
.landing-search-nav:focus-visible {
  color: var(--library-ink);
  background: var(--library-primary-soft);
  border-color: var(--library-border);
  outline: none;
}

.landing-search-nav .landing-search-icon {
  width: 14px;
  height: 14px;
}

.landing-search-nav-kbd {
  display: inline-flex;
  align-items: center;
  padding: 1px 5px;
  border: 1px solid var(--library-border);
  border-radius: 4px;
  background: var(--library-surface);
  color: var(--library-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10.5px;
  font-weight: 500;
}

/* ==========================================================================
   移动端自适应
   ========================================================================== */
@media (max-width: 640px) {
  .landing-search-hero {
    width: 100%;
  }

  .landing-search-nav-kbd {
    display: none;
  }
}
</style>
