---
title: "DeepSeek Harness 完全指南：从浏览器应用到 219 包插件树"
date: "2026-08-15"
source: "X (Twitter)：@phosphenq"
url: "https://x.com/phosphenq/status/2088709619279372749"
---

# DeepSeek Harness 完全指南：从浏览器应用到 219 包插件树

## 核心结论

DeepSeek 开源的 Harness 是一套浏览器优先（而非终端）的 Agent harness：MIT 许可证、默认安装 133 个插件、一份 config 文件就能关闭任意插件（包括 sidebar 和 agent loop）。本指南从运行实例写就，覆盖安装、配置、profile/preset/plugin、Trajectory 视图、MCP 接入等全套操作，并澄清了 DSH 与 Claude Code/Codex 的关键差异。

## 关键洞察

1. **DSH 是浏览器应用，不是终端应用**：`npx @deepseek-ai/dsh web` 在终端启动 server，浏览器访问 `http://127.0.0.1:3080` 才是真正的 UI。终端只用于启动，必须保持终端窗口开着。
2. **唯一的终端选项是一次性而非交互**：`dsh --profile headless "run the tests and fix what fails"` 跑完一个 session、打印最终答案、退出。DSH 只 ship 两个 profile：`web` 和 `headless`，其他必须自己用 `dsh plugin` 创建。
3. **Harness = 模型周围的一切**：可调用的工具、能访问的文件和 shell、记忆的日志、让模型持续运行的 loop；模型本身只是插件之一。
4. **config 替代补丁**：DSH 提供一份 config 文件能关闭任意插件，包括 sidebar 和 agent loop 本身——这与 Claude Code/Codex 这类黑盒终端产品形成鲜明对比。
5. **npm 缓存锁陷阱**：`npx` 偶发报 `ECOMPROMISED` 不是包本身的问题，而是 npm 缓存锁陈旧，需要清缓存重试。
6. **Trajectory 视图是 DSH 的差异化**：UI 中直接暴露模型请求、tool 列表、token 用量、缓存命中、Agent 运行轨迹，是研究 Agent 工作机制的最佳场所。
7. **profile 是插件树组合**：每个 profile 是一份被命名的插件清单 +权限边界；不同 profile 可彻底改变 Agent 的能力外观（如 minimal/standard/code/cordis）。
8. **MCP 接入走配置而非代码**：MCP server 注册以 `mcp__<server>__<tool>` 命名空间添加 tool，断线指数退避重连，HMR 热插拔，无需改插件代码。
9. **schema 不是静态可知的**：文档完整目录（1873 行）由启动每个工具插件后读 `ctx.tools.schemas()` 生成；新增 tool 包却漏进目录会被 glob 门禁直接拒绝。
10. **新会话默认 `workspace-write`**：Bash 和文件系统写限制在工作区加平台临时目录，但**读、网络访问、进程可见性并不受限**；遥测默认关闭且发行版没有内置脱敏规则。

## 值得保留的判断

- **DSH 的可观察性是被低估的差异化**：模型请求 + tool + token + 缓存 + 轨迹全暴露，是少数能用于 Agent 工作机制研究的开源 harness。
- **Headless profile 不是装饰品**：headless `completed` exit 0 / 失败 exit 1、stdout 是最后文本、不开监听端口，是无人值守场景的最简路径。
- **Plugin 注册是声明式**：每个插件在 package.json 声明自己是 bundle，配 cordis.patch.yml，profile 拉取即可——无需 fork 核心代码。

## 疑点与边界

- **预发布阶段 API 可能破坏性变更**：与官方定位一致，本指南基于 v0.1.0-rc.5 编写，配置 schema 和 plugin API 不保证稳定。
- **本地 +沙箱**用 Linux bwrap/Landlock、macOS Seatbelt、Windows ACL 令牌；容器化 runner 里 bwrap 可能受限，需降级为 `danger-full-access`。
- **安全默认**：读/网络/进程可见性不限意味着工作目录外的文件可能被读到，临时 Plugin 信任等级等同于 Bash，node:vm 不构成 security boundary。

## Related Pages

- [[products/deepseek-harness]]
- [[summaries/dsh-tech-hype-or-not]]
- [[summaries/deepseek-harness-plugin-first-agent-runtime]]
- [[patterns/plugin-first-agent-runtime]]
- [[patterns/dsh-four-modes]]
- [[concepts/harness-engineering]]
- [[concepts/deepseek-harness-agent-formula]]
- [[summaries/dsh-vs-continuum-acp]]

## Sources

- [[sources/dsh-complete-guide]]