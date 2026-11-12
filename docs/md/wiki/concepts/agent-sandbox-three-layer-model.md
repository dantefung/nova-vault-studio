---
title: "Agent 沙箱三层模型：隔离边界、能力控制与策略治理"
date: "2026-11-02"
source: "整理自 columns/agentic-engineer/agent-sandbox-three-layer-model.md"
url: ""
---

# Agent 沙箱三层模型

> 「沙箱」在 Agent 生态里压着三件互不等价的事：**Agent 在哪跑**、**Agent 能碰什么**、**这个动作要不要人点头**。选错层的代价不是「防护差一点」，而是整套威胁模型从根上错位。

## 一句话定义

把 Agent 沙箱拆成三个正交层，各管各的失效模式：

| 层 | 回答的问题 | 失效后果 | 代表 |
|---|---|---|---|
| **L1 隔离边界** | Agent 在哪跑？ | 恶意代码逃逸到宿主机，波及其他租户 | OpenSandbox、AX、DSec、CubeSandbox、E2B |
| **L2 能力控制** | Agent 能碰什么？ | 读到不该读的文件、拿到不该拿的凭据、连了不该连的域名 | nono |
| **L3 策略治理** | 这个动作要不要人点头？ | 删库、推生产、动资金被自动执行 | 护栏模式、HITL、CI 门禁、审计回放 |

**三层不是三选一，是三明治：L1 划边界，L2 削权限，L3 留闸门。**

## 为什么必须拆开

一个具体反例：

> Agent 在有 root 的开发机上跑，用 `curl` 拿走 `~/.aws/credentials`，POST 到陌生域名。
>
> - L1 **没有失败**——它确实就在开发机上跑，隔离边界本来不管这个
> - L2 **失败了**——凭据本该在沙箱外，`curl` 本该被网络策略拦下
> - L3 **也失败了**——这类动作不该走 HITL 审批（否则 Agent 什么都干不了），该在 L2 就挡掉

**推论**：
- L3 不是 L2 的替代品——HITL 审批不可能覆盖 Agent 每一次 `ls`
- L2 不是 L1 的替代品——文件权限控制也管不了「这个 PR 能不能合」

## L1 隔离边界层

### OpenSandbox 的定位

AAIF（Agentic AI Foundation）官方项目，源自阿里巴巴。**不重新发明虚拟化引擎**，而是在既有基础设施上提供标准沙箱控制层。

**两级后端路由**：

```text
runtime.type = "docker"      → DockerSandboxService
runtime.type = "kubernetes"  → CompositeSandboxService
        ├─ templateId    → FastSandboxService（Firecracker microVM）
        └─ image/snapshotId → KubernetesSandboxService
现有沙箱操作 → 按 ID 前缀分发（fsb- 前缀走 Fast Sandbox）
```

官方原话：**「the ID prefix is the dispatcher」**。

### 五种隔离运行时

| 运行时 | 机制 | 启动开销 | 内存 |
|---|---|---|---|
| runc（默认） | 进程级 cgroups | ~0ms | 极小 |
| gVisor | 用户态内核 | ~10-50ms | ~50MB |
| Kata (CLH) | Cloud Hypervisor | ~200ms | ~10-20MB |
| Kata (Firecracker) | microVM | ~125ms | ~5MB |
| Kata (QEMU) | 完整 VM | ~500ms | ~20-50MB |

### 三个必须知道的约束

1. **`[secure_runtime]` 是服务端启动配置，不是创建沙箱的字段。** 一个 Lifecycle Server 只能给所有模板模式沙箱套同一套 profile。runc 与 Kata 混跑要**两套独立寻址的部署**，客户端按需路由。
2. **gVisor 不支持所需的 nftables 特性，egress 策略在 gVisor 上两条路都走不通——Kata 是受支持的 secure runtime。** 「用 gVisor 省资源」与「要精细出网管控」当前互斥。
3. **Firecracker 与 gVisor 的系统调用兼容性分别是「有限」和「部分」。**

### Fast Sandbox：64ms 的标题数字 vs 62 秒的现实

2026-10-08 ACK 集群实测（原始 JSON 在仓库 `docs/public/benchmarks/`）：

