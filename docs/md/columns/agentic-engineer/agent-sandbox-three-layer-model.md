---
title: "Agent 沙箱的三层分工：隔离边界、能力控制与策略治理"
date: "2026-11-02"
source: "原创 · 基于 OpenSandbox / nono / AX / DSec / Agent Sandbox 调研的一手文档"
url: "https://github.com/opensandbox-group/OpenSandbox"
---

# Agent 沙箱的三层分工：隔离边界、能力控制与策略治理

> 「沙箱」这个词在 2026 年的 Agent 生态里被用得极其含混。同一个词底下压着三件不同的事：Agent 在哪跑、Agent 能碰什么、以及 Agent 的动作要不要人点头。选错层的代价不是「防护差一点」，而是**整套威胁模型从根上就错位**。

<!-- more -->

这篇把知识库里已有的九大沙箱方案调研、DeepSeek DSec 论文拆解、运行时安全护栏模式，加上本轮新增的 **OpenSandbox**（AAIF 官方沙箱运行时）与 **nono**（Sigstore 团队的 Agent 运行时安全工具），统一到一张三层图上。

先说结论：**OpenSandbox 和 nono 不是竞品，它们在不同的层，互不替代。** 混淆这两者是当前最常见的选型错误。

---

## 一、先破一个概念混淆：「沙箱」至少指三件事

在 Agent 语境里，「沙箱」至少承担三个互不等价的职责：

| 层 | 回答的问题 | 失败时的后果 | 典型代表 |
|---|---|---|---|
| **L1 隔离边界层**<br>Isolation Boundary | **Agent 在哪跑？** | 恶意代码逃逸到宿主机，影响其他租户 | OpenSandbox、AX、DSec、CubeSandbox、E2B、gVisor/Kata/Firecracker |
| **L2 能力控制层**<br>Capability Control | **Agent 能碰什么？** | Agent 读了不该读的文件、拿到了不该拿的凭据、连了不该连的域名 | nono |
| **L3 策略治理层**<br>Policy Governance | **这个动作要不要人点头？** | 删库、推生产、动资金——不可逆动作被自动执行 | 护栏模式、HITL、CI 门禁、审计回放 |

**这三层的失效模式完全不同，防护手段也完全不同，混在一起谈「沙箱够不够安全」是没有意义的。**

一个具体例子说明为什么必须拆开：

> Agent 在一台有 root 的开发机上跑，它用 `curl` 拿走了 `~/.aws/credentials`，然后把内容 POST 到了一个陌生域名。
>
> - L1 隔离边界：**没有失败**——它确实就在开发机上跑，隔离边界本来就没打算管这个。
> - L2 能力控制：**失败了**——凭据本该在沙箱外，`curl` 本该被网络策略拦下。
> - L3 策略治理：**也失败了**——这类动作本来就不该走 HITL 审批流程（否则 Agent 什么都干不了），它应该在 L2 就被挡掉。

**结论：L3 不是 L2 的替代品，L2 也不是 L1 的替代品。** HITL 审批不可能覆盖 Agent 每一次 `ls`；反过来，文件权限控制也管不了「这个 PR 能不能合」。

---

## 二、L1 隔离边界层：OpenSandbox 代表的路线

知识库里的《Agent Sandbox 智能体任务沙箱调研与选型》已经给出过 L0–L4 五层模型（L0 受控本地进程 → L4 生产级 Agent 算力平台），并横向对比了九大方案。**OpenSandbox 在那张矩阵里的定位是「统一沙箱服务层（API）」**——它不重新发明虚拟化引擎，而是在既有基础设施之上提供一套标准控制层。

这一轮补充的一手信息，让这个定位更清晰了。

### 2.1 隔离后端：五个技术栈，靠 ID 前缀分发

OpenSandbox 的后端选择是**两级路由**：

```text
runtime.type = "docker"      → DockerSandboxService（本地/单机）
runtime.type = "kubernetes"  → CompositeSandboxService
        ├─ 带 templateId  → FastSandboxService（Firecracker microVM）
        └─ 带 image/snapshotId → KubernetesSandboxService
现有沙箱操作 → 按 ID 前缀分发，fsb- 前缀走 Fast Sandbox
```

官方文档一句话点破了 Fast Sandbox 的调度方式：**「the ID prefix is the dispatcher」**——ID 前缀就是分发器。

支持的隔离技术栈与启动开销（官方 `secure-container.md` 表格）：

