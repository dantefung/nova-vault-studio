---
title: "稍后读"
date: "2026-05-29"
---

# 稍后读

> 待采集/待阅读的内容链接

## X / Twitter

| 日期 | 链接 | 备注 |
|------|------|------|
| 2026-05-29 | https://x.com/i/status/2059844244907696186 | Vince 聊开发 |
| 2026-05-29 | https://x.com/i/status/2052368318825402507 | Vince 聊开发 |
| 2026-06-06 | https://x.com/i/status/2012728374725398570 | 待查看 |

## 微信公众号

| 日期 | 链接 | 摘要 |
|------|------|------|
| 2026-05-30 | https://mp.weixin.qq.com/s/k6y1ohwHQJQmVpwMLRwS4g | **OpenCodeReview v1.1.1-v1.1.7 更新**：核心围绕两条主线——**可控性**（让用户看见并控制评审全过程）和**可集成性**（成为 AI 编码工作流原住民）。新功能包括 `--preview` 预览（零 token 消耗提前确认评审范围）、`ocr rules check` 规则检查、多阶段工程流水线等。已在阿里巴巴内部多个核心业务线落地验证。 |
| 2026-05-31 | https://mp.weixin.qq.com/s/CzhP5enU_tGDbjoDcEMKuA | **easyclaw.work 企业 AI 员工分析**：2 个月从 8.1K 涨到 97.4K 访问量。核心原因不是技术最强，而是**说人话**——用岗位和业务结果来卖，把复杂 agent 基础设施包装成"AI Employees for Business"，面向非技术决策者。站点结构：多语言销售页 + credits 用量制 + 高客单 lobster care 服务。值得学习的增长结构。 |
| 2026-05-31 | https://mp.weixin.qq.com/s/p-Uk4QjnIAhVWpvC23nFvg | **Remoting 动态图表叠加口播视频**：人月聊IT 分享如何给真人口播视频叠加动态可视化图表（流程图、对比图、要点列表）。核心思路：用 Remoting 生成 SVG 图表 + ffmpeg overlay 叠加到视频上。工作流可复用——给一段视频 + 逐字稿就能跑出来，避免手动剪辑 2-3 小时。提供完整 Skills 技能包。 |
| 2026-06-01 | https://mp.weixin.qq.com/s/Z09Sf9Nx0S4uv3dHECJGAw | **AI SaaS Web 上线动作日志与指标系统**：上线日志的本质是"增长实验账本"——每次产品动作必须记录：改了什么、影响哪个指标、预计生效时间、数据源、判断方法、是否保留。关键：动作日志记因，指标系统记果，中间必须有时间窗口、对象范围、控制组、版本号。附 API/AI 模型、GSC/SEO、UI/UX、CVR/激活、内容/SEO 长线、归因分析各模块的指标 Cheatsheet。 |
| 2026-05-31 | https://mp.weixin.qq.com/s/S7HO98KRB2VBqBkBjSNa6g | **Obsidian 插件授权系统改造复盘**：用户买了 Pro 却激活不了，因为国内网络无法访问 Cloudflare Worker。改造方案：国内备用节点 + License 签名校验（客户端必须验证签名，中间人无法伪造）+ 多端点故障转移。关键设计点：私钥保护、KV 存储、ICP 备案/CORS/SSL 证书坑点。还发现"清除本机授权"其实没有释放服务端名额的设计 bug。 |
| 2026-06-04 | https://mp.weixin.qq.com/s/6hDDkU2z31K67y8Z9dcqhw | **AI研发自动化：Wiki知识库+技能包**：把 AI 研发自动化拆成两条腿——**LLM-Wiki 知识库**（Karpathy 26/04 提出的"新知识库模式"，本质是 SKILL/md 文件，把 LLM 从 RAG 引擎变成"维护 wiki 的全职编辑"，知识增长是**复利式**而非线性）+ **领域专家 SKILL 包**（写方案/写代码/评审/测试/答疑/排障）。架构三层：Sources（只读真源）→ Wiki（LLM 全权 md 实体/概念/综述页）→ Schema（工作流规范）。核心操作是 Ingest/Query/Lint 三件套。最终目标：用户给 PRD，剩下全交给 agent。跟本仓 `llm-wiki` skill 主题完全契合。 |
| 2026-06-04 | https://mp.weixin.qq.com/s/AZ-np48XJLM1QO5NJ_YiVA | **用 LLM Agent 重构告警排查流程（得物技术）**：用 **Spring AI Alibaba ReAct Agent** + Supervisor Agent 编排，自动完成告警数据采集/根因分析/处置建议；4 个排查工具（指标/日志/链路/知识）+ Validation Agent 验收 + 知识沉淀闭环。**中位排查耗时 20min→4.4min**，覆盖 11 个服务 10+ 告警类型。核心难点：动态策略组装、工具超时隔离、AI 权限安全、幻觉控制。跟本仓 `agentic-engineer` 主题强相关。 |
| 2026-06-09 | https://mp.weixin.qq.com/s/--PaxhI2_8dz4bpcDy1ciw | **给 Agent 引入专家：自定义子代理**（天空的代码世界）：通用子代理/自定义子代理/fork子代理/Teammate 四种模式，"配置即能力"——给 Agent 加新行为成本压到"写一段 Markdown"。四个 frontmatter 字段（name/description/model/max_turns）定义专家。关联：本仓 [[agentic-engineer]] 子代理章节 + Serenity Skill 多专家分工思路。 |

## 其他

<!-- 待补充 -->