# AgenticSE Book CN

<script setup>
import PdfViewer from '../../../.vitepress/theme/components/PdfViewer.vue'
const pdfUrl = new URL('./AgenticSE_Book_CN.pdf', import.meta.url).href
</script>

<PdfViewer :src="pdfUrl" />