| 运行时 | 隔离机制 | 启动开销 | 内存开销 |
|---|---|---|---|
| runc（默认） | 进程级 cgroups | ~0ms | 极小 |
| gVisor | 用户态内核（系统调用拦截） | ~10-50ms | ~50MB |
| Kata (CLH) | Cloud Hypervisor | ~200ms | ~10-20MB |
| Kata (Firecracker) | microVM | ~125ms | ~5MB |
| Kata (QEMU) | 完整 VM | ~500ms | ~20-50MB |

**两个必须知道的约束**（都出自官方文档，不是我的推断）：

1. **`[secure_runtime]` 是服务端启动配置，不是创建沙箱时的字段。** 一个 Lifecycle Server 进程只能给所有模板模式沙箱套同一套 runtime profile。想同时提供 runc 和 Kata，得跑**两套独立寻址的 Lifecycle Server**（如 `opensandbox-runc` 与 `opensandbox-kata`），客户端按需路由。
2. **gVisor 不支持所需的 nftables 特性，所以 egress 策略在 gVisor 上两条路都走不通——Kata 是受支持的 secure runtime。** 这意味着「用 gVisor 省资源」和「要精细出网管控」在当前是互斥的。

### 2.2 Fast Sandbox：64ms 的标题数字与 62 秒的现实

官方 2026-10-08 的 ACK 集群实测（原始 JSON 已在仓库 `docs/public/benchmarks/`）：

| 场景 | p50 | p90 | p99 | 成功率 |
|---|---:|---:|---:|---:|
| SDK 创建（串行基线） | **64.0 ms** | 93.8 ms | 108.3 ms | 100/100 |
| SDK 创建（并发 10） | 102.7 ms | 120.1 ms | **125.4 ms** | 100/100 |
| SDK 创建（并发 20） | 136.7 ms | 163.0 ms | 197.0 ms | **51/100** |

运行时阶段拆解（并发 10）：runtime 创建 34.1ms，rootfs 准备 2.76ms，VM 状态加载 0.234ms。

**但同一个文档自己给出了三条「别被标题数字骗了」的警告，这三条比标题数字更重要：**

1. **「Do not substitute the runtime number for SDK resume.」**
   同一节点恢复实测：SDK 恢复到 guest `/ping` 返回 200，**中位数 62.66 秒**（58.29~65.16 秒）。runtime 恢复确实只要 35.49ms，但**可用的 SDK 恢复约一分钟**。官方明说这个差距**没有被隔离归因**——不确定是网络、网关、endpoint 解析还是重试机制造成的。

2. **并发 20 的分位数「只含成功样本」。**
   那 100 次里有 **48 次 `SandboxRateLimitException`（HTTP 429 / Fastlet CapacityRejected）**，另有 1 次就绪超时伴随网关 503 反复。官方结论：**这次运行没有证明 20 路并发是可用的准入能力，也没有证明可持续的每秒请求数。**

3. **快照恢复慢得惊人**：request 接受 14.4ms → Ready **60.63 秒** → 冻结转储 11.14 秒 → 产物发布 46.22 秒（2GiB rootfs + 2GiB 内存）。

> **选型启示**：Fast Sandbox 的 64ms 是「**创建**」的数字。如果你的场景是「暂停几百个 Agent、之后批量唤醒」，那你真正该看的是 62 秒这个数，而不是 64 毫秒。官方还补了一句：**「These are engineering measurements, not a production latency guarantee.」**

### 2.3 架构：协议优先 + 控制面/数据面分离

OpenSandbox 的架构文档给了五条设计原则，其中前两条最关键：

1. **Protocol First**——「Public behavior starts from OpenAPI contracts in `specs/`」。`specs/` 目录里有四份 spec：`sandbox-lifecycle.yml`（生命周期 API，base path `/v1`）、`execd-api.yaml`（沙箱内执行）、`egress-api.yaml`（出网策略 + 凭据代理）、`diagnostic-api.yml`。
2. **Control Plane vs Data Plane**——控制面编排校验，数据面 `execd` 负责沙箱内操作。
3. Runtime Neutral API, Runtime Specific Execution——共享概念（资源限制、卷、端点、网络策略、元数据），不同物化实现。
4. Secure Defaults with Explicit Escape Hatches。
5. Observable Failures——沙箱状态带 `state`/`reason`/`message`/转换时间。

**关于「sandbox vs session vs agent」的一个重要澄清**（这一点很多资料会搞混）：

