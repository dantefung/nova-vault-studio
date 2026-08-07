---
title: "AgentScope Java 2.0 源码拆解：分层的艺术"
date: "2026-07-30"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/xmW_z-OS35lYcvAby16i5g"
---

# AgentScope Java 2.0 源码拆解：分层的艺术

> 冻结内核语义，用组合式外壳管理变化——企业级 Agent 平台的工程铁律。

一个做 Agent 平台的朋友吐槽：给公司搭智能体框架，从 ReAct 到 Memory 到 Tool 全自己写，做到一半发现核心 Agent 类膨胀到没人敢动。答案是：去看 AgentScope Java 2.0 源码。

![AgentScope 架构](images/agentscope-layering/001.png)

2026 年 7 月刚 GA，基于真实源码（不只是 README），从架构、设计、扩展、演进四个维度拆解。

## 为什么大多数人的做法扛不住变化

大部分人搭 Agent 平台，打开 Spring Boot / LangChain 就开干，一个 Agent 类搞定全部逻辑——推理循环、状态管理、模型调用、工具注入、中间件全塞一起。两个月后代码翻倍，新增一个拦截点要改三个类，想换底层模型得重写半个流程。

AgentScope 2.0 的答案是：真正的企业级 Agent 平台，核心不在于"功能多"，而在于**"变化点被控制在哪一层"**。代码规模不小（core 482 + harness 316 + extensions 1034 个 Java 文件），但把世界切成三层：

| 层 | 职责 | 一句话定位 |
|----|------|-----------|
| 无状态 ReAct 推理内核 | "大脑" | 只管想 |
| 委托内核，叠加工程能力 | "身体" | 管干活 |
| 18 类扩展（模型/存储/沙箱/协议/IM 渠道） | "手脚" | 按需接 |

贯穿全框架的哲学八个字：**无状态内核 + 组合式外壳**。

## 解决方案：冻结内核语义，用组合式外壳管理变化

### 要点一：ReAct 内核是无状态的（但不是无状态单例）

先纠正一个常见误解：它的 Agent 不是"纯无状态单例"，而是"**单实例 × 多 session 并发**"。

ReActAgent 的推理-行动循环（`ReActAgent.java:1906`）：

```java
private Mono<AgentResult> reasoning(int iter, boolean ignoreMaxIters) {
    if (!ignoreMaxIters && iter >= maxIters) return summarizing();  // 迭代上限兜底
    return checkInterrupted().then(/* 拦截器 */)
        .flatMap(/* MiddlewareChain 洋葱 + model stream */)
        .flatMap(msg -> runPostReasoningPipeline(msg, iter));
    // 没 finish 就 acting
}
// acting → 执行 pending 工具 → executeIteration(iter + 1) 互递归
```

reasoning（想）和 acting（做）互递归，靠迭代号 + maxIters 守卫防止失控。终止判定很简单：消息里没有 ToolUseBlock 就认为它想完了。

**"无状态"怎么做到的？** 把所有可变状态按 (userId, sessionId) 分槽缓存，不可变配置才是 final。每次调用新建一个全新 CallExecution，通过 Reactor Context 在线程间传递，绝不落在 agent 实例的共享字段上。换来的是：同一 session 内消息按序处理，不同 session 之间完全并发——不靠锁，不靠同步。这是**水平扩展的地基**。

### 要点二：中间件是"洋葱 4 点 + 管道 1 点"，不是五阶段枚举

要纠正一处普遍误解：很多资料把中间件描述成 before-llm/after-llm/before-tool/after-tool/around 五个生命周期枚举阶段。这是错的。

真实接口 `MiddlewareBase`（`middleware/MiddlewareBase.java`）是 **4 个洋葱点 + 1 个管道点**：

```java
public interface MiddlewareBase {
    // 4 个"洋葱点"（wrap 语义，before/after 用 Reactor 操作符自己组合）
    default Flux<AgentOutput> onAgent(Agent agent, RuntimeContext context, AgentInput input, Function<AgentInput, Flux<AgentOutput>> next) { return next.apply(input); }
    default Flux<AgentOutput> onReasoning(Agent agent, RuntimeContext context, ReasoningInput input, Function<ReasoningInput, Flux<AgentOutput>> next) { return next.apply(input); }
    default Flux<AgentOutput> onActing(Agent agent, RuntimeContext context, ActingInput input, Function<ActingInput, Flux<AgentOutput>> next) { return next.apply(input); }
    default Flux<AgentOutput> onModelCall(Agent agent, RuntimeContext context, ModelCallInput input, Function<ModelCallInput, Flux<AgentOutput>> next) { return next.apply(input); }
    // 1 个"管道点"（顺序变换，非事件型）
    default Mono<String> onSystemPrompt(Agent agent, RuntimeContext context, String currentPrompt) { return Mono.just(currentPrompt); }
}
```

每个洋葱点带一个 next 函数——调 next.apply(input) 就是放行下一层，before 写在它前面，after 用 .doOnComplete(...) 接后面。链由 MiddlewareChain.build 从后往前 fold，6 行代码一个责任链。