| 场景 | p50 | p90 | p99 | 成功率 |
|---|---:|---:|---:|---:|
| SDK 创建（串行基线） | **64.0 ms** | 93.8 ms | 108.3 ms | 100/100 |
| SDK 创建（并发 10） | 102.7 ms | 120.1 ms | **125.4 ms** | 100/100 |
| SDK 创建（并发 20） | 136.7 ms | 163.0 ms | 197.0 ms | **51/100** |

**官方自己给的三条警告比标题数字更重要**：

1. **「Do not substitute the runtime number for SDK resume.」**
   同节点恢复：runtime 恢复只要 35.49ms，但 **SDK 恢复到 guest `/ping` 200 的中位数是 62.66 秒**（58.29~65.16s）。官方明说这 60 秒的差距**未被隔离归因**。
2. **并发 20 的分位数「只含成功样本」。** 100 次里 **48 次 `SandboxRateLimitException`（HTTP 429）**，另有 1 次就绪超时伴随网关 503。官方结论：这次运行没证明 20 路并发可用，也没证明可持续 QPS。
3. **快照恢复慢得惊人**：接受 14.4ms → Ready **60.63s** → 冻结转储 11.14s → 产物发布 46.22s（2GiB rootfs + 2GiB 内存）。

> **选型启示**：64ms 是「**创建**」的数字。如果场景是「暂停几百个 Agent 再批量唤醒」，该看的是 62 秒。官方补充：**「These are engineering measurements, not a production latency guarantee.」**

### 架构原则

1. **Protocol First**——公共行为从 `specs/` 的 OpenAPI 契约开始（4 份 spec：lifecycle / execd / egress / diagnostic）
2. **Control Plane vs Data Plane**——控制面编排校验，`execd` 负责沙箱内操作
3. Runtime Neutral API, Runtime Specific Execution
4. Secure Defaults with Explicit Escape Hatches
5. Observable Failures——状态带 `state`/`reason`/`message`/转换时间

### sandbox / session / agent 的准确区分

| 概念 | 是什么 | 不是什么 |
|---|---|---|
| **Sandbox** | 平台资源，有状态机 `Pending→Running→Pausing→Paused→Stopping→Terminated`（+Failed）、TTL、端点 | — |
| **Session** | `execd` 内的执行概念。`POST /session` 是保持 shell 状态的会话；`/v1/isolated/session` 是带 overlay 挂载的隔离执行上下文，支持 diff/commit | **不是**生命周期对象，不 outlive 它的沙箱 |
| **Agent** | **客户端**。`specs/` 里没有 first-class agent 资源、没有 agent CRD、没有 agent spec | **不是**平台资源 |

唯一把 agent 做成平台概念的是 K8s workload provider `agent-sandbox`——但那是**另一个上游项目 `kubernetes-sigs/agent-sandbox` 的 CRD**，被 OpenSandbox 消费。

Fast Sandbox 的层级：**Fastlet pod → sandbox（Firecracker microVM）→ `execd` → session**。

## L2 能力控制层

### nono 的立身之本：明确拒绝做 guest/host 边界

Sigstore 团队出品（PyPI/npm/brew/Maven Central 供应链认证标准制定方），4.8k Stars，Rust，Apache-2.0。

官方原话：

> "nono provides fine-grained **capability control** sandboxing… **This is intentionally a different model from a guest/host isolation boundary sandbox model**… **It is a capability model, not a VM model.**"

**它不创造隔离边界，它削减进程及其子进程的权限半径。**

### 内核强制机制

| OS | 机制 | 关键限制 |
|---|---|---|
| Linux | **Landlock LSM**（非特权自限制） | 需 5.13+；ABI 逐级解锁（v4 需 6.7+ 才有 TCP bind/connect）；**只管 TCP，UDP 不覆盖**（靠 seccomp 静态过滤器补 `io_uring_setup`） |
| macOS | **Apple Seatbelt** | **无法按域名过滤**；**无 capability expansion**（SIP 剥掉 `DYLD_INSERT_LIBRARIES`）；**无资源限制**（无 cgroups） |
| Windows | **无原生后端** | 仅 WSL2；WSL2 内核 6.6 拿不到 Landlock v4，**无按端口 TCP 过滤**；capability elevation 因 `EBUSY` 不可用 |

**主动排除的做法**：不用 LD_PRELOAD / DYLD_INSERT_LIBRARIES 强制（内置不可覆盖 deny-list）；不用 ptrace 强制（仅作防御）。不用 SELinux / AppArmor（Landlock 允许任意进程自我限制，无需 root 配置）。

