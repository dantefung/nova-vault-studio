# claude code deep dive xelatex

<script setup>
import PdfViewer from '../../../.vitepress/theme/components/PdfViewer.vue'
const pdfUrl = new URL('./claude-code-deep-dive-xelatex.pdf', import.meta.url).href
</script>

<PdfViewer :src="pdfUrl" />
