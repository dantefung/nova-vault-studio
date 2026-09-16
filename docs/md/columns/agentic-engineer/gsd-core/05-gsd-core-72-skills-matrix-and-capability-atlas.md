---
title: "05. GSD Core 72 技能全景分类矩阵与实战速查图谱"
date: "2026-09-16"
source: "open-gsd/gsd-core"
url: "https://github.com/open-gsd/gsd-core"
---

# 05. GSD Core 72 技能全景分类矩阵与实战速查图谱

> 「好程序员的工具箱里没有多余的废铁，每一把扳手都有明确的尺寸和扭矩。」GSD Core（v1.7.0）内置了整整 **72 个专业技能（Skills）**。如果把它们散落成 72 个碎片页面，读者只会迷失在字典列表里。本文将这 72 个技能系统归纳为 **6 大业务能力域**，提供最透彻的实战速查图谱。

<!-- more -->

## 六大能力域总览

GSD Core 的技能树严格服务于项目生命周期：

```text
1. 启动与项目入轨 (Bootstrap & Onboarding)      ── 7 个核心技能
2. 阶段规划与规格定义 (Phase Planning & Spec)    ── 12 个核心技能
3. 并发执行与波次调度 (Execution & Wave Dispatch) ── 9 个核心技能
4. 验证、审计与安全防御 (Verification & Security)  ── 12 个核心技能
5. 发布、里程碑与回滚 (Shipping & Revert)        ── 8 个核心技能
6. 洞察、记忆与日常工具 (Intel, Memory & Tools)   ── 24 个核心技能
```

---

## 域 1：启动与项目入轨（Bootstrap & Onboarding）

负责将绿地项目（从零开始）或棕地项目（既有存量仓库）无缝纳入 GSD Core 轨道。

| 技能命令 | 适用场景 | 核心动作与产物 |
|---------|---------|---------------|
| `/gsd-new-project` | 全新项目从零启动 | 深度意图访谈，由 4 个 researcher 并发调研技术栈，生成 `PROJECT.md` 与第一版 `ROADMAP.md` |
| `/gsd-onboard` | 既有老代码库入轨 | 扫描仓库架构，分析历史代码模式，生成项目概况并初始化 `.planning/` 目录 |
| `/gsd-new-milestone` | 开启下一个迭代版本 | 归档旧里程碑，根据当前需求规划下一轮阶段路线图并刷新 `STATE.md` |
| `/gsd-map-codebase` | 代码库拓扑与架构制图 | 并发调度 4 个 mapper，分析技术栈、架构、代码质量与隐患，生成 7 篇 `.planning/codebase/*.md` |
| `/gsd-import` | 导入外部计划方案 | 解析第三方架构方案或计划文档，执行决策冲突检测后合入 `.planning/` |
| `/gsd-ingest-docs` | 存量文档吸纳与治理 | 扫描已有 PRD、ADR 和规范，由分类器与综合器消解冲突后生成统一上下文 |
| `/gsd-profile-user` | 开发者行为画像分析 | 跨会话分析人类开发者的编码习惯、决策风格与偏好，生成 `USER-PROFILE.md` 注入模型 |

---

## 域 2：阶段规划与规格定义（Phase Planning & Spec）

在写代码之前，把业务意图、视觉规范与边界条件收敛为机器可执行的确定性契约。

