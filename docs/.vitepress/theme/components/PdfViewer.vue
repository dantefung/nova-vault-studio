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
      <aside v-show="outlineOpen" class="outline">
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

      <div
        ref="canvasWrapper"
        class="canvas-wrapper"
        @wheel="handleWheel"
        @scroll="handleScroll"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
      >
        <div v-if="error" class="pdf-error">
          <strong>PDF 加载失败：</strong> {{ error }}
          <div>请确认文件名是否允许 URL 编码，例如避免特殊字符。</div>
        </div>
        <canvas v-else ref="canvas" class="pdf-canvas" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import PdfOutline from './PdfOutline.vue'

let getDocument
let GlobalWorkerOptions

const loadPdfJs = async () => {
  if (getDocument) return
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const workerUrl = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')
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
const canvasWrapper = ref(null)

const page = ref(props.page)
const scale = ref(props.scale)
const numPages = ref(0)
const outline = ref(null)
const outlineOpen = ref(false)
const error = ref(null)

let pdfDocument = null
let pendingScrollPosition = 'top'
let lastScrollTop = 0
let touchState = null
let isProgrammaticScroll = false

const EDGE_THRESHOLD = 24

const loadPdf = async () => {
  if (!props.src) return
  error.value = null
  pendingScrollPosition = 'top'
  await loadPdfJs()
  try {
    const loadingTask = getDocument(props.src)
    pdfDocument = await loadingTask.promise
    numPages.value = pdfDocument.numPages
    outline.value = await pdfDocument.getOutline()
    renderPage()
  } catch (e) {
    error.value = e?.message || String(e)
    console.error('PDF load error:', e)
  }
}

const renderPage = async () => {
  if (!pdfDocument || !canvas.value) return
  const pdfPage = await pdfDocument.getPage(page.value)
  const viewport = pdfPage.getViewport({ scale: scale.value })
  const ctx = canvas.value.getContext('2d')
  canvas.value.height = viewport.height
  canvas.value.width = viewport.width
  await pdfPage.render({ canvasContext: ctx, viewport }).promise
  await nextTick()
  syncScrollPosition()
}

const goToPage = (n, options = {}) => {
  if (!pdfDocument) return
  pendingScrollPosition = options.scrollTo ?? 'top'
  page.value = Math.min(Math.max(1, n), numPages.value)
}

const setScale = (value) => {
  scale.value = Math.max(0.2, Math.min(5, value))
}

const syncScrollPosition = () => {
  if (!canvasWrapper.value) return

  isProgrammaticScroll = true
  canvasWrapper.value.scrollTop =
    pendingScrollPosition === 'bottom' ? canvasWrapper.value.scrollHeight : 0
  lastScrollTop = canvasWrapper.value.scrollTop
  pendingScrollPosition = 'top'

  requestAnimationFrame(() => {
    isProgrammaticScroll = false
  })
}

const changePageFromEdge = (direction) => {
  if (direction > 0 && page.value < numPages.value) {
    goToPage(page.value + 1, { scrollTo: 'top' })
  } else if (direction < 0 && page.value > 1) {
    goToPage(page.value - 1, { scrollTo: 'bottom' })
  }
}

const handleWheel = (event) => {
  const wrapper = canvasWrapper.value
  if (!wrapper || event.ctrlKey) return

  const atTop = wrapper.scrollTop <= EDGE_THRESHOLD
  const atBottom =
    wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight - EDGE_THRESHOLD

  if (event.deltaY > 0 && atBottom) {
    event.preventDefault()
    changePageFromEdge(1)
  } else if (event.deltaY < 0 && atTop) {
    event.preventDefault()
    changePageFromEdge(-1)
  }
}

const handleScroll = () => {
  const wrapper = canvasWrapper.value
  if (!wrapper || isProgrammaticScroll || touchState?.pinching) return

  const currentTop = wrapper.scrollTop
  const movingDown = currentTop > lastScrollTop
  const movingUp = currentTop < lastScrollTop
  const atTop = currentTop <= EDGE_THRESHOLD
  const atBottom =
    currentTop + wrapper.clientHeight >= wrapper.scrollHeight - EDGE_THRESHOLD

  lastScrollTop = currentTop

  if (movingDown && atBottom) {
    changePageFromEdge(1)
  } else if (movingUp && atTop) {
    changePageFromEdge(-1)
  }
}

const getTouchDistance = (touches) => {
  const [firstTouch, secondTouch] = touches
  return Math.hypot(
    firstTouch.clientX - secondTouch.clientX,
    firstTouch.clientY - secondTouch.clientY
  )
}

const handleTouchStart = (event) => {
  if (event.touches.length !== 2) return

  touchState = {
    pinching: true,
    startDistance: getTouchDistance(event.touches),
    startScale: scale.value
  }
}

const handleTouchMove = (event) => {
  if (event.touches.length !== 2 || !touchState?.pinching) return

  event.preventDefault()
  const currentDistance = getTouchDistance(event.touches)
  const nextScale = touchState.startScale * (currentDistance / touchState.startDistance)
  setScale(nextScale)
}

const handleTouchEnd = (event) => {
  if (event.touches.length < 2) {
    touchState = null
  }
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
  if (!pdfDocument || !item.dest) return
  try {
    const dest = await pdfDocument.getDestination(item.dest)
    if (!dest || !dest.length) return
    
    // dest[0] could be either a page object or page number
    let pageNumber
    if (typeof dest[0] === 'object' && dest[0].num !== undefined) {
      pageNumber = dest[0].num + 1 // page numbers are 0-indexed in PDF.js
    } else if (typeof dest[0] === 'number') {
      pageNumber = dest[0] + 1
    } else {
      return
    }
    
    goToPage(pageNumber, { scrollTo: 'top' })
    outlineOpen.value = false
  } catch (e) {
    console.warn('Failed to navigate to outline item:', e)
  }
}

onMounted(loadPdf)

watch(() => props.src, loadPdf)
watch(page, renderPage)
watch(scale, renderPage)
</script>

<style scoped>
.pdf-viewer {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.pdf-viewer:fullscreen {
  width: 100vw;
  height: 100vh;
  flex: 1;
}

.pdf-viewer:fullscreen .toolbar {
  margin-bottom: 0;
  border-radius: 0;
}

.pdf-viewer:fullscreen .viewer {
  height: calc(100vh - 60px);
}

.pdf-viewer:fullscreen .canvas-wrapper {
  max-height: calc(100vh - 60px);
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
  align-items: flex-start;
  padding: 8px;
  overflow: auto;
  max-height: calc(80vh - 120px);
  width: 100%;
  min-height: 300px;
  overscroll-behavior: contain;
}

.pdf-canvas {
  display: block;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.pdf-error {
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: rgba(255, 100, 80, 0.08);
  color: var(--vp-c-danger);
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
}


.outline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  margin-bottom: 8px;
}

.outline ul {
  list-style: none;
  padding-left: 12px;
  margin: 4px 0;
}

</style>
