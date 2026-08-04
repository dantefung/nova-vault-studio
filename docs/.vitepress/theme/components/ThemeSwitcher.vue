<script setup>
import { useTheme } from '../composables/useTheme.js'

const { currentTheme, currentLandingTheme, setTheme, THEMES } = useTheme()

const swatches = [
  { key: 'light', color: '#f7f4ed', label: '晴空' },
  { key: 'dark', color: '#24211f', label: '暗夜' },
  { key: 'sepia', color: '#c2a375', label: '纸卷' },
]

function pick(key) {
  setTheme(key)
}
</script>

<template>
  <div
    class="theme-switcher"
    :class="`is-${currentLandingTheme}`"
    role="group"
    aria-label="页面色调"
    :title="`当前主题：${THEMES.find(t => t === currentTheme) || ''}`"
  >
    <button
      v-for="s in swatches"
      :key="s.key"
      type="button"
      class="theme-swatch"
      :class="{ 'is-active': currentTheme === s.key }"
      :style="{ '--swatch-color': s.color }"
      :aria-label="s.label"
      :title="s.label"
      @click="pick(s.key)"
    >
      <svg v-if="currentLandingTheme === 'quiet' && s.key === 'light'" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="3"></circle>
        <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4"></path>
      </svg>
      <svg v-else-if="currentLandingTheme === 'quiet' && s.key === 'dark'" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M16.3 12.7A7 7 0 0 1 7.3 3.7a6.4 6.4 0 1 0 9 9Z"></path>
      </svg>
      <svg v-else-if="currentLandingTheme === 'quiet'" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5 3.5h8a2 2 0 0 1 2 2v11H7a2 2 0 0 1-2-2v-11Z"></path>
        <path d="M7 3.5v13M9.5 7h3"></path>
      </svg>
      <span v-else class="theme-swatch-dot" aria-hidden="true"></span>
    </button>
  </div>
</template>

<style scoped>
.theme-switcher {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 32px;
  margin-left: 8px;
  padding: 0 5px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg);
}

.theme-swatch {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 5px;
  padding: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease;
}

.theme-swatch svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.theme-swatch:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.theme-swatch.is-active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.theme-switcher.is-easton {
  gap: 8px;
  margin-left: 13px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.is-easton .theme-swatch {
  width: 14px;
  height: 24px;
  border-radius: 0;
  background: transparent;
}

.is-easton .theme-swatch:hover {
  background: transparent;
}

.theme-swatch-dot {
  display: block;
  width: 10px;
  height: 10px;
  border: 1px solid color-mix(in srgb, var(--easton-doc-ink, #000) 18%, transparent);
  border-radius: 50%;
  background: var(--swatch-color);
  transition: width 160ms ease, height 160ms ease, outline-color 160ms ease;
}

.is-easton .theme-swatch.is-active .theme-swatch-dot {
  width: 12px;
  height: 12px;
  outline: 1px solid var(--easton-doc-accent, var(--vp-c-brand-1));
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .theme-switcher {
    display: none;
  }
}
</style>
