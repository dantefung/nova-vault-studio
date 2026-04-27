<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vitepress'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import { useTheme } from '../composables/useTheme.js'

const route = useRoute()
const { currentTheme } = useTheme()

// 落地页风格列表
const STYLES = [
  { key: 'clear',    name: '晴空',   desc: '极简学术风', color: '#3451b2' },
  { key: 'magazine', name: '杂志',   desc: '大写叙事风', color: '#9b7653' },
  { key: 'tech',     name: '极客',   desc: '代码美学风', color: '#3fb950' },
  { key: 'poetry',   name: '诗卷',   desc: '东方诗意风', color: '#2d6a4f' },
  { key: 'cards',    name: '卡片',   desc: '现代导航风', color: '#e65100' },
  { key: 'brutal',   name: '暗魄',   desc: '粗野几何风', color: '#e63946' },
  { key: 'editorial',name: '暖域',   desc: '杂志编辑风', color: '#d4a373' },
  { key: 'zen',      name: '静界',   desc: '极简禅意风', color: '#adb5bd' },
]

const STORAGE_KEY = 'vp-landing-style'

// 当前风格（可写 ref）
const landingStyle = ref('clear')
const styleSwitcherOpen = ref(false)

// 初始化：从 localStorage 读取
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && STYLES.some(s => s.key === saved)) {
    landingStyle.value = saved
  }
})

// 切换风格
function selectStyle(key) {
  landingStyle.value = key
  localStorage.setItem(STORAGE_KEY, key)
  styleSwitcherOpen.value = false
}

// 当前风格配置
const currentStyle = computed(() =>
  STYLES.find(s => s.key === landingStyle.value) || STYLES[0]
)

// 是否为落地页（所有 docs/ 根目录路由）
const isLanding = computed(() => {
  return ['/', '/v2/', '/v3/', '/v4/', '/v5/'].some(p => route.path === p)
})

// 点击外部关闭下拉
function handleClickOutside(e) {
  if (!e.target.closest('.style-switcher')) {
    styleSwitcherOpen.value = false
  }
}

