# manual

<script setup>
import PdfViewer from '../../../.vitepress/theme/components/PdfViewer.vue'
const pdfUrl = new URL('./manual.pdf', import.meta.url).href
</script>

<PdfViewer :src="pdfUrl" />
