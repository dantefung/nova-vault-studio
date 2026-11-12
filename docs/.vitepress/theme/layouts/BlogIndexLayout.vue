<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import { useBlogIndex } from '../composables/useBlogIndex.js'
import ArticleCard from '../components/ArticleCard.vue'

const route = useRoute()
const router = useRouter()

const PAGE_SIZE = 20

const { index, featuredArticles, categories, series } = useBlogIndex()

const mode = ref('latest') // latest | category | series

const articles = computed(() => index.value.articles)
const featured = computed(() => {
  const selected = []
  const paths = new Set()
  for (const article of [...featuredArticles(5), ...articles.value]) {
    if (!article?.path || paths.has(article.path)) continue
    paths.add(article.path)
    selected.push(article)
    if (selected.length === 5) break
  }
  return selected
})
const allArticles = computed(() => {
  const featuredPaths = new Set(featured.value.map(article => article.path))
  return articles.value.filter(article => !featuredPaths.has(article.path))
})

const pageCount = computed(() => Math.max(1, Math.ceil(allArticles.value.length / PAGE_SIZE)))

const pageRef = ref(1)
const currentPage = computed(() => Math.min(pageRef.value, pageCount.value))

function parsePageFromQuery() {
  if (typeof window === 'undefined') return 1
  const match = /[?&]page=(\d+)/.exec(window.location.href)
  if (!match) return 1
  const raw = Number(match[1])
  return (!Number.isInteger(raw) || raw < 1) ? 1 : raw
}

function syncPage() {
  pageRef.value = Math.min(parsePageFromQuery(), pageCount.value)
}

onMounted(() => {
  syncPage()
  window.addEventListener('popstate', syncPage)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncPage)
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return allArticles.value.slice(start, start + PAGE_SIZE)
})

const showFeatured = computed(() => currentPage.value === 1)

const pageButtons = computed(() => {
  const total = pageCount.value
  const cur = currentPage.value
  const set = new Set([1, total, cur - 2, cur - 1, cur, cur + 1, cur + 2])
  return Array.from(set).filter(p => p >= 1 && p <= total).sort((a, b) => a - b)
})

const list = computed(() => {
  if (mode.value === 'category') return categories.value
  return series.value
})

async function goToPage(n) {
  const target = Math.min(Math.max(1, n), pageCount.value)
  const query = target > 1 ? `?page=${target}` : ''
  await router.go(`${route.path}${query}`)
  pageRef.value = target
  await nextTick()
  document.getElementById('all-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function selectMode(next) {
  mode.value = next
  router.go(route.path)
}
</script>

<template>
  <section class="easton-clone-section blog-index">
    <div class="easton-clone-section-head">
      <span>BLOG / NOTES ON BUILDING</span>
      <div class="blog-index-intro">
        <h1>持续写作，整理正在发生的变化。</h1>
        <p>这里记录 AI、软件与独立创作。精选文章适合初次阅读，完整目录保留每一次思考的时间顺序。</p>
      </div>
      <div class="blog-index-tabs">
        <button :class="{ active: mode === 'latest' }" :aria-pressed="mode === 'latest'" @click="selectMode('latest')">最新</button>
        <button :class="{ active: mode === 'category' }" :aria-pressed="mode === 'category'" @click="selectMode('category')">分类</button>
        <button :class="{ active: mode === 'series' }" :aria-pressed="mode === 'series'" @click="selectMode('series')">系列</button>
      </div>
    </div>

    <template v-if="mode === 'latest'">
      <section v-if="showFeatured && featured.length" class="blog-featured" aria-labelledby="featured-title">
        <div class="blog-subhead"><span>01</span><h2 id="featured-title">编辑精选</h2></div>
        <div class="blog-featured-grid">
          <ArticleCard v-for="a in featured" :key="a.path" :article="a" variant="feature" />
        </div>
      </section>
      <section class="blog-all" aria-labelledby="all-title">
        <div class="blog-subhead"><span>02</span><h2 id="all-title">全部文章</h2></div>
        <div v-if="paginatedArticles.length" class="blog-row-list">
          <ArticleCard v-for="a in paginatedArticles" :key="a.path" :article="a" variant="row" />
        </div>
        <p v-else class="blog-empty">暂无更多文章。</p>
        <nav v-if="pageCount > 1" class="blog-pagination" aria-label="文章分页">
          <button type="button" class="blog-pagination-btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">上一页</button>
          <button
            v-for="p in pageButtons"
            :key="p"
            type="button"
            class="blog-pagination-btn"
            :class="{ active: p === currentPage }"
            :aria-current="p === currentPage ? 'page' : undefined"
            @click="goToPage(p)"
          >{{ p }}</button>
          <button type="button" class="blog-pagination-btn" :disabled="currentPage >= pageCount" @click="goToPage(currentPage + 1)">下一页</button>
          <span class="blog-pagination-total">共 {{ allArticles.length }} 篇 · {{ pageCount }} 页</span>
        </nav>
      </section>
    </template>

    <template v-else-if="mode === 'category'">
      <div class="blog-directory">
        <a v-for="(c, index) in list" :key="c.slug" :href="`/md/blog/category/${c.slug}/`" class="blog-tile">
          <em>{{ String(index + 1).padStart(2, '0') }}</em>
          <b>{{ c.title }}</b>
          <span>{{ c.count }} 篇</span>
          <i>→</i>
        </a>
      </div>
    </template>

    <template v-else>
      <div class="blog-directory">
        <a v-for="(s, index) in list" :key="s.slug" :href="`/md/blog/series/${s.slug}/`" class="blog-tile">
          <em>{{ String(index + 1).padStart(2, '0') }}</em>
          <b>{{ s.title }}</b>
          <span>{{ s.count }} 篇</span>
          <i>→</i>
        </a>
      </div>
    </template>
  </section>
</template>
