<template>
  <div class="html-viewer" ref="container">
    <div class="toolbar">
      <div class="title">{{ title }}</div>
      <div class="actions">
        <button @click="toggleFullscreen" title="全屏">⛶</button>
        <a :href="src" target="_blank" rel="noreferrer" title="在新标签页打开">↗</a>
      </div>
    </div>

    <div
      ref="iframeWrapper"
      class="iframe-wrapper"
    >
      <iframe
        ref="iframe"
        :src="src"
        class="html-iframe"
        frameborder="0"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, default: 'HTML 内容' }
})

const container = ref(null)
const iframeWrapper = ref(null)
const iframe = ref(null)

const toggleFullscreen = () => {
  if (!container.value) return
  if (!document.fullscreenElement) {
    container.value.requestFullscreen().catch(() => {})
  } else {
    document.exitFullscreen().catch(() => {})
  }
}
</script>

<style scoped>
.html-viewer {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.html-viewer:fullscreen {
  width: 100vw;
  height: 100vh;
}

.html-viewer:fullscreen .iframe-wrapper {
  height: calc(100vh - 52px);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  margin-bottom: 12px;
}

.toolbar .title {
  font-weight: 600;
  padding: 0 4px;
}

.toolbar .actions {
  display: flex;
  align-items: center;
  gap: 4px;
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

.iframe-wrapper {
  width: 100%;
  height: calc(80vh - 80px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.html-iframe {
  width: 100%;
  height: 100%;
  display: block;
}
</style>