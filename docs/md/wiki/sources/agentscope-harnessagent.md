---
title: "AgentScope HarnessAgent：高级封装与生产级特性"
date: "2026-08-13"
source: "微信公众号：老梁agent"
url: "https://mp.weixin.qq.com/s/vGDAnke3XA8NvoRvesQNaA"
---

# AgentScope HarnessAgent：高级封装与生产级特性

> ReActAgent 提供了完整的 Agent 原语，但直接用于生产还需要手动处理上下文压缩、任务规划、技能管理等。HarnessAgent 是 AgentScope 在 ReActAgent 之上的高级封装，把这些能力内建进去。

## 一、HarnessAgent vs ReActAgent

### 1.1 定位差异

| 维度 | ReActAgent | HarnessAgent |
|------|------------|--------------|
| 定位 | Agent 基础原语 | 生产级 Agent 封装 |
| AgentState | 自动管理 | 自动管理 |
| 上下文压缩 | 无（LLM 在 ReAct 循环中自适应） | 内建 CompactionMiddleware 主动压缩 |
| 任务规划 | 无 | 内建 Plan Mode，自动分解任务 |
| 工具注册 | 手动 Toolkit 注册 | workspace 目录自动发现（tools.json）|
| 技能管理 | 无 | curated skills + skill promotion |
| 适用场景 | 简单 Agent、原型开发 | 长对话、复杂任务、生产部署 |

简单来说：**ReActAgent 是「引擎」，HarnessAgent 是「整车」。**

### 1.2 创建 HarnessAgent

```java
HarnessAgent agent = HarnessAgent.builder()
    .name("my-assistant")
    .model(model)
    .workspace(Path.of("./src/main/resources/workspace"))
    .subagents(List.of(weatherExpert.getAgent()))
    .build();
```

## 二、Workspace：Agent 的自描述目录

### 2.1 目录结构

```
src/main/resources/workspace/
├── tools.json    ← MCP Server 声明
├── AGENTS.md     ← Agent 能力自描述
└── MEMORY.md     ← Agent 长期记忆文件
```

HarnessAgent 启动时自动读取这个目录，完成工具发现和能力自描述。

### 2.2 tools.json：声明式工具发现

```json
{
  "mcpServers": {
    "weather-server": {
      "type": "http",
      "url": "http://localhost:3100/mcp"
    },
    "database-server": {
      "type": "http",
      "url": "http://localhost:3200/mcp"
    }
  }
}
```

HarnessAgent 启动时的自动流程：

1. 读取 `workspace/tools.json`
2. 连接每个 `mcpServers` 中声明的 URL
3. 调用 `tools/list` 获取每个 Server 的工具列表
4. 将远程工具自动注册到 Agent 的 Toolkit 中

相比 ReActAgent 需要手动 `toolkit.registerTool(...)`，HarnessAgent 做到了**工具配置与代码分离**。

### 2.3 AGENTS.md：Agent 能力自描述

```markdown
# 智能助手 Agent

通用智能助手，可以查询天气、执行计算、翻译文本。

## 可用工具
- getWeather: 查询城市天气
- calculate: 执行数学计算
- translate: 文本翻译

## 限制
- 不支持文件操作
- 不访问用户隐私数据
```

AGENTS.md 是 Agent 的「简历」——在 HarnessAgent 作为 SubAgent 被注册到其他 Agent 时，这份描述帮助上层 LLM 理解它能做什么。

### 2.4 MEMORY.md：长期记忆文件

```markdown
# Agent 长期记忆
- 用户偏好使用公制单位（°C, km）
- 默认城市：北京
- 回复风格：简洁，不要超过 200 字
```

MEMORY.md 的内容在每次对话时被注入到 sysPrompt 中（或作为第一条 system message）。它和 AgentState 的区别：

| 维度 | MEMORY.md | AgentState |
|------|-----------|------------|
| 内容性质 | 静态的持久偏好/知识 | 动态的对话历史 |
| 更新方式 | 手动编辑或 skill promotion | 框架自动追加 |
| 持久范围 | 跨会话持久 | 会话级别 |

## 三、内建中间件

HarnessAgent 内置了三个生产级中间件，无需手动装配。

### 3.1 CompactionMiddleware：上下文压缩

HarnessAgent 内置 `CompactionMiddleware`，当上下文达到阈值时自动触发压缩：

```java
// 默认配置
compactionConfig.setThreshold(60_000);   // token 阈值
compactionConfig.setKeepSystem(true);     // 保留系统消息
compactionConfig.setKeepLastN(10);        // 保留最近 N 条消息
```

关键机制：
- 压缩时保留系统消息（含工具描述），避免模型丢失工具信息
- 保留最近的 N 条消息，维护近期上下文
- 压缩后的上下文总量不超过阈值

这解决了长对话中 Token 爆炸的问题，是 ReActAgent 需要手动装配的能力。

### 3.2 PlanMiddleware：任务规划

HarnessAgent 内置 `PlanMiddleware`，开启 Plan Mode 后，每次用户请求会先触发任务分解：

```java
planConfig.setEnabled(true);
planConfig.setPlanModel(model);      // 可指定专用规划模型
planConfig.setMaxPlanSteps(5);       // 最多 5 个子任务
```

Plan 模式下的执行流程：

```
用户输入 → Plan Middleware 触发 → LLM 生成子任务列表 → 逐个执行子任务 → 汇总结果
```

