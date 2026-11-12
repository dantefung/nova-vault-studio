---
title: "AI Coding Delivery (AI 研发交付)"
date: "2026-08-06"
source: "物流技术 公众号"
---

# AI Coding Delivery (AI 研发交付)

> 复杂业务团队中，通过分层知识库 + 文件化 RD 流程 + 前置质量门禁，让 AI 负责分析和实现、人聚焦关键判断的研发交付方法论。

## 核心洞察

- **不追求 100% 全 AI 交付**：AI 负责分析、拆解、实现，人聚焦关键判断和 review，避免"全自动化"的幻觉
- **工具可换，沉淀不可换**：真正值得打磨的是业务知识、应用边界、研发规范、质量门禁，而非某个特定工具
- **渐进式上下文加载**：AI 在正确阶段读取正确粒度的上下文，避免被不重要的信息影响实现方向
- **错误知识比没有知识更危险**：所有知识必须经过 candidate → owner review → official 的流转路径

## 三层架构

| 层级 | 内容 | 职责 |
|------|------|------|
| 命令协议层 | `.agents/commands/` + `.agents/skills/` | 定义 `/kb:*` 和 `/rd:*` 命令的工作方式 |
| 知识资产层 | `knowledge/` | 沉淀正式知识、候选知识、个人经验、模板、路由 |
| RD 过程资产层 | `rd/requirements/{requirementId}/` | 每个需求从输入到发布的全过程产物 |

## 分层知识库设计

```
knowledge/
├── main/           # 跨应用通用知识（术语、全局约束、跨应用流程）
├── applications/   # 应用级知识（product/solution/base/tech 四层）
├── candidate/      # 候选知识暂存区（标注来源、证据、可信度）
├── personal/       # 个人经验（踩坑记录、排查思路）
├── template/       # 强约束知识模板（YAML Front Matter 驱动）
├── ROUTING.md      # 知识路由：关键词 → 应用 → 知识入口 → 代码路径
└── KNOWLEDGE-RULES.md
```

## RD 流程核心命令链

```
需求/PRD/Bug → /rd:verify-prd → /rd:work(路由) → /rd:clarify
  → /rd:analyze → /rd:decompose → /rd:verify-requirement
  → 编码 → /rd:apply → /rd:validate → /rd:code-review
  → /rd:release-plan → 发布 → 知识回补
```

## 质量门禁哲学

前置 fail-fast：能在 PRD 阶段暴露的问题，不拖到 requirement；能在 requirement 阶段暴露的问题，不拖到编码。

两个关键门禁：
- `/rd:verify-prd`：检查 PRD 的完整性（状态码、协议、验收标准等）
- `/rd:verify-requirement`：进入编码前的最终确认（目标、影响范围、知识入口、代码入口）

## 相关页面

- [[concepts/harness-engineering]] — AI 工程化实践，RD 流程的上层框架
- [[concepts/llm-wiki]] — 知识库模式，与分层知识库设计互补
- [[concepts/ai-asset-map]] — AI 资产地图，与知识资产管理相关
- [[concepts/engineering-skills]] — 工程技能，RD 流程中的 skills 设计
- [[concepts/agent-skill]] — Agent Skill 体系，与命令协议层相关