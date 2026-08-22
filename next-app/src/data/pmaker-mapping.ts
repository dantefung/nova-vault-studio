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
  'basics/business-models.html': { src: 'pmaker-detail/basics__business-models.html', cat: 'basics' },
  'basics/industry-map.html': { src: 'pmaker-detail/basics__industry-map.html', cat: 'basics' },
  'basics/product-types.html': { src: 'pmaker-detail/basics__product-types.html', cat: 'basics' },
  'basics/roadmap.html': { src: 'pmaker-detail/basics__roadmap.html', cat: 'basics' },
  'basics/thinking-models.html': { src: 'pmaker-detail/basics__thinking-models.html', cat: 'basics' },
  'basics/tools.html': { src: 'pmaker-detail/basics__tools.html', cat: 'basics' },
  'basics/understand-tech.html': { src: 'pmaker-detail/basics__understand-tech.html', cat: 'basics' },
  'basics/what-pm-does.html': { src: 'pmaker-detail/basics__what-pm-does.html', cat: 'basics' },
  'learn/agent-drift.html': { src: 'pmaker-detail/learn__agent-drift.html', cat: 'ai-agent' },
  'learn/agent-eval.html': { src: 'pmaker-detail/learn__agent-eval.html', cat: 'ai-agent' },
  'learn/agent-layers.html': { src: 'pmaker-detail/learn__agent-layers.html', cat: 'ai-agent' },
  'learn/ai-code-vulns.html': { src: 'pmaker-detail/learn__ai-code-vulns.html', cat: 'ai-cost' },
  'learn/billing.html': { src: 'pmaker-detail/learn__billing.html', cat: 'ai-cost' },
  'learn/cache-savings.html': { src: 'pmaker-detail/learn__cache-savings.html', cat: 'ai-cost' },
  'learn/call-params.html': { src: 'pmaker-detail/learn__call-params.html', cat: 'ai-model' },
  'learn/compaction.html': { src: 'pmaker-detail/learn__compaction.html', cat: 'ai-context' },
  'learn/context-rot.html': { src: 'pmaker-detail/learn__context-rot.html', cat: 'ai-context' },
  'learn/cutoff.html': { src: 'pmaker-detail/learn__cutoff.html', cat: 'ai-model' },
  'learn/data-usage.html': { src: 'pmaker-detail/learn__data-usage.html', cat: 'ai-cost' },
  'learn/finetune-vs-rag.html': { src: 'pmaker-detail/learn__finetune-vs-rag.html', cat: 'ai-context' },
  'learn/hallucination.html': { src: 'pmaker-detail/learn__hallucination.html', cat: 'ai-model' },
  'learn/how-to-call.html': { src: 'pmaker-detail/learn__how-to-call.html', cat: 'ai-model' },
  'learn/human-boundary.html': { src: 'pmaker-detail/learn__human-boundary.html', cat: 'ai-cost' },
  'learn/image-cost.html': { src: 'pmaker-detail/learn__image-cost.html', cat: 'ai-cost' },
  'learn/industry-layers.html': { src: 'pmaker-detail/learn__industry-layers.html', cat: 'ai-basics' },
  'learn/long-memory.html': { src: 'pmaker-detail/learn__long-memory.html', cat: 'ai-context' },
  'learn/modality.html': { src: 'pmaker-detail/learn__modality.html', cat: 'ai-model' },
  'learn/model-access.html': { src: 'pmaker-detail/learn__model-access.html', cat: 'ai-basics' },
  'learn/model-providers.html': { src: 'pmaker-detail/learn__model-providers.html', cat: 'ai-basics' },
  'learn/model-selection.html': { src: 'pmaker-detail/learn__model-selection.html', cat: 'ai-model' },
  'learn/model-types.html': { src: 'pmaker-detail/learn__model-types.html', cat: 'ai-model' },
  'learn/not-search.html': { src: 'pmaker-detail/learn__not-search.html', cat: 'ai-model' },
  'learn/open-vs-closed.html': { src: 'pmaker-detail/learn__open-vs-closed.html', cat: 'ai-model' },
  'learn/params.html': { src: 'pmaker-detail/learn__params.html', cat: 'ai-model' },
  'learn/permissions.html': { src: 'pmaker-detail/learn__permissions.html', cat: 'ai-agent' },
  'learn/prompt-assets.html': { src: 'pmaker-detail/learn__prompt-assets.html', cat: 'ai-prompt' },
  'learn/prompt-injection.html': { src: 'pmaker-detail/learn__prompt-injection.html', cat: 'ai-cost' },
  'learn/prompt-layers.html': { src: 'pmaker-detail/learn__prompt-layers.html', cat: 'ai-agent' },
  'learn/prompt-markdown.html': { src: 'pmaker-detail/learn__prompt-markdown.html', cat: 'ai-prompt' },
  'learn/prompt-parts.html': { src: 'pmaker-detail/learn__prompt-parts.html', cat: 'ai-prompt' },
  'learn/prompt-roles.html': { src: 'pmaker-detail/learn__prompt-roles.html', cat: 'ai-prompt' },
  'learn/prompt-techniques.html': { src: 'pmaker-detail/learn__prompt-techniques.html', cat: 'ai-prompt' },
  'learn/rag-chunking.html': { src: 'pmaker-detail/learn__rag-chunking.html', cat: 'ai-context' },
  'learn/rag-fails.html': { src: 'pmaker-detail/learn__rag-fails.html', cat: 'ai-context' },
  'learn/rag.html': { src: 'pmaker-detail/learn__rag.html', cat: 'ai-context' },
  'learn/reasoning-models.html': { src: 'pmaker-detail/learn__reasoning-models.html', cat: 'ai-model' },
  'learn/retrieval-methods.html': { src: 'pmaker-detail/learn__retrieval-methods.html', cat: 'ai-context' },
  'learn/similarity.html': { src: 'pmaker-detail/learn__similarity.html', cat: 'ai-context' },
  'learn/token.html': { src: 'pmaker-detail/learn__token.html', cat: 'ai-model' },
  'learn/train-vs-infer.html': { src: 'pmaker-detail/learn__train-vs-infer.html', cat: 'ai-model' },
  'learn/training-data.html': { src: 'pmaker-detail/learn__training-data.html', cat: 'ai-model' },
  'learn/verify-answer.html': { src: 'pmaker-detail/learn__verify-answer.html', cat: 'ai-cost' },
  'patterns/ai-can-cannot.html': { src: 'pmaker-detail/patterns__ai-can-cannot.html', cat: 'xiezuo' },
  'patterns/ai-code-check.html': { src: 'pmaker-detail/patterns__ai-code-check.html', cat: 'yanzheng' },
  'patterns/alignment.html': { src: 'pmaker-detail/patterns__alignment.html', cat: 'jiemian' },
  'patterns/backlog-priority.html': { src: 'pmaker-detail/patterns__backlog-priority.html', cat: 'faxian' },
  'patterns/borrow-form.html': { src: 'pmaker-detail/patterns__borrow-form.html', cat: 'dingyi' },
  'patterns/card-sorting.html': { src: 'pmaker-detail/patterns__card-sorting.html', cat: 'jiegou' },
  'patterns/components-first.html': { src: 'pmaker-detail/patterns__components-first.html', cat: 'jiemian' },
  'patterns/connect-business.html': { src: 'pmaker-detail/patterns__connect-business.html', cat: 'dingyi' },
  'patterns/content-inventory.html': { src: 'pmaker-detail/patterns__content-inventory.html', cat: 'jiegou' },
  'patterns/context-budget.html': { src: 'pmaker-detail/patterns__context-budget.html', cat: 'xiezuo' },
  'patterns/data-model-first.html': { src: 'pmaker-detail/patterns__data-model-first.html', cat: 'jiegou' },
  'patterns/definition-three-parts.html': { src: 'pmaker-detail/patterns__definition-three-parts.html', cat: 'dingyi' },
  'patterns/design-system.html': { src: 'pmaker-detail/patterns__design-system.html', cat: 'jiemian' },
  'patterns/first-run.html': { src: 'pmaker-detail/patterns__first-run.html', cat: 'jiaohu' },
  'patterns/five-whys.html': { src: 'pmaker-detail/patterns__five-whys.html', cat: 'faxian' },
  'patterns/grouping-naming.html': { src: 'pmaker-detail/patterns__grouping-naming.html', cat: 'jiegou' },
  'patterns/hint-types.html': { src: 'pmaker-detail/patterns__hint-types.html', cat: 'jiaohu' },
  'patterns/nav-forms.html': { src: 'pmaker-detail/patterns__nav-forms.html', cat: 'jiegou' },
  'patterns/need-sources.html': { src: 'pmaker-detail/patterns__need-sources.html', cat: 'faxian' },
  'patterns/north-star-split.html': { src: 'pmaker-detail/patterns__north-star-split.html', cat: 'yanzheng' },
  'patterns/not-doing-list.html': { src: 'pmaker-detail/patterns__not-doing-list.html', cat: 'dingyi' },
  'patterns/one-screen-one-job.html': { src: 'pmaker-detail/patterns__one-screen-one-job.html', cat: 'jiegou' },
  'patterns/permission-as-view.html': { src: 'pmaker-detail/patterns__permission-as-view.html', cat: 'jiaohu' },
  'patterns/real-data-stress.html': { src: 'pmaker-detail/patterns__real-data-stress.html', cat: 'yanzheng' },
  'patterns/real-data.html': { src: 'pmaker-detail/patterns__real-data.html', cat: 'yanzheng' },
  'patterns/real-vs-fake.html': { src: 'pmaker-detail/patterns__real-vs-fake.html', cat: 'faxian' },
  'patterns/responsive.html': { src: 'pmaker-detail/patterns__responsive.html', cat: 'jiemian' },
  'patterns/roadmap-blueprint.html': { src: 'pmaker-detail/patterns__roadmap-blueprint.html', cat: 'dingyi' },
  'patterns/rules-distilled.html': { src: 'pmaker-detail/patterns__rules-distilled.html', cat: 'xiezuo' },
  'patterns/scene-anchor.html': { src: 'pmaker-detail/patterns__scene-anchor.html', cat: 'faxian' },
  'patterns/spec-prompt-rules.html': { src: 'pmaker-detail/patterns__spec-prompt-rules.html', cat: 'xiezuo' },
  'patterns/state-checklist.html': { src: 'pmaker-detail/patterns__state-checklist.html', cat: 'jiaohu' },
  'patterns/thin-slice.html': { src: 'pmaker-detail/patterns__thin-slice.html', cat: 'dingyi' },
  'patterns/three-part-prompt.html': { src: 'pmaker-detail/patterns__three-part-prompt.html', cat: 'xiezuo' },
  'patterns/track-before-launch.html': { src: 'pmaker-detail/patterns__track-before-launch.html', cat: 'yanzheng' },
  'patterns/type-scale.html': { src: 'pmaker-detail/patterns__type-scale.html', cat: 'jiemian' },
  'patterns/undoable.html': { src: 'pmaker-detail/patterns__undoable.html', cat: 'jiaohu' },
  'patterns/user-journey.html': { src: 'pmaker-detail/patterns__user-journey.html', cat: 'jiaohu' },
  'patterns/web-vs-mobile.html': { src: 'pmaker-detail/patterns__web-vs-mobile.html', cat: 'jiegou' },
  'patterns/what-is-context.html': { src: 'pmaker-detail/patterns__what-is-context.html', cat: 'xiezuo' },
  'patterns/wide-shallow.html': { src: 'pmaker-detail/patterns__wide-shallow.html', cat: 'jiegou' },
  'patterns/wording.html': { src: 'pmaker-detail/patterns__wording.html', cat: 'jiaohu' },

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