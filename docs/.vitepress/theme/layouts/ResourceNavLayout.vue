<script setup>
import { computed, ref } from 'vue'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import LandingThemeSwitcher from '../components/LandingThemeSwitcher.vue'
import MobileNavSheet from '../components/MobileNavSheet.vue'
import { useTheme } from '../composables/useTheme.js'
import { useResourceNav } from '../composables/useResourceNav.js'

const { currentTheme, currentLandingTheme } = useTheme()
const { data, categories, flatItems, stats } = useResourceNav()

const query = ref('')
const activeCategory = ref('all')

const normalizedQuery = computed(() => query.value.trim().toLowerCase())

const searchResults = computed(() => {
  const q = normalizedQuery.value
  if (!q) return []
  const tokens = q.split(/\s+/).filter(Boolean)
  return flatItems.filter((item) => {
    const haystack = [
      item.title,
      item.desc,
      item.tag,
      item.category?.title,
      item.group?.title,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return tokens.every((token) => haystack.includes(token))
  })
})

const isSearching = computed(() => normalizedQuery.value.length > 0)

const visibleCategories = computed(() => {
  if (activeCategory.value === 'all') return categories
  return categories.filter((category) => category.slug === activeCategory.value)
})

const visibleCount = computed(() =>
  visibleCategories.value.reduce((sum, category) => sum + (category.count || 0), 0),
)

function resetFilters() {
  query.value = ''
  activeCategory.value = 'all'
}
</script>

<template>
  <div
    class="easton-clone-page blog-page resource-nav-page"
    :class="[`theme-${currentTheme}`, `landing-theme-${currentLandingTheme}`]"
  >
    <header class="easton-clone-header">
      <a href="/" class="easton-clone-brand">
        <span>System Vault</span>
      </a>
      <nav aria-label="资源导航" class="easton-clone-nav">
        <a href="/">首页</a>
        <a href="/md/resources/" class="is-active">资源导航</a>
        <a href="/md/blog/">博客</a>
        <a href="/md/guide/getting-started">指南</a>
        <LandingThemeSwitcher />
        <ThemeSwitcher />
        <MobileNavSheet />
      </nav>
    </header>

    <main class="blog-main">
      <section class="easton-clone-section-head">
        <span>RESOURCE NAVIGATION</span>
        <div class="rn-intro">
          <h1>{{ data.title }}</h1>
          <p v-if="data.description">{{ data.description }}</p>
        </div>
        <div class="rn-stats">
          <b>{{ stats.items }}</b>
          <span>条资源</span>
          <b>{{ stats.categories }}</b>
          <span>个分类</span>
        </div>
      </section>

      <section class="rn-toolbar" aria-label="筛选与搜索">
        <label class="rn-search">
          <span class="rn-search-icon" aria-hidden="true">⌕</span>
          <input
            v-model="query"
            type="text"
            inputmode="search"
            enterkeyhint="search"
            autocomplete="off"
            placeholder="搜索工具、Skill、教程、平台…"
            aria-label="搜索资源"
          />
          <button
            v-if="normalizedQuery"
            type="button"
            class="rn-search-clear"
            aria-label="清空搜索"
            @click="query = ''"
          >×</button>
        </label>

        <div class="rn-chips" role="tablist" aria-label="按分类筛选">
          <button
            type="button"
            role="tab"
            class="rn-chip"
            :class="{ active: activeCategory === 'all' }"
            :aria-selected="activeCategory === 'all'"
            @click="activeCategory = 'all'"
          >全部</button>
          <button
            v-for="category in categories"
            :key="category.slug"
            type="button"
            role="tab"
            class="rn-chip"
            :class="{ active: activeCategory === category.slug }"
            :aria-selected="activeCategory === category.slug"
            @click="activeCategory = category.slug"
          >{{ category.title }} <em>{{ category.count }}</em></button>
        </div>
      </section>

      <section v-if="isSearching" class="rn-results" aria-live="polite">
        <p class="rn-result-meta">
          找到 <b>{{ searchResults.length }}</b> 条结果
          <button v-if="searchResults.length" type="button" class="rn-reset" @click="resetFilters">重置</button>
        </p>
        <div v-if="searchResults.length" class="rn-grid">
          <article v-for="(item, index) in searchResults" :key="`${item.href}-${index}`" class="rn-card">
            <div class="rn-card-head">
              <a
                v-if="item.href"
                class="rn-card-title"
                :href="item.href"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noreferrer' : undefined"
              >
                {{ item.title }}<span class="rn-arrow" aria-hidden="true">{{ item.external ? '↗' : '→' }}</span>
              </a>
              <span v-else class="rn-card-title is-plain">{{ item.title }}</span>
            </div>
            <span class="rn-badge">{{ item.category?.title }}<template v-if="item.group?.title"> · {{ item.group.title }}</template></span>
            <p v-if="item.desc" class="rn-desc">{{ item.desc }}</p>
          </article>
        </div>
        <p v-else class="rn-empty">没有匹配的资源。换个关键词试试，或<button type="button" class="rn-reset" @click="resetFilters">重置筛选</button>。</p>
      </section>

      <template v-else>
        <section v-for="category in visibleCategories" :key="category.slug" class="rn-category">
          <header class="rn-category-head">
            <h2>{{ category.title }}</h2>
            <span>{{ category.count }} 条</span>
          </header>
          <p v-if="category.desc" class="rn-category-desc">{{ category.desc }}</p>

          <div v-for="(group, gi) in category.groups" :key="`${category.slug}-${gi}`" class="rn-group">
            <h3 v-if="group.title" class="rn-group-title">{{ group.title }}</h3>
            <div v-if="group.items.length" class="rn-grid">
              <article v-for="(item, index) in group.items" :key="`${item.href}-${index}`" class="rn-card">
                <div class="rn-card-head">
                  <a
                    v-if="item.href"
                    class="rn-card-title"
                    :href="item.href"
                    :target="item.external ? '_blank' : undefined"
                    :rel="item.external ? 'noreferrer' : undefined"
                  >
                    {{ item.title }}<span class="rn-arrow" aria-hidden="true">{{ item.external ? '↗' : '→' }}</span>
                  </a>
                  <span v-else class="rn-card-title is-plain">{{ item.title }}</span>
                  <span v-if="item.tag" class="rn-tag">{{ item.tag }}</span>
                </div>
                <p v-if="item.desc" class="rn-desc">{{ item.desc }}</p>
                <ul v-if="item.children?.length" class="rn-children">
                  <li v-for="(child, ci) in item.children" :key="ci" class="rn-child">
                    <a
                      v-if="child.href"
                      class="rn-child-title"
                      :href="child.href"
                      :target="child.external ? '_blank' : undefined"
                      :rel="child.external ? 'noreferrer' : undefined"
                    >{{ child.title }}<span v-if="child.desc" class="rn-child-desc">{{ child.desc }}</span></a>
                    <span v-else class="rn-child-text">{{ child.title }}</span>
                    <ul v-if="child.children?.length" class="rn-grandchildren">
                      <li v-for="(grand, gci) in child.children" :key="gci">
                        <a
                          v-if="grand.href"
                          :href="grand.href"
                          :target="grand.external ? '_blank' : undefined"
                          :rel="grand.external ? 'noreferrer' : undefined"
                        >{{ grand.title }}</a>
                        <span v-else>{{ grand.title }}</span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </article>
            </div>
            <p v-if="group.note" class="rn-note">{{ group.note }}</p>
          </div>

          <p v-if="category.note" class="rn-note">{{ category.note }}</p>
        </section>

        <p v-if="!visibleCategories.length" class="rn-empty">该分类暂无资源。</p>
      </template>
    </main>

    <footer class="easton-clone-footer">
      <div>
        <a href="/" class="easton-clone-brand"><span>System Vault</span></a>
        <p>收录 AI 编程相关的工具、平台与视频。</p>
      </div>
      <div>
        <a href="/">首页</a>
        <a href="/md/resources/">资源导航</a>
        <a href="/md/blog/">博客</a>
        <a href="/md/guide/getting-started">指南</a>
        <a href="/md/guide/ai/ai-programming-resources">原文档</a>
        <span>© 2024-present</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.resource-nav-page .rn-intro h1 {
  margin: 0;
  color: var(--clone-ink);
  font-family: var(--blog-heading-font, var(--vp-font-family-base));
  font-size: clamp(34px, 5vw, 60px);
  font-weight: 400;
  letter-spacing: -0.045em;
  line-height: 1.08;
}

.resource-nav-page .rn-intro p {
  max-width: 620px;
  margin: 20px 0 0;
  color: var(--clone-body);
  font-size: 16px;
  line-height: 1.8;
}

.rn-stats {
  display: grid;
  grid-template-columns: auto auto;
  gap: 2px 10px;
  align-content: start;
  padding-top: 8px;
  text-align: right;
  color: var(--clone-body);
  font-size: 13px;
}

.rn-stats b {
  color: var(--clone-accent);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
}

.rn-toolbar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 26px 0 8px;
  border-top: 2px solid var(--clone-ink);
}