| 技能命令 | 适用场景 | 核心动作与产物 |
|---------|---------|---------------|
| `/gsd-discuss-phase` | 阶段启动前的人机对齐 | 自适应提问与决策确认，锁定技术选型与实现策略，产出 `{phase}-CONTEXT.md` |
| `/gsd-spec-phase` | 复杂需求业务规范细化 | 对模糊需求进行歧义度评分，定义功能边界与验收标准，产出 `{phase}-SPEC.md` |
| `/gsd-ui-phase` | 前端界面的设计契约 | 扫描设计系统（Tailwind/shadcn），锁定排版与组件清单，产出 `{phase}-UI-SPEC.md` |
| `/gsd-mvp-phase` | 垂直 MVP 切片规划 | 采用用户故事（User Story）与 SPIDR 拆分技术，规避横向铺摊子，聚焦纵向走通 |
| `/gsd-ai-integration-phase` | AI 与 LLM 能力集成设计 | 调研选型大模型框架（LangChain/Vercel AI 等），生成 `AI-SPEC.md` 设计契约 |
| `/gsd-plan-phase` | 拆解执行切片与波次 | 产出原子级 `{phase}-{N}-PLAN.md`，内嵌 Failing-direction 预设并交由 checker 审核 |
| `/gsd-plan-review-convergence` | 跨模型对抗性计划收敛 | 将计划交由不同模型家族的外部 Reviewer 挑刺，多轮迭代直至无 HIGH 风险 |
| `/gsd-ultraplan-phase` | 云端离线深度超前规划 | [BETA] 将庞大阶段的规划任务卸载至云端后台异步推演，完成后拉回本地 |
| `/gsd-phase` | 阶段 CRUD 维护管理 | 对 `ROADMAP.md` 中的阶段进行结构化新增、插入、重命名、编辑或删除 |
| `/gsd-explore` | 开放式苏格拉底探索 | 在写任何计划前，通过苏格拉底式发问推演方案可行性，沉淀真伪需求判断 |
| `/gsd-spike` | 快速技术尖兵实验 | 针对未知技术做探路原型（Spike），探明可行性与限制后沉淀报告 |
| `/gsd-sketch` | 抛弃型前端 UI 原型速写 | 快速生成一次性 HTML 原型，供人类确认界面交互流，确认后丢弃进正规实现 |

---

## 域 3：并发执行与波次调度（Execution & Wave Dispatch）

控制代码生成节奏，利用波次划分与环境隔离保证并发安全。

| 技能命令 | 适用场景 | 核心动作与产物 |
|---------|---------|---------------|
| `/gsd-execute-phase` | 阶段全量波次执行 | 解析 Plan 拓扑，按 Wave 分组在 Git Worktree 中并行启动 `gsd-executor`，原子化提交代码 |
| `/gsd-quick` | 快速单任务执行 | 适用于单次、轻量的临时任务，跳过复杂漫长的多代理磋商，保持原子提交与状态追踪 |
| `/gsd-quick-batch` | 批量任务并行执行 | 一次性派发多个独立的快速任务，通过文件重叠检测自动分波次无冲突执行 |
| `/gsd-fast` | 极速内联单步执行 | 零子代理调度开销，直接在当前会话内联完成琐碎改动 |
| `/gsd-autonomous` | 全自动无人值守模式 | 连续自主跑完剩余的所有 Phase（Discuss → Plan → Execute），全自主推进 |
| `/gsd-pause-work` | 中途挂起工作交接 | 临时中断工作时生成完整的上下文交接包（Handoff），保证下次随时无缝续接 |
| `/gsd-resume-work` | 恢复历史中断的工作 | 从上次的交接包中完整重建工作上下文并继续执行未完成的波次 |
| `/gsd-workstreams` | 多任务并行工作流管理 | 创建、切换、列出与归档并行的 Workstream 工作流分支，实现多需求并行开发 |
| `/gsd-workspace` | 物理工作区环境管理 | 管理基于 Git Worktree 衍生的沙箱工作空间，避免多任务环境污染 |

---

## 域 4：验证、审计与安全防御（Verification, Audit & Security）

提供比人类更冷酷的客观证据检验，拦截假绿灯与隐性技术债。

