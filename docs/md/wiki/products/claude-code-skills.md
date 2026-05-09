---
title: "Claude Code Skills"
date: "2026-05-09"
---

# Claude Code Skills

> Claude Code 的技能扩展系统，通过文件夹结构（SKILL.md + scripts/ + references/ + assets/）教会 Agent 处理特定任务。

## Key Points

- Skills 不只是 markdown 文件，是包含脚本、资源、数据的文件夹
- 九种类型：库参考、产品验证、代码生成、工作流编排等
- 三级递进式披露：YAML frontmatter → SKILL.md 正文 → 链接文件
- 支持 hooks 注册动态行为

## Details

### Skill 文件夹结构

```
skill-name/
├── SKILL.md          # 必须：YAML frontmatter + 指令
├── scripts/          # 可选：可执行代码
├── references/       # 可选：按需加载文档
└── assets/           # 可选：模板、字体、图标
```

### 三级递进式披露

1. **第一级（YAML frontmatter）**：始终加载，让 Claude 知道何时使用
2. **第二级（SKILL.md 正文）**：相关时加载，包含完整指令
3. **第三级（链接文件）**：按需浏览发现

## Related Pages

- [[patterns/agent-skill-design-patterns]]
- [[patterns/skill-building-guide]]
- [[concepts/harness-engineering]]

## Sources

- docs/md/guide/ai/skills/01-Claude-Code-Skills-实战经验.md
- docs/md/guide/ai/skills/02-Claude-Skills-完整构建指南.md