.rn-search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border: 1px solid var(--clone-rule);
  border-radius: 8px;
  background: var(--clone-surface);
}

.rn-search-icon {
  color: var(--clone-body);
  font-size: 18px;
}

.rn-search input {
  flex: 1;
  width: 100%;
  padding: 13px 0;
  border: 0;
  background: transparent;
  color: var(--clone-ink);
  font-family: inherit;
  font-size: 15px;
  outline: none;
}

.rn-search input::placeholder {
  color: var(--vp-c-text-3, var(--clone-body));
}

.rn-search-clear {
  border: 0;
  background: transparent;
  color: var(--clone-body);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.rn-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.rn-chip {
  padding: 7px 14px;
  border: 1px solid var(--clone-rule);
  border-radius: 999px;
  background: transparent;
  color: var(--clone-body);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.2;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.rn-chip em {
  color: var(--vp-c-text-3, var(--clone-body));
  font-style: normal;
  font-size: 11px;
}

.rn-chip:hover {
  border-color: var(--clone-accent);
  color: var(--clone-ink);
}

.rn-chip.active {
  border-color: var(--clone-ink);
  background: var(--clone-ink);
  color: var(--clone-bg);
}

.rn-chip.active em {
  color: var(--clone-bg);
  opacity: 0.7;
}

.rn-category {
  padding: 54px 0 6px;
}

.rn-category + .rn-category {
  margin-top: 22px;
  border-top: 1px solid var(--clone-rule);
}

.rn-category-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 18px;
}

.rn-category-head h2 {
  margin: 0;
  color: var(--clone-ink);
  font-family: var(--blog-heading-font, var(--vp-font-family-base));
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 400;
  letter-spacing: -0.03em;
}

.rn-category-head span {
  flex: none;
  color: var(--clone-body);
  font-size: 13px;
}

.rn-category-desc {
  max-width: 760px;
  margin: 14px 0 0;
  color: var(--clone-body);
  font-size: 14px;
  line-height: 1.8;
}

.rn-group {
  margin-top: 30px;
}

.rn-group-title {
  margin: 0 0 14px;
  color: var(--clone-accent);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.rn-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 16px;
}

.rn-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 18px 20px;
  border: 1px solid var(--clone-rule);
  border-radius: 10px;
  background: var(--clone-surface);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.rn-card:hover {
  border-color: var(--clone-accent);
  transform: translateY(-2px);
}

.rn-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.rn-card-title {
  color: var(--clone-ink);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
  text-decoration: none;
}

.rn-card-title.is-plain {
  font-weight: 600;
}

a.rn-card-title:hover {
  color: var(--clone-accent);
}

.rn-arrow {
  margin-left: 6px;
  color: var(--clone-accent);
  font-size: 12px;
}

.rn-tag {
  flex: none;
  padding: 2px 8px;
  border: 1px solid var(--clone-rule);
  border-radius: 999px;
  color: var(--clone-body);
  font-size: 11px;
  line-height: 1.6;
}

.rn-badge {
  color: var(--clone-accent);
  font-size: 11px;
  letter-spacing: 0.02em;
}

.rn-desc {
  margin: 0;
  color: var(--clone-body);
  font-size: 13px;
  line-height: 1.7;
}

.rn-children {
  margin: 4px 0 0;
  padding: 8px 0 0;
  border-top: 1px dashed var(--clone-rule);
  list-style: none;
}

.rn-child {
  position: relative;
  padding-left: 14px;
  color: var(--clone-body);
  font-size: 12px;
  line-height: 1.7;
}

.rn-child::before {
  content: '·';
  position: absolute;
  left: 2px;
  color: var(--clone-accent);
}

.rn-child + .rn-child {
  margin-top: 4px;
}

.rn-child-title {
  color: var(--clone-body);
  text-decoration: none;
}

.rn-child-title:hover {
  color: var(--clone-accent);
}

.rn-child-desc {
  color: var(--vp-c-text-3, var(--clone-body));
}

.rn-grandchildren {
  margin: 4px 0 0;
  padding-left: 12px;
  list-style: none;
}

.rn-grandchildren li {
  color: var(--vp-c-text-3, var(--clone-body));
  font-size: 12px;
  line-height: 1.7;
}

.rn-grandchildren a {
  color: var(--clone-body);
  text-decoration: none;
}

.rn-grandchildren a:hover {
  color: var(--clone-accent);
}

.rn-note {
  margin: 16px 0 0;
  padding: 12px 16px;
  border-left: 3px solid var(--clone-accent);
  background: var(--easton-doc-soft, var(--vp-c-bg-soft));
  color: var(--clone-body);
  font-size: 13px;
  line-height: 1.8;
}

.rn-result-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 44px 0 20px;
  color: var(--clone-body);
  font-size: 14px;
}

.rn-result-meta b {
  color: var(--clone-ink);
}

.rn-reset {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--clone-accent);
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  text-decoration: underline;
}

.rn-empty {
  padding: 60px 0;
  color: var(--clone-body);
  font-size: 14px;
  text-align: center;
}

@media (max-width: 720px) {
  .rn-grid {
    grid-template-columns: 1fr;
  }

  .resource-nav-page .rn-stats {
    text-align: left;
  }
}
</style>
