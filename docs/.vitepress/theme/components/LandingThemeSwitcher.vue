<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const { currentLandingTheme, setLandingTheme } = useTheme()
const isOpen = ref(false)

const themes = {
  quiet: { name: 'Quiet Library', desc: '安静的知识库', accent: '#2563eb' },
  easton: { name: 'Easton Blog', desc: '编辑感首页', accent: '#b85c38' },
}

function selectTheme(name) {
  setLandingTheme(name)
  isOpen.value = false
}

function handleClickOutside(event) {
  if (!event.target.closest('.landing-theme-switcher')) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="landing-theme-switcher">
    <button
      class="landing-theme-switcher-button"
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      :title="`首页风格：${themes[currentLandingTheme].name}`"
      @click.stop="isOpen = !isOpen"
    >
      <span class="landing-theme-switcher-mark" :style="{ background: themes[currentLandingTheme].accent }" aria-hidden="true"></span>
      <span class="landing-theme-switcher-label">{{ themes[currentLandingTheme].name }}</span>
      <span class="landing-theme-switcher-arrow" :class="{ open: isOpen }" aria-hidden="true">⌄</span>
    </button>

    <Transition name="landing-theme-dropdown">
      <div v-if="isOpen" class="landing-theme-dropdown" role="menu">
        <p class="landing-theme-dropdown-label">首页风格</p>
        <button
          v-for="(theme, name) in themes"
          :key="name"
          class="landing-theme-option"
          :class="{ active: currentLandingTheme === name }"
          type="button"
          role="menuitemradio"
          :aria-checked="currentLandingTheme === name"
          @click="selectTheme(name)"
        >
          <span class="landing-theme-option-mark" :style="{ background: theme.accent }" aria-hidden="true"></span>
          <span>
            <strong>{{ theme.name }}</strong>
            <small>{{ theme.desc }}</small>
          </span>
          <span v-if="currentLandingTheme === name" aria-hidden="true">✓</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.landing-theme-switcher {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 100%;
}

.landing-theme-switcher-button,
.landing-theme-option {
  font: inherit;
  cursor: pointer;
}

.landing-theme-switcher-button {
  display: inline-flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: 7px;
  padding: 6px 8px;
  border: 1px solid var(--library-border, var(--vp-c-divider));
  border-radius: 7px;
  background: transparent;
  color: var(--library-body, var(--vp-c-text-2));
  font-size: 12px;
  white-space: nowrap;
}

.landing-theme-switcher-button:hover,
.landing-theme-switcher-button:focus-visible {
  border-color: var(--library-primary, var(--vp-c-brand-1));
  color: var(--library-ink, var(--vp-c-text-1));
}

.landing-theme-switcher-mark,
.landing-theme-option-mark {
  display: block;
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.landing-theme-switcher-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.landing-theme-switcher-arrow {
  flex: 0 0 auto;
  color: var(--library-muted, var(--vp-c-text-3));
  line-height: 1;
  transition: transform 180ms ease;
}

.landing-theme-switcher-arrow.open {
  transform: rotate(180deg);
}

.landing-theme-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 100;
  width: max-content;
  min-width: min(190px, calc(100vw - 32px));
  max-width: calc(100vw - 32px);
  padding: 7px;
  border: 1px solid var(--library-border, var(--vp-c-border));
  border-radius: 9px;
  background: var(--library-surface, var(--vp-c-bg-elv));
  box-shadow: 0 12px 30px rgb(15 23 42 / 0.12);
}

.landing-theme-dropdown-label {
  margin: 4px 8px 6px;
  color: var(--library-muted, var(--vp-c-text-3));
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.landing-theme-option {
  display: grid;
  grid-template-columns: 8px minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--library-ink, var(--vp-c-text-1));
  text-align: left;
}

.landing-theme-option:hover,
.landing-theme-option:focus-visible,
.landing-theme-option.active {
  background: var(--library-primary-soft, var(--vp-c-bg-soft));
}

.landing-theme-option strong,
.landing-theme-option small {
  display: block;
}

.landing-theme-option strong {
  font-size: 12px;
}

.landing-theme-option small {
  margin-top: 2px;
  color: var(--library-muted, var(--vp-c-text-3));
  font-size: 11px;
}

@media (prefers-reduced-motion: reduce) {
  .landing-theme-switcher-arrow {
    transition: none;
  }
}
</style>
