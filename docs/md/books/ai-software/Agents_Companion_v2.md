---
title: "Agents Companion v2"
---

# Agents Companion v2

<script setup>
import PdfViewer from '../../../.vitepress/theme/components/PdfViewer.vue'
const pdfUrl = new URL('./Agents_Companion_v2.pdf', import.meta.url).href
</script>

<PdfViewer :src="pdfUrl" />
