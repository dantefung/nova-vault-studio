---
title: "Skeleton And Port"
date: "2026-10-15"
source: "wiki-ingest"
---

---
title: "骨架与插口（Skeleton and Port）"
date: "2026-10-15"
source: "wiki-ingest"
---

# 骨架与插口（Skeleton and Port）

> Pi 与 DSH 控制面设计的核心哲学：把跨集成方重复的逻辑收进框架（骨架），把产品差异留在调用方注入的回调里（插口）。

## 核心思想

- **骨架**：人人相同的规则，写进框架内部。例如"输入归属有三条裁决规则"是骨架，所有集成方都遵守
- **插口**：产品各异的参数，交给集成方决定。例如"打断还是排队""派还是不派"是插口，每个产品自定义

## 在输入归属上的体现

「骨架与插口的边界在输入归属上，恰好划在'归哪个容器'与'容器怎么处理'之间」——前者人人相同收进骨架，后者产品各异留成插口。

具体插口：
- `getSteeringMessages()` — steering 队列的消息注入点
- `follow-up` — turn 收口后的回调，决定派还是不派

## 自检清单

- 如果多个集成方都在写"消息到达先看循环忙不忙"，说明归属规则该收进骨架
- 如果都在写"打断还是排队"，说明参数该留在插口

## Related Pages

- [[concepts/input-attribution]]
- [[patterns/agent-router-table]]

## Sources

- 王江华《Pi 与 DSH 的输入归属》：mp.weixin.qq.com/s/IVyLRVEtb2JUNf2WTWbwSQ
