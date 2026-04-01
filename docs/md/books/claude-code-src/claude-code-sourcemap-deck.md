# claude code sourcemap deck

<script setup>
import PdfViewer from '../../../.vitepress/theme/components/PdfViewer.vue'
const pdfUrl = new URL('./claude-code-sourcemap-deck.pdf', import.meta.url).href
</script>

<PdfViewer :src="pdfUrl" />
