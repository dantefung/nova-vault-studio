---
title: "我的 Harness 工程化和脚手架实践——Java AgentScope 多 Agent 旅游规划项目拆解"
date: "2026-08-20"
source: "微信公众号：华仔"
url: "https://mp.weixin.qq.com/s/zOgLaXwMjgarsXJ7E0vXmA"
---

# Harness 工程化和脚手架实践

> 华仔用 Claude Code 构建的 Java AgentScope 小红书旅游规划项目，多 Agent + SDD + Harness Engineering + Skills 的完整实践。本文从公开分享的技术要点做概要整理。

> ⚠️ 原文含大量付费社群推广（星球限时 159 元），下方仅提炼公开可见的技术内容。

---

## 项目概览

- **技术栈**：Java + AgentScope 2.0 + Claude Code Opus 4.8
- **架构思路**：多 Agent + SDD（Spec 驱动开发）+ Harness Engineering + CC VibeCoding + Skills
- **核心场景**：旅游行程规划——需求理解→小红书分析→路线规划→行程编排→预算校验

## 五 Agent 架构

| Agent | 职责 |
|-------|------|
| **SupervisorAgent** | 总控：理解意图、拆解任务、汇总结果，同时维护两条编排路径 |
| **XHSAnalysisAgent** | 分析小红书笔记，挖掘热门玩法、景点和内容偏好 |
| **RouteAgent** | 路线规划，调用地图能力做交通与距离计算 |
| **ItineraryAgent** | 把景点、餐饮、时间槽编排成每日行程 |
| **BudgetAgent** | 费用拆分、预算校验、超支预警 |

Agent 间通过 A2A 协议协作，Supervisor 统一调度。

## SDD + Harness 双层规范

| 层次 | 解决 | 手段 |
|------|------|------|
| **SDD** | 「先想清楚再写」 | change.md 承接需求卡、验收标准、边界条件、影响面 |
| **Harness Engineering** | 「想清楚之后怎么稳定推荐并被验证可用」 | 工程结构/编码规范/开发流程规范 |

### Harness 目录结构

```
.harness/
├── rules/      # 三规范：工程结构 / 编码规范 / 开发流程规范
├── skills/     # 六技能：①~⑥ 流水线步骤定义（含 frontmatter + status 流转）
├── wiki/       # 四文档：业务模型 / 接口协议 / 数据模型 / 架构决策
└── changes/    # 变更追踪（含 _TEMPLATE/）
```

## Plan Mode：两阶段执行

```
用户输入 → 起草阶段（Plan Mode ON，仅可调用 plan_write 写入 PLAN.md）
       → 暂停，等待人工确认（CONFIRM / REJECT）
       → 执行阶段（Plan Mode OFF，恢复全部 Toolkit）
       → 输出 TripPlanResult
```

## 三层数据存储

| 层级 | 存储 | 用途 |
|------|------|------|
| 短期缓存 | Redis | 状态管理 |
| 长期记忆 | ReMe | AgentScope 记忆 |
| 审计/业务 | MySQL | 持久化 |

## Skills 分类

- **开发 Skills**：代码生成、测试、架构约束、评审等流水线步骤
- **业务 Skills**：旅游规划领域的业务逻辑封装

## 核心观点

- 先定义「角色」，再定义「通信」，再定义「边界」，最后才是「实现功能」
- SDD 解决「先想清楚再写」，Harness Engineering 解决「怎么稳定推荐并被验证可用」——两者是上下层关系，不是冲突关系
- Agent 项目常见陷阱：一开始就掉进「工具堆砌」的坑里

> 📎 完整原文见知识库：[wiki/sources/huazai-harness-practice.md](./sources/huazai-harness-practice.md)

---


[← 上一篇：18、Skill Repository](./18-skill-repository.md) | [→ 专栏首页](./index.md)