import { onUnmounted } from 'vue'
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <!-- 落地页 -->
  <div v-if="isLanding" class="vp-landing" :class="[`style-${landingStyle}`, `theme-${currentTheme}`]">

    <!-- 导航栏 -->
    <header class="landing-nav">
      <div class="landing-nav-inner">
        <a href="/" class="landing-logo">System Vault</a>
        <nav class="landing-nav-links">
          <a href="/md/guide/getting-started">开始阅读</a>
          <a href="https://github.com/dantefung/nova-vault-studio" target="_blank">GitHub</a>

          <!-- 风格切换下拉 -->
          <div class="style-switcher">
            <button
              class="style-switcher-btn"
              :title="`当前风格: ${currentStyle.name}，点击切换`"
              @click.stop="styleSwitcherOpen = !styleSwitcherOpen"
            >
              <!-- 风格色块 -->
              <span class="style-indicator" :style="{ background: currentStyle.color }"></span>
              <span class="style-name">{{ currentStyle.name }}</span>
              <span class="style-arrow" :class="{ open: styleSwitcherOpen }">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </button>

            <Transition name="dropdown">
              <div v-if="styleSwitcherOpen" class="style-dropdown">
                <div class="style-dropdown-header">切换风格</div>
                <button
                  v-for="s in STYLES"
                  :key="s.key"
                  class="style-option"
                  :class="{ active: landingStyle === s.key }"
                  @click="selectStyle(s.key)"
                >
                  <span class="style-color-block" :style="{ background: s.color }"></span>
                  <span class="style-option-text">
                    <span class="style-option-name">{{ s.name }}</span>
                    <span class="style-option-desc">{{ s.desc }}</span>
                  </span>
                  <span v-if="landingStyle === s.key" class="style-check">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </button>
              </div>
            </Transition>
          </div>

          <ThemeSwitcher />
        </nav>
      </div>
    </header>

    <!-- 各风格 Hero 内容 -->
    <main class="landing-main">

      <!-- 风格 1：晴空·极简学术 -->
      <section v-if="landingStyle === 'clear'" class="hero-clear">
        <div class="hero-clear-inner">
          <div class="hero-eyebrow">系统知识库</div>
          <h1 class="hero-title">System Vault</h1>
          <p class="hero-tagline">凡是过往，皆为序章</p>
          <div class="hero-actions">
            <a href="/md/guide/getting-started" class="btn-primary">开始阅读 →</a>
            <a href="https://github.com/dantefung/nova-vault-studio" class="btn-ghost" target="_blank">GitHub</a>
          </div>
          <div class="hero-meta">
            <span class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              知识沉淀
            </span>
            <span class="meta-sep">·</span>
            <span class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              动态侧边栏
            </span>
            <span class="meta-sep">·</span>
            <span class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              持续演进
            </span>
          </div>
        </div>
      </section>

      <!-- 风格 2：杂志·大写叙事 -->
      <section v-else-if="landingStyle === 'magazine'" class="hero-magazine">
        <div class="hero-mag-inner">
          <div class="mag-label">PERSONAL KNOWLEDGE HUB</div>
          <h1 class="mag-title">System<br/>Vault</h1>
          <div class="mag-divider"></div>
          <p class="mag-sub">凡是过往<br/><em>皆为序章</em></p>
          <div class="mag-actions">
            <a href="/md/guide/getting-started" class="mag-btn">开始阅读</a>
          </div>
        </div>
        <div class="mag-visual">
          <div class="mag-block b1"></div>
          <div class="mag-block b2"></div>
          <div class="mag-block b3"></div>
        </div>
      </section>

      <!-- 风格 3：技术极客 -->
      <section v-else-if="landingStyle === 'tech'" class="hero-tech">
        <div class="tech-terminal">
          <div class="tech-bar">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="tech-title">system-vault ~</span>
          </div>
          <div class="tech-body">
            <div class="tech-line"><span class="t-prompt">$</span><span class="t-cmd"> cat README.md</span></div>
            <div class="tech-line t-out"># System Vault — 系统知识库</div>
            <div class="tech-line t-comment"># 记录系统架构、技术方案、开发规范</div>
            <div class="tech-line t-comment"># 内置 Mermaid + Markmap 支持</div>
            <div class="tech-line">&nbsp;</div>
            <div class="tech-line">
              <span class="t-prompt">$</span>
              <span class="t-cmd t-cursor"> npm run dev</span>
            </div>
          </div>
        </div>
        <div class="tech-hero-text">
          <h1>System Vault</h1>
          <p>系统知识库 · 知识沉淀 · 持续演进</p>
          <div class="tech-actions">
            <a href="/md/guide/getting-started" class="tech-btn">开始阅读</a>
            <a href="https://github.com/dantefung/nova-vault-studio" class="tech-btn-outline" target="_blank">View on GitHub</a>
          </div>
        </div>
      </section>

      <!-- 风格 4：东方诗意 -->
      <section v-else-if="landingStyle === 'poetry'" class="hero-poetry">
        <div class="poetry-left">
          <div class="poetry-scroll">
            <h1 class="poetry-title">系<br/>统<br/>知<br/>识<br/>库</h1>
          </div>
        </div>
        <div class="poetry-right">
          <p class="poetry-motto">凡是过往<br/><span class="poetry-small">皆为序章</span></p>
          <div class="poetry-ornament">◆</div>
          <p class="poetry-desc">记录架构思考<br/>沉淀技术方案<br/>见证知识生命周期</p>
          <div class="poetry-actions">
            <a href="/md/guide/getting-started" class="poetry-btn">开卷有益</a>
          </div>
        </div>
      </section>

      <!-- 风格 5：现代卡片 -->
      <section v-else-if="landingStyle === 'cards'" class="hero-cards">
        <div class="cards-header">
          <h1>System Vault</h1>
          <p>系统知识库 · 知识沉淀 · 持续演进</p>
        </div>
        <div class="cards-grid">
          <a href="/md/guide/getting-started" class="card">
            <div class="card-icon" style="background: #e8f5e9; color: #2d6a4f;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <h3>知识沉淀</h3>
            <p>记录系统架构、技术方案、开发规范等核心知识</p>
          </a>
          <a href="/md/sitelog/features/charts" class="card">
            <div class="card-icon" style="background: #e3f2fd; color: #1565c0;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            </div>
            <h3>图表支持</h3>
            <p>内置 Mermaid 与 Markmap，架构图与思维导图信手拈来</p>
          </a>
          <a href="/md/sitelog/evolution/milestones" class="card">
            <div class="card-icon" style="background: #fff3e0; color: #e65100;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <h3>演进黑盒</h3>
            <p>记录从原型到标准的完整过程，见证知识库的生命周期</p>
          </a>
          <a href="/md/books/" class="card">
            <div class="card-icon" style="background: #f3e5f5; color: #6a1b9a;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <h3>书籍库</h3>
            <p>收录经典技术书籍，深入阅读，持续成长</p>
          </a>
        </div>
        <div class="cards-footer">
          <a href="/md/guide/getting-started" class="cards-cta">开始阅读 →</a>
        </div>
      </section>

      <!-- 风格 6：暗魄·粗野主义 -->
      <section v-else-if="landingStyle === 'brutal'" class="hero-brutal">
        <div class="brutal-grid">
          <div class="brutal-left">
            <div class="brutal-label">KNOWLEDGE HUB</div>
            <h1 class="brutal-title">SYSTEM<br/>VAULT</h1>
            <div class="brutal-rule"></div>
            <p class="brutal-quote">「凡是过往<br/>皆为序章」</p>
          </div>
          <div class="brutal-right">
            <div class="brutal-block b-red"></div>
            <div class="brutal-block b-black"></div>
            <div class="brutal-block b-white"></div>
            <div class="brutal-nav">
              <a href="/md/guide/getting-started" class="brutal-link">开始阅读 →</a>
              <a href="https://github.com/dantefung/nova-vault-studio" class="brutal-link-outline" target="_blank">GitHub</a>
            </div>
          </div>
        </div>
      </section>

      <!-- 风格 7：暖域·杂志编辑 -->
      <section v-else-if="landingStyle === 'editorial'" class="hero-editorial">
        <div class="edit-masthead">
          <div class="edit-vol">Vol. 01 — 系统知识库</div>
          <div class="edit-rule"></div>
        </div>
        <div class="edit-hero">
          <div class="edit-img-block">
            <div class="edit-img-placeholder">
              <span>Knowledge Vault</span>
            </div>
          </div>
          <div class="edit-text">
            <h1 class="edit-title">System<br/>Vault</h1>
            <p class="edit-subtitle">凡是过往，皆为序章</p>
            <p class="edit-body">记录系统架构、技术方案、开发规范。内置 Mermaid 与 Markmap 支持，让架构图与思维导图信手拈来。</p>
            <div class="edit-actions">
              <a href="/md/guide/getting-started" class="edit-btn">开始阅读</a>
              <a href="https://github.com/dantefung/nova-vault-studio" class="edit-link" target="_blank">GitHub →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- 风格 8：静界·极简禅意 -->
      <section v-else-if="landingStyle === 'zen'" class="hero-zen">
        <div class="zen-center">
          <div class="zen-line top"></div>
          <h1 class="zen-title">System Vault</h1>
          <p class="zen-motto">凡是过往，皆为序章</p>
          <div class="zen-divider"></div>
          <div class="zen-tags">
            <span>知识沉淀</span>
            <span class="zen-dot">·</span>
            <span>动态侧边栏</span>
            <span class="zen-dot">·</span>
            <span>图表支持</span>
          </div>
          <div class="zen-actions">
            <a href="/md/guide/getting-started" class="zen-btn">进入知识库</a>
          </div>
          <div class="zen-line bottom"></div>
        </div>
      </section>

    </main>

    <footer class="landing-footer">
      <span>© 2024-present DANTE FUNG · MIT License</span>
    </footer>
  </div>

  <!-- 非落地页：Layout 由调用方处理 -->
  <slot v-else />
