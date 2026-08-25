---
title: DeepSeek Harness 专栏
date: "2026-08-19"
source: "微信公众号"
---

# DeepSeek Harness 专栏

> DeepSeek 开源的 Agent 框架——「Agent = Model + Harness」。一切皆插件，能力按需装配、用完即焚。

> 本专栏共收录 15 篇文章，从整体架构到插件机制，从运行时设计到 Agent 蒸馏，从与 Cordis/Pi 的横向对比到 Codex 竞品开源，再到自进化 Agent 的哲学思考、DSH 桌面应用与虚拟机部署，iPhone 极限部署实战，最新架构深度拆解，以及 1W 个 DSH 插件仓库全量生态审计。

---

## 阅读路线

```
概念层    →  Agent = Model + Harness（整体架构）
运行时层  →  Agent Runtime 架构  +  插件运行机制
能力层    →  Agent 为自己构建工具
数据层    →  Agent 蒸馏数据工厂
对比层    →  DSH vs Pi：两种 Agent 架构设计哲学
实践层    →  Minke v0.2.0：DSH 桌面应用与远程控制
```

---

## 文章列表

| # | 文章 | 日期 | 主题 |
|---|------|------|------|
| 01 | [Agent = Model + Harness：DeepSeek 把模型的「壳」开源了](./01-deepseek-harness.md) | 08-14 | 整体架构与核心理念 |
| 02 | [从 DeepSeek Harness 的架构，看 Agent Runtime 该怎么设计](./02-agent-runtime-architecture.md) | 08-13 | Session Log / Seam / Agent Loop |
| 03 | [深入解析 DeepSeek Harness 插件运行机制](./03-plugin-architecture.md) | 08-14 | Cordis 插件生态与核心能力 |
| 04 | [让 Agent 为自己构建工具](./04-agent-build-tools.md) | 08-19 | 现场装配：脚本 vs 插件 + 五条最佳实践 |
| 05 | [DeepSeek Harness 做 Agent 蒸馏：天然蒸馏数据工厂](./05-agent-distillation.md) | 08-14 | 事件流 → 蒸馏数据 |
| 06 | [Cordis 到底解决了什么：DSH 与 Pi 的两种答案](./06-cordis-dsh-vs-pi.md) | 08-15 | 横向对比两种 Agent 架构 |
| 07 | [OpenAI 全面开源 Codex Harness——「把 AI 装进专业界面，不是让用户适应聊天框」](./07-codex-harness-open-source.md) | 08-21 | 竞品开源，ARC-AGI-3 得分 13.3%→38.3%，Token 降 6 倍 |
| 08 | [DeepSeek Harness 是自进化 Agent 的基石——从 To Developer 到 To Agent](./08-self-evolving-foundation.md) | 08-20 | DSH vs Anthropic 两种 Harness 哲学，meta harness 与自进化愿景 |
| 09 | [Minke v0.2.0 发布：把电脑变成可随时访问的 Agent Host](./09-minke-v020-release.md) | 08-21 | DSH 桌面应用，Cordis 插件树扩展，远程控制架构，Tailscale 私有接入 |
| 10 | [可逆不是逆向运行：DeepSeek Harness 架构的数学本质](./10-reversible-architecture.md) | 08-21 | 从可逆计算理论看 Cordis 的数学本质：一切皆差量、Delta 可正可负、单写者+累加+无删除 |
| 11 | [从 Codex Harness 到 DSH Subagent：Agent 进入软件架构新一层](./11-codex-harness-dsh-subagent.md) | 08-21 | DSH rc.8 接 Codex/Claude Code 做 Subagent，Harness 作为基础设施，四种控制权拆分 |
| 12 | [DeepSeek Harness 虚拟机部署体验](./12-dsh-vm-deployment.md) | 08-22 | CentOS 虚拟机从零部署 DSH，四种安装方式，远端访问坑位，实际运行 38 万 Token |
| 13 | [我在 iPhone 上装了 DeepSeek Harness，还让它自己审讯了自己](./13-dsh-on-iphone.md) | 08-24 | iPhone + iSH 极限部署，五道关卡，多智能体审讯流水线，Flash vs Pro 盲评竞技场 |
| 14 | [10 张图详细拆解 DeepSeek Harness 设计架构](./14-xuanyuan-dsh-architecture-deep-dive.md) | 08-25 | 三阶段运行时、Profile/Bundle/Patch 三层组装、Cordis 插件框架四能力、四种 Preset、Turn/Step 模型、SessionEvent |
| 15 | [我扒了 1W 个仓库，重新看了一遍 DSH 插件生态](./15-dsh-plugin-ecosystem-10k.md) | 08-24 | 9393 仓库全量枚举、rc.1 破坏性变更试金石、27 品类全景分布、10 大精选原生插件 |

---

## 参考资料

- [DeepSeek Harness 官方仓库](https://github.com/deepseek-ai/DeepSeek-Harness)
- [Cordis](https://github.com/deepseek-ai/cordis)