这比"五阶段枚举"灵活得多：一个中间件能在同一个 hook 里同时管 before 和 after，不用拆两个类。5 个方法全 default 直通，只覆盖关心的那个。日志、审计、限流、追踪、skill 注入全是这套机制的实现。

### 要点三：call 和 stream 真正合一

很多框架的同步 call() 和流式 stream() 是两条执行路径，维护两套逻辑。AgentScope 合到了一个内核：

```java
// call() 只是 streamEvents() 的"取末尾结果"特例
call(...) → buildAgentStream(...).filter(AgentResultEvent).takeLast(1)
streamEvents(...) → buildAgentStream(...)  // 直接返回事件流
```

代价：事件类型从 README 说的 28 种涨到了实际的 31 个枚举值——文档已经滞后于代码。

## 核心代码：HarnessAgent 与 ReActAgent 的委托关系

很多人以为 HarnessAgent extends ReActAgent。**错，是委托。**

```java
// agentscope-harness/.../HarnessAgent.java:152
public class HarnessAgent implements Agent, AutoCloseable {
    private final ReActAgent delegate;       // :156 持有一个内核实例
    private final WorkspaceManager workspaceManager;
    private final SandboxContext defaultSandboxContext;
    // ... 17 个工程能力字段，全可 null/noop
}
```

所有 call/stream/interrupt 方法都转调 delegate，自己只做一件事：往 delegate 里塞大约 20 个工程专用 middleware（沙箱生命周期、工作区上下文、上下文压缩、子 Agent 编排……），再挂上 workspace/sandbox/skill。

**为什么不用继承？** 因为继承会让工程能力渗透进内核，内核一旦不纯，测试和演进都被拖累。组合让你能独立替换和测试每个组件。

## 但是，GA 版本背着 112 处 @Deprecated

core 模块的 @Deprecated 注释，数了 112 处，其中 80 处标了 forRemoval。一个刚 GA 的框架背着这么多"承诺要删但还没删"的代码，暴露了 1.x 到 2.0 迁移留下的五处双轨债：

1. **旧 Hook 系统**（Hook/LegacyHookDispatcher）全部 @Deprecated(forRemoval=true)，但 ReAct 主循环里仍然双轨触发——同一阶段既 fire 旧 Hook，又过新 Middleware 链
2. **memory 包 8 个类全部 forRemoval**，LongTermMemory 整块移除——跨会话记忆在 2.0 没有框架级替代，文档让你"交给应用层"
3. **旧 `io.agentscope.core.agent.Event` 和新 `io.agentscope.core.event.AgentEvent`**——agent 和 event 差一级，import 极易选错
4. **legacy 的 ImageBlock/AudioBlock/VideoBlock 和前向统一的 DataBlock 并存**，formatter、权限、事件层都要同时处理两类
5. **core 里的 SubAgentTool（消费 v1 事件）和 harness 的 agent_spawn/agent_send 职责重叠**，core 那套连 deprecated 都没标

更隐蔽的是文档先于代码：Model.java 的 javadoc 引用了一个 "compaction middleware"，但这个 middleware 根本不存在——实际只有 maxIters 兜底。

## 给做 Agent / Skill / MCP / SubAgent 管理平台的 7 条铁律

1. **ReAct 流程一旦确定不轻易改，变化发生在扩展层**。内核越稳定，平台越长寿
2. **4 个切入点 + 1 条管道线就够**，重点是每个扩展点职责明确。确定会变的留口，不会变的焊死，别预测 5 年后的变化
3. **HarnessAgent 委托 ReActAgent，不是继承**。组合能独立替换和测试每个组件
4. **新旧两套并存时，必须有明确的删除版本号和时限**——forRemoval=true 是承诺，承诺不兑现就是债的复利
5. **AgentScope 有 SPI、Spring AutoConfig、手动 Builder 三套发现机制并行，却没有统一注册表**——三套并行等于没有，收口到一套
6. **双 BOM 版本治理、统一事件流、权限六步管线、优雅停机**——这些"非功能性"能力决定平台能不能上生产，不是事后加
7. **凡是引用了不存在的抽象、数字和代码漂移的地方都会误导使用者**——核验优于相信文档，API 文档从代码生成

## 踩坑提醒

⚠️ 别盲目把旧 Hook 迁到 Middleware，更别急着删 Hook。两者的触发机制不同：Hook 是事件驱动的后处理（onEvent + priority 排序串行），Middleware 是流程驱动的洋葱拦截（带 next 函数的 wrap）。更关键的是——废弃的 Hook.tools() 还承载着**非废弃的工具注册能力**，硬删 Hook 会连带断掉工具注册。

正确做法：给双轨迁移设明确的"杀死开关"版本，在删除前先把 Hook.tools() 承载的工具注册能力完整迁到 Middleware，再分批清理。

## 结尾：一个灵魂拷问

你的 Agent 平台，有多少行代码是"没人敢动"的？ReActAgent 有 4709 行，HarnessAgent 有 2568 行——AgentScope 也还在还这个债。

> 但它的源码告诉你一条出路：不是重构全部代码，而是分层解耦、冻结内核语义、用组合式外壳管理变化。一个成熟的团队，不在于踩了多少坑，而在于踩坑后能不能总结出有效的工程铁律。