### 「零延迟」的机制

| 指标 | nono | Docker |
|---|---|---|
| 启动 | `real 0m0.005s`（**5ms**） | 热 350ms / 冷 2.5s |
| 内存 | ~0MB | 10-50MB |
| 磁盘 | ~2MB 单二进制 | 每镜像 100MB+ |
| 文件打开系统调用开销 | **3-10 微秒** | — |

**supervisor/proxy 架构，不是 LD_PRELOAD 垫片**：

- **监督模式（`nono run`，默认）**：fork 后**只沙箱化子进程**，父进程不受限（做审计、能力扩展、网络代理、回滚快照）。代价：父进程必须活着。
- **直连模式（`nono wrap`）**：施加沙箱后直接 exec，**nono 从进程树彻底消失**。代价：无审计、无回滚、无代理、无能力扩展。

强制走两条路：

1. **主路径——内核 LSM。** 规则在 `exec()` 前施加，`restrict_self()` / `sandbox_init()` 后**永久生效并被子进程继承**。官方：**「The only escape is a kernel exploit.」**
2. **协商路径——seccomp user notification。** 只拦 `openat` 和 `openat2`，用于需授权的路径访问与 AF_UNIX 仲裁；授权后 supervisor 用 **`SECCOMP_IOCTL_NOTIF_ADDFD`** 注入 fd。

「其他系统调用全速通过、零开销」成立——因为只拦两个。代价官方也承认：**`stat` 和 `access` 未被拦截**，可枚举文件系统结构。

### Capability Broker：每个工具一个临时沙箱

1. Agent 调用命令（`git`/`kubectl`/`curl`）
2. `PATH` 上的**命令中介 shim**把调用与调用者身份发给受信 supervisor
3. supervisor 解析适用的 command / caller-to-command 策略
4. **在全新命令沙箱里启动该工具**——最小运行时基线 + 该策略的 fs/network/env/credential/argv/output/resource 授权
5. 链式命令再次穿过 broker，拿到属于它自己的策略

**「临时」= 每次调用一个新 fork 进程 + 一套新规则，不是每个命令一个容器。** 命令沙箱**不继承**会话的 `--allow`、CWD 访问、宽泛 profile 组、原始凭据路径或网络策略。

Linux 上验证过的可执行文件**按 fd 启动**（绕开 TOCTOU）；macOS 必须按路径 `execve()`，可写可执行文件仍可能被替换——官方警告高保障 macOS 策略应避免 `allow_writable_executable`。

### 凭据：Phantom Token

真实凭据待在**不受沙箱限制的 supervisor** 里。Agent 打 `http://127.0.0.1:<port>/<service>/...`，代理剥前缀、注入真 Key、走上游 TLS、流式回传。**子进程环境变量和内存里都没有真凭据。**

**Phantom token**：每次会话用 `getrandom` 生成 **256-bit 随机令牌**，以 `NONO_PROXY_TOKEN` 交给子进程——**这个幻影令牌就是会话令牌本身**。代理先校验再替换，无效/缺失 → **401**；**比较是常数时间**的。

- 注入位点：`header`（默认）、`url_path`、`query_param`、`basic_auth`
- 凭据来源：`op://`（1Password）、`bw://`、`apple-password://`、`keyring://`、`file://`、`env://`、`cmd://`
- 密钥以 `Zeroizing<String>` 存储，drop 时擦除；**只加载一次，从不落盘、从不进日志**
- **OAuth**：真 token 改写成幻影值，保留最长 90 天，幻影上限 4096 个
- **SPIFFE/SPIRE**：出站用 SVID 认证，profile 里无秘密

### 供应链：Sigstore 验 Skill 与指令文件

**nono 相对于所有沙箱方案最独特的一层——给 Agent 吃的文件（Skill / Hook / 指令文件）做来源认证，而不只是镜像签名。**

三层结构（SLSA provenance 风格）：DSSE envelope（签名覆盖 PAE）→ in-toto v1 Statement → Sigstore bundle v0.3（免密钥带 Fulcio 链 + Rekor 包含性证明，可离线验证）。

信任策略三层组合，**取最严**（deny > warn > audit），**项目级不能削弱用户级或内嵌级**：

| 层级 | 位置 | 定义什么 |
|---|---|---|
| 内嵌 | 二进制内置 | 基线 include 模式 |
| 用户 | `~/.config/nono/trust-policy.json` | **信任谁** |
| 项目 | `<项目根>/trust-policy.json` | **验什么** |

