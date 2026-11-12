---
title: "Cordis 到底解决了什么：DSH 与 Pi 的两种答案"
date: "2026-08-15"
source: "架构师（JiaGouX）"
---

# Cordis 到底解决了什么：DSH 与 Pi 的两种答案

> DeepSeek Harness 专栏第 06 篇。DSH 把 Cordis 嵌入运行时管理跨插件关系，Pi 把清理责任交给扩展作者。两种架构在解决同一类「幽灵状态」问题，但把复杂度记在了不同地方。

---

## 幽灵状态问题

给 Agent 加一个插件通常不难。真正让人头疼的是插件离开以后：配置里明明删掉了，文件监听器还在跑；Provider 换成新的，某个工具却仍握着旧对象。

## Pi：内环很短，退出边界清楚

Pi 的分工很直接：宿主负责把门关上再打开（`session_shutdown` → 重载 → `session_start`），屋里有什么东西由住在里面的人自己清点。

## Cordis：把插件关系记进运行时

Cordis 通过 Context / Fiber / Service 三个概念回答三个问题：

1. **系统现在想让哪些插件活着？**
2. **一个插件创建的资源，退出时该找谁撤销？**
3. **某项能力没了，哪些依赖它的插件也不能继续跑？**

## DSH 与 Pi：把复杂度记在了不同地方

| 维度 | Pi | DSH（Cordis） |
|------|-----|---------------|
| 清理责任 | 扩展作者自己 | 运行时管理 |
| 跨插件依赖 | 扩展作者协调 | Context 自动追踪 |
| 适用场景 | 扩展不多、重载成本低 | 插件复杂、跨依赖频繁 |
| 核心哲学 | 极简内环，扩充分散 | 无特权核心，全插件化 |

> 📎 完整原文见知识库：[wiki/sources/cordis-dsh-vs-pi.md](../../../wiki/sources/cordis-dsh-vs-pi.md)

---

[← 上一篇：Agent 蒸馏](./05-agent-distillation.md) | [→ 专栏首页](./index.md)