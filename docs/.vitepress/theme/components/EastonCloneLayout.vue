<script setup>
import { computed } from 'vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import LandingThemeSwitcher from './LandingThemeSwitcher.vue'
import EastonSearchTrigger from './EastonSearchTrigger.vue'
import { useBlogIndex } from '../composables/useBlogIndex.js'

const { latest, categories, series } = useBlogIndex()

const featured = computed(() => latest(3))
const recentList = computed(() => latest(4))
const topCategories = computed(() => categories.value.slice(0, 3))
const featuredSeries = computed(() => series.value.slice(0, 3))
</script>

<template>
  <div class="easton-clone-page">
    <header class="easton-clone-header">
      <a href="/" class="easton-clone-brand"><span class="easton-clone-mark">E</span><span>System Vault</span></a>
      <nav aria-label="首页导航" class="easton-clone-nav">
        <a href="/">首页</a>
        <a href="/md/blog/">列表</a>
        <a href="/md/blog/category/sources/">分类</a>
        <a href="/md/blog/archive/">归档</a>
        <EastonSearchTrigger variant="nav" label="搜索文章" />
        <LandingThemeSwitcher />
        <ThemeSwitcher />
      </nav>
    </header>

    <main>
      <section class="easton-clone-hero">
        <p class="easton-clone-overline">AI · DEV · AUTOMATION</p>
        <h1>AI、开发、自动化<br />与独立产品笔记。</h1>
        <p>文章、指南、工具与项目笔记，覆盖 AI、开发、自动化、知识管理与独立创造。</p>
        <div class="easton-clone-actions">
          <EastonSearchTrigger variant="action" label="搜索问题" />
          <a href="/md/blog/">浏览列表</a>
          <a href="/md/blog/archive/">分类归档</a>
        </div>
        <EastonSearchTrigger variant="bar" label="搜索问题" />
      </section>

      <section class="easton-clone-entry">
        <div class="easton-clone-section-head">
          <span>阅读入口</span>
          <strong>从最新内容、长期专题或分类目录开始浏览。</strong>
        </div>
        <div class="easton-clone-entry-grid">
          <a href="/md/blog/"><b>最新文章</b><span>查看最近发布和更新笔记</span><i>→</i></a>
          <a href="/md/blog/series/"><b>系列</b><span>按长期主题系统阅读内容</span><i>→</i></a>
          <a href="/md/blog/category/"><b>分类</b><span>按 AI、开发和商业主题浏览</span><i>→</i></a>
        </div>
      </section>

      <section v-if="featuredSeries.length" class="easton-clone-section">
        <div class="easton-clone-section-head">
          <span>精选系列专题</span>
          <strong>每个专题都有完整的阅读路径，从第一篇系统读起。</strong>
          <a href="/md/blog/series/">浏览系列 →</a>
        </div>
        <div class="easton-clone-series-grid">
          <a v-for="(s, i) in featuredSeries" :key="s.slug" :href="`/md/blog/series/${s.slug}/`" class="easton-clone-series-card" :class="['tone-' + (i % 3)]">
            <div class="easton-clone-art"><span>{{ ['CODE', 'AGENT', 'SOLO'][i % 3] }}</span></div>
            <small>{{ s.title }} · {{ s.count }} 篇</small>
            <h2>{{ s.title }}</h2>
            <p>共 {{ s.count }} 篇，按发布时间排序，从第一篇系统读起。</p>
            <b>从第 1 篇开始 →</b>
          </a>
        </div>
      </section>

      <section v-if="featured.length" class="easton-clone-section">
        <div class="easton-clone-section-head">
          <span>编辑精选</span>
          <strong>最近发布、值得优先阅读的文章、指南和项目笔记。</strong>
          <a href="/md/blog/">查看全部 →</a>
        </div>
        <div class="easton-clone-featured-grid">
          <a v-for="item in featured" :key="item.path" :href="item.path" class="easton-clone-featured-card">
            <div class="easton-clone-featured-art"></div>
            <small>{{ item.date }} · {{ item.categoryTitle || item.category }}</small>
            <h2>{{ item.title }}</h2>
            <p>{{ item.excerpt }}</p>
          </a>
        </div>
      </section>

      <section v-if="recentList.length" class="easton-clone-section" id="latest">
        <div class="easton-clone-section-head">
          <span>最新文章</span>
          <strong>最近发布的 AI、开发和独立产品笔记。</strong>
        </div>
        <div class="easton-clone-latest-list">
          <a v-for="item in recentList" :key="item.path" :href="item.path">
            <span>{{ item.date }}</span>
            <span>{{ item.categoryTitle || item.category }}</span>
            <b>{{ item.title }}</b>
            <i>↗</i>
          </a>
        </div>
      </section>

      <section v-if="topCategories.length" class="easton-clone-section easton-clone-categories">
        <div class="easton-clone-section-head">
          <span>按分类浏览</span>
          <strong>从开发、AI 与数字创作三个方向进入内容。</strong>
        </div>
        <div class="easton-clone-category-grid">
          <a v-for="cat in topCategories" :key="cat.slug" :href="`/md/blog/category/${cat.slug}/`">
            <span class="easton-clone-category-icon">✦</span>
            <h2>{{ cat.title }}</h2>
            <b>{{ cat.count }}</b>
            <p>围绕实践、工具、工作流和长期积累的内容。</p>
            <span>进入{{ cat.title }} →</span>
          </a>
        </div>
      </section>
    </main>

    <footer class="easton-clone-footer">
      <div>
        <a href="/" class="easton-clone-brand"><span class="easton-clone-mark">E</span><span>System Vault</span></a>
        <p>AI、开发、自动化与独立产品构建笔记。</p>
      </div>
      <div>
        <b>导航</b>
        <a href="/">首页</a>
        <a href="/md/blog/">列表</a>
        <a href="/md/blog/archive/">归档</a>
      </div>
      <div>
        <b>资源</b>
        <a href="/md/guide/">指南</a>
        <a href="/md/agi/">AGI</a>
        <a href="/md/business/">商业</a>
      </div>
      <div>
        <b>许可</b>
        <span>MIT License</span>
        <span>© 2024-present</span>
      </div>
    </footer>
  </div>
</template>
