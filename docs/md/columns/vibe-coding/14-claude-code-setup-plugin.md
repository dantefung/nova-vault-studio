---
title: "Claude Code 官方自动化配置插件 claude-code-setup"
date: "2026-05-28"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/v79Rp0w9YQss__p7OtcdiQ"
author: "呱呱一号"
abstract: "Anthropic 官方插件 claude-code-setup 上线，扫描代码库后推荐 MCP servers、Skills、Hooks、Subagents、Slash Commands 五类自动化配置，帮助把 Claude Code 从「会写代码」升级为「持续交付」的半自动开发流水线。121,428 次安装。"
---

> 来源：[Claude Code 官方自动化配置插件上线，一步把项目最佳实践一次配齐](https://mp.weixin.qq.com/s/v79Rp0w9YQss__p7OtcdiQ)，作者 呱呱一号

---

## 插件是什么

Claude Code 最近悄悄上了个官方插件 `claude-code-setup`。

主要功能：先扫一遍代码库，再根据当前项目的情况，给出一套适合的 Claude Code 自动化建议，帮着把对应仓库最佳的 Skill、MCP 啥的直接配置好，对小白十分友好。

以前用 Claude Code，基本就是装完就问"你是什么模型"，能干活，但还是没有发挥更大的能力，主要就是周围那套工程化不知道怎么搭配。

## 五类建议

插件页写的是五类建议：**MCP servers、skills、hooks、subagents、slash commands**。

这五类正好对应 Claude Code 从"会写代码"走向"会持续交付"的五块骨架：

- **hooks** — 负责把检查、格式化、拦截危险操作这些流程自动化
- **skills** — 负责沉淀可复用的做事方法，不用每次从头说
- **MCP servers** — 负责把外部工具、文档、数据库、设计稿这些能力接进来
- **subagents** — 负责拆任务、保上下文、分角色干活
- **slash commands** — 负责把常用工作流压成一条命令

这几个东西单独看都不新鲜。但一旦配起来，Claude Code 的使用感受会完全不是一回事。

以前是"来，帮我做一下这个"。之后会慢慢变成"按这套工程规矩，自己把这类事做完"。

这就类似 harness 的能力了。这才是同样的人用同样的工具，但是还能拉开距离的关键。

## 插件只读

官方页面明确写了：**read-only mode**。

也就是说，它先做分析和建议，不会一上来就改项目文件。先扫描、先解释、再一步步配置，这个节奏比"我帮全自动装了"靠谱得多。

官方给的用法：

- 直接问它"为这个项目推荐自动化方案"
- 或者"帮助我设置 Claude Code"
- 如果只想看某一类，就单问"这个项目我应该使用什么 MCP"

默认会先给每类最值得装的 1 到 2 个建议。只问某一类时，再展开到 3 到 5 个。

## 安装方式

如果已经加过官方市场，直接装：

```
/plugin install claude-code-setup@claude-plugins-official
```

如果还没加过官方市场，先执行：

```
/plugin marketplace add anthropics/claude-plugins-official
/plugin install claude-code-setup@claude-plugins-official
```

截至 **2026 年 5 月 19 日**，已经有 **121,428** 次安装。

## 参考资料

- [Anthropic 官方插件页](https://claude.com/plugins/claude-code-setup)
- [Anthropic 官方博客《Customize Claude Code with plugins》](https://claude.com/blog/claude-code-plugins)
- [Anthropic 官方文档《Hooks reference》](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Anthropic 官方文档《Subagents》](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- [Anthropic 官方文档《Slash commands》](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [Claude Code Changelog](https://code.claude.com/docs/en/changelog)