</template>

<style>
/* ============================================================
   导航栏公共样式
   ============================================================ */
.vp-landing .landing-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  backdrop-filter: blur(8px);
}
.vp-landing .landing-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.vp-landing .landing-logo {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  letter-spacing: -0.01em;
}
.vp-landing .landing-nav-links {
  display: flex;
  align-items: center;
  gap: 16px;
}
.vp-landing .landing-nav-links a {
  font-size: 14px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}
.vp-landing .landing-nav-links a:hover {
  color: var(--vp-c-text-1);
}
.vp-landing .landing-footer {
  text-align: center;
  padding: 40px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  border-top: 1px solid var(--vp-c-divider);
}

/* ============================================================
   风格切换下拉
   ============================================================ */
.style-switcher {
  position: relative;
}

.style-switcher-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.style-switcher-btn:hover {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-border);
}

.style-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.style-name {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.style-arrow {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-3);
  transition: transform 0.2s;
}

.style-arrow.open {
  transform: rotate(180deg);
}

.style-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  padding: 8px;
  z-index: 100;
}

.style-dropdown-header {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px 8px;
}

.style-option {
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
  transition: background 0.15s;
  color: var(--vp-c-text-1);
}

.style-option:hover {
  background: var(--vp-c-bg-alt);
}

.style-option.active {
  background: var(--vp-c-brand-soft);
}