| 技能命令 | 适用场景 | 核心动作与产物 |
|---------|---------|---------------|
| `/gsd-verify-work` | 阶段目标达成验收 (UAT) | 依据阶段核心愿景与 `CONTEXT.md` 开展目标反向推导，生成 `{phase}-VERIFICATION.md` |
| `/gsd-add-tests` | 针对性补全测试用例 | 根据阶段 UAT 验收标准和实际代码，为尚未覆盖的边界条件自动生成单测 |
| `/gsd-audit-fix` | 自动化审计与即时修复 | 全流程自愈流水线：自动扫雷、严重度分类、针对性修复、运行单测并提交 Commit |
| `/gsd-audit-uat` | 跨阶段 UAT 遗留项排查 | 交叉扫描所有阶段遗留的待验证项，确保没有未经验收的代码溜进主分支 |
| `/gsd-audit-milestone` | 里程碑终审总体验收 | 在里程碑完结前，对照初始项目愿景进行全量跨模块端到端集成检验 |
| `/gsd-validate-phase` | 奈奎斯特采样验证审计 | 依据奈奎斯特采样原则审计测试充分度，自动生成对抗性边界测试 |
| `/gsd-secure-phase` | 威胁建模与安全审计 | 对照计划中的威胁模型回溯代码，检验 SQL 注入、越权、密钥泄露等防护是否真实落地 |
| `/gsd-eval-review` | AI 系统评估覆盖度审查 | 审查 AI 阶段的 Eval 评估体系，确保模型输出质量具备客观打分标准 |
| `/gsd-code-review` | 高级代码质量深度走查 | 纯只读扫描变更源码，抓取逻辑漏洞、类型隐患与坏味道，输出 `REVIEW.md` |
| `/gsd-ui-review` | 前端视觉 6 维深度审计 | 对照 UI 设计规范，从文案、视觉、色彩、字体、间距与体验 6 维度严格打分 |
| `/gsd-debug` | 科学归因式疑难 Bug 排查 | 基于科学假说推导排查 Bug，状态跨 Context 留存，强制找到根因才允许修补 |
| `/gsd-forensics` | 失败工作流事故复盘调查 | 针对异常崩溃或死锁的工作流进行日志与状态尸检，指出问题出在哪一步 |

---

## 域 5：发布、里程碑与回滚（Shipping, Milestones & Revert）

负责代码合并、版本发布、历史清理与可逆回滚。

| 技能命令 | 适用场景 | 核心动作与产物 |
|---------|---------|---------------|
| `/gsd-ship` | 阶段发版与代码合并 | 执行前置安全检查，合并 Worktree 分支，创建 Git 提交/PR，归档阶段产物 |
| `/gsd-pr-branch` | 过滤规划痕迹生成干净 PR | 从 Git 历史中剥离 `.planning/` 等过程元数据，产出极其干净的生产级 PR 分支 |
| `/gsd-complete-milestone` | 归档并完结当前里程碑 | 总结里程碑战果，将阶段目录迁移至归档区，为新版本铺平道路 |
| `/gsd-milestone-summary` | 里程碑总结生成器 | 汇总里程碑期间的所有架构决策、交付物和经验，生成团队交接白皮书 |
| `/gsd-undo` | 阶段级安全事务回滚 | 基于阶段清单和 Git 提交依赖，安全回退指定 Phase 或 Plan，零连带伤害 |
| `/gsd-cleanup` | 归档目录与临时文件清扫 | 整理并归档已完结里程碑的历史目录，释放磁盘与上下文空间 |
| `/gsd-cleanup-avatar-images` | 杂项小图批量清洗 | 批处理清理导入文档中冗余的社交头像与空占位图片 |
| `/gsd-update` | GSD Core 核心版本升级 | 检查上游最新发布版本，平滑升级运行时组件并更新配置规范 |

---

## 域 6：洞察、记忆与日常工具（Intel, Memory & Utilities）

提供全局可观测性、长期记忆库同步、日常辅助与命名空间路由。