- **Sandbox** 是平台资源，有状态机 `Pending → Running → Pausing → Paused → Stopping → Terminated`（+ `Failed`）、有 TTL、有端点，由容器或 microVM 物化。
- **Session** 是 `execd` 内的执行概念，不是生命周期对象。`POST /session` 建的是**保持 shell 状态**的会话；`/v1/isolated/session` 建的是带**overlay 挂载**的隔离执行上下文（root overlay + `/workspace` overlay，`persist: true|false`），支持 `diff`/`commit`。
- **Agent** 是**客户端**，不是平台资源。`specs/` 里**没有** first-class agent 资源、没有 agent CRD、没有 agent spec。唯一把「agent」做成平台概念的是 Kubernetes workload provider `agent-sandbox`——但那是**另一个上游项目 `kubernetes-sigs/agent-sandbox` 的 CRD**，被 OpenSandbox 消费。

Fast Sandbox 还加了一层：**Fastlet pod → sandbox（Firecracker microVM）→ `execd` → session**。Fastlet 是预热的 Pod，一个 Pod 托管多个沙箱（基准测试里 5 Fastlets × 4 slots = 20 slots），共享出口与 DNS 以摊薄成本。

---

## 三、L2 能力控制层：nono 代表的是另一条路

nono 是这一轮**知识库完全空白**的一层。它由 **Sigstore 团队**（PyPI / npm / brew / Maven Central 供应链认证标准的制定方）出品，4.8k Stars，Rust 实现，Apache-2.0。

### 3.1 关键定位：它明确拒绝做 guest/host 边界

nono 文档里有一句话，是整个对比的题眼：

> "nono provides fine-grained **capability control** sandboxing… **This is intentionally a different model from a guest/host isolation boundary sandbox model**. It reduces the authority available to a process and any child process it spawns, but it does not create a separate kernel or hardware boundary. **It is a capability model, not a VM model.**"

翻译成工程语言：**nono 不创造隔离边界，它削减进程及其子进程的权限半径。** 两者是正交的。

内核强制机制按 OS 分：

| OS | 机制 | 关键限制 |
|---|---|---|
| **Linux** | **Landlock LSM**（非特权自限制） | 需内核 5.13+；ABI 逐级解锁（v4 需 6.7+ 才有 TCP bind/connect）；**只管 TCP，UDP 不覆盖**（靠 seccomp 静态过滤器补 `io_uring_setup` 缺口） |
| **macOS** | **Apple Seatbelt**（`sandbox_init()`） | **无法按域名过滤**（Seatbelt 不支持），改用二进制级网络控制；**无 capability expansion**（SIP 会剥掉 `DYLD_INSERT_LIBRARIES`） |
| **Windows** | **无原生后端** | 仅支持 WSL2（跑 Linux 路径）；WSL2 内核 6.6 拿不到 Landlock v4，**无按端口 TCP 过滤**；capability elevation 因 `EBUSY` 不可用 |

**注意它主动排除了什么**：不用 LD_PRELOAD / DYLD_INSERT_LIBRARIES 做强制（这两个在不可覆盖的内置 deny-list 上，永远不可放行）；不用 ptrace 做强制（只作为防御手段）。这比很多「零延迟沙箱」的做法干净。

### 3.2 「零延迟」是怎么做到的

| 指标 | nono | Docker |
|---|---|---|
| 启动 | `real 0m0.005s`（**5ms**） | 热 350ms / 冷 2.5s |
| 内存开销 | ~0MB | 10-50MB |
| 磁盘 | ~2MB 单二进制 | 每个镜像 100MB+ |
| 文件打开的系统调用开销 | **3-10 微秒** | — |

**机制是 supervisor/proxy 架构，不是 LD_PRELOAD 垫片**：

- **监督模式（`nono run`，默认）**：nono fork 后**只沙箱化子进程**，父进程保持不受限，用来做审计记录、能力扩展、网络代理、回滚快照。代价是父进程必须活着。
- **直连模式（`nono wrap`）**：施加沙箱后直接 exec 进目标，**nono 从进程树彻底消失**。代价是无审计、无回滚、无代理、无能力扩展。

系统调用层面的强制走两条路：

1. **主路径——内核 LSM。** Landlock / Seatbelt 规则在 `exec()` 前施加，`restrict_self()` / `sandbox_init()` 之后**永久生效并被子进程继承**。官方原话：**「The only escape is a kernel exploit.」**
2. **协商路径——seccomp user notification。** 只拦 `openat` 和 `openat2` 两个系统调用，用于需要人工授权的路径访问与 AF_UNIX 仲裁；授权后 supervisor 用 **`SECCOMP_IOCTL_NOTIF_ADDFD`** 把文件描述符直接注入子进程。

