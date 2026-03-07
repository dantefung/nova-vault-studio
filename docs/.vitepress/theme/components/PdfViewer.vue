<template>
  <div class="pdf-viewer" ref="container">
    <div class="toolbar">
      <div class="page-controls">
        <button @click="goToPage(1)" :disabled="page <= 1" title="首页">⏮</button>
        <button @click="goToPage(page - 1)" :disabled="page <= 1" title="上一页">◀</button>
        <span class="page-indicator">{{ page }} / {{ numPages }}</span>
        <button @click="goToPage(page + 1)" :disabled="page >= numPages" title="下一页">▶</button>
        <button @click="goToPage(numPages)" :disabled="page >= numPages" title="尾页">⏭</button>
      </div>

      <div class="zoom-controls">
        <button @click="setScale(scale - 0.2)" title="缩小">➖</button>
        <span class="zoom-indicator">{{ (scale * 100).toFixed(0) }}%</span>
        <button @click="setScale(scale + 0.2)" title="放大">➕</button>
      </div>

      <div class="actions">
        <button @click="toggleOutline" title="目录">📑</button>
        <button @click="toggleFullscreen" title="全屏">⛶</button>
        <a :href="src" target="_blank" rel="noreferrer" title="在新标签页打开">↗</a>
      </div>
    </div>

    <div class="viewer">
      <aside v-if="outline && outline.length" class="outline" :class="{ open: outlineOpen }">
        <div class="outline-header">
          <span>目录</span>
          <button @click="toggleOutline" title="关闭">✕</button>
        </div>
        <ul>
          <li v-for="(item, idx) in outline" :key="idx">
            <button class="outline-item" @click="goToOutline(item)">{{ item.title }}</button>
            <PdfOutline v-if="item.items?.length" :items="item.items" @navigate="goToOutline" />
          </li>
        </ul>
      </aside>

      <div class="canvas-wrapper">
        <canvas ref="canvas" class="pdf-canvas" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

let getDocument
let GlobalWorkerOptions

const loadPdfJs = async () => {
  if (getDocument) return
  const pdfjs = await import('pdfjs-dist')
  const workerUrl = await import('pdfjs-dist/build/pdf.worker.min.js?url')
  getDocument = pdfjs.getDocument
  GlobalWorkerOptions = pdfjs.GlobalWorkerOptions
  GlobalWorkerOptions.workerSrc = workerUrl.default
}

const props = defineProps({
  src: { type: String, required: true },
  page: { type: Number, default: 1 },
  scale: { type: Number, default: 1.2 }
})

const container = ref(null)
const canvas = ref(null)

const page = ref(props.page)
const scale = ref(props.scale)
const numPages = ref(0)
const outline = ref(null)
const outlineOpen = ref(false)

let pdfDocument = null

const loadPdf = async () => {
  if (!props.src) return
  await loadPdfJs()
  const loadingTask = getDocument(props.src)
  pdfDocument = await loadingTask.promise
  numPages.value = pdfDocument.numPages
  outline.value = await pdfDocument.getOutline()
  renderPage()
}

const renderPage = async () => {
  if (!pdfDocument || !canvas.value) return
  const pdfPage = await pdfDocument.getPage(page.value)
  const viewport = pdfPage.getViewport({ scale: scale.value })
  const ctx = canvas.value.getContext('2d')
  canvas.value.height = viewport.height
  canvas.value.width = viewport.width
  await pdfPage.render({ canvasContext: ctx, viewport }).promise
}

const goToPage = (n) => {
  if (!pdfDocument) return
  page.value = Math.min(Math.max(1, n), numPages.value)
}

const setScale = (value) => {
  scale.value = Math.max(0.2, Math.min(5, value))
}

const toggleFullscreen = () => {
  if (!container.value) return
  if (!document.fullscreenElement) {
    container.value.requestFullscreen().catch(() => {})
  } else {
    document.exitFullscreen().catch(() => {})
  }
}

const toggleOutline = () => {
  outlineOpen.value = !outlineOpen.value
}

const goToOutline = async (item) => {
  if (!item.dest) return
  const dest = await pdfDocument.getDestination(item.dest)
  if (!dest) return
  const pageNumber = typeof dest[0] === 'object' ? dest[0].num : dest[0]
  goToPage(pageNumber)
  outlineOpen.value = false
}

onMounted(loadPdf)

watch(() => props.src, loadPdf)
watch(page, renderPage)
watch(scale, renderPage)
</script>

<script>
export default {
  components: {
    PdfOutline: {
      props: ['items'],
      emits: ['navigate'],
      template: `
        <ul class="outline-children">
          <li v-for="(item, idx) in items" :key="idx">
            <button class="outline-item" @click="$emit('navigate', item)">{{ item.title }}</button>
            <PdfOutline v-if="item.items?.length" :items="item.items" @navigate="$emit('navigate', $event)" />
          </li>
        </ul>
      `
    }
  }
}
</script>

<style scoped>
.pdf-viewer {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  margin-bottom: 12px;
}

.toolbar button,
.toolbar a {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-canvas-bg);
  color: var(--vp-c-foreground);
  padding: 4px 8px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.95em;
}

.toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar .page-controls,
.toolbar .zoom-controls,
.toolbar .actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-indicator,
.zoom-indicator {
  min-width: 60px;
  text-align: center;
}

.viewer {
  display: flex;
  width: 100%;
  position: relative;
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}

.pdf-canvas {
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.outline {
  width: 260px;
  max-height: 70vh;
  overflow: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-canvas-bg);
  margin-right: 12px;
  padding: 12px;
  transition: transform 0.25s ease;
}

.outline.open {
  transform: translateX(0);
}

.outline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  margin-bottom: 8px;
}

.outline ul,
.outline-children {
  list-style: none;
  padding-left: 0;
  margin: 4px 0;
}

.outline-item {
  cursor: pointer;
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  padding: 4px 0;
  font-size: 0.92em;
  color: var(--vp-c-foreground);
}

.outline-item:hover {
  text-decoration: underline;
}
</style>
