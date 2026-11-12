import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

/**
 * 全站内容加载器（自定义，替代 astro/loaders 的 glob）
 *
 * 为什么不直接用 glob loader：
 *   glob loader 会渲染每篇 markdown 以收集 metadata，其中 imagePaths 会被
 *   astro:assets 接管并做 sharp 优化。站内 464MB 图片里有大量 SVG，
 *   sharp 的元数据解析对部分 SVG 直接抛 NoImageMetadata，导致构建中断。
 *
 *   实际上这些图片早已压过（scripts/optimize-images.mjs + 500KB 钩子），
 *   并且要按 VitePress 时期的原路径提供（/md/.../images/x.png），
 *   不能走 Astro 的哈希化资源管线。
 *
 * 本 loader 的职责：
 *   - 扫描 docs/md 下的所有 markdown
 *   - 解析 frontmatter（gray-matter，宽容解析）
 *   - 产出 id（相对 base 的路径，不含扩展名）、body（正文）、data（frontmatter）
 *   - 不注册任何 image asset，图片由 public/ 直接提供
 *
 * id 规则：wiki/sources/foo、blog/index —— 与 astro glob loader 一致，
 * 便于 getStaticPaths 与 URL 映射逻辑复用。
 *
 * 注意：Astro 的 content store 在 digest 未变时会跳过写入，
 * 所以修��� loader 逻辑后必须清掉缓存（rm -rf node_modules/.astro .astro），
 * 否则旧的脏数据会被继续沿用。
 */
const docsLoader = {
  name: 'nova-docs-loader',
  async load({ store, logger, parseData, generateDigest, config }: any) {
    // config.root 是 astro-app/ 目录，内容源在仓库根的 docs/md/
    const base = new URL('../docs/md/', config.root)
    const basePath = fileURLToPath(base)

    if (!fs.existsSync(basePath)) {
      logger.warn(`内容目录不存在: ${basePath}`)
      return
    }

    const files: string[] = []
    const walk = (dir: string, rel: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.')) continue
        const full = path.join(dir, entry.name)
        const relPath = rel ? path.join(rel, entry.name) : entry.name
        if (entry.isDirectory()) {
          walk(full, relPath)
        } else if (entry.name.endsWith('.md')) {
          files.push(relPath.split(path.sep).join('/'))
        }
      }
    }
    walk(basePath, '')

    files.sort()

    for (const relPath of files) {
      const fullPath = path.join(basePath, relPath)
      const raw = fs.readFileSync(fullPath, 'utf8')
      const { content, data } = matter(raw)

      const id = relPath.replace(/\.md$/, '')
      // parseData 返回的是「解析并校验后的 data 本身」，不是 { data } 包装
      const parsedData = await parseData({ id, data, filePath: fullPath, digest: generateDigest(raw) })
      if (!parsedData) continue

      store.set({
        id,
        body: content,
        filePath: path.relative(fileURLToPath(config.root), fullPath),
        digest: generateDigest(raw),
        data: parsedData,
      })
    }

    logger.info(`内容加载完成: ${files.length} 篇文档`)
  },
}

export default docsLoader
