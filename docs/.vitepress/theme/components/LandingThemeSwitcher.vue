<script setup>
import { useTheme } from '../composables/useTheme.js'

const { currentLandingTheme, setLandingTheme } = useTheme()

const themes = {
  quiet: { name: 'Quiet Library', desc: '安静的知识库', accent: '#2563eb' },
  easton: { name: 'Easton Blog', desc: '编辑感首页', accent: '#b85c38' },
}
</script>

<template>
  <div class="landing-theme-switcher" role="group" aria-label="首页风格">
    <button
      v-for="(theme, name) in themes"
      :key="name"
      type="button"
      class="landing-theme-pill"
      :class="{ 'is-active': currentLandingTheme === name }"
      :title="theme.desc"
      @click="setLandingTheme(name)"
    >
      <span class="landing-theme-pill-mark" :style="{ background: theme.accent }" aria-hidden="true"></span>
      <span class="landing-theme-pill-label">{{ theme.name }}</span>
    </button>
  </div>
</template>

<style scoped>
.landing-theme-switcher {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--easton-doc-rule, var(--vp-c-divider));
  border-radius: 999px;
  background: color-mix(in srgb, var(--easton-doc-surface, var(--vp-c-bg-elv)) 80%, transparent);
}

.landing-theme-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--easton-doc-body, var(--vp-c-text-2));
  font: inherit;
  font-size: 12.5px;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease;
}

.landing-theme-pill:hover {
  color: var(--easton-doc-ink, var(--vp-c-text-1));
}

.landing-theme-pill.is-active {
  background: color-mix(in srgb, var(--easton-doc-accent, #e7683d) 14%, transparent);
  color: var(--easton-doc-accent, #e7683d);
  font-weight: 600;
}

.landing-theme-pill-mark {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  /* 移动端：进入 MobileNavSheet 才显示，这里隐藏 */
  .landing-theme-switcher {
    display: none;
  }
}
</style>
