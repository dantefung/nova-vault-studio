import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const root = process.cwd()
const docsDir = path.join(root, 'docs', 'md')
const definitionPattern = /^\[([^\]]+)\]:data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/]+={0,2})\r?$/gm
const extensionByType = { png: 'png', jpeg: 'jpg', webp: 'webp', gif: 'gif' }
const maxSize = 500 * 1024
const signatures = {
  png: (data) => data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  jpeg: (data) => data.subarray(0, 3).equals(Buffer.from([255, 216, 255])),
  webp: (data) => data.subarray(0, 4).toString() === 'RIFF' && data.subarray(8, 12).toString() === 'WEBP',
  gif: (data) => ['GIF87a', 'GIF89a'].includes(data.subarray(0, 6).toString()),
}

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return markdownFiles(fullPath)
    return entry.name.endsWith('.md') ? [fullPath] : []
  })
}

function articleDirectory(file) {
  const basename = path.basename(file, '.md')
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return path.join(path.dirname(file), 'images', basename)
}

function optimizeImage(file) {
  if (fs.statSync(file).size <= maxSize) return

  const extension = path.extname(file).toLowerCase()
  const originalFrames = extension === '.gif'
    ? Number(execFileSync('magick', ['identify', '-format', '%n\n', file], { encoding: 'utf8' }).trim().split('\n')[0])
    : 1
  const sizes = extension === '.gif'
    ? ['75%', '60%', '50%', '40%', '30%', '20%']
    : ['1600x1600>', '1400x1400>', '1200x1200>', '1000x1000>', '800x800>']

  for (const size of sizes) {
    const temporary = `${file}.optimized${extension}`
    const args = extension === '.gif'
      ? [file, '-coalesce', '-resize', size, '-colors', '64', '-layers', 'Optimize', temporary]
      : [file, '-auto-orient', '-resize', size, '-strip', '-colors', '256', '-quality', '82', temporary]

    execFileSync('magick', args, { stdio: 'inherit' })
    if (fs.statSync(temporary).size < fs.statSync(file).size) {
      fs.renameSync(temporary, file)
    } else {
      fs.rmSync(temporary)
    }
    if (fs.statSync(file).size <= maxSize) {
      if (extension === '.gif') {
        const optimizedFrames = Number(execFileSync('magick', ['identify', '-format', '%n\n', file], { encoding: 'utf8' }).trim().split('\n')[0])
        if (optimizedFrames !== originalFrames) {
          throw new Error(`GIF frame count changed during optimization: ${path.relative(root, file)}`)
        }
      }
      return
    }
  }

  if (fs.statSync(file).size > maxSize) {
    throw new Error(`Image remains above 500 KB after optimization: ${path.relative(root, file)}`)
  }
}

let filesChanged = 0
let imagesWritten = 0
let encodedBytesRemoved = 0

for (const file of markdownFiles(docsDir)) {
  const original = fs.readFileSync(file, 'utf8')
  const matches = [...original.matchAll(definitionPattern)]
  if (matches.length === 0) continue

  const outputDirectory = articleDirectory(file)
  const temporaryDirectory = `${outputDirectory}.extracting-${process.pid}`
  const temporaryMarkdown = `${file}.extracting-${process.pid}`
  const imagesByHash = new Map()
  let imageNumber = 0
  let outputCommitted = false

  try {
    const updated = original.replace(definitionPattern, (_, label, type, payload) => {
      const data = Buffer.from(payload, 'base64')
      if (data.toString('base64') !== payload || !signatures[type](data)) {
        throw new Error(`Invalid image/${type} data in ${path.relative(root, file)} (${label})`)
      }

      const hash = crypto.createHash('sha256').update(data).digest('hex')
      let filename = imagesByHash.get(hash)

      if (!filename) {
        imageNumber += 1
        filename = `p${String(imageNumber).padStart(2, '0')}.${extensionByType[type]}`
        const outputFile = path.join(temporaryDirectory, filename)
        fs.mkdirSync(temporaryDirectory, { recursive: true })
        fs.writeFileSync(outputFile, data, { flag: 'wx' })
        optimizeImage(outputFile)
        imagesByHash.set(hash, filename)
      }

      encodedBytesRemoved += payload.length
      const relativePath = path.relative(path.dirname(file), path.join(outputDirectory, filename)).split(path.sep).join('/')
      return `[${label}]:${relativePath}`
    })

    if (fs.existsSync(outputDirectory)) {
      throw new Error(`Refusing to overwrite existing image directory: ${path.relative(root, outputDirectory)}`)
    }
    fs.writeFileSync(temporaryMarkdown, updated, {
      flag: 'wx',
      mode: fs.statSync(file).mode,
    })
    fs.mkdirSync(path.dirname(outputDirectory), { recursive: true })
    fs.renameSync(temporaryDirectory, outputDirectory)
    outputCommitted = true
    try {
      fs.renameSync(temporaryMarkdown, file)
    } catch (error) {
      fs.rmSync(outputDirectory, { recursive: true, force: true })
      outputCommitted = false
      throw error
    }
    imagesWritten += imagesByHash.size
    filesChanged += 1
  } catch (error) {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true })
    fs.rmSync(temporaryMarkdown, { force: true })
    if (outputCommitted) fs.rmSync(outputDirectory, { recursive: true, force: true })
    throw error
  }
}

console.log(`Extracted ${imagesWritten} image(s) from ${filesChanged} Markdown file(s)`)
console.log(`Removed ${(encodedBytesRemoved / 1024 / 1024).toFixed(2)} MiB of Base64 text`)