**「其他系统调用全速通过、零开销」** 是真实成立的——因为只拦了两个调用。代价是文档自己承认的漏洞：**`stat` 和 `access` 没有被拦截**，子进程可以枚举文件系统结构（存在性、类型、权限）而不触发 supervisor 通知。

### 3.3 Capability Broker：每个工具一个临时沙箱

这是 nono 最独特的设计：

1. Agent 调用某个命令（`git`、`kubectl`、`curl`）。
2. `PATH` 上的**命令中介 shim**把调用与调用者身份发给受信 supervisor。
3. supervisor 解析适用的 command / caller-to-command 策略。
4. **nono 在一个全新的命令沙箱里启动该工具**——最小运行时基线 + 该策略的 fs/network/env/credential/argv/output/resource 授权。
5. 链式命令会再次穿过 broker，拿到属于它自己的策略。

**「临时」的含义是每次调用一个新 fork 进程 + 一套新施加的 Landlock/Seatbelt 规则，不是「每个命令一个容器」。** 命令沙箱**不继承**会话沙箱的 `--allow` 授权、CWD 访问、宽泛的 profile 组、原始凭据路径或网络策略。

Linux 上验证过的可执行文件**按文件描述符启动**（绕开 TOCTOU）；macOS 上必须按路径 `execve()`，所以可写的可执行文件仍可能被替换——官方为此专门警告：**高保障的 macOS 策略应避免 `allow_writable_executable`**。

### 3.4 凭据：Phantom Token 机制

nono 的凭据方案是整个工具里设计最精细的部分。

**代理注入**：真实凭据待在**不受沙箱限制的 supervisor** 里，Agent 打的是 `http://127.0.0.1:<port>/<service>/...`，代理剥掉前缀、注入真实 Key、走上游 TLS、流式回传。**子进程的环境变量和内存里都没有真凭据。**

**Phantom token（幻影令牌）**：每次代理会话用 `getrandom` 生成 **256-bit 随机令牌**，以 `NONO_PROXY_TOKEN` 交给子进程。**这个幻影令牌就是会话令牌本身**——子进程在配置位置用它替代真实凭据，代理在上游把它换回真货。

- **代理先校验幻影令牌，再替换**；无效或缺失 → **401 Unauthorized**
- **比较是常数时间**的，防时序攻击
- 支持四种注入位点：`header`（默认）、`url_path`、`query_param`、`basic_auth`
- 凭据来源：`op://`（1Password）、`bw://`（Bitwarden）、`apple-password://`、`keyring://`、`file://`、`env://`、`cmd://`（调用宿主 CLI 现取，如 `gh auth token`）
- 密钥以 `Zeroizing<String>` 存储，drop 时擦除；**只加载一次，从不落盘、从不进日志**
- **OAuth**：抓真实 token 后把响应里的字段改写成幻影值，幻影只能通过被准入的代理消费者解析。store 里真 token 仅 owner 可读，保留**最长 90 天**，幻影**上限 4096 个**
- **SPIFFE/SPIRE**：出站请求用 SVID 认证，profile 里没有秘密，沙箱进程也看不到

### 3.5 供应链：用 Sigstore 验 Skill 和指令文件

这是 nono 相对于所有沙箱方案最独特的一层。它做的不只是「镜像签名」，而是**给 Agent 吃的 Skill、Hook、指令文件做来源认证**。

三层嵌套结构（SLSA provenance 风格）：

1. **DSSE envelope**——`payloadType: application/vnd.in-toto+json`，签名覆盖 **PAE**（防类型混淆）
2. **in-toto v1 Statement**——`predicateType` 区分 `instruction-file/v1` 与 `trust-policy/v1`
3. **Sigstore bundle v0.3**——免密钥模式带 Fulcio 证书链 + Rekor 透明日志包含性证明（自包含，可离线验证）

信任策略分三层组合，**取最严**（`deny` > `warn` > `audit`），且**项目级策略不能削弱用户级或内嵌策略**：

| 层级 | 位置 | 定义什么 |
|---|---|---|
| 内嵌 | 二进制内置 | 基线 include 模式 |
| 用户 | `~/.config/nono/trust-policy.json` | **信任谁**（发布者） |
| 项目 | `<项目根>/trust-policy.json` | **验什么**（文件范围） |

Blocklist 里的 digest **永远硬拒绝**，即使 enforcement 是 `warn` 或 `audit`。

