<script setup>
import ThemeSwitcher from './ThemeSwitcher.vue'
import LandingThemeSwitcher from './LandingThemeSwitcher.vue'
import EastonSearchTrigger from './EastonSearchTrigger.vue'

const categories = [
  { label: '技术开发', count: '225', href: '/md/guide/' },
  { label: 'AI 与智能', count: '159', href: '/md/agi/' },
  { label: '数字创作', count: '70', href: '/md/business/' },
]

const series = [
  { eyebrow: '技术开发 · 25 篇', title: 'Claude Code 专题：安装、配置、工作流与提效指南', text: '覆盖从第一次安装到复杂项目协作的完整实践路径。', href: '/md/guide/claude-code/' , tone: 'orange' },
  { eyebrow: 'AI 与智能 · 36 篇', title: 'Agent 实战：模型、工具、安全与部署指南', text: '从模型能力到可运行系统，建立一条清晰的 AI 实践路线。', href: '/md/agi/', tone: 'charcoal' },
  { eyebrow: '数字创作 · 18 篇', title: '独立创造者的产品、内容与增长工作流', text: '围绕工具站、SEO、内容生产与长期积累做系统记录。', href: '/md/columns/', tone: 'cream' },
]

const featured = [
  { category: 'AI 与智能', date: '2026-07-30', title: 'Codex 测试驱动开发：让 AI 先写测试，再修到全绿', text: '用可验证的工程闭环约束 AI 编程，让结果不再停留在“看起来能用”。', href: '/md/guide/ai/' },
  { category: '技术开发', date: '2026-07-29', title: 'Happy Coder：用手机远程操控 Claude Code', text: '把远程开发、通知和实际执行串成一条可复用的工作流。', href: '/md/guide/claude-code/happy-coder-remote-control' },
  { category: '数字创作', date: '2026-07-27', title: '网站分析与关键词挖掘：核心转折点全部突破', text: '从数据、搜索意图和内容结构出发，建立独立站增长判断。', href: '/md/columns/indie-hub/seo/keyword-analysis/keyword-breakthrough-round-15' },
]

const latest = [
  { date: '2026-07-30', category: 'AI 与智能', title: 'Codex 测试驱动开发：让 AI 先写测试，再修到全绿', href: '/md/guide/ai/' },
  { date: '2026-07-29', category: 'AI 与智能', title: 'Prompt Cache 为什么没省钱？用 skills 排查缓存', href: '/md/guide/ai/prompt-engineering/' },
  { date: '2026-07-28', category: 'AI 与智能', title: 'LazyCodex 怎么用：项目记忆、规划和验收闭环', href: '/md/guide/claude-code/' },
  { date: '2026-07-27', category: '技术开发', title: '网站分析与关键词挖掘：核心转折点全部突破', href: '/md/columns/indie-hub/seo/keyword-analysis/keyword-breakthrough-round-15' },
]
</script>

<template>
  <div class="easton-clone-page">
    <header class="easton-clone-header">
      <a href="/" class="easton-clone-brand"><span class="easton-clone-mark">E</span><span>System Vault</span></a>
      <nav aria-label="首页导航" class="easton-clone-nav">
        <a href="/">首页</a>
        <a href="/md/columns/">系列</a>
        <a href="/md/wiki/">分类</a>
        <a href="/md/wiki/">归档</a>
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
        <div class="easton-clone-actions"><EastonSearchTrigger variant="action" label="搜索问题" /><a href="/md/columns/">浏览系列</a><a href="/md/wiki/">分类入口</a></div>
        <EastonSearchTrigger variant="bar" label="搜索问题" />
      </section>

      <section class="easton-clone-entry">
        <div class="easton-clone-section-head"><span>阅读入口</span><strong>从最新内容、长期专题或分类目录开始浏览。</strong></div>
        <div class="easton-clone-entry-grid">
          <a href="#latest"><b>最新文章</b><span>查看最近发布和更新笔记</span><i>→</i></a>
          <a href="/md/columns/"><b>系列</b><span>按长期主题系统阅读内容</span><i>→</i></a>
          <a href="/md/wiki/"><b>分类</b><span>按 AI、开发和商业主题浏览</span><i>→</i></a>
        </div>
      </section>

      <section class="easton-clone-section">
        <div class="easton-clone-section-head"><span>精选系列专题</span><strong>每个专题都有完整的阅读路径，从第一篇系统读起。</strong><a href="/md/columns/">浏览系列 →</a></div>
        <div class="easton-clone-series-grid">
          <a v-for="item in series" :key="item.title" :href="item.href" class="easton-clone-series-card" :class="item.tone"><div class="easton-clone-art"><span>{{ item.tone === 'charcoal' ? 'AGENT' : item.tone === 'cream' ? 'SOLO' : 'CODE' }}</span></div><small>{{ item.eyebrow }}</small><h2>{{ item.title }}</h2><p>{{ item.text }}</p><b>从第 1 篇开始 →</b></a>
        </div>
      </section>

      <section class="easton-clone-section">
        <div class="easton-clone-section-head"><span>编辑精选</span><strong>值得优先阅读的文章、指南和项目笔记。</strong><a href="/md/guide/">查看全部 →</a></div>
        <div class="easton-clone-featured-grid"><a v-for="item in featured" :key="item.title" :href="item.href" class="easton-clone-featured-card"><div class="easton-clone-featured-art"></div><small>{{ item.date }} · {{ item.category }}</small><h2>{{ item.title }}</h2><p>{{ item.text }}</p></a></div>
      </section>

      <section class="easton-clone-section" id="latest">
        <div class="easton-clone-section-head"><span>最新文章</span><strong>最近发布的 AI、开发和独立产品笔记。</strong></div>
        <div class="easton-clone-latest-list"><a v-for="item in latest" :key="item.title" :href="item.href"><span>{{ item.date }}</span><span>{{ item.category }}</span><b>{{ item.title }}</b><i>↗</i></a></div>
      </section>

      <section class="easton-clone-section easton-clone-categories">
        <div class="easton-clone-section-head"><span>按分类浏览</span><strong>从开发、AI 与数字创作三个方向进入内容。</strong></div>
        <div class="easton-clone-category-grid"><a v-for="category in categories" :key="category.label" :href="category.href"><span class="easton-clone-category-icon">✦</span><h2>{{ category.label }}</h2><b>{{ category.count }}</b><p>围绕实践、工具、工作流和长期积累的内容。</p><span>进入{{ category.label }} →</span></a></div>
      </section>
    </main>

    <footer class="easton-clone-footer"><div><a href="/" class="easton-clone-brand"><span class="easton-clone-mark">E</span><span>System Vault</span></a><p>AI、开发、自动化与独立产品构建笔记。</p></div><div><b>导航</b><a href="/">首页</a><a href="/md/columns/">系列</a><a href="/md/wiki/">分类</a></div><div><b>资源</b><a href="/md/guide/">指南</a><a href="/md/agi/">AGI</a><a href="/md/business/">商业</a></div><div><b>许可</b><span>MIT License</span><span>© 2024-present</span></div></footer>
  </div>
</template>
