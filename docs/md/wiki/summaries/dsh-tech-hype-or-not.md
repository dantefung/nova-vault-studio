---
title: "DeepSeek Harness 是技术人自嗨炫技？——四种工作模式与 Cordis 插件架构"
date: "2026-08-18"
source: "微信公众号：轩辕之风"
url: "https://mp.weixin.qq.com/s/c_EtbD5fyq0vQXyVSxl35A"
---

# DeepSeek Harness 是技术人自嗨炫技？——四种工作模式与 Cordis 插件架构

## 核心结论

DeepSeek Harness（DSH）被部分用户批评为「技术人自嗨炫技」，作者在花时间研究后认为这种判断并不准确。DSH 不是消费级产品，而是官方定位明确的开发者预览版基础设施，其真正的差异化来自 Cordis 插件架构和四种可加载的工作模式，而非功能丰富度。

## 关键洞察

1. **Harness 是工程系统，不是产品功能**：负责管理工具、上下文、权限、校验、重试和运行记录；模型只会吐文字，工具提供能力，Harness 让「能干活的 Agent」变得「能把活干靠谱」。
2. **四种模式 = 四份插件清单**：DSH 四种工作模式（标准/PTC/极简/创造）不是四套程序，而是在同一个 Harness 里加载不同的 preset 配置；切换模式就是换插件组合。
3. **PTC（Programmatic Tool Calling）的本质**：把模型「组合工具」变成「写程序调度工具」，工具调用由代码串联而非模型逐步决策，能减少中间上下文与模型往返次数，但程序失败时反而会拖累效率。
4. **极简模式是测试工具**：只有一句系统提示词 + Bash + str_replace_editor 两个工具，用于观察同一模型在最少 Harness 干预下的真实表现。
5. **创造模式让 Agent 自己组装 Agent**：DSH 能查看现有插件清单并把插件重新组合成新的 preset，作者实测创建「B 站 UP 主数据获取」专用 preset，把几十次模型往返压缩为 4 次 AI 调用。
6. **Cordis 是自由组合的关键**：Cordis（独立 TypeScript 插件框架，MIT）允许模型适配器、文件系统、沙箱、会话日志、Agent Loop、UI 全部做成插件，DSH 把固定版本 Cordis 源码放进 vendor 目录并做了定制。

## 值得保留的判断

1. **DSH 是基础设施，不是成品**：用 Claude Code / Codex 的成熟度要求一个刚开源的 Developer Preview 项目是错位的，官方 README 已明确告知这一点。
2. **深度路线符合 DeepSeek 一贯打法**：先做底层能力，再由外部开发者做 To B/To C；作者做桌面版和工作流插件就是这种模式的一次尝试。
3. **开发者预览 ≠ 没价值**：研究 Agent 真实工作流、对照四种模式差异、可视化请求轨迹——这些场景 DSH 比消费级产品更合适。

## 疑点与边界

1. **用户体验的真问题不能掩盖**：界面粗糙、配置复杂、文档对新手不友好、插件安全和生态质量都需要时间验证。
2. **创造模式的稳定性未证**：作者实测创建 B 站 preset 折腾了两轮才成功，可重复性和边界条件尚未公开。
3. **PTC 不是稳赚不赔**：模型写程序若执行失败，反复修改后的调用次数可能比标准模式更多，需结合任务特征选择。
4. **Cordis 供应商锁定风险**：DSH 把固定版本 Cordis 源码放进 vendor 而非走 npm 上游，未来 Cordis 演进可能产生分叉债。

## Related Pages

- [[products/deepseek-harness]]
- [[summaries/deepseek-harness-plugin-first-agent-runtime]]
- [[patterns/plugin-first-agent-runtime]]
- [[concepts/harness-engineering]]
- [[concepts/deepseek-harness-agent-formula]]
- [[concepts/harness-multiplier-effect]]

## Sources

- [[sources/dsh-tech-hype-or-not]]