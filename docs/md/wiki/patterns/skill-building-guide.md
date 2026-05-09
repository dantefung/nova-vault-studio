---
title: "Skill 构建指南"
date: "2026-05-09"
---

# Skill 构建指南

> 从规划到测试到分发的完整 Skill 构建手册。

## Key Points

- 核心设计原则：递进式披露、可组合性、可测试性
- SKILL.md 是入口，通过 frontmatter 控制加载行为
- 支持 scripts/（可执行代码）、references/（文档）、assets/（资源）
- 测试方法：手动测试 + 自动化验证

## Details

### 构建流程

1. **规划**：确定 Skill 的触发条件和核心功能
2. **结构设计**：选择合适的设计模式
3. **编写 SKILL.md**：frontmatter + 指令正文
4. **添加资源**：scripts/、references/、assets/
5. **测试验证**：手动测试 + 边界情况验证
6. **分发共享**：打包发布或团队内部分发

### 最佳实践

- 一个 Skill 做一件事
- frontmatter description 要精准触发
- 指令要具体，避免模糊表述
- 提供示例和边界情况处理

## Related Pages

- [[products/claude-code-skills]]
- [[patterns/agent-skill-design-patterns]]

## Sources

- docs/md/guide/ai/skills/02-Claude-Skills-完整构建指南.md
