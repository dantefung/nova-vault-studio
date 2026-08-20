---
title: "把 Agent 的「经验」固化为可复用的流程：Skill 与 Workflow 引擎"
date: "2026-07-28"
source: "微信公众号：老梁agent"
url: "https://mp.weixin.qq.com/s/htFytIvy2DlQeb6FIZOfow"
---

# 把 Agent 的「经验」固化为可复用的流程：Skill 与 Workflow 引擎

> 五个 Expert 各写一套重复代码，Router 和 Supervisor 靠硬编码 switch 分发——这是 MVP 的 Agent 协作方式。生产级用 Skill 接口抽象共性，用 Workflow 引擎把确定性流程编成 DAG，让 Router 自动识别并委托执行。

![架构图](images/agentscope-skill-workflow/001.png)

## 一、五个 Expert，五套重复代码

MVP 的五个专家 Agent 长这样：

```
AlarmExpert.java      — 一个 inner interface + @SystemMessage + AiServices.builder() + tools + chat()
DataExpert.java       — 一个 inner interface + @SystemMessage + AiServices.builder() + tools + chat()
DiagnosisExpert.java  — 一个 inner interface + @SystemMessage + AiServices.builder() + tools + chat()
KnowledgeExpert.java  — 一个 inner interface + @SystemMessage + AiServices.builder() + tools + chat()
GeneralExpert.java    — 一个 inner interface + @SystemMessage + AiServices.builder() + (no tools) + chat()
```

结构完全一样，但没有任何共享抽象——没有接口、没有基类、没有统一的调用方式。

RouterAgent 和 SupervisorAgent 里是两套几乎相同的 switch：

```java
// RouterAgent.java
String reply = switch(intent) {
    case ALARM     -> alarmExpert.chat(message);
    case DATA      -> dataExpert.chat(message);
    case DIAGNOSIS -> diagnosisExpert.chat(message);
    case KNOWLEDGE -> knowledgeExpert.chat(message);
    case GENERAL   -> generalExpert.chat(message);
};

// SupervisorAgent.java — 几乎完全相同的代码
String reply = switch(task.expert()) {
    case "ALARM_EXPERT"     -> alarmExpert.chat(task.task());
    case "DATA_EXPERT"      -> dataExpert.chat(task.task());
    case "DIAGNOSIS_EXPERT" -> diagnosisExpert.chat(task.task());
    case "KNOWLEDGE_EXPERT" -> knowledgeExpert.chat(task.task());
    default                 -> generalExpert.chat(task.task());
};
```

新增一个 Expert 要改三个文件：Expert 定义、Router 的 switch、Supervisor 的 switch。这是典型的散弹式修改。

## 二、Skill 接口：三个方法，统一入口

第一步：从五个 Expert 中提取共性，定义一个 Skill 接口：

```java
public interface Skill {
    /** 执行技能 */
    String chat(String message);

    /** 带运行时上下文的执行 */
    default String chat(String message, RuntimeContext ctx) {
        return chat(message);
    }

    /** 技能标识，用于路由发现 */
    String skillName();

    /** 技能描述，用于可观测性 */
    String description();
}
```

五个 Expert 只需加一行 `implements Skill` 和两个简短方法：

```java
@Component
public class AlarmExpert implements Skill {
    // ... 原有代码完全不变 ...

    @Override
    public String skillName() { return "ALARM_EXPERT"; }

    @Override
    public String description() { return "设备告警查询和解读"; }
}
```

零行为变化。chat() 方法的实现一行没改，只是多了一个接口契约。但有了这个契约，Spring 可以自动注入所有 Skill 实现：

```java
// WorkflowEngine.java
public WorkflowEngine(List<Skill> skills, ...) {
    // Spring 自动收集所有 Skill 实现注入到 List<Skill>
}
```

List 的注入由 Spring 自动完成——所有 `@Component + implements Skill` 的 Bean 都会被收集进来。新增 Expert 只要实现 Skill 接口就会被自动发现，不再需要改 Router 和 Supervisor 的 switch。

## 三、SkillTemplate：可编译的 System Prompt

五个 Expert 的 System Prompt 都是 `@SystemMessage` 静态字符串。但生产级场景需要动态组装 Prompt——根据上下文注入策略规则、工具约束、记忆摘要。

SkillTemplate 提供了另一种选择：用 PromptCompiler 做 System Prompt 的动态编译。

