#!/usr/bin/env node
// 把 docs/md/ 下映射到的所有文章内容生成到 pmaker-content.ts
// 这样 CF Workers bundle 自带内容（不需要读 fs）

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const NEXT_APP = join(__dirname, '..')
const ROOT = join(NEXT_APP, '..')
const DOCS_MD = join(ROOT, 'docs', 'md')
const MAPPING_PATH = join(NEXT_APP, 'src/data/pmaker-mapping.ts')
const OUT_PATH = join(NEXT_APP, 'src/data/pmaker-content.ts')

// 直接 hardcode 映射（不用 import ts）
// 与 src/data/pmaker-mapping.ts PMAKER_MAPPING 保持一致
const PMAKER_MAPPING = {
  'learn/glossary.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'ai-basics' },
  'learn/history.html': { src: 'columns/cognition/programmer-underlying-thinking.md', cat: 'ai-basics' },
  'learn/current-state.html': { src: 'columns/ai-agent/pi-agent-principle-and-implementation.md', cat: 'ai-basics' },
  'learn/next-token.html': { src: 'columns/vibe-coding/04-02-diagram-prompt/04-02-diagram-prompt.md', cat: 'ai-model' },
  'learn/call_params.html': { src: 'columns/vibe-coding/04-01-vibe-prompts/04-01-vibe-prompts.md', cat: 'ai-model' },
  'learn/temperature.html': { src: 'columns/vibe-coding/01-vibe-coding-intro.md', cat: 'ai-model' },
  'learn/model_selection.html': { src: 'columns/ai-agent/pi-agent-principle-and-implementation.md', cat: 'ai-model' },
  'learn/what-is-prompt.html': { src: 'columns/vibe-coding/04-01-vibe-prompts/04-01-vibe-prompts.md', cat: 'ai-prompt' },
  'learn/few-shot.html': { src: 'columns/vibe-coding/03-01-clean-code/03-01-clean-code.md', cat: 'ai-prompt' },
  'learn/output-format.html': { src: 'columns/vibe-coding/03-03-code-principle/03-03-code-principle.md', cat: 'ai-prompt' },
  'learn/prompt-iterate.html': { src: 'columns/vibe-coding/04-01-vibe-prompts/04-01-vibe-prompts.md', cat: 'ai-prompt' },
  'learn/context-window.html': { src: 'columns/vibe-coding/02-01-spec-workflow/02-04-spec-workflow.md', cat: 'ai-context' },
  'learn/embedding.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'ai-context' },
  'learn/tool-calling.html': { src: 'columns/ai-agent/pi-agent-principle-and-implementation.md', cat: 'ai-agent' },
  'learn/agent-loop.html': { src: 'columns/ai-agent/pi-agent-principle-and-implementation.md', cat: 'ai-agent' },
  'learn/skill-mcp.html': { src: 'columns/ai-agent/tw93-open-source-story.md', cat: 'ai-agent' },
  'learn/multi-agent.html': { src: 'columns/ai-agent/pi-agent-principle-and-implementation.md', cat: 'ai-agent' },
  'learn/what-to-trust.html': { src: 'columns/cognition/programmer-underlying-thinking.md', cat: 'ai-cost' },
  'basics/what-pm.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'basics' },
  'basics/product-workflow.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'basics' },
  'basics/glossary.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'basics' },
  'patterns/what-is-need.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'faxian' },
  'patterns/ask-behavior.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'faxian' },
  'patterns/existing-workaround.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'faxian' },
  'patterns/worth-doing.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'faxian' },
  'patterns/interview.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'faxian' },
  'patterns/definition-three.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'dingyi' },
  'patterns/lifecycle.html': { src: 'columns/vibe-coding/02-02-linus-principle/02-02-linus-principle.md', cat: 'dingyi' },
  'patterns/one-sentence.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'dingyi' },
  'patterns/single-thread.html': { src: 'columns/cognition/programmer-underlying-thinking.md', cat: 'dingyi' },
  'patterns/narrow-audience.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'dingyi' },
  'patterns/what-is-ia.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiegou' },
  'patterns/four-structures.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'jiegou' },
  'patterns/sitemap.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiegou' },
  'patterns/three-diagrams.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiegou' },
  'patterns/interaction-basics.html': { src: 'columns/cognition/programmer-underlying-thinking.md', cat: 'jiaohu' },
  'patterns/common-components.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiaohu' },
  'patterns/four-states.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiaohu' },
  'patterns/feedback.html': { src: 'columns/vibe-coding/03-02-code-quality/03-02-code-quality.md', cat: 'jiaohu' },
  'patterns/form-restraint.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'jiaohu' },
  'patterns/visual-hierarchy.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'jiemian' },
  'patterns/color-basics.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiemian' },
  'patterns/typography-basics.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiemian' },
  'patterns/spacing-scale.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiemian' },
  'patterns/one-accent.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiemian' },
  'patterns/whitespace-first.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiemian' },
  'patterns/spec-before-code.html': { src: 'columns/vibe-coding/02-01-spec-workflow/02-04-spec-workflow.md', cat: 'xiezuo' },
  'patterns/one-thing-at-a-time.html': { src: 'columns/vibe-coding/03-01-clean-code/03-01-clean-code.md', cat: 'xiezuo' },
  'patterns/reference-anchor.html': { src: 'columns/vibe-coding/04-02-diagram-prompt/04-02-diagram-prompt.md', cat: 'xiezuo' },
  'patterns/prototype-to-code.html': { src: 'columns/vibe-coding/02-01-spec-workflow/02-04-spec-workflow.md', cat: 'xiezuo' },
  'patterns/three-layers-of-validation.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'yanzheng' },
  'patterns/metrics-system.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'yanzheng' },
  'patterns/north-star.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'yanzheng' },
  'patterns/five-second-test.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'yanzheng' },
  'patterns/launch-checklist.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'yanzheng' },
}

const entries = {}
let okCount = 0
let skipCount = 0
for (const [href, m] of Object.entries(PMAKER_MAPPING)) {
  const fullPath = join(DOCS_MD, m.src)
  if (existsSync(fullPath)) {
    try {
      const content = readFileSync(fullPath, 'utf-8')
      entries[href] = content
      okCount++
    } catch (e) {
      console.warn('  failed to read', href, '→', fullPath, ':', e.message)
      skipCount++
    }
  } else {
    console.warn('  missing file', href, '→', fullPath)
    skipCount++
  }
}

const out = `// AUTO-GENERATED by scripts/build-pmaker-content.mjs — DO NOT EDIT.
// Build-time embed of docs/md/ articles referenced by pmaker-mapping.ts.
// CF Workers cannot read fs at runtime, so all content must be in the bundle.

export const PMAKER_CONTENT: Record<string, string> = ${JSON.stringify(entries, null, 2)}
`

writeFileSync(OUT_PATH, out)
console.log(`\nWrote ${OUT_PATH}`)
console.log(`  articles: ${okCount} ok, ${skipCount} skipped`)
console.log(`  size: ${(JSON.stringify(entries).length / 1024).toFixed(1)} KB`)