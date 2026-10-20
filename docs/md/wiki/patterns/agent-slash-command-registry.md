---
title: "Agent Slash Command 注册与覆盖模式"
date: "2026-10-20"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/NXBuk7227ST9C4Id5qlL2Q"
---

# Agent Slash Command 注册与覆盖模式

> 将高频 Prompt 作为 Markdown 命令文件管理，以共享解析器、分层注册表、确定性覆盖、调用时参数展开和全量热重载构成轻量命令系统。

## File Contract

```text
command.md
├── YAML Frontmatter
│   ├── name          required, unique within effective registry
│   └── description   required for discovery and errors
└── Prompt body       required, preserved as template
```

推荐在加载阶段检查：

- Frontmatter 是否闭合且可解析。
- `name` 和 `description` 是否存在。
- Prompt 正文是否非空。
- 命令名是否符合允许的字符规范。
- 同一层级中的重复定义是否需要报警。

## Resolution Order

```text
register built-ins
  -> load global command files
  -> load project command files
  -> later definition wins
```

该顺序让系统提供稳定默认值，同时允许用户和项目逐层定制。若不希望用户覆盖安全关键的内置命令，应将其标记为保留命令并在注册时拒绝覆盖，而不是依赖文档约定。

## Expansion Contract

- `$1`、`$2`：位置参数。
- `${2:-default}`：缺失时使用默认值。
- 模板在注册表中保持原样，调用时才展开。
- 缺少无默认值的必填参数时，应返回结构化用法错误。
- 参数替换只处理模板变量，不把展开结果重新解释为系统级配置。

## Reload Algorithm

```text
/reload
  -> parse every command file into a temporary registry
  -> validate the complete candidate registry
  -> atomically replace the active registry
  -> report loaded commands and rejected files
```

原文实现采用先清空再加载。生产化实现更适合先构建临时注册表，全部验证成功后再原子替换，避免单个坏文件让运行中的命令全部消失。

## Commands Versus Skills

- Command 是用户主动选择的任务入口，关注输入复用与可发现性。
- Skill 是模型按任务上下文加载的能力说明，关注推理与执行规则。
- Command 可以启动一个任务，Skill 可以在任务内部约束如何完成。
- 不应因为二者都以 Prompt 表达，就混淆触发权和生命周期。

## Security Notes

命令文件属于可执行指令供应链的一部分：

- 项目命令可能覆盖全局行为，加载陌生仓库时应显示来源和覆盖关系。
- 命令模板不应自动获得额外工具权限。
- 对来自仓库的命令执行敏感操作前，仍需运行时授权和人工门禁。
- 注册表日志应记录命令来源文件，方便审计冲突与投毒。

## Related Pages

- [[sources/zeroagent-slash-commands]]
- [[concepts/harness-engineering]]
- [[patterns/agent-runtime-safety-guardrails]]
