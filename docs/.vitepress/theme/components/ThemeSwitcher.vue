<script setup>
import { useTheme } from '../composables/useTheme.js'

const { currentTheme, setTheme, THEMES } = useTheme()

const swatches = [
  { key: 'light', color: '#5672cd', label: '晴空' },
  { key: 'dark', color: '#1d1a18', label: '暗夜' },
  { key: 'sepia', color: '#c2a375', label: '纸卷' },
]

function pick(key) {
  setTheme(key)
}
</script>

<template>
  <div class="theme-switcher" :title="`当前主题：${THEMES.find(t => t === currentTheme) || ''}`">
    <button
      v-for="s in swatches"
      :key="s.key"
      type="button"
      class="theme-swatch"
      :class="{ 'is-active': currentTheme === s.key }"
      :style="{ background: s.color }"
      :aria-label="s.label"
      :title="s.label"
      @click="pick(s.key)"
    ></button>
  </div>
</template>

<style scoped>
.theme-switcher {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid var(--easton-doc-rule, var(--vp-c-divider));
  border-radius: 999px;
  background: color-mix(in srgb, var(--easton-doc-surface, var(--vp-c-bg-elv)) 80%, transparent);
}

.theme-swatch {
  width: 18px;
  height: 18px;
  border: 0;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--easton-doc-ink, #000) 12%, transparent),
    inset 0 0 0 1px rgba(255, 255, 255, 0.18);
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.theme-swatch:hover {
  transform: scale(1.12);
}

.theme-swatch.is-active {
  box-shadow: 0 0 0 2px var(--easton-doc-accent, #e7683d),
    0 0 0 4px color-mix(in srgb, var(--easton-doc-accent, #e7683d) 24%, transparent),
    inset 0 0 0 1px rgba(255, 255, 255, 0.22);
}

@media (max-width: 768px) {
  .theme-switcher {
    padding: 6px 8px;
    gap: 4px;
  }
  .theme-swatch {
    width: 28px;
    height: 28px;
  }
}
</style>
