---
title: "搭一个企业级 Agent 平台（三）：工程外壳——workspace、沙箱、skill 怎么搭"
date: "2026-08-01"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/3_sbEcVe0Qv6CW4onvJFnQ"
---

# 搭一个企业级 Agent 平台（三）：工程外壳——workspace、沙箱、skill 怎么搭

> 外壳不参与推理，只往内核上叠工程能力。本篇讲 workspace（工位）、沙箱（干活的地方）、skill 自学习（越用越聪明）。

系列第三篇，钻进工程外壳子系统。上一篇讲"agent 怎么想"，这篇讲"agent 怎么干活"。

![AgentScope 架构图](images/agentscope-enterprise-shell/001.png)

## 一、workspace：agent 的"工位"

很多框架把 agent 的"角色设定""记忆""技能"写死在代码或配置里。AgentScope 的做法更巧妙——把它们都放进一个文件系统目录，让 agent 自己能读能写。

WorkspaceManager 约定的目录结构：

```
workspace/
├── AGENTS.md           ← persona（角色身份 + 本地约定）
├── MEMORY.md           ← 长期记忆索引
├── memory/*.md         ← 分条记忆
├── skills/<名字>/SKILL.md  ← 技能（markdown 驱动）
├── knowledge/          ← 知识库
└── agents/<id>/sessions/  ← 会话日志
```

### 两个值得抄的设计

**① 二层读写。** 读的时候先查可插拔的 AbstractFilesystem（带 namespace 隔离），查不到再回退本地磁盘；写的时候全部走 filesystem。这意味着 workspace 后端可以是本地盘、共享存储、或沙箱内的文件系统——换后端不动业务逻辑。

**② persona 就是 AGENTS.md。** WorkspaceContextMiddleware 在每次推理前，把 AGENTS.md（角色身份）+ MEMORY.md（记忆）拼进 system prompt。改 agent 人设，改个 markdown 文件就行，不用重新发版。

> 抄什么：把"角色 + 记忆 + 技能"做成文件系统，让 LLM 可读可写，比塞代码里灵活得多。这是 Claude Code / Cursor 那套"context engineering"的同款思路。

## 二、沙箱：让 agent 能跑代码又不炸宿主

agent 要干活（跑脚本、装依赖、改文件），但不能让它直接在你宿主机上跑——一个 `rm -rf` 就完蛋。所以工程外壳的第二个核心是沙箱：工具不在宿主直接执行，落到隔离的容器/沙箱里。

沙箱生命周期：`acquireForCall → start/resume → 工具在沙箱内执行 → releaseForCall → persist(state) → stop`

### 三个关键设计

**① acquire 的 4 级优先级——这是状态不丢的秘诀。** SandboxManager.acquire 按优先级找沙箱：

1. 外部注入的 Sandbox
2. 外部注入的 State
3. **持久化 State 恢复（resume）** ← 重点
4. 全新 create

第 ③ 级是重点：沙箱状态会被持久化，任何副本下次 acquire 都能 resume 同一个沙箱。所以滚动发布、跨副本调度，agent 的"干活现场"不丢。

**② stop() ≠ shutdown()——名字像，含义相反：**
- **stop()**：持久化快照、不销毁后端，下次 resume 同一个沙箱
- **shutdown()**：销毁后端资源，真正释放

这俩搞混了，要么状态丢、要么资源泄漏。

**③ SPI：加一种沙箱零改内核。** SandboxFilesystemSpec 是个抽象——只描述"怎么造 client/options/snapshot"，不实现。五种后端是平行扩展模块：

- **docker**（harness 内置默认）
- **kubernetes / daytona / e2b / agentrun**（都在 extensions，平行）

加一种新沙箱，实现 SandboxFilesystemSpec 打个 jar 就行，harness 核心零感知。

> 抄什么：沙箱做成 SPI，默认 docker，其他后端平行扩展。这是"加供应商/加沙箱零改内核"的标准答案。

## 三、skill 自学习闭环：要不要抄？

这是工程外壳里最超前的部分。AgentScope 给 skill 配了一套自学习闭环：
- agent 自己创建/管理 skill
- 把好用的临时 skill 晋升为长期
- 整理/淘汰 skill
- 记录每个 skill 的使用情况
- 审计 skill 变更

说白了：agent 越用越会自己攒技能库。

**评价：** 很超前，但 v1 别急。这套东西的前提是 agent 本身已经稳定、usage 数据攒够了。刚搭平台时，先让 skill 能手动管理就行；等 agent 跑顺了、有数据了，再开自学习闭环，否则容易攒出一堆垃圾 skill。

## 四、抄什么 + 避什么坑

### 值得抄
1. **workspace 文件化**：角色/记忆/技能做成文件系统，LLM 可读可写
2. **沙箱 SPI**：加后端零改内核，默认 docker、其他平行
3. **沙箱状态持久化**：acquire 4 级优先级 + resume，让"干活现场"跨副本存活

### 要避的坑（AgentScope 自己的债，别照抄）

**SandboxExecutionGuard 名不副实。** 名字像"安全守卫"，实际只是个并发槽位锁（防同一 key 的并发调用 race 持久化槽）。命令级安全完全靠容器自身隔离，harness 层没有命令黑名单/资源限额/网络出口控制。更坑的是 LocalFilesystemSpec 模式下 shell 直接跑宿主机、无任何防护。做平台，沙箱的命令级安全（黑名单、CPU/内存/网络限额）必须自己补。

**workspace 的锁是 in-process、不跨副本。** WorkspaceManager 用 `ConcurrentHashMap<String, ReentrantLock>` 做原子 read-merge-write，但注释明说"仅限单进程，跨进程要后端 CAS"。多副本部署下，光靠本地锁会丢更新——得靠 BaseStore.putIfVersion（CAS 乐观锁）。做多副本平台，这层必须想清楚。

**docker 沙箱靠 fork docker CLI**（不是 docker-java 客户端），高并发下进程 fork 有开销，stdout 还有截断风险。量大时要评估。

## 五、一句话带走

> workspace 文件化角色与记忆，沙箱做成 SPI 且状态可持久化——agent 才能安全、有记忆地"干活"。但命令级安全和跨副本锁，框架没替你兜底，得自己补。

**下一篇预告：** 治理子系统——权限六步管线、优雅停机（长任务不丢）、统一事件流（前端/HITL/审计）。