**执行时机的平台差异很重要**：

- **Linux（seccomp-notify）**：真正的运行时拦截——每次 `openat()` 都被拦，supervisor 校验 bundle 后才放行，失败返回 `EPERM`
- **macOS（Seatbelt）**：**仅启动时**——给每个已验证文件生成一条字面量 `(deny file-write-data ...)` 规则使其在会话内结构上不可变。**沙箱起来之后新出现的匹配文件，若父目录有读权限就仍可读**
- 预执行扫描**不认 `.gitignore`**——「adding a file to `.gitignore` cannot bypass trust verification」

另有 **`agent-sign` GitHub Action**：安装 CLI → `nono trust sign --keyless` → 用 audience `nono-registry` 换 OIDC token → 注册表校验身份 → 返回短期上传 token → 发布版本。

### 3.6 审计：哈希链 + Merkle + 会话级签名

| 层级 | 机制 |
|---|---|
| 审计记录 | 受信 supervisor 写，**沙箱子进程无法篡改自己的日志** |
| 审计日志完整性（默认开） | 事件计数 + 有序事件流的**哈希链头** + 全部事件叶的 **Merkle root** |
| 文件系统完整性 | 遍历可写的受追踪目录，记录前后 Merkle root |
| 回滚 | 内容寻址快照 |
| 审计签名 | **每会话在终结时签一次**，覆盖最终审计 Merkle root + 会话上下文，写入 keyed DSSE bundle |

**官方明说：「nono does not sign each individual audit event.」**

诚实披露的局限（这些是文档自己写的，值得原样记住）：

- 「The current ledger is still local host state. Without a future signature or external anchor, a host attacker who can rewrite both the session files and the ledger can forge a self-consistent history.」——**本地账本没有外部锚定，能同时改文件和账本的主机攻击者可以伪造自洽的历史**
- `session.json` **只在终结时写**——**未完整结束的会话没有持久可发现的开始记录**，崩溃可恢复的审计持久化是「planned future work」
- 脱敏「is not a complete secret detector」

### 3.7 回滚：内容寻址 + 每文件原子替换

```text
$XDG_STATE_HOME/nono/rollbacks/<session-id>/
  manifest.json          # 元数据、Merkle root、时间戳
  objects/ab/cd1234...   # 按 SHA-256 存储，自动去重
  snapshots/0/           # 基线
  snapshots/1/           # 终态
```

**「Atomic」的准确含义**：恢复用**每文件原子 rename** 防止部分恢复——但**跨文件不是原子的**。默认上限 10 个会话、5GB。

关键区分：**这是用户态快照，不阻止写入，只让写入可逆。** 与 Landlock/Seatbelt 是正交的。

### 3.8 Registry：Agent profile 的分发与签名

`registry.nono.sh` 上 **17 个 `nolabs-ai` 官方包**，下载量最高的是 `nolabs-ai/claude`（37,216）、`nolabs-ai/opencode`（7,176）、`nolabs-ai/codex`（5,674）、`nolabs-ai/pi`（4,630）。

```bash
nono search pi                    # 搜索
nono pull nolabs-ai/pi            # 拉取（本地校验 Sigstore bundle）
nono run --profile nolabs-ai/pi -- pi
nono profile init my-agent --extends nolabs-ai/pi   # 派生自己的 profile
```

**拉取流程**：拉 manifest → 下载产物与 `.bundle` → **本地校验 Sigstore bundle** → 校验签名仓库 org 与包命名空间一致 → 在本地 lockfile 里钉住签名者身份 → 安装到 pack store。

`--force` 会**绕过签名者变更提示**——这是一个需要知道的门。

Profile 是 JSON（可用 JSONC），有**发布的 JSON Schema**（draft 2020-12，`additionalProperties: false`），30 个顶层属性。组合代数官方原文：

```text
((default_profile_groups + profile.groups.include) - profile.groups.exclude)
+ profile.filesystem.{allow,read,write}
+ profile.commands.allow
- (deny_groups + profile.filesystem.deny + profile.commands.deny)
+ profile.filesystem.bypass_protection
+ CLI flags
```

内置 **45 个策略组**、**9 个内置 profile**（`default`、`python-dev`、`node-dev`、`go-dev`、`rust-dev` 等）。`default` 含 18 组，其中 `dangerous_commands` **跨平台 deny 27 个命令**：`rm`、`rmdir`、`dd`、`chmod`、`chown`、`chgrp`、`mv`、`cp`、`truncate`、`scp`、`rsync`、`sftp`、`ftp`、`xargs`、`sudo`、`su`、`doas`、`pip`、`npm`、`kill`、`killall`、`pkill`、`shutdown`、`reboot`、`halt`、`poweroff`。

