<script setup>
import { ref, computed } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const { currentTheme, setTheme, THEMES } = useTheme()

const isOpen = ref(false)

// 主题配置：名称、图标（三个小圆点）、色块预览
const themeConfig = {
  light: {
    name: '晴空',
    desc: '明亮阅读',
    dotColors: ['#5672cd', '#c2c2c4', '#c2c2c4'],
    accentColor: '#5672cd'
  },
  dark: {
    name: '暗夜',
    desc: '深色沉浸',
    dotColors: ['#3e63dd', '#3e63dd', '#c2c2c4'],
    accentColor: '#3e63dd'
  },
  sepia: {
    name: '纸卷',
    desc: '护眼阅读',
    dotColors: ['#2d6a4f', '#c2c2c4', '#c2c2c4'],
    accentColor: '#2d6a4f'
  }
}

function selectTheme(name) {
  setTheme(name)
  isOpen.value = false
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

// 点击外部关闭
function handleClickOutside(e) {
  if (!e.target.closest('.theme-switcher')) {
    isOpen.value = false
  }
}

import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="theme-switcher">
    <!-- 触发按钮 -->
    <button
      class="theme-switcher-btn"
      :title="`当前主题: ${themeConfig[currentTheme].name}，点击切换`"
      @click.stop="toggleDropdown"
    >
      <!-- 三个小圆点指示器 -->
      <span class="theme-dots">
        <span
          v-for="(color, i) in themeConfig[currentTheme].dotColors"
          :key="i"
          class="theme-dot"
          :style="{ background: color }"
        ></span>
      </span>
      <span class="theme-arrow" :class="{ open: isOpen }">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </button>

    <!-- 下拉菜单 -->
    <Transition name="dropdown">
      <div v-if="isOpen" class="theme-dropdown">
        <div class="theme-dropdown-header">选择主题</div>
        <button
          v-for="theme in THEMES"
          :key="theme"
          class="theme-option"
          :class="{ active: currentTheme === theme }"
          @click="selectTheme(theme)"
        >
          <!-- 色块预览 -->
          <span
            class="theme-color-block"
            :style="{ background: themeConfig[theme].accentColor }"
          ></span>
          <!-- 名称 + 描述 -->
          <span class="theme-option-text">
            <span class="theme-option-name">{{ themeConfig[theme].name }}</span>
            <span class="theme-option-desc">{{ themeConfig[theme].desc }}</span>
          </span>
          <!-- 选中标记 -->
          <span v-if="currentTheme === theme" class="theme-check">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.theme-switcher {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 100%;
}

.theme-switcher-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--vp-c-text-2);
}

.theme-switcher-btn:hover {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border);
}

.theme-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.theme-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: block;
}

.theme-arrow {
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  color: var(--vp-c-text-3);
}

.theme-arrow.open {
  transform: rotate(180deg);
}

.theme-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: max-content;
  min-width: min(200px, calc(100vw - 32px));
  max-width: calc(100vw - 32px);
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  padding: 8px;
  z-index: 100;
}

.theme-dropdown-header {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px 8px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
  color: var(--vp-c-text-1);
}

.theme-option:hover {
  background: var(--vp-c-bg-alt);
}

.theme-option.active {
  background: var(--vp-c-brand-soft);
}

.theme-color-block {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.theme-option-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.theme-option-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.theme-option-desc {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.theme-check {
  color: var(--vp-c-brand-1);
  display: flex;
  align-items: center;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
