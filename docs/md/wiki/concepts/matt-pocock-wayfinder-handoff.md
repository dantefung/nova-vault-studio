---
title: "wayfinder & handoff：AI Agent 跨会话接力协议"
date: "2026-07-30"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/H1httNlFmRqN9jyOAO380A"
---

# wayfinder & handoff：AI Agent 跨会话接力协议

Matt Pocock 在 skills/engineering/wayfinder 和 skills/productivity/handoff 中给出的跨会话接力协议，解决"上下文窗口是一次性的"这一根本问题。

---

## 核心概念

### smart zone vs dumb zone

会话早期 Agent 处于 **smart zone**——敏锐、专注、记忆良好。随着会话增长，进入 **dumb zone**——松散、遗忘、错误增多、产生忠实幻觉。前沿模型的 dumb zone 通常在 **~120K-150K tokens** 时开始（存在争议）。

**本质**：会话拖长后注意力稀薄，模型更易忘一小时前定下的约束。

### wayfinder：多会话共享地图

适用场景：工作本身就需要多会话。

维护一张跨会话共享的"地图"，一次启动即为多会话协作铺路。先把目的地钉死，再 fan out 出票。

**判断信号**：任务太大、雾太大、说不清目的地 → 用 wayfinder。

### handoff：会话边界交接

适用场景：当前会话快到边界了，本来一两会话能干完，只需开个新会话把上下文搬过去。

换窗口不换任务，把对话压缩成 markdown 文件搬到下一个会话。

**判断信号**：当前会话快到 smart zone，但任务规模不大 → 用 handoff。

### main flow：单会话直过

适用场景：目的地清晰，一两个会话能搞定。

**判断信号**：路上没雾，没必要地图 → 直接走 /grill-with-docs → /to-spec → /to-tickets → /implement。

---

## 三选一决策框架

| 场景信号 | 选谁 | 为什么 |
|---------|------|-------|
| 目的地清晰，一两个会话能搞定 | main flow | 路上没雾，没必要地图 |
| 当前会话快到 smart zone，但任务规模不大 | /handoff | 换窗口不换任务，把对话搬到下一个会话 |
| 任务太大、雾太大，还说不清目的地 | /wayfinder | 先把目的地钉死，再 fan out 出票 |

**混用警告**：如果既想用 wayfinder 又想用 handoff，多半是任务规模被低估了。强行拆会导致套娃。

---

## 关键机制

- **/handoff** 是 fork（开新会话 + 引用文件），**/compact** 是 continue（同一会话压摘要）。两者不是轻重区别，是方向的区别。
- **setup-matt-pocock-skills** 是这套协议的地基——没有 issue tracker + native blocking + labels 的环境，wayfinder 协议会被削弱一半能力。

---

## 交叉引用

- [[matt-pocock-skills]] — wayfinder/handoff 所在的 Skills 生态
- [[smart-zone]] — 会话边界阈值概念
- [[agent-handoff-pattern]] — 跨 Agent 上下文交接模式

> 来源：术哥无界（运维有术）公众号，2026-07-30