**「策略留在 Agent 触达不到的地方」** —— 这是 nono 的立身之本。官方给的例子：

> - `aws` CLI 能用某凭据，但 `curl` 不能。
> - `gh` 能读 issue 和 PR，但只能发到 `org/foo`。
> - `git` 能在自己策略下调 `ssh`，而 Agent 不能直接调 `ssh`。

**注意最后一条的方向性**：策略可以允许 Agent 通过 `git` **间接**调用 `ssh`，但阻断 Agent **直接**调用 `ssh`。这正是「能力模型」相对「白名单」的表达力优势。

---

## 四、L3 策略治理层：现有知识库已覆盖

L3 在知识库里已有《Agent 运行时安全护栏模式》，其 **Five Enforcement Layers** 里，「系统隔离」只是**第五层中的一层**：

| 层级 | 主要控制 | 强制点 |
|---|---|---|
| 信息边界 | 归一化、可信/不可信分槽、I/O 脱敏、最小知识 | 上下文入口与输出出口 |
| 工具系统 | 默认拒绝、白名单、细粒度权限、版本与 Schema 锁定 | 工具注册与授权层 |
| 执行编排 | pre-dispatch、成本包络、HITL、Trip Wire、熔断 | 工具调用前与运行循环 |
| **系统隔离** | **OS 沙箱、受控网络、短时凭证** | **宿主机与网络边界** |
| 门禁审计 | CI、安全扫描、Rubric、状态快照、审计与回滚 | 合入、发布和持久化前 |

以及八条 Non-negotiable Rules，其中的关键几条：

1. 高危能力不应常驻可用，必须按任务授权并及时回收
2. **工具执行前必须存在模型无法绕过的决策点**
3. **外部数据只能作为证据，不能自动升级为指令**
4. 语义明确且有副作用的参数必须由代码验证，缺失即拒绝

以及红/黄/绿三卡 HITL 分级——「HITL 的目标不是让人确认一切，而是把人的注意力集中在高破坏和高不确定决策上」。

**把这三层叠起来看，护栏模式里那句「工具执行前必须存在模型无法绕过的决策点」，在 L2 有了具体实现形态**——就是 nono 的 Capability Broker：模型无法绕过 supervisor，因为决策点在 supervisor 手里，不在模型的上下文里。

---

## 五、正交对照表

| 维度 | **OpenSandbox**（L1） | **nono**（L2） |
|---|---|---|
| 隔离原语 | 容器（runc/gVisor/Kata）或 **Firecracker microVM**——**guest/host 边界** | **Landlock LSM**（Linux）/ **Seatbelt**（macOS）——**进程级能力控制，无 guest/host 边界** |
| 隔离粒度 | 每沙箱（每容器/VM）、每沙箱出网策略、每沙箱凭据绑定 | **每文件、每命令、每域名、每凭据路由、每 HTTP 方法+路径** |
| 根权限要求 | Docker daemon / K8s 集群 / **裸金属 KVM 节点**（fast-sandbox） | **完全不需要**——无 root、无 `CAP_SYS_ADMIN`、无 setuid |
| 凭据模型 | **Credential Vault**（egress sidecar / 共享 egress 进程）；原始秘密不进工作负载 | **Phantom token** + supervisor 反向代理；凭据既不在沙箱内也不在环境变量里 |
| 供应链认证 | **Cosign** 免密钥签名**容器镜像** + provenance；无 per-agent-file 方案 | **Sigstore 原生**——DSSE + in-toto + Fulcio + Rekor，**同时覆盖 Agent 文件（Skill/指令）与 pack** |
| 审计 | 沙箱内 eBPF 观测（**OSEP-0018 计划/实现中**） | **哈希链 + Merkle root + 可选会话级 DSSE 签名**；本地账本 |
| 启动成本 | runc ~0ms / gVisor ~10-50ms / Kata-FC ~125ms / **Fast Sandbox 创建 p50 64ms** | **5ms**（`0m0.005s`） |
| 运行位置 | 本地 Docker；生产 K8s；fast-sandbox 需裸金属 KVM + 一致 CPU 型号 | 开发机、CI、容器、K8s Pod、microVM |
| 装机方式 | `uvx opensandbox-server`；`pip install opensandbox`；Helm chart | `brew install nono` / `curl \| sh` / Nix flake |
| 治理 | **AAIF**（源自阿里巴巴）；OSEP 流程；Apache-2.0 | **Sigstore 团队 / nolabs-ai**；NEP 流程；Apache-2.0 |
| 成熟度 | Fast Sandbox 仍标注「工程测量，非生产延迟保证」 | **1.0 前 API 仍在稳定**；README 明示 |