.style-color-block {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.style-option-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.style-option-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.style-option-desc {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.style-check {
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

/* ============================================================
   风格 1：晴空·极简学术
   ============================================================ */
.vp-landing.style-clear .hero-clear {
  min-height: calc(100vh - 56px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
}
.vp-landing.style-clear .hero-clear-inner {
  text-align: center;
  max-width: 640px;
  padding: 80px 32px;
}
.vp-landing.style-clear .hero-eyebrow {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 24px;
}
.vp-landing.style-clear .hero-title {
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 0 0 16px;
}
.vp-landing.style-clear .hero-tagline {
  font-size: clamp(18px, 3vw, 24px);
  color: var(--vp-c-text-2);
  margin: 0 0 48px;
  font-style: italic;
}
.vp-landing.style-clear .hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 48px;
}
.vp-landing.style-clear .btn-primary {
  padding: 12px 28px;
  background: var(--vp-c-brand-1);
  color: #fff;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}
.vp-landing.style-clear .btn-primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}
.vp-landing.style-clear .btn-ghost {
  padding: 12px 28px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  border-radius: 8px;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.2s;
}
.vp-landing.style-clear .btn-ghost:hover {
  border-color: var(--vp-c-border);
  color: var(--vp-c-text-1);
}
.vp-landing.style-clear .hero-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--vp-c-text-3);
  font-size: 14px;
}
.vp-landing.style-clear .meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ============================================================
   风格 2：杂志·大写叙事
   ============================================================ */
.vp-landing.style-magazine {
  background: #1a1814;
  color: #f5f0e8;
  min-height: 100vh;
}
.vp-landing.style-magazine .landing-nav {
  background: transparent;
  border-bottom-color: rgba(245, 240, 232, 0.12);
}
.vp-landing.style-magazine .landing-logo,
.vp-landing.style-magazine .landing-nav-links a {
  color: #f5f0e8;
}
.vp-landing.style-magazine .landing-footer {
  border-top-color: rgba(245, 240, 232, 0.12);
  color: rgba(245, 240, 232, 0.4);
}
.vp-landing.style-magazine .hero-magazine {
  min-height: calc(100vh - 56px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  align-items: center;
}
.vp-landing.style-magazine .mag-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #9b7653;
  margin-bottom: 32px;
  font-weight: 600;
}
.vp-landing.style-magazine .mag-title {
  font-size: clamp(64px, 10vw, 120px);
  font-weight: 800;
  line-height: 0.95;
  color: #f5f0e8;
  letter-spacing: -0.04em;
  margin: 0 0 40px;
}
.vp-landing.style-magazine .mag-divider {
  width: 64px;
  height: 3px;
  background: #9b7653;
  margin-bottom: 40px;
}
.vp-landing.style-magazine .mag-sub {
  font-size: clamp(20px, 3vw, 28px);
  color: rgba(245, 240, 232, 0.6);
  line-height: 1.6;
  margin: 0 0 48px;
}
.vp-landing.style-magazine .mag-sub em {
  color: #f5f0e8;
  font-style: normal;
}
.vp-landing.style-magazine .mag-btn {
  display: inline-block;
  padding: 14px 36px;
  border: 2px solid #9b7653;
  color: #f5f0e8;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s;
}
.vp-landing.style-magazine .mag-btn:hover {
  background: #9b7653;
}
.vp-landing.style-magazine .mag-visual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 2fr 1fr 1fr;
  gap: 16px;
  height: 400px;
}
.vp-landing.style-magazine .mag-block {
  border-radius: 4px;
}
.vp-landing.style-magazine .mag-block.b1 {
  background: linear-gradient(135deg, #9b7653, #6b4f35);
  grid-column: 1;
  grid-row: 1 / 3;
}
.vp-landing.style-magazine .mag-block.b2 {
  background: rgba(245, 240, 232, 0.08);
  grid-column: 2;
  grid-row: 1;
}
.vp-landing.style-magazine .mag-block.b3 {
  background: rgba(155, 118, 83, 0.3);
  grid-column: 2;
  grid-row: 2 / 4;
}
@media (max-width: 768px) {
  .vp-landing.style-magazine .hero-magazine {
    grid-template-columns: 1fr;
  }
  .vp-landing.style-magazine .mag-visual {
    display: none;
  }
}

/* ============================================================
   风格 3：技术极客
   ============================================================ */
.vp-landing.style-tech {
  background: #0d1117;
  color: #c9d1d9;
  min-height: 100vh;
}
.vp-landing.style-tech .landing-nav {
  background: rgba(13, 17, 23, 0.9);
  border-bottom-color: #30363d;
}
.vp-landing.style-tech .landing-logo,
.vp-landing.style-tech .landing-nav-links a {
  color: #c9d1d9;
}
.vp-landing.style-tech .landing-footer {
  border-top-color: #30363d;
  color: #484f58;
}
.vp-landing.style-tech .hero-tech {
  min-height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  gap: 64px;
}
.vp-landing.style-tech .tech-terminal {
  width: 100%;
  max-width: 600px;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.4);
}
.vp-landing.style-tech .tech-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #21262d;
  border-bottom: 1px solid #30363d;
}
.vp-landing.style-tech .tech-bar .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.vp-landing.style-tech .tech-bar .dot.red { background: #ff5f56; }
.vp-landing.style-tech .tech-bar .dot.yellow { background: #ffbd2e; }
.vp-landing.style-tech .tech-bar .dot.green { background: #27c93f; }
.vp-landing.style-tech .tech-title {
  font-size: 13px;
  color: #8b949e;
  margin-left: 8px;
}
.vp-landing.style-tech .tech-body {
  padding: 24px;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 14px;
  line-height: 1.8;
}
.vp-landing.style-tech .tech-line { display: flex; }
.vp-landing.style-tech .t-prompt { color: #3fb950; }
.vp-landing.style-tech .t-cmd { color: #c9d1d9; }
.vp-landing.style-tech .t-cursor::after {
  content: '█';
  color: #3fb950;
  animation: blink 1s step-end infinite;
}
.vp-landing.style-tech .t-out { color: #c9d1d9; }
.vp-landing.style-tech .t-comment { color: #8b949e; }
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.vp-landing.style-tech .tech-hero-text {
  text-align: center;
}
.vp-landing.style-tech .tech-hero-text h1 {
  font-size: clamp(32px, 6vw, 56px);
  font-weight: 700;
  color: #f0f6fc;
  letter-spacing: -0.03em;
  margin: 0 0 16px;
  font-family: 'SF Mono', monospace;
}
.vp-landing.style-tech .tech-hero-text p {
  color: #8b949e;
  font-size: 16px;
  margin: 0 0 32px;
}
.vp-landing.style-tech .tech-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
.vp-landing.style-tech .tech-btn {
  padding: 10px 24px;
  background: #238636;
  color: #fff;
  border-radius: 6px;
  font-size: 14px;
  font-family: monospace;
  text-decoration: none;
  transition: background 0.2s;
}
.vp-landing.style-tech .tech-btn:hover { background: #2ea043; }
.vp-landing.style-tech .tech-btn-outline {
  padding: 10px 24px;
  border: 1px solid #30363d;
  color: #c9d1d9;
  border-radius: 6px;
  font-size: 14px;
  font-family: monospace;
  text-decoration: none;
  transition: all 0.2s;
}
.vp-landing.style-tech .tech-btn-outline:hover {
  border-color: #8b949e;
  color: #f0f6fc;
}

/* ============================================================
   风格 4：东方诗意
   ============================================================ */
.vp-landing.style-poetry {
  background: #f5f0e8;
  color: #3a3328;
  min-height: 100vh;
}
.vp-landing.style-poetry .landing-nav {
  background: rgba(245, 240, 232, 0.9);
  border-bottom-color: #d6cfc0;
}
.vp-landing.style-poetry .landing-logo,
.vp-landing.style-poetry .landing-nav-links a {
  color: #3a3328;
}
.vp-landing.style-poetry .landing-footer {
  border-top-color: #d6cfc0;
  color: #9c8e7a;
}
.vp-landing.style-poetry .hero-poetry {
  min-height: calc(100vh - 56px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 48px;
  align-items: center;
  gap: 80px;
}
.vp-landing.style-poetry .poetry-scroll {
  border-right: 1px solid #d6cfc0;
  padding-right: 80px;
}
.vp-landing.style-poetry .poetry-title {
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 700;
  line-height: 1.2;
  color: #3a3328;
  letter-spacing: 0.1em;
  margin: 0;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  height: 320px;
}
.vp-landing.style-poetry .poetry-motto {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: #3a3328;
  line-height: 1.6;
  margin: 0 0 24px;
}
.vp-landing.style-poetry .poetry-small {
  font-size: 0.7em;
  color: #6b5f4e;
}
.vp-landing.style-poetry .poetry-ornament {
  color: #2d6a4f;
  font-size: 20px;
  margin-bottom: 24px;
}
.vp-landing.style-poetry .poetry-desc {
  font-size: 16px;
  color: #6b5f4e;
  line-height: 2;
  margin: 0 0 40px;
}
.vp-landing.style-poetry .poetry-btn {
  display: inline-block;
  padding: 12px 32px;
  border: 2px solid #2d6a4f;
  color: #2d6a4f;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.vp-landing.style-poetry .poetry-btn:hover {
  background: #2d6a4f;
  color: #f5f0e8;
}
@media (max-width: 768px) {
  .vp-landing.style-poetry .hero-poetry {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px 24px;
  }
  .vp-landing.style-poetry .poetry-scroll {
    border-right: none;
    border-bottom: 1px solid #d6cfc0;
    padding-right: 0;
    padding-bottom: 40px;
  }
  .vp-landing.style-poetry .poetry-title {
    writing-mode: horizontal-tb;
    height: auto;
    font-size: 48px;
  }
}

/* ============================================================
   风格 5：现代卡片
   ============================================================ */
.vp-landing.style-cards {
  background: #fafafa;
  color: #1a1a2e;
  min-height: 100vh;
}
.vp-landing.style-cards .landing-nav {
  background: rgba(250, 250, 250, 0.9);
  border-bottom-color: #e5e5e5;
}
.vp-landing.style-cards .landing-logo,
.vp-landing.style-cards .landing-nav-links a {
  color: #1a1a2e;
}
.vp-landing.style-cards .landing-footer {
  border-top-color: #e5e5e5;
  color: #888;
}
.vp-landing.style-cards .hero-cards {
  max-width: 960px;
  margin: 0 auto;
  padding: 80px 32px;
}
.vp-landing.style-cards .cards-header {
  text-align: center;
  margin-bottom: 64px;
}
.vp-landing.style-cards .cards-header h1 {
  font-size: clamp(36px, 6vw, 56px);
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: -0.03em;
  margin: 0 0 12px;
}
.vp-landing.style-cards .cards-header p {
  font-size: 16px;
  color: #888;
  margin: 0;
}
.vp-landing.style-cards .cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 48px;
}
.vp-landing.style-cards .card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 28px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  display: block;
}
.vp-landing.style-cards .card:hover {
  border-color: #d0d0d0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
.vp-landing.style-cards .card-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.vp-landing.style-cards .card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 8px;
}
.vp-landing.style-cards .card p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}
.vp-landing.style-cards .cards-footer {
  text-align: center;
}
.vp-landing.style-cards .cards-cta {
  display: inline-block;
  padding: 14px 40px;
  background: #1a1a2e;
  color: #fff;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.vp-landing.style-cards .cards-cta:hover {
  background: #2a2a4e;
}

/* ============================================================
   风格 6：暗魄·粗野主义
   ============================================================ */
.vp-landing.style-brutal {
  background: #0a0a0a;
  color: #f5f5f5;
  min-height: 100vh;
}
.vp-landing.style-brutal .landing-nav {
  background: transparent;
  border-bottom-color: #333;
}
.vp-landing.style-brutal .landing-logo,
.vp-landing.style-brutal .landing-nav-links a {
  color: #f5f5f5;
}
.vp-landing.style-brutal .landing-footer {
  border-top-color: #333;
  color: #555;
}
.vp-landing.style-brutal .hero-brutal {
  min-height: calc(100vh - 56px);
  display: flex;
  align-items: center;
  padding: 80px 48px;
}
.vp-landing.style-brutal .brutal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  align-items: center;
}
.vp-landing.style-brutal .brutal-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #e63946;
  margin-bottom: 24px;
}
.vp-landing.style-brutal .brutal-title {
  font-size: clamp(56px, 9vw, 112px);
  font-weight: 900;
  color: #f5f5f5;
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin: 0 0 32px;
}
.vp-landing.style-brutal .brutal-rule {
  width: 80px;
  height: 6px;
  background: #e63946;
  margin-bottom: 32px;
}
.vp-landing.style-brutal .brutal-quote {
  font-size: clamp(18px, 2.5vw, 24px);
  color: #888;
  line-height: 1.6;
  margin: 0;
}
.vp-landing.style-brutal .brutal-right {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 2fr 1fr;
  gap: 16px;
  height: 380px;
}
.vp-landing.style-brutal .brutal-block {
  border: 2px solid #333;
}
.vp-landing.style-brutal .brutal-block.b-red { background: #e63946; border-color: #e63946; grid-row: 1; }
.vp-landing.style-brutal .brutal-block.b-black { background: #1a1a1a; border-color: #333; }
.vp-landing.style-brutal .brutal-block.b-white { background: #f5f5f5; border-color: #555; }
.vp-landing.style-brutal .brutal-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  grid-column: 1 / -1;
}
.vp-landing.style-brutal .brutal-link {
  display: inline-block;
  padding: 14px 32px;
  background: #e63946;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s;
}
.vp-landing.style-brutal .brutal-link:hover { background: #c1121f; }
.vp-landing.style-brutal .brutal-link-outline {
  display: inline-block;
  padding: 14px 32px;
  border: 2px solid #f5f5f5;
  color: #f5f5f5;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
}
.vp-landing.style-brutal .brutal-link-outline:hover { background: #f5f5f5; color: #0a0a0a; }
@media (max-width: 768px) {
  .vp-landing.style-brutal .brutal-grid { grid-template-columns: 1fr; gap: 40px; }
  .vp-landing.style-brutal .brutal-right { display: none; }
}

/* ============================================================
   风格 7：暖域·杂志编辑
   ============================================================ */
.vp-landing.style-editorial {
  background: #faf7f4;
  color: #2c2825;
  min-height: 100vh;
}
.vp-landing.style-editorial .landing-nav {
  background: transparent;
  border-bottom-color: #e8e0d8;
}
.vp-landing.style-editorial .landing-logo,
.vp-landing.style-editorial .landing-nav-links a {
  color: #2c2825;
}
.vp-landing.style-editorial .landing-footer {
  border-top-color: #e8e0d8;
  color: #9c8e7a;
}
.vp-landing.style-editorial .hero-editorial {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 48px 80px;
}
.vp-landing.style-editorial .edit-masthead {
  margin-bottom: 48px;
}
.vp-landing.style-editorial .edit-vol {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #d4a373;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.vp-landing.style-editorial .edit-rule {
  width: 48px;
  height: 2px;
  background: #2c2825;
}
.vp-landing.style-editorial .edit-hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 64px;
  align-items: center;
}
.vp-landing.style-editorial .edit-img-placeholder {
  aspect-ratio: 4/3;
  background: #2c2825;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #faf7f4;
  font-size: 13px;
  letter-spacing: 0.2em;
  font-weight: 600;
}
.vp-landing.style-editorial .edit-title {
  font-size: clamp(48px, 7vw, 80px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  color: #2c2825;
  margin: 0 0 24px;
}
.vp-landing.style-editorial .edit-subtitle {
  font-size: clamp(16px, 2vw, 20px);
  font-style: italic;
  color: #9c8e7a;
  margin: 0 0 24px;
}
.vp-landing.style-editorial .edit-body {
  font-size: 15px;
  color: #6b5f4e;
  line-height: 1.8;
  margin: 0 0 32px;
}
.vp-landing.style-editorial .edit-actions {
  display: flex;
  gap: 24px;
  align-items: center;
}
.vp-landing.style-editorial .edit-btn {
  display: inline-block;
  padding: 12px 28px;
  background: #2c2825;
  color: #faf7f4;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.vp-landing.style-editorial .edit-btn:hover { background: #4a3f3a; }
.vp-landing.style-editorial .edit-link {
  font-size: 14px;
  color: #9c8e7a;
  text-decoration: none;
  transition: color 0.2s;
}
.vp-landing.style-editorial .edit-link:hover { color: #2c2825; }
@media (max-width: 768px) {
  .vp-landing.style-editorial .edit-hero { grid-template-columns: 1fr; }
  .vp-landing.style-editorial .edit-img-placeholder { display: none; }
}

/* ============================================================
   风格 8：静界·极简禅意
   ============================================================ */
.vp-landing.style-zen {
  background: #fafafa;
  color: #1a1a1a;
  min-height: 100vh;
}
.vp-landing.style-zen .landing-nav {
  background: transparent;
  border-bottom-color: #e0e0e0;
}
.vp-landing.style-zen .landing-logo,
.vp-landing.style-zen .landing-nav-links a {
  color: #1a1a1a;
}
.vp-landing.style-zen .landing-footer {
  border-top-color: #e0e0e0;
  color: #aaa;
}
.vp-landing.style-zen .hero-zen {
  min-height: calc(100vh - 56px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
}
.vp-landing.style-zen .zen-center {
  text-align: center;
  max-width: 600px;
}
.vp-landing.style-zen .zen-line {
  width: 1px;
  height: 60px;
  background: #e0e0e0;
  margin: 0 auto;
}
.vp-landing.style-zen .zen-line.top { margin-bottom: 48px; }
.vp-landing.style-zen .zen-title {
  font-size: clamp(40px, 7vw, 72px);
  font-weight: 200;
  letter-spacing: 0.15em;
  color: #1a1a1a;
  margin: 0 0 16px;
}
.vp-landing.style-zen .zen-motto {
  font-size: clamp(16px, 2.5vw, 22px);
  color: #888;
  font-style: italic;
  margin: 0 0 40px;
}
.vp-landing.style-zen .zen-divider {
  width: 40px;
  height: 1px;
  background: #1a1a1a;
  margin: 0 auto 40px;
}
.vp-landing.style-zen .zen-tags {
  font-size: 13px;
  color: #aaa;
  letter-spacing: 0.1em;
  margin-bottom: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.vp-landing.style-zen .zen-dot { color: #ccc; }
.vp-landing.style-zen .zen-actions { margin-bottom: 48px; }
.vp-landing.style-zen .zen-btn {
  display: inline-block;
  padding: 12px 36px;
  border: 1px solid #1a1a1a;
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s;
}
.vp-landing.style-zen .zen-btn:hover {
  background: #1a1a1a;
  color: #fafafa;
}
.vp-landing.style-zen .zen-line.bottom { margin-top: 48px; }
</style>
