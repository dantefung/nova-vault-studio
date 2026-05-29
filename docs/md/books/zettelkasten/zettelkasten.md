# zettelkasten

<script setup>
import PdfViewer from '../../../.vitepress/theme/components/PdfViewer.vue'
const pdfUrl = new URL('./zettelkasten.pdf', import.meta.url).href
</script>

<PdfViewer :src="pdfUrl" />