### 官方给出的组合建议

nono 文档自己给了部署对照表，措辞非常清楚：

> "For hostile-code execution, multi-tenant services, or deployments that require a strong guest/host boundary, use a suitable container or microVM as the perimeter and **use nono for fine-grained control inside it**."

即：**L1 做粗粒度周界，L2 在周界内做细粒度管控。**

---

## 六、实际选型路径

### 场景 A：本地开发机跑 Coding Agent，想防手滑和凭据泄露

**只需要 L2。** `brew install nono`，然后 `nono run --profile nolabs-ai/claude -- claude`。5ms 启动、零配置、不需要 root、不需要装 Docker。

> **关键判断**：本地单用户场景没有多租户隔离需求，guest/host 边界的成本（容器编排、镜像管理、端口映射）远大于收益。nono 的文件级 + 命令级 + 凭据级控制，防护的正是本地场景真实的高频事故——Agent 误删文件、误读 SSH 私钥、误发凭据。

### 场景 B：多租户 SaaS 服务，租户代码互不可见

**L1 必须，且要用真隔离。** OpenSandbox + Fast Sandbox（Firecracker microVM），或直接用 CubeSandbox / E2B。

> **关键判断**：nono **做不到**这件事——它明确不创造 guest/host 边界，而且**共享宿主 PID namespace**（沙箱进程能看到其他进程，容器做不到）。多租户场景不能拿 nono 当隔离边界。

### 场景 C：Agent 在集群上跑生产任务，要精细管控凭据与出网

**L1 + L2 组合。** OpenSandbox 提供 microVM 周界，nono 在周界内管凭据代理与出网策略。

### 场景 D：Agent 要执行来自公网/第三方仓库的不可信代码

**L1 用强隔离 + L3 上 HITL。** gVisor 系统调用兼容性是**部分**的、Firecracker 也**有限**，且 gVisor 上 egress 策略走不通——**Kata 是当前受支持的 secure runtime**。不可信代码 + 出网需求同时存在时，别选 gVisor。

### 场景 E：团队要管「谁发布的 Skill 能被 Agent 加载」

**这是 nono 的独占区。** 其他人都在做镜像签名，只有 nono 做 **per-agent-file attestation**：用 Sigstore 验 Skill / Hook / 指令文件的来源与完整性，未签名或被篡改的文件在策略覆盖范围内直接拒绝。

> 对 Agent 生态来说这可能比 microVM 更重要——**Agent 吃的是文件，不是镜像。** 一个被篡改的 SKILL.md 比一个恶意容器更贴近真实攻击面。

---

## 七、诚实的边界与未解问题

### OpenSandbox 侧

1. **Fast Sandbox 的恢复是分钟级**，不是毫秒级——官方自己强调「别拿 runtime 数字替代 SDK resume 数字」，且没归因那 60 秒的差距
2. **并发 20 的样本里 48 次被限流**，官方明说这次运行没证明可持续吞吐
3. **`[secure_runtime]` 是进程级配置**，runc 与 Kata 混跑要两套独立部署
4. **gVisor 上 egress 策略不可用**（nftables 特性缺失），与「要出网管控」直接冲突
5. **Fast Sandbox 拒绝 `credentialProxy.enabled` 与卷挂载**——有安全需求的能力组合被禁用了
6. **Fastlet / FastPath 的 CRD 归 `opensandbox-group/fast-sandbox` 平台所有**，不在本仓库——跨仓库的版本耦合是运维隐患
7. **沙箱内审计（eBPF）仍是 OSEP-0018 计划中**，不是已交付能力

### nono 侧

