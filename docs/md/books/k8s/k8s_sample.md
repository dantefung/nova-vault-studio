# k8s sample

<script setup>
const pdfUrl = new URL('./k8s_sample.pdf', import.meta.url).href
</script>

<PdfViewer :src="pdfUrl" />
