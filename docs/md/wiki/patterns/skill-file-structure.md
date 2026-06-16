---
title: "Skill File Structure"
date: "2026-06-12"
source: "Agent skill 迭代式编写实战"
url: "https://mp.weixin.qq.com/s/59Z2eVOg914_bpRD6-WsYg"
---

# Skill File Structure

Skill 基于文件系统驱动，标准目录结构如下：

```
skill-name/
├── SKILL.md          # 核心文件
├── references/       # 补充文档
│   ├── template.md
│   └── detailed-spec.md
└── scripts/          # 执行脚本
    ├── deploy.sh
    └── validate.py
```

## SKILL.md 结构

由两部分组成：

### YAML frontmatter

skill 的元数据，agent 通过此判断是否触发。

```yaml
---
name: "example-skill"
description: "当用户说 XXX 时触发，适用于 YYY 场景"
---
```

### Markdown 正文

面向 agent 的执行 SOP，建议用「总-分」结构：
1. 先说核心规则
2. 再展开约束细节

## references/ 目录

放补充文档，如模板文件、详细规范、示例代码等。在 SKILL.md 中通过路径按需引用，不要把大量内容堆进主文件。

## scripts/ 目录

放确定性操作的执行脚本（Python/Bash 等）。

**原则**：能写成脚本的就不要靠 agent 推理——脚本的稳定性和可复现性远高于让 agent 猜。

## 扩展资源

- [如何处理带有三方库依赖的 python 脚本：uv run + pep 723](https://docs.astral.sh/uv/guides/scripts/)