```java
public abstract class SkillTemplate implements Skill {
    protected final PromptCompiler promptCompiler;
    protected final ChatModel chatModel;
    protected final List<Object> tools;

    protected <T> T buildAssistant(Class<T> assistantClass, RuntimeContext ctx) {
        return AiServices.builder(assistantClass)
            .chatModel(chatModel)
            .chatMemory(MessageWindowChatMemory.withMaxMessages(10))
            .systemMessageProvider(id -> promptCompiler.compileSystem(ctx))
            .tools(tools.toArray())
            .build();
    }
}
```

与 `@SystemMessage` 的区别：

- `@SystemMessage`：编译时固定，不改代码变不了
- `systemMessageProvider + PromptCompiler`：运行时动态组装，策略变更、工具增减自动反映在 Prompt 里

一个具体的 SkillTemplate 子类：

```java
@Component
public class AlarmDiagnosisSkill extends SkillTemplate {

    public AlarmDiagnosisSkill(PromptCompiler promptCompiler,
                                ChatModel chatModel,
                                DeviceAlarmTool alarmTool,
                                DiagnosisTool diagnosisTool,
                                KnowledgeBaseTool knowledgeBaseTool) {
        super(promptCompiler, chatModel,
              List.of(alarmTool, diagnosisTool, knowledgeBaseTool));
        // 工具子集：只给这个技能需要的工具，不暴露全部
    }

    @Override
    public String skillName() { return "ALARM_DIAGNOSIS_SKILL"; }

    @Override
    public String description() { return "告警分析+故障诊断联合技能"; }
}
```

**Skill 和 SkillTemplate 是两种选择，不是替代关系：**

- **Skill 接口**：轻量、向后兼容、适合已有 Expert
- **SkillTemplate 基类**：动态 Prompt 编译、工具子集过滤、适合需要 Prompt 编排的新技能

## 四、Workflow：当「做什么」可以提前定义

MVP 的路由模式本质是「每次来了请求，LLM 决定找谁做」——意图分类 → 选一个 Expert → 聊天式推理。这适合开放性问题。

但工业场景里有很多确定性流程。「CNC-001 轴承温度过高，需要维修」——这个需求的处理步骤是固定的：

```
查告警 → 查数据 → 搜知识库 → 诊断 → 创建工单 → 审批 → 通知
```

每一步调用谁、输入什么、输出什么、走哪条分支，都是确定的。让 LLM 每次现场编流程是对模型能力的浪费。

Workflow 引擎的设计思路：**把确定性流程写成 YAML 配置，启动时加载，执行时走图遍历，LLM 只在每个节点内部做推理。**

### 4.1 YAML 定义

```yaml
# maintenance-workflow.yml
name: maintenance-workflow
description: "告警查询 → 数据分析 → 知识检索 → 诊断 → 工单 → 审批 → 通知"
intentKeywords: ["维修","工单","停机","故障处理","报修"]

nodes:
  - id: query-alarms
    type: EXPERT_CALL
    label: "查询设备告警"
    config:
      skillName: "ALARM_EXPERT"
  - id: query-data
    type: EXPERT_CALL
    label: "查询设备数据"
    config:
      skillName: "DATA_EXPERT"
  - id: retrieve-knowledge
    type: TOOL_CALL
    label: "检索维修知识库"
    config:
      toolName: "searchKnowledgeBase"
  - id: diagnose
    type: EXPERT_CALL
    label: "故障诊断"
    config:
      skillName: "DIAGNOSIS_EXPERT"
  - id: create-workorder
    type: TOOL_CALL
    label: "创建维修工单"
    config:
      toolName: "createWorkOrder"
    requiresApproval: true
  - id: approval-gate
    type: APPROVAL
    label: "等待主管审批"
  - id: notify
    type: NOTIFY
    label: "通知维修工程师"

edges:
  - {from: query-alarms, to: query-data}
  - {from: query-data, to: retrieve-knowledge}
  - {from: retrieve-knowledge, to: diagnose}
  - {from: diagnose, to: create-workorder}
  - {from: create-workorder, to: approval-gate}
  - {from: approval-gate, to: notify}
```

七个节点，六条边，一条链。复杂流程可以加分支、并行（引擎已预留 DAG 能力），但这七个节点的串行链已经覆盖了维修场景的核心路径。

### 4.2 四种节点类型

| 节点类型 | 执行方式 | 用途 |
|----------|----------|------|
| EXPERT_CALL | 通过 Map 查找并调用 `skill.chat(context)` | 调用专家做推理 |
| TOOL_CALL | 直接调用注入的工具 Bean（如 KnowledgeBaseTool） | 确定性工具操作 |
| APPROVAL | 委托 ApprovalGate，暂停执行，等待人工审批 | 写操作安全门 |
| NOTIFY | 记录日志（未来扩展 MQTT/邮件） | 流程完成通知 |

