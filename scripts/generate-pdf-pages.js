import fs from 'fs'
import path from 'path'

const bookRoot = path.join(process.cwd(), 'docs/md/books')

if (!fs.existsSync(bookRoot)) {
  console.warn('Books directory not found:', bookRoot)
  process.exit(0)
}

const dirs = fs.readdirSync(bookRoot).filter(name => {
  const full = path.join(bookRoot, name)
  return fs.statSync(full).isDirectory()
})

const normalizeName = (name) => name.replace(/[-_]+/g, ' ')

for (const dir of dirs) {
  const fullDir = path.join(bookRoot, dir)
  const pdfFiles = fs.readdirSync(fullDir).filter(f => f.toLowerCase().endsWith('.pdf'))

  // 1) Ensure there is an index.md that renders a PDF list for this folder
  //    If index.md already exists, keep it so users can add custom text.
  const indexMdPath = path.join(fullDir, 'index.md')
  if (!fs.existsSync(indexMdPath)) {
    const title = normalizeName(dir)
    const indexContent = `---
title: ${title}
---

# ${title}

> 📖 在此处写一些本书的简介（例如用途、章节概览、阅读建议等）。
>
> 你也可以添加封面图，例如：
>
> \`\`\`md
> ![封面](./cover.png)
> \`\`\`
>
<PdfList dir="${dir}" />
`
    fs.writeFileSync(indexMdPath, indexContent, 'utf8')
  }

  // 2) Create individual markdown pages for each PDF so it can be linked directly.
  //    If the markdown file already exists, do not overwrite it so it can be customized.
  pdfFiles.forEach(file => {
    const base = file.replace(/\.pdf$/i, '')
    const mdPath = path.join(fullDir, `${base}.md`)

    const mdContent = `# ${normalizeName(base)}

<script setup>
import PdfViewer from '../../../.vitepress/theme/components/PdfViewer.vue'
const pdfUrl = new URL('./${file}', import.meta.url).href
</script>

<PdfViewer :src="pdfUrl" />
`

    // If the page doesn't exist, create it.
    // If it exists but uses the older URL construction approach, update it.
    if (!fs.existsSync(mdPath)) {
      fs.writeFileSync(mdPath, mdContent, 'utf8')
      return
    }

    const existing = fs.readFileSync(mdPath, 'utf8')
    const needsUpdate = !existing.includes('import PdfViewer') || !existing.includes('new URL(')
    if (needsUpdate) {
      fs.writeFileSync(mdPath, mdContent, 'utf8')
    }
  })
}


console.log(`Generated PDF pages for ${dirs.length} book folder(s)`)