Blocklist digest **永远硬拒绝**，即使 enforcement 是 warn/audit。

**执行时机的平台差异**：

- **Linux**：真正的运行时拦截——每次 `openat()` 被拦，supervisor 校验 bundle 后放行，失败 `EPERM`
- **macOS**：**仅启动时**——给每个已验证文件生成 `(deny file-write-data ...)` 规则使其结构上不可变。**沙箱起来后新出现的匹配文件，若父目录有读权限仍可读**
- 预执行扫描**不认 `.gitignore`**——「adding a file to `.gitignore` cannot bypass trust verification」

**`agent-sign` GitHub Action**：装 CLI → `nono trust sign --keyless` → 用 audience `nono-registry` 换 OIDC → 注册表校验身份 → 短期上传 token → 发版。

### 审计：哈希链 + Merkle + 会话级签名

| 层级 | 机制 |
|---|---|
| 审计记录 | 受信 supervisor 写，**沙箱子进程无法篡改自己的日志** |
| 日志完整性（默认开） | 事件计数 + 有序事件流**哈希链头** + 全部事件叶 **Merkle root** |
| 文件系统完整性 | 遍历受追踪可写目录，记录前后 Merkle root |
| 回滚 | 内容寻址快照 |
| 审计签名 | **每会话终结时签一次**，覆盖最终 Merkle root + 会话上下文，写入 keyed DSSE bundle |

官方明说：**「nono does not sign each individual audit event.」**

诚实披露的局限：

- 「The current ledger is still local host state… a host attacker who can rewrite both the session files and the ledger can forge a self-consistent history.」
- `session.json` **只在终结时写**——**未完成会话没有持久可发现的开始记录**，崩溃可恢复的审计持久化是「planned future work」
- 脱敏「is not a complete secret detector」

### 回滚：内容寻址 + 每文件原子替换

```text
$XDG_STATE_HOME/nono/rollbacks/<session-id>/
  manifest.json          # 元数据、Merkle root、时间戳
  objects/ab/cd1234...   # 按 SHA-256 存储，自动去重
  snapshots/0/           # 基线
  snapshots/1/           # 终态
```

**「Atomic」的准确含义**：**每文件**原子 rename 防部分恢复——但**跨文件不是原子的**。默认上限 10 会话 / 5GB。

关键区分：**这是用户态快照，不阻止写入，只让写入可逆。** 与 Landlock/Seatbelt 正交。

### Registry 与策略表达力

`registry.nono.sh` 上 17 个 `nolabs-ai` 官方包，最高下载量：`claude`（37,216）、`opencode`（7,176）、`codex`（5,674）、`pi`（4,630）。

```bash
nono search pi
nono pull nolabs-ai/pi          # 本地校验 Sigstore bundle，lockfile 钉住签名者
nono run --profile nolabs-ai/pi -- pi
nono profile init my-agent --extends nolabs-ai/pi
```

**拉取流程**：拉 manifest → 下载产物与 `.bundle` → **本地校验 Sigstore bundle** → 校验签名仓库 org 与包命名空间一致 → lockfile 钉住签名者 → 安装。`--force` 会**绕过签名者变更提示**。

Profile 是 JSON（可用 JSONC），有发布的 JSON Schema（draft 2020-12，`additionalProperties: false`），30 个顶层属性。组合代数官方原文：

```text
((default_profile_groups + profile.groups.include) - profile.groups.exclude)
+ profile.filesystem.{allow,read,write}
+ profile.commands.allow
- (deny_groups + profile.filesystem.deny + profile.commands.deny)
+ profile.filesystem.bypass_protection
+ CLI flags
```

内置 45 个策略组、9 个内置 profile。`default` 含 18 组，`dangerous_commands` **跨平台 deny 27 个命令**：`rm` `rmdir` `dd` `chmod` `chown` `chgrp` `mv` `cp` `truncate` `scp` `rsync` `sftp` `ftp` `xargs` `sudo` `su` `doas` `pip` `npm` `kill` `killall` `pkill` `shutdown` `reboot` `halt` `poweroff`。

**「策略留在 Agent 触达不到的地方」** 是 nono 的立身之本。官方例子：

