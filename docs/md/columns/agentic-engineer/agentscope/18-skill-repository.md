---
title: "企业级 Agent Skill 技能中台实战：像搭 OverlayFS 一样组合五层 SkillRepository"
date: "2026-08-10"
source: "微信公众号：一灰灰blog"
url: "https://mp.weixin.qq.com/s/98O22sqo5kZK1Mdv0Ezs_g"
---

# 企业级 Skill 技能中台：五层 SkillRepository 组合

> AgentScope 迁移系列第 18 篇。像 Linux OverlayFS 一样，通过五层 SkillRepository 组合实现技能的中台管理——企业级、可版本化、可隔离。

---

## 五层 Repository

| 层级 | 类型 | 用途 |
|------|------|------|
| Workspace | 本地文件 | Agent 个人技能，每次会话加载 |
| Git | 代码仓库 | 团队协作技能，版本化管理 |
| Nacos | 配置中心 | 动态发布，热更新 |
| MySQL | 数据库 | 企业技能库，权限控制 |
| 自定义 | 扩展接口 | 对接内部系统 |

## OverlayFS 模型

多层仓库像 OverlayFS 一样叠加：上层覆盖下层，查找时从上到下逐层匹配，最终加载一个合并后的 Skill 视图。

> 📎 完整原文见知识库：[wiki/sources/agentscope-2.0-skill-repository.md](../../../wiki/sources/agentscope-2.0-skill-repository.md)

---

[← 上一