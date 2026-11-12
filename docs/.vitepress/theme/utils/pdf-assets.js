import { resolvePdfUrl } from './pdf-url.js'

const localPdfs = import.meta.env.DEV
  ? import.meta.glob('../../../md/books/**/*.pdf', {
      eager: true,
      query: '?url',
      import: 'default'
    })
  : {}

const localUrls = Object.fromEntries(
  Object.entries(localPdfs).map(([filePath, url]) => [
    `docs/md/books/${filePath.replace('../../../md/books/', '')}`,
    url
  ])
)

export const getPdfUrl = (repoPath) =>
  resolvePdfUrl(repoPath, localUrls[repoPath])