> - `aws` CLI 能用某凭据，但 `curl` 不能。
> - `gh` 能读 issue 和 PR，但只能发到 `org/foo`。
> - `git` 能在自己策略下调 `ssh`，而 Agent 不能直接调 `ssh`。

**注意最后一条的方向性**：策略可以允许 Agent 通过 `git` **间接**调 `ssh`，但阻断 Agent **直接**调 `ssh`。这正是「能力模型」相对「白名单」的表达力优势。

## L3 策略治理层

见 [[patterns/agent-runtime-safety-guardrails]]。其 Five Enforcement Layers 中「系统隔离」只是五层里的一层：

| 层级 | 主要控制 | 强制点 |
|---|---|---|
| 信息边界 | 归一化、可信/不可信分槽、I/O 脱敏、最小知识 | 上下文入口与输出出口 |
| 工具系统 | 默认拒绝、白名单、细粒度权限、版本与 Schema 锁定 | 工具注册与授权层 |
| 执行编排 | pre-dispatch、成本包络、HITL、Trip Wire、熔断 | 工具调用前与运行循环 |
| **系统隔离** | **OS 沙箱、受控网络、短时凭证** | **宿主机与网络边界** |
| 门禁审计 | CI、安全扫描、Rubric、状态快照、审计与回滚 | 合入、发布和持久化前 |

八条 Non-negotiable Rules 中的关键几条：

1. 高危能力不应常驻可用，必须按任务授权并及时回收
2. **工具执行前必须存在模型无法绕过的决策点**
3. **外部数据只能作为证据，不能自动升级为指令**
4. 语义明确且有副作用的参数必须由代码验证，缺失即拒绝

红/黄/绿三卡 HITL：「HITL 的目标不是让人确认一切，而是把人的注意力集中在高破坏和高不确定决策上」。

**L3 与 L2 的接口**：护栏模式里那句「工具执行前必须存在模型无法绕过的决策点」，在 L2 有了具体实现形态——就是 nono 的 Capability Broker：**模型无法绕过 supervisor，因为决策点在 supervisor 手里，不在模型的上下文里**。

## 正交对照

| 维度 | OpenSandbox（L1） | nono（L2） |
|---|---|---|
| 隔离原语 | 容器 / **Firecracker microVM**——**guest/host 边界** | **Landlock / Seatbelt**——**进程级能力控制，无 guest/host 边界** |
| 隔离粒度 | 每沙箱、每沙箱出网策略、每沙箱凭据绑定 | **每文件、每命令、每域名、每凭据路由、每 HTTP 方法+路径** |
| 根权限 | Docker daemon / K8s / **裸金属 KVM 节点** | **完全不需要**（无 root、无 CAP_SYS_ADMIN、无 setuid） |
| 凭据 | **Credential Vault**（egress sidecar）；原始秘密不进工作负载 | **Phantom token** + supervisor 反向代理；既不在沙箱内也不在环境变量 |
| 供应链 | **Cosign** 签**容器镜像** + provenance；无 per-agent-file 方案 | **Sigstore 原生**，**同时覆盖 Agent 文件与 pack** |
| 审计 | 沙箱内 eBPF（**OSEP-0018 计划中**） | **哈希链 + Merkle + 可选会话级 DSSE**；本地账本 |
| 启动 | runc ~0ms / gVisor ~10-50ms / Kata-FC ~125ms / **Fast Sandbox 创建 p50 64ms** | **5ms** |
| 治理 | **AAIF**（源自阿里）；OSEP 流程 | **Sigstore 团队 / nolabs-ai**；NEP 流程 |

**官方给出的组合建议**：

> "For hostile-code execution, multi-tenant services, or deployments that require a strong guest/host boundary, use a suitable container or microVM as the perimeter and **use nono for fine-grained control inside it**."

即 **L1 做粗粒度周界，L2 在周界内做细粒度管控**。

## 选型路径

