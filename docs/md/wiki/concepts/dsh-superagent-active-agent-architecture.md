---
title: "主动型 Coding Agent 架构设计：DSH Super-agent 五大工程常识"
date: "2026-11-03"
---

# 主动型 Coding Agent 架构设计：DSH Super-agent 五大工程常识

> 从「被动问答机」走向「全天候主动协同体」：DeepSeek Harness（`dsh-superagent-prototype`）把操作系统与分布式系统数十年经典架构机制迁移至 Agent 工程，确立了「少占人类注意力、多产出确定价值」的工程范式。

## 核心定义

**主动型 Coding Agent（Active Coding Agent）** 是一种脱离单次前台会话绑定、在后台以事件驱动方式持续运行的智能体系统。

与传统「人输入 Prompt → Agent 阻塞执行」的拉取式不同，主动型系统像驻场的**后厨领班**：监听外部环境信号（Trigger），在后台以流水线（Thread/Worker）方式执行代码与任务，仅在**产出可用成果**或**面临关键决策**时结构化主动介入。

```
[外部事件] (PR / Issue / IM / CI)
    │
    ▼ (规则粗筛 + 轻量模型去噪)
[Trigger 队列] ──> 按源拆分 ──> [Thread 1] (串行出菜)
                               [Thread 2] (串行出菜)
                                    │
               ┌────────────────────┴────────────────────┐
               ▼                                         ▼
      [Router 前台领班]                         [Worker 后台大厨]
   (全局记忆 / 人机沟通 / 无 Bash)         (强模型 / 工具全挂载 / 隔离执行)
               │                                         │
               │ (结构化汇报 / 阶段成果)                    │ (5秒超时沉淀后台)
               └─────────────────◄───────────────────────┘
                                 │
                         [Stored Work 账本]
                     (动作未动 / 先记账 / 断点续跑)
                                 │
                         [Watchdog 看门狗]
                     (超时熔断 / 限流退避 / 纠偏自救)
```

---

## 五大工程支柱

### 1. Router-Worker 前后台解耦与注意力纪律

- **前台 Router（领班）**：常驻会话，保持全局记忆与人机对话，**不配备 Bash 等破坏性工具**，使用轻量快模型。
- **后台 Worker（厨师）**：临时拉起、按需并发，上下文严格隔离，挂载全套工程工具，使用能力最强的推理模型。
- **注意力纪律**：
  1. 过程保持极度安静，禁发垃圾进度；
  2. 仅在「重大拍板」或「可用交付」两个节点开口；
  3. 提问严格限制为单选或结构化表单，绝不大而化之开放式反问；
  4. 绝不掩饰失败，草稿必打标记。

### 2. 事件驱动与 Thread 串行一致性（Agent 界的 epoll）

- **Trigger 不可变事件**：代码提交、报错日志、IM 讨论均沉淀为不可变事实。
- **Thread 串行隔离**：同一个 Thread 同一时刻只跑一个评估任务；新事件入队合并处理，杜绝多个 Agent 并发改同一处代码产生冲突踩脚。
- **跨 Thread 并行**：不同数据源（不同 Issue、不同代码模块）完全并行推进。

### 3. 异步 ReAct Loop（5 秒原则与 Watchdog）

- **5 秒沉淀规则**：前台 Shell 命令执行超 5 秒自动切入后台任务并释放 Worker， Worker 即可继续接收指令或处理下一步。
- **唤醒与硬超时**：后台任务产出后主动唤醒对应 Worker；设置 30 分钟硬超时防止死锁。
- **Watchdog 现场监工**：作为独立的外部控制回路（Control Loop），接管 API 429 限流退避、假死熔断与状态自愈，摆脱人类沉睡时的死机停滞。

### 4. 版本化 Policy + Mandate 授权单 + 影子模式

- **版本化 Policy**：准入与边界采用机器可读的版本化配置，杜绝主观散文式叮嘱。
- **不可变 Mandate**：接单时签发盖钢印的权限授权单，严格约束读写范围与工具等级，事后可追溯审计。
- **影子模式（Record-Only）**：心中没底的主动功能先只记录「若执行会做什么」而不实际执行，经日志评估稳健后再推生产。

### 5. Stored Work 先记账后动手（事务先行）

- **动作先落库再发外部调用**：规避内存易失性标记文件在断电、网络闪退时的状态混乱。
- **Outbox 发件箱机制**：外发消息落盘排队，指数退避重试，杜绝丢消息或重复轰炸。
- **恢复便签（Recovery Note）**：崩溃拉起时自带便签，提示 Worker 先审查 Git 历史与本地产物，避免盲目从头重跑。

---

## 落地演进对照

| 维度 | 传统单会话 Agent / 定时脚本 | DSH 主动型 Super-agent |
|---|---|---|
| **驱动模式** | 人肉提问拉取 / 定时闹钟轮询 | 事件驱动（Trigger + Thread 队列） |
| **交互认知** | 人类管理 10+ 会话窗口，注意力频繁切换 | Sessionless 无感体验，前台单一常驻接口 |
| **长任务执行** | 进程卡死，前台无法响应新指令 | 5 秒转后台异步推进，完成后按 ID 唤醒 |
| **稳定性控制** | 发短信报警等待人类手动重启 | 独立 Watchdog 现场退避重试与熔断 |
| **权限控制** | 提示词叮嘱「请小心谨慎」 | 版本化 Policy + Mandate 授权单硬约束 |
| **故障恢复** | 临时标记丢失导致全量重新执行 | Stored Work 数据库事务 + 恢复便签断点续跑 |

---

## 关联知识

- [[sources/fanbing-dsh-superagent-engineering-common-sense]] — 增长黑客范冰原文拆解
- [[summaries/fanbing-dsh-superagent-engineering-common-sense]] — 精读摘要
- [[sources/criscxuan-deepseek-super-agent-architecture-teardown]] — cxuan 程序员视角解析
- [[sources/coderleft-deepseek-super-agent-architecture-deep-dive]] — 程序员Left 全景拆解
- [[sources/antivo-deepseek-super-agent-distributed-master-worker]] — 纳米AI Master-Worker 映射
- [[concepts/deepseek-harness-agent-formula]] — Agent = Model + Harness
- [[concepts/durable-execution]] — Durable 持久可恢复执行
