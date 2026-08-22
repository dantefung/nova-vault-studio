// PMaker 详情页 href → docs/md/ 路径映射
// 视觉壳复刻（详情页样式），内容用 docs/md/ 真实文章
// 没映射的 href 显示 PMaker 风格的 "待写" 占位页面

import { CATS } from './pmaker'

export type MappedArticle = {
  // docs/md/ 下相对路径（含 .md 后缀）
  src: string
  // 文章所属 cat id（决定 stage 头图渐变色）
  cat: string
}

// PMaker href → docs/md/ 路径 + cat id
export const PMAKER_MAPPING: Record<string, MappedArticle> = {
  // ── 学 AI · 基础认知 ────────────────────
  'learn/glossary.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'ai-basics' },
  'learn/history.html': { src: 'columns/cognition/programmer-underlying-thinking.md', cat: 'ai-basics' },
  'learn/current-state.html': { src: 'columns/ai-agent/pi-agent-principle-and-implementation.md', cat: 'ai-basics' },

  // ── 学 AI · 大模型 ────────────────────
  'learn/next-token.html': { src: 'columns/vibe-coding/04-02-diagram-prompt.md', cat: 'ai-model' },
  'learn/call_params.html': { src: 'columns/vibe-coding/04-01-vibe-prompts.md', cat: 'ai-model' },
  'learn/temperature.html': { src: 'columns/vibe-coding/01-vibe-coding-intro.md', cat: 'ai-model' },
  'learn/model_selection.html': { src: 'columns/ai-agent/pi-agent-principle-and-implementation.md', cat: 'ai-model' },

  // ── 学 AI · 提示词工程 ────────────────────
  'learn/what-is-prompt.html': { src: 'columns/vibe-coding/04-01-vibe-prompts.md', cat: 'ai-prompt' },
  'learn/few-shot.html': { src: 'columns/vibe-coding/03-01-clean-code.md', cat: 'ai-prompt' },
  'learn/output-format.html': { src: 'columns/vibe-coding/03-03-code-principle.md', cat: 'ai-prompt' },
  'learn/prompt-iterate.html': { src: 'columns/vibe-coding/04-01-vibe-prompts.md', cat: 'ai-prompt' },

  // ── 学 AI · 上下文与 RAG ────────────────────
  'learn/context-window.html': { src: 'columns/vibe-coding/02-01-spec-workflow.md', cat: 'ai-context' },
  'learn/embedding.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'ai-context' },

  // ── 学 AI · Agent 与 Skill ────────────────────
  'learn/tool-calling.html': { src: 'columns/ai-agent/pi-agent-principle-and-implementation.md', cat: 'ai-agent' },
  'learn/agent-loop.html': { src: 'columns/ai-agent/pi-agent-principle-and-implementation.md', cat: 'ai-agent' },
  'learn/skill-mcp.html': { src: 'columns/ai-agent/tw93-open-source-story.md', cat: 'ai-agent' },
  'learn/multi-agent.html': { src: 'columns/ai-agent/pi-agent-principle-and-implementation.md', cat: 'ai-agent' },

  // ── 学 AI · 成本与安全 ────────────────────
  'learn/what-to-trust.html': { src: 'columns/cognition/programmer-underlying-thinking.md', cat: 'ai-cost' },

  // ── 做产品 · 基础 ────────────────────
  'basics/what-pm.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'basics' },
  'basics/product-workflow.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'basics' },
  'basics/glossary.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'basics' },

  // ── 做产品 · 发现问题 ────────────────────
  'patterns/what-is-need.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'faxian' },
  'patterns/ask-behavior.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'faxian' },
  'patterns/existing-workaround.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'faxian' },
  'patterns/worth-doing.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'faxian' },
  'patterns/interview.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'faxian' },

  // ── 做产品 · 定义产品 ────────────────────
  'patterns/definition-three.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'dingyi' },
  'patterns/lifecycle.html': { src: 'columns/vibe-coding/02-02-linus-principle.md', cat: 'dingyi' },
  'patterns/one-sentence.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'dingyi' },
  'patterns/single-thread.html': { src: 'columns/cognition/programmer-underlying-thinking.md', cat: 'dingyi' },
  'patterns/narrow-audience.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'dingyi' },

  // ── 做产品 · 设计结构 ────────────────────
  'patterns/what-is-ia.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiegou' },
  'patterns/four-structures.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'jiegou' },
  'patterns/sitemap.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiegou' },
  'patterns/three-diagrams.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiegou' },

  // ── 做产品 · 设计交互 ────────────────────
  'patterns/interaction-basics.html': { src: 'columns/cognition/programmer-underlying-thinking.md', cat: 'jiaohu' },
  'patterns/common-components.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiaohu' },
  'patterns/four-states.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiaohu' },
  'patterns/feedback.html': { src: 'columns/vibe-coding/03-02-code-quality.md', cat: 'jiaohu' },
  'patterns/form-restraint.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'jiaohu' },

  // ── 做产品 · 设计界面 ────────────────────
  'patterns/visual-hierarchy.html': { src: 'columns/cognition/compositional-description-model.md', cat: 'jiemian' },
  'patterns/color-basics.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiemian' },
  'patterns/typography-basics.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiemian' },
  'patterns/spacing-scale.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiemian' },
  'patterns/one-accent.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiemian' },
  'patterns/whitespace-first.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'jiemian' },

  // ── 做产品 · 与 AI 协作 ────────────────────
  'patterns/spec-before-code.html': { src: 'columns/vibe-coding/02-01-spec-workflow.md', cat: 'xiezuo' },
  'patterns/one-thing-at-a-time.html': { src: 'columns/vibe-coding/03-01-clean-code.md', cat: 'xiezuo' },
  'patterns/reference-anchor.html': { src: 'columns/vibe-coding/04-02-diagram-prompt.md', cat: 'xiezuo' },
  'patterns/prototype-to-code.html': { src: 'columns/vibe-coding/02-01-spec-workflow.md', cat: 'xiezuo' },

  // ── 做产品 · 验证与迭代 ────────────────────
  'patterns/three-layers-of-validation.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'yanzheng' },
  'patterns/metrics-system.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'yanzheng' },
  'patterns/north-star.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'yanzheng' },
  'patterns/five-second-test.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'yanzheng' },
  'patterns/launch-checklist.html': { src: 'columns/content-engineering/dbs-content-system.md', cat: 'yanzheng' },
}

/**
 * 把 PMaker href（learn/glossary.html）解析到 (cat, src)
 * 没匹配返回 null
 */
export function resolvePMaker(href: string): MappedArticle | null {
  // href 可能是 'learn/glossary.html' 或 '/learn/glossary.html'
  const clean = href.replace(/^\//, '').replace(/\.html$/, '')
  return PMAKER_MAPPING[clean + '.html'] || PMAKER_MAPPING[clean] || null
}

/**
 * 把 PMaker cat id 转中文名（用于面包屑）
 */
export function catName(catId: string): string {
  return CATS[catId]?.name || catId
}