| 场景 | 需要 | 理由 |
|---|---|---|
| **A. 本地开发机跑 Coding Agent** | 只用 **L2** | 本地单用户无多租户需求，guest/host 边界成本远大于收益。nono 防护的正是本地高频事故：误删文件、误读 SSH 私钥、误发凭据 |
| **B. 多租户 SaaS，租户代码互不可见** | 必须 **L1 强隔离** | nono **做不到**——它明确不创造 guest/host 边界，且**共享宿主 PID namespace**（沙箱进程能看到其他进程，容器做不到） |
| **C. 集群跑生产任务，要精细管控凭据与出网** | **L1 + L2 组合** | OpenSandbox 提供 microVM 周界，nono 在周界内管凭据代理与出网 |
| **D. 执行来自公网/第三方仓库的不可信代码** | **L1 强隔离 + L3 HITL** | gVisor 系统调用兼容性「部分」、Firecracker「有限」，且 gVisor 上 egress 走不通——**Kata 是受支持的 secure runtime**。不可信代码 + 出网需求同时存在时别选 gVisor |
| **E. 管「谁发布的 Skill 能被 Agent 加载」** | **L2 的独占区** | 其他人做镜像签名，只有 nono 做 per-agent-file attestation。**Agent 吃的是文件不是镜像**——被篡改的 SKILL.md 比恶意容器更贴近真实攻击面 |

## 已知边界与盲区

### OpenSandbox 侧

1. Fast Sandbox 恢复是**分钟级**，且 60 秒差距**未被归因**
2. 并发 20 有 **48/100 被限流**，官方明说未证明可持续吞吐
3. `[secure_runtime]` 进程级配置，runc/Kata 混跑要两套部署
4. **gVisor 上 egress 策略不可用**
5. Fast Sandbox **拒绝 `credentialProxy.enabled` 与卷挂载**
6. Fastlet/FastPath 的 CRD 归 `opensandbox-group/fast-sandbox` 平台所有，**跨仓库版本耦合**
7. 沙箱内审计（eBPF）仍是 **OSEP-0018 计划中**

### nono 侧

1. **`stat`/`access` 未被拦截**——可枚举文件系统结构
2. **Landlock 只管 TCP，UDP 不覆盖**
3. **审计账本只在本机，无外部锚定**
4. **`session.json` 只在终结时写**——未完成会话无持久开始记录
5. **macOS 信任校验仅启动时**；无 capability expansion、无按域名过滤、无资源限制
6. **WSL2 降级明显**：无按端口 TCP 过滤、capability elevation 不可用、凭据代理默认禁（需 `wsl2_proxy_policy: "insecure_proxy"`）
7. **Landlock 是 allow-list，无法表达「允许范围内的拒绝」**——AGENTS.md 明写「不要创建会抵消必需拒绝的宽泛授权」
8. **`intercept` 的 `sandbox` 覆盖「完全替换」选定沙箱**，官方明说「it can grant capabilities the base sandbox does not」
9. **没有基准测试套件**——唯一可比对手是 Docker，**无与 gVisor/Firecracker/E2B 的性能对照**
10. **审计签名是每会话一次**，事件级不可否认性要靠哈希链验证
11. **1.0 前 API 仍在稳定**
12. **ROADMAP 里 Windows 后端还是 draft**，NEP-0007 计划把 supervisor 决策/审计/凭据拆到 microVM guest 之外——**团队自己也认为「supervisor 是信任假设」尚未解完**

### 共同盲区

- **供应链信任根的选择未被解决。** Sigstore 免密钥依赖 Fulcio 的 OIDC 身份——「哪个组织的哪个 workflow 有权签发这个 Skill」是策略问题，不是密码学问题
- **「Agent 的意图」不可见。** 两层都管**动作**不管**意图**。被诱导的 Agent 可能在完全合法的权限范围内做破坏性决策——这需要 L3 的 HITL，而 L3 是最难规模化的一层
- **可观测性成本与审计强度成反比**：nono 全量审计要哈希链 + Merkle，OpenSandbox 沙箱内 eBPF 还在计划中——**出事时能查到什么，取决于当初愿意付多少成本**

## 相关页面

- [[sources/agent-sandbox-survey]] — 九大方案选型矩阵与 L0–L4 分层
- [[sources/agent-sandbox-k8s]] — Kubernetes SIG Agent Sandbox 声明式 CRD
- [[sources/deepseek-dsec-sandbox-infrastructure]] — DSec 四级异构后端与训练/沙箱生命周期解耦
- [[sources/dannykkg-ai-sandbox-primer]] — Container / 虚拟机 / Sandbox 的关系
- [[patterns/agent-runtime-safety-guardrails]] — L3 策略治理层
- [[concepts/durable-execution]] — 持久可恢复执行
- [[concepts/agentscope-managed-agents]] — Brain/Hands 分离的运行时底座
- `/md/columns/agentic-engineer/agent-sandbox-three-layer-model` — 本概念页的完整长文版