| 技能命令 | 适用场景 | 核心动作与产物 |
|---------|---------|---------------|
| `/gsd-progress` | 项目整体进度即时看盘 | 扫描 `STATE.md` 与当前阶段，展示当前位于哪一步，下一动作是什么 |
| `/gsd-stats` | 项目统计与度量大盘 | 统计项目阶段数、Task 达成率、Commit 次数与时间跨度 |
| `/gsd-graphify` | 知识图谱构建与检索 | 在 `.planning/graphs/` 下构建代码知识图谱，供其他 Agent 高效按需召回 |
| `/gsd-health` | 规划目录健康体检与修复 | 扫描 `.planning/` 结构的一致性，诊断文件是否缺失并提供修复方案 |
| `/gsd-manager` | 交互式阶段控制中心 | 提供一站式交互菜单，管理和调度各阶段的执行与推进 |
| `/gsd-next` | 智能决策下一步动作 | 分析当前文件系统状态，直接给出下一步最合理的建议命令 |
| `/gsd-capture` | 灵感与碎片待办捕获 | 快速将人类临时闪现的 Idea、待办或种子记录落盘到对应的收件箱 |
| `/gsd-extract-learnings` | 经验与踩坑认知提炼 | 从已完成的阶段产物中萃取架构经验、错误教训与惊喜发现 |
| `/gsd-inbox` | GitHub Issue/PR 自动化分诊 | 自动审查和分类外来 Issue 与 PR，对照项目规范整理进待办池 |
| `/gsd-review-backlog` | 梳理并激活 Backlog 待办 | 审查沉淀在 Backlog 中的需求项，挑选并晋升进当前活跃里程碑 |
| `/gsd-settings` / `/gsd-config` | 工作流配置调优与配置管理 | 配置 GSD 工作流开关、模型路由偏好（Model Profiles）与隔离策略 |
| `/gsd-thread` | 跨 Session 长期会话线程管理 | 管理持久化的会话线程，实现跨窗口长期工作上下文沉淀 |
| `/gsd-surface` | 技能集群动态开关控制 | 细粒度开启或屏蔽特定技能集群，控制 Agent 提示词开销 |
| `/gsd-mempalace-capture` | 记忆宫殿知识提取 | 将阶段沉淀的决策与架构模式持久化到 MemPalace 记忆宫殿中 |
| `/gsd-mempalace-recall` | 记忆宫殿关联记忆召回 | 在新阶段启动时，从记忆宫殿跨项目召回相似的架构踩坑经验 |
| `/gsd-docs-update` | 文档与代码事实对齐更新 | 验证文档声明与代码库事实（路径、配置项等），修正陈旧过时文档 |
| `/gsd-help` | 完整命令手册查询 | 打印当前环境下所有可用的 GSD 技能使用说明 |
| `/gsd-ns-workflow` | 核心工作流命名空间路由 | 涵盖 discuss, plan, execute, verify, phase, progress 的顶层路由 |
| `/gsd-ns-context` | 代码智能与上下文命名空间路由 | 涵盖 map, graphify, docs, learnings 的上下文集合入口 |
| `/gsd-ns-ideate` | 创意与探索命名空间路由 | 涵盖 explore, sketch, spike, spec, capture 的前期入口 |
| `/gsd-ns-manage` | 项目治理与工作区命名空间路由 | 涵盖 config, workspace, workstreams, thread, ship, inbox 的管理入口 |
| `/gsd-ns-project` | 项目生命周期命名空间路由 | 涵盖 milestones, audits, summary 的顶层生命周期入口 |
| `/gsd-ns-review` | 质量把控命名空间路由 | 涵盖 code-review, debug, audit, security, eval, ui 的质量门禁入口 |

---

## 终局思考：如何使用这套能力库？

72 个技能看起来很多，但千万不要把它当成死记硬背的指令集。在 GSD Core 的哲学里：
1. **日常开发只需记住一条主线**：`/gsd-progress` 看状态，跟着推荐命令一步步往下走即可。
2. **需要特定把控时按图索骥**：UI 阶段调 `/gsd-ui-phase`，疑难排查调 `/gsd-debug`，复杂需求调 `/gsd-spec-phase`。
3. **把不确定性关进流水线**：每个技能都是大模型流水线上的一个标准化夹具，各司其职，从而实现工业级可靠的自治开发。