这特别适合复杂任务，比如「分析昨天服务器故障原因并写报告」，会自动拆分为「查询告警日志」「定位异常时段」「分析根因」「撰写报告」四个子任务。

### 3.3 SkillMiddleware：技能管理

HarnessAgent 内置 `SkillMiddleware`，负责 Skill 的生命周期管理。

**Curated Skills**：

AgentScope 提供一组官方精选技能，包括：
- `analyze-project`：分析代码项目结构
- `debug-code`：调试代码问题
- `code-review`：代码审查
- `write-tests`：编写测试用例
- `doc-generator`：生成文档

这些技能通过 `skill-store` Maven 依赖引入：

```xml
<dependency>
  <groupId>io.agentscope</groupId>
  <artifactId>agentscope-skill-store</artifactId>
  <version>2.0.1</version>
</dependency>
```

**Skill Promotion**：

SkillMiddleware 支持将常用工具调用提升为 Skill：

1. 检测到某个工具被频繁调用
2. 自动提取使用模式和最佳实践
3. 生成 SKILL.md 文件保存到 workspace/skills/
4. 下次遇到类似任务时，自动加载对应 Skill

这个特性让 Agent 在使用过程中不断「学习」，把高频操作沉淀为结构化知识。

## 四、SubAgent 注册

HarnessAgent 支持注册子 Agent，实现多 Agent 协作。

### 4.1 注册方式

```java
// 方式一：构建时注册
HarnessAgent agent = HarnessAgent.builder()
    .name("main-agent")
    .model(model)
    .workspace(Path.of("./workspace"))
    .subagents(List.of(weatherExpert, dataExpert))
    .build();

// 方式二：运行时注册
agent.addSubagent(weatherExpert);
```

### 4.2 子 Agent 调用流程

当主 Agent 的 LLM 决定调用子 Agent 时，HarnessAgent 自动处理以下流程：

```
主 Agent LLM 输出 tool_call → 匹配到子 Agent 名称
  → HarnessAgent 获取子 Agent 实例
  → 创建独立会话（新 AgentState）
  → 转发用户消息到子 Agent
  → 等待子 Agent 完成（或流式回传）
  → 将子 Agent 结果返回给主 Agent 的上下文
```

每个子 Agent 调用都会创建独立的 AgentState，不会污染主 Agent 的对话历史。

### 4.3 AGENTS.md 的作用

子 Agent 的 AGENTS.md 会作为子 Agent 的「能力卡片」注入到主 Agent 的上下文中。主 Agent 的 LLM 在决定是否调用某个子 Agent 时，会参考这张卡片。

## 五、生产级特性

HarnessAgent 相比 ReActAgent，额外提供了以下生产级能力。

### 5.1 会话持久化

HarnessAgent 支持将 AgentState 持久化到数据库或文件系统，支持会话恢复：

```java
agent.setStorage(new DatabaseAgentStateStorage(dataSource));
```

当服务重启或 Agent 实例被销毁后，可以通过 SessionId 恢复之前的对话状态，继续执行。

### 5.2 工具沙箱

HarnessAgent 支持在 Docker 容器中执行工具调用，实现与宿主系统的隔离：

```java
toolkitConfig.setSandbox(SandboxConfig.builder()
    .engine(SandboxEngine.DOCKER)
    .image("agentscope/sandbox:latest")
    .timeoutSeconds(60)
    .memoryLimit("512m")
    .build());
```

所有 Bash 工具调用在 Docker 容器内执行，不会直接操作宿主系统。

### 5.3 权限系统

HarnessAgent 支持细粒度的工具权限控制：

```java
Permission permission = Permission.builder()
    .addAllowRule(AllowRule.of("Read", "/data/**"))
    .addDenyRule(DenyRule.of("Write", "/etc/**"))
    .addAskRule(AskRule.of("Bash", "rm -rf"))
    .build();

HarnessAgent agent = HarnessAgent.builder()
    .name("safe-agent")
    .model(model)
    .workspace(workspacePath)
    .permission(permission)
    .build();
```

### 5.4 流式输出

HarnessAgent 继承 ReActAgent 的流式输出能力，通过 Flux 暴露事件流：

```java
Flux<AgentResponse> responseFlux = agent.chatStreaming("分析这个数据");

responseFlux.subscribe(event -> {
    switch (event.getType()) {
        case THINKING:
            log.info("模型思考中...");
            break;
        case TOOL_CALLING:
            log.info("调用工具: {}", event.getToolName());
            break;
        case TOOL_CALL_RESULT:
            log.info("工具结果: {}", event.getResult());
            break;
        case FINAL_ANSWER:
            log.info("最终回答: {}", event.getContent());
            break;
    }
});
```

## 六、选择指南：什么时候用哪个？

| 场景 | 推荐 |
|------|------|
| 简单问答、原型验证 | ReActAgent |
| 短任务、单次工具调用 | ReActAgent |
| 学习 Agent 原理 | ReActAgent |
| 长对话、复杂任务 | HarnessAgent |
| 生产环境部署 | HarnessAgent |
| 多 Agent 协作 | HarnessAgent |
| 需要 MCP 集成 | HarnessAgent |
| 需要 Skill 管理 | HarnessAgent |
| 需要上下文压缩 | HarnessAgent |

## 七、后续

HarnessAgent 是 AgentScope 面向生产的核心推荐方案。下一篇文章将进入代码实践：如何将现有 LangChain4j Agent 迁移到 HarnessAgent，从单 Agent 到多 Agent 协作的完整迁移过程。
