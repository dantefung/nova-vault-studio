# k8s sample

<script setup>
import PdfViewer from '../../../.vitepress/theme/components/PdfViewer.vue'
const pdfUrl = new URL('./k8s_sample.pdf', import.meta.url).href
</script>

<PdfViewer :src="pdfUrl" />