1. **`stat` / `access` 未被拦截**——可枚举文件系统结构（官方承认，认为对「合作型 Agent」可接受）
2. **Landlock 只管 TCP，UDP 不覆盖**，靠 seccomp 静态过滤器补 `io_uring_setup` 缺口
3. **审计账本只在本机**，无外部锚定——能同时改会话文件和账本的主机攻击者可伪造自洽历史
4. **`session.json` 只在终结时写**——未完成会话没有持久开始记录，崩溃恢复是「planned future work」
5. **macOS 上信任校验仅启动时**，且无 capability expansion、无按域名过滤、无资源限制
6. **WSL2 降级明显**：无按端口 TCP 过滤、capability elevation 不可用、凭据代理默认被禁（需 `wsl2_proxy_policy: "insecure_proxy"` 显式放开）
7. **Landlock 是 allow-list，无法表达「允许范围内的拒绝」**——AGENTS.md 里明确写着「不要创建会抵消必需拒绝的宽泛授权」
8. **`intercept` 规则的 `sandbox` 覆盖会「完全替换」选定沙箱**，官方明说「it can grant capabilities the base sandbox does not」
9. **没有基准测试套件**——`grep -ri benchmark` 在 docs/、crates/、ROADMAP、CHANGELOG 里零命中，唯一可比的对手是 Docker，**没有与 gVisor / Firecracker / E2B 的性能对照**
10. **审计签名是每会话一次**，不是每事件——事件级不可否认性要靠哈希链验证，不能靠签名单独保证
11. **1.0 前 API 仍在稳定**，README 明示 API 仍可能变化
12. **ROADMAP 里 Windows 后端还是 NEP draft**，NEP-0007 计划把 supervisor 决策/审计/凭据拆到 microVM guest 之外——**说明 nono 团队自己也认为「supervisor 本身是个信任假设」这个问题还没解完**

### 两个方案共同的盲区

- **供应链信任根的选择本身没被解决。** Sigstore 免密钥模式依赖 Fulcio 的 OIDC 身份——「哪个 GitHub 组织的哪个 workflow 有权签发这个 Skill」是策略问题，不是密码学问题
- **「Agent 的意图」不可见。** 两层都在管**动作**，不管**意图**。一个被诱导的 Agent 可能在完全合法的权限范围内做出破坏性决策——这需要 L3 的 HITL，而 L3 恰恰是三层里最不自动化、最难规模化的一层
- **可观测性的成本与审计的强度成反比**：nono 的全量审计要哈希链 + Merkle root，OpenSandbox 的沙箱内 eBPF 观测还在计划中——**出事时能查到什么，取决于当初愿意付多少成本**

---

## 八、一句话总结

> **OpenSandbox 回答「Agent 在哪跑」，nono 回答「Agent 能碰什么」，护栏模式回答「这个动作要不要人点头」。**
>
> 三层不是三选一，是三明治：**L1 划边界，L2 削权限，L3 留闸门。** 只做 L1，你防得住逃逸防不住误操作；只做 L2，你防得住内鬼防不住逃逸；只做 L3，你会被人审到放弃自动化。
>
> 而如果只能记一句 nono 自己的话，那就是：**「It is a capability model, not a VM model.」** ——先想清楚你要的是哪一种。

---

## 相关阅读

**知识库内已有**

- Agent Sandbox｜智能体任务沙箱调研与选型 — 九大方案选型矩阵与 L0–L4 分层（`wiki/sources/agent-sandbox-survey`）
- 一天 300 万个沙盒，DeepSeek 怎么给 Agent 造环境 — DSec 四级异构后端与训练/沙箱生命周期解耦（`wiki/sources/deepseek-dsec-sandbox-infrastructure`）
- Agent 运行时安全护栏模式 — Five Enforcement Layers 与八条 Non-negotiable Rules（`wiki/patterns/agent-runtime-safety-guardrails`）
- AI 的工作间：Sandbox 入门 — Container / 虚拟机 / Sandbox 的关系（`wiki/sources/dannykkg-ai-sandbox-primer`）
- Durable Execution — 把 Agent 任务进度从调用栈搬进可存储的状态机（`wiki/concepts/durable-execution`）
- 阿里云 AgentCore 架构解析（`columns/agentic-engineer/aliyun-agentcore-enterprise-architecture`）

**官方文档**

- OpenSandbox 架构总览 — `docs/architecture/index.md`
- Fast Sandbox 性能实测 — `docs/architecture/fast-sandbox/performance.md`
- OpenSandbox 规格 — `specs/sandbox-lifecycle.yml`、`specs/execd-api.yaml`、`specs/egress-api.yaml`
- nono 安全模型 — `nono.sh/docs/cli/internals/security-model`
- nono Landlock / Seatbelt / WSL2 实现说明 — `nono.sh/docs/cli/internals/{landlock,seatbelt,wsl2}`
- nono 信任与审计 — `nono.sh/docs/cli/features/{trust,audit,atomic-rollbacks}`
