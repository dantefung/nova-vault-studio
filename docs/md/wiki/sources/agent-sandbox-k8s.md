---
title: "Agent 生成的代码要跑在 K8s 集群，别再手搓 Pod 了？直接用 Agent Sandbox"
date: "2026-08-01"
source: "希里安（阿里云）"
url: "https://mp.weixin.qq.com/s/QQIEMyvTwknUM3N8_HzU9Q"
---

# Agent 生成的代码要跑在 K8s 集群，别再手搓 Pod 了？直接用 Agent Sandbox

> Kubernetes SIG 项目 kubernetes-sigs/agent-sandbox：在 K8s 上用声明式 API，管一类「单实例、有状态、得隔离」的沙箱运行时，特别适合给 AI Agent 跑那些你不太敢直接扔宿主机上的代码。

## 它到底解决什么问题

K8s 擅长两类东西：

- **Deployment**：无状态、可复制、随便杀
- **StatefulSet**：有编号、有稳定身份，但偏一组有状态服务

但 AI Agent 常见需求长这样：

1. 模型生成了一段代码 / shell，你要在集群里真执行
2. 这段东西可能不靠谱，必须隔离（别直接上宿主机内核）
3. 会话要活一阵：文件系统、进程状态、网络身份别动不动丢
4. 常常是一个用户 / 一次任务对应一个单例容器，不是副本集

用 StatefulSet replicas=1 再拼 Service、PVC 也能凑合，就是啰嗦，还缺暂停、休眠、按模板批量开、预热池秒级领取这类专门生命周期。

**Agent Sandbox 就是冲这块空白来的：给单例有状态沙箱一个正经 CRD。**

## 它是啥、不是啥

Agent Sandbox = K8s 上的 **Sandbox 编排器（orchestrator）**。它声明要一个沙箱，控制器去创建/管理对应的 Pod；真正的强隔离交给 RuntimeClass 背后的运行时（如 gVisor、Kata Containers）。

注意边界：

- **不是**再造一套容器安全沙箱内核
- **不是** LangChain / AutoGPT 那种 Agent 应用框架
- **是**：怎么在集群里标准化地开沙箱、挂存储、保身份、管生命周期

对平台工程来说，这很重要——Agent 平台要规模化，最后都得落到租户级隔离运行时这层。

## 核心对象长什么样

主对象是 **Sandbox CRD**（API 组是 `agents.x-k8s.io`）：

- **稳定身份**：主机名 / 网络身份相对稳定，不像普通 Pod 重建就换一套
- **持久存储**：可挂盘，重启不至于会话全没了
- **生命周期**：创建、定时删、暂停 / 恢复等，由控制器管

扩展层：

| 资源 | 作用 |
|------|------|
| SandboxTemplate | 沙箱模板，同类沙箱别复制粘贴 YAML |
| SandboxWarmPool | 预热池：先暖着一批，领取时更快 |
| SandboxClaim | 用户/系统申领一个沙箱（可从暖池领养） |

关系：直接建 Sandbox，或者走 Claim 从 WarmPool 领养 → 控制器拉起 Pod → RuntimeClass 走到 gVisor / Kata。

最小形态示例：

```yaml
apiVersion: agents.x-k8s.io/v1beta1
kind: Sandbox
metadata:
  name: my-sandbox
spec:
  podTemplate:
    spec:
      containers:
        - name: my-container
          image: <IMAGE>
```

装控制器后 `kubectl apply` 即可；项目也提供 Go / Python SDK，方便平台侧程序化开沙箱。

## 和 AI Agent 怎么对上号

把 Agent 链路拆开看：

| 层 | 常见东西 | Agent Sandbox 管不管 |
|----|---------|---------------------|
| 推理与规划 | 模型、Prompt、Skill、工具选择 | 不管 |
| 工具调用协议 | MCP、Function Calling | 不管 |
| 执行环境 | 跑代码、装依赖、落文件、联网 | **管这一层** |
| 隔离强度 | gVisor / Kata / 普通 runc | 编排 + 选 RuntimeClass |

所以：Cursor / 自研 Agent / 企业内部 Copilot，只要「生成代码要在集群里跑」，都会碰到沙箱编排问题。以前各家自研一套 Pod + PVC + NetworkPolicy；现在社区在 SIG Apps 下推一个更标准的 Sandbox API。

官方动机里还写了相近场景：云上开发环境、Jupyter 一类单容器会话、需要稳定身份但不想上完整 StatefulSet 的单 Pod 服务。**Agent 是主叙事，但 API 并不锁死在 Agent。**

## 为什么值得学习收藏

1. **Workload 形态在变**：从长期跑着的微服务，扩展到大量短中期、有状态、强隔离的会话型工作负载
2. **安全默认要升档**：LLM 生成代码默认不可信；只靠 Namespace + 普通人权限，平台很难睡踏实
3. **冷启动是产品体验**：WarmPool / Template / Claim 这套，是在认真回答「用户点一下，沙箱多久就绪」
4. **可编程**：鼓励应用和 Agent 程序化消费 Sandbox API，而不是运维手工点 YAML——和平台工程方向一致

项目挂在 kubernetes-sigs、归属 SIG Apps，说明社区把沙箱工作负载当成正经工作负载类型在推，而不只是某个厂商玩具。

## 安装

官方推荐一份合并清单（Core + Extensions），按 release 版本 `kubectl apply` 即可，也适合 Argo CD / Kustomize 这类 GitOps。

- 文档：https://agent-sandbox.sigs.k8s.io/docs/getting_started/
- Threat Model 文档：真上生产前建议读，别只盯着 CRD 名字酷

## 和我自己做的事有什么关系

作者一直在折腾集群控制台、AI 调查、终端这类人怎么跟集群协作的东西。Agent 一旦要从问答走到代你执行，平台侧立刻会问三句：

- 跑在哪？
- 隔离够不够？
- 会话状态怎么留、怎么回收？

Agent Sandbox 回答的正是这三句里的基础设施部分。上层 Agent 产品可以继续卷体验；下层若能收敛到社区标准 Sandbox API，平台会少造很多轮子。

## 小结

Agent Sandbox：用 K8s CRD/Controller，编排隔离、有状态、单例的沙箱工作负载；特别适合 AI Agent 执行不可信代码。它编排沙箱，不负责替代 gVisor/Kata，也不负责替你写 Agent 逻辑。

**值得收藏的链接**：
- GitHub：https://github.com/kubernetes-sigs/agent-sandbox
- 文档站：https://agent-sandbox.sigs.k8s.io