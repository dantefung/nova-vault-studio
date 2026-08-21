<script setup>
import { useTheme } from '../composables/useTheme.js'

const { currentLandingTheme, setLandingTheme } = useTheme()

const themes = {
  quiet: { quietLabel: '知识库', eastonLabel: 'Library', desc: '安静的知识库' },
  easton: { quietLabel: '博客', eastonLabel: 'Blog', desc: '编辑感首页' },
  cubxxw: { quietLabel: '档案', eastonLabel: 'Archive', desc: 'cubxxw 编辑风' },
}
</script>

<template>
  <div
    class="landing-theme-switcher"
    :class="`is-${currentLandingTheme}`"
    role="group"
    aria-label="首页风格"
  >
    <button
      v-for="(theme, name) in themes"
      :key="name"
      type="button"
      class="landing-theme-pill"
      :class="{ 'is-active': currentLandingTheme === name }"
      :title="theme.desc"
      @click="setLandingTheme(name)"
    >
      <span class="landing-theme-pill-label">
        {{ currentLandingTheme === 'easton' ? theme.eastonLabel : theme.quietLabel }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.landing-theme-switcher {
  display: inline-flex;
  align-items: center;
  height: 32px;
  margin-left: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg);
  overflow: hidden;
}

.landing-theme-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 11px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease;
}

.landing-theme-pill + .landing-theme-pill {
  border-left: 1px solid var(--vp-c-divider);
}

.landing-theme-pill:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.landing-theme-pill.is-active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
  box-shadow: inset 0 -2px var(--vp-c-brand-1);
}

.landing-theme-switcher.is-easton {
  gap: 0;
  margin-left: 18px;
  padding-left: 17px;
  border: 0;
  border-left: 1px solid var(--easton-doc-rule, var(--vp-c-divider));
  border-radius: 0;
  background: transparent;
  overflow: visible;
  font-family: 'LXGW WenKai', Georgia, serif;
}

.is-easton .landing-theme-pill {
  padding: 0;
  color: var(--easton-doc-muted, var(--vp-c-text-2));
  background: transparent;
  font-size: 12px;
}

.is-easton .landing-theme-pill + .landing-theme-pill {
  border: 0;
}

.is-easton .landing-theme-pill + .landing-theme-pill::before {
  content: '/';
  margin: 0 6px;
  color: var(--easton-doc-rule, var(--vp-c-divider));
  font-weight: 400;
}

.is-easton .landing-theme-pill:hover {
  color: var(--easton-doc-ink, var(--vp-c-text-1));
  background: transparent;
}

.is-easton .landing-theme-pill.is-active {
  color: var(--easton-doc-ink, var(--vp-c-text-1));
  background: transparent;
  box-shadow: inset 0 -2px var(--easton-doc-accent, var(--vp-c-brand-1));
}

@media (max-width: 768px) {
  /* 移动端：进入 MobileNavSheet 才显示，这里隐藏 */
  .landing-theme-switcher {
    display: none;
  }
}
</style>
