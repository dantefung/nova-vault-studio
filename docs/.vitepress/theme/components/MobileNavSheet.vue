<script setup>
/**
 * MobileNavSheet - easton 主题移动端底部 sheet
 *
 * 包含主题切换、首页风格、字号设置（占位）等偏好设置入口。
 * 从底部弹出，圆角 20px top，背部半透明遮罩。
 *
 * 只在 <768px 视口下显示（CSS @media 控制）。
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const { currentTheme, setTheme, THEMES, currentLandingTheme, setLandingTheme } = useTheme()

const isOpen = ref(false)

function open() { isOpen.value = true; document.body.style.overflow = 'hidden' }
function close() { isOpen.value = false; document.body.style.overflow = '' }

const swatches = [
  { key: 'light', color: '#5672cd', label: '晴空' },
  { key: 'dark', color: '#1d1a18', label: '暗夜' },
  { key: 'sepia', color: '#c2a375', label: '纸卷' },
]

const landingThemes = {
  quiet: { name: 'Quiet Library', accent: '#2563eb' },
  easton: { name: 'Easton Blog', accent: '#b85c38' },
}

function handleKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) close()
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <button
    type="button"
    class="mobile-nav-sheet-trigger"
    aria-label="设置"
    @click="open"
  >
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" width="18" height="18">
      <circle cx="10" cy="10" r="7.5" />
      <circle cx="10" cy="10" r="2" fill="currentColor" />
      <line x1="10" y1="2.5" x2="10" y2="4.5" stroke-linecap="round" />
      <line x1="10" y1="15.5" x2="10" y2="17.5" stroke-linecap="round" />
      <line x1="2.5" y1="10" x2="4.5" y2="10" stroke-linecap="round" />
      <line x1="15.5" y1="10" x2="17.5" y2="10" stroke-linecap="round" />
    </svg>
  </button>

  <Teleport v-if="isOpen" to="body">
    <div class="mobile-nav-sheet-backdrop" @click="close"></div>
    <Transition name="mobile-nav-sheet" appear>
      <div
        v-if="isOpen"
        class="mobile-nav-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="偏好设置"
      >
        <div class="mobile-nav-sheet-handle"></div>

        <h2 class="mobile-nav-sheet-title">偏好设置</h2>

        <section class="mobile-nav-sheet-section">
          <h3 class="mobile-nav-sheet-section-label">主题色板</h3>
          <div class="mobile-nav-sheet-swatches">
            <button
              v-for="s in swatches"
              :key="s.key"
              type="button"
              class="mobile-nav-sheet-swatch"
              :class="{ 'is-active': currentTheme === s.key }"
              :style="{ background: s.color }"
              :aria-label="s.label"
              @click="setTheme(s.key)"
            >
              <span class="mobile-nav-sheet-swatch-label">{{ s.label }}</span>
            </button>
          </div>
        </section>

        <section class="mobile-nav-sheet-section">
          <h3 class="mobile-nav-sheet-section-label">首页风格</h3>
          <div class="mobile-nav-sheet-pills">
            <button
              v-for="(t, name) in landingThemes"
              :key="name"
              type="button"
              class="mobile-nav-sheet-pill"
              :class="{ 'is-active': currentLandingTheme === name }"
              :style="{ '--pill-accent': t.accent }"
              @click="setLandingTheme(name)"
            >
              <span class="mobile-nav-sheet-pill-mark" :style="{ background: t.accent }" aria-hidden="true"></span>
              <span class="mobile-nav-sheet-pill-label">{{ t.name }}</span>
              <span v-if="currentLandingTheme === name" class="mobile-nav-sheet-pill-check" aria-hidden="true">✓</span>
            </button>
          </div>
        </section>

        <button
          type="button"
          class="mobile-nav-sheet-close"
          @click="close"
        >完成</button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mobile-nav-sheet-trigger {
  display: none;
  width: 44px;
  height: 44px;
  border: 1px solid var(--easton-doc-rule, var(--vp-c-divider));
  border-radius: 999px;
  background: color-mix(in srgb, var(--easton-doc-surface, var(--vp-c-bg-elv)) 80%, transparent);
  color: var(--easton-doc-body, var(--vp-c-text-2));
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .mobile-nav-sheet-trigger {
    display: inline-flex;
  }
}

.mobile-nav-sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(36, 33, 30, 0.4);
  backdrop-filter: blur(4px);
  z-index: 9999;
}

.mobile-nav-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  max-height: 80vh;
  padding: 12px 22px 32px;
  background: var(--easton-doc-surface, #fffaf3);
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -8px 32px rgba(36, 33, 30, 0.12);
  overflow-y: auto;
}

.mobile-nav-sheet-handle {
  width: 36px;
  height: 4px;
  margin: 0 auto 14px;
  border-radius: 999px;
  background: var(--easton-doc-rule, #d7cec2);
}

.mobile-nav-sheet-title {
  margin: 0 0 20px;
  font-family: 'LXGW WenKai', Georgia, serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--easton-doc-ink, #24211e);
}

.mobile-nav-sheet-section {
  margin-bottom: 24px;
}

.mobile-nav-sheet-section-label {
  margin: 0 0 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--easton-doc-muted, #9b8c7f);
}

.mobile-nav-sheet-swatches {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.mobile-nav-sheet-swatch {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid var(--easton-doc-rule, #d7cec2);
  border-radius: 14px;
  background: var(--easton-doc-surface, #fffaf3);
  font: inherit;
  cursor: pointer;
  min-height: 56px;
}

.mobile-nav-sheet-swatch.is-active {
  border-color: var(--easton-doc-accent, #e7683d);
  background: color-mix(in srgb, var(--easton-doc-accent, #e7683d) 8%, var(--easton-doc-surface));
}

.mobile-nav-sheet-swatch-label {
  color: var(--easton-doc-ink, #24211e);
  font-size: 15px;
  font-weight: 500;
}

.mobile-nav-sheet-pills {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-nav-sheet-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border: 1px solid var(--easton-doc-rule, #d7cec2);
  border-radius: 14px;
  background: var(--easton-doc-surface, #fffaf3);
  color: var(--easton-doc-ink, #24211e);
  font: inherit;
  cursor: pointer;
  font-size: 15px;
  min-height: 56px;
  text-align: left;
}

.mobile-nav-sheet-pill.is-active {
  border-color: var(--easton-doc-accent, #e7683d);
  background: color-mix(in srgb, var(--easton-doc-accent, #e7683d) 8%, var(--easton-doc-surface));
}

.mobile-nav-sheet-pill-mark {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.mobile-nav-sheet-pill-label {
  flex: 1;
  font-weight: 500;
}

.mobile-nav-sheet-pill-check {
  color: var(--easton-doc-accent, #e7683d);
  font-weight: 700;
}

.mobile-nav-sheet-close {
  width: 100%;
  padding: 14px;
  border: 0;
  border-radius: 14px;
  background: var(--easton-doc-ink, #24211e);
  color: var(--easton-doc-surface, #fffaf3);
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  min-height: 48px;
  margin-top: 4px;
}

.mobile-nav-sheet-enter-active,
.mobile-nav-sheet-leave-active {
  transition: transform 240ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease;
}

.mobile-nav-sheet-enter-from,
.mobile-nav-sheet-leave-to {
  transform: translateY(100%);
  opacity: 0.6;
}
</style>