### 4.3 引擎执行：拓扑排序 + 上下文累积

```java
// WorkflowEngine.java
public WorkflowResult execute(WorkflowDefinition def, String input, RuntimeContext ctx) {
    List<String> sortedIds = topologicalSort(def);  // Kahn 算法
    StringBuilder context = new StringBuilder(input);

    for (String nodeId : sortedIds) {
        WorkflowNode node = findNode(def, nodeId);
        NodeExecution result = executeNode(node, context.toString(), ctx);

        if ("AWAITING_APPROVAL".equals(result.status())) {
            break;  // 遇到审批门，暂停等人工确认
        }

        // 每个节点的输出累积为下一个节点的上下文
        context.append("\n[")
               .append(node.label())
               .append("]: ")
               .append(result.output());
    }

    return new WorkflowResult(...);
}
```

关键设计：

- **拓扑排序**保证依赖关系正确——edges 定义的 from→to 决定执行顺序
- **上下文累积**——每个节点的输出追加到 context，下游节点能看到前面所有步骤的结果
- **审批暂停**——遇到 APPROVAL 节点立即停止，返回 pendingApprovals 给调用方，等待人工操作

## 五、与 Router 和 Supervisor 的协作

Workflow 引擎不是替代 Router 和 Supervisor，而是增强它们。

### 5.1 RouterAgent：新增 WORKFLOW 意图

```java
// IntentClassifier — 新增 WORKFLOW 关键词匹配
Pattern WORKFLOW_PATTERN = Pattern.compile("维修工单|故障处理流程|报修|维修流程");

// RouterAgent — 新增 WORKFLOW 分发
case WORKFLOW -> {
    var wf = workflowRegistry.findByIntentKeywords(message);
    if (wf.isPresent()) {
        yield workflowEngine.execute(wf.get(), message, ctx);
    }
    yield diagnosisExpert.chat(message);  // 降级
}
```

### 5.2 SupervisorAgent：工作流优先检查

```java
public SupervisorResult execute(String message, RuntimeContext ctx) {
    // 优先：如果匹配确定性工作流，直接执行，不走 LLM 任务规划
    var wf = workflowRegistry.findByIntentKeywords(message);
    if (wf.isPresent()) {
        return executeAsWorkflow(wf.get(), message, ctx);
    }
    // 否则走原有的 TaskPlanner → 多 Expert 协作流程
    List<SubTask> tasks = taskPlanner.plan(message);
    // ...
}
```

当一个流程已经被定义好，就不需要让 LLM 重新规划它。Supervisor 不再为「维修流程」支付一次任务规划的 LLM 调用。

## 六、Workflow 是一个开放式框架

当前实现是基础版——串行链 + 四种节点类型 + 审批门。但架构已经预留了扩展点：

| 扩展方向 | 做法 |
|----------|------|
| 并行节点 | DAG 中多个入度为零的节点并发执行（引擎已做了拓扑排序，改执行循环即可） |
| 条件分支 | 节点加 condition 配置，根据上一步输出决定下一跳 |
| 自定义节点 | 实现 NodeExecutor 接口，在引擎中注册——如 MQTT_PUBLISH、EMAIL_SEND |
| 动态加载 | 可以从数据库或配置中心加载，支持热更新 |

Workflow 的本质是把「怎么做一件事」的知识从代码中提取出来，变成可编辑、可版本化、可组合的配置。运维工程师不需要懂 Java 就能调整维修流程——改 YAML，重启即可。

## 七、谁来定义 Workflow？

一个常被问到的问题：Workflow 的 YAML 是运维工程师手写的，还是模型生成的？

**当前阶段：手写为主，模型辅助。** 工业场景的确定性流程数量有限——维修、巡检、备件申领，一只手数得过来。手写 7 个节点的 YAML 比训练模型理解业务流程简单得多。

但引擎的 API 设计已经为「模型生成 Workflow」留了空间。`POST /api/agent/workflow/execute` 接受 workflowName 和 message，未来可以加一个「模型建议 Workflow」的端点——用户描述需求，LLM 生成 YAML，人审核后入库执行。这比模型直接操作工单安全得多。

> Skill 把 Agent 的能力模块化。Workflow 把模块的执行流程化。两者结合，Agent 从「每次都让模型临场发挥」进化到「确定性流程走引擎，开放性问题走推理」。

项目地址：github.com/LaoLiang-agent/industrial-agent-long
