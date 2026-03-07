<template>
  <div class="pdf-list">
    <div class="pdf-list__sidebar">
      <div class="pdf-list__header">
        <h3>{{ sidebarTitle }}</h3>
      </div>

      <template v-if="dir">
        <ul class="tree">
          <li v-for="item in items" :key="item.name">
            <button @click="select(item)" :class="{ active: item.url === selected?.url }">
              {{ item.name }}
            </button>
          </li>
        </ul>
      </template>

      <template v-else>
        <ul class="tree">
          <li v-for="book in dirs" :key="book">
            <div class="tree-node" @click="toggleBook(book)">
              <span class="tree-toggle">{{ expandedBooks.has(book) ? '▾' : '▸' }}</span>
              {{ book.replace(/[-_]/g, ' ') }}
            </div>
            <ul v-if="expandedBooks.has(book)" class="tree-children">
              <li v-for="item in groups[book] || []" :key="item.name">
                <button @click="select(item)" :class="{ active: item.url === selected?.url }">
                  {{ item.name }}
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </template>
    </div>

    <div class="pdf-list__viewer" v-if="selected">
      <h3>{{ selected.name }}</h3>
      <PdfViewer :src="selected.url" />
    </div>

    <div class="pdf-list__empty" v-else>
      <p>请从左侧选择一个 PDF 进行预览。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import PdfViewer from './PdfViewer.vue'

const props = defineProps({
  dir: { type: String, default: '' }
})

const raw = import.meta.globEager('../../../md/books/**/*.pdf')

const groups = {}
Object.entries(raw).forEach(([filePath, module]) => {
  const segments = filePath.split('/')
  const fileName = segments.pop()
  const dirName = segments.pop() || ''

  const name = fileName.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ')
  const url = module.default

  if (!groups[dirName]) groups[dirName] = []
  groups[dirName].push({ name, url })
})

Object.values(groups).forEach(list => list.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN')))

const dirs = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
const currentDir = ref(props.dir || dirs[0] || '')

const sidebarTitle = computed(() => {
  const bookName = props.dir ? props.dir.replace(/[-_]/g, ' ') : ''
  return props.dir ? `${bookName} 目录` : 'PDF 书籍'
})

const items = computed(() => {
  return groups[currentDir.value] || []
})

const expandedBooks = ref(new Set([currentDir.value]))

watch(currentDir, (newDir) => {
  if (newDir) {
    expandedBooks.value.add(newDir)
  }
})

const selected = ref(null)

watch(
  [items, () => props.dir],
  ([nextItems, nextDir]) => {
    // Only auto-select the first PDF when a specific book is being viewed.
    // When displaying the full tree, we wait for the user to choose a PDF.
    if (nextDir) {
      selected.value = nextItems[0] || null
    }
  },
  { immediate: true }
)

watch(
  () => props.dir,
  (newDir) => {
    if (newDir && groups[newDir]) {
      currentDir.value = newDir
    }
  }
)

const toggleBook = (book) => {
  const set = expandedBooks.value
  if (set.has(book)) {
    set.delete(book)
  } else {
    set.add(book)
  }
  expandedBooks.value = new Set(set)
}

const select = (item) => {
  selected.value = item
}
</script>

<style scoped>
.pdf-list {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 12px;
}

.pdf-list__sidebar {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  background: var(--vp-canvas-bg);
  max-height: 78vh;
  overflow: auto;
}

.pdf-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.pdf-list__sidebar h3 {
  margin: 0;
  font-size: 1.05em;
}

.pdf-list__sidebar select {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-canvas-bg);
  color: var(--vp-c-foreground);
}

.pdf-list__sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tree {
  padding-left: 0;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}

.tree-node:hover {
  background: rgba(0, 0, 0, 0.04);
}

.tree-toggle {
  display: inline-flex;
  width: 1.2em;
  justify-content: center;
  color: var(--vp-c-accent);
}

.tree-children {
  margin-left: 14px;
}

.pdf-list__sidebar button {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.pdf-list__sidebar button:hover {
  background: rgba(0, 0, 0, 0.04);
}

.pdf-list__sidebar button.active {
  background: var(--vp-c-accent-bg);
  font-weight: 600;
}

.pdf-list__viewer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pdf-list__viewer h3 {
  margin: 0;
}

.pdf-list__empty {
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-canvas-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
