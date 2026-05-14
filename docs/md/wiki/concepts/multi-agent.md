# 多Agent系统（Multi-Agent System）

> 由多个具有专业能力的Agent协同工作的系统，通过分工合作完成复杂任务。

## Key Points

- 每个Agent有特定角色和工具
- 支持CrewAI、LangGraph等框架
- 解决单一Agent能力有限的问题

## Details

### 典型架构

1. **检索Agent**：负责向量检索、图谱查询
2. **总结Agent**：负责答案整理、格式输出
3. **路由Agent**：负责意图判断、任务分发
4. **执行Agent**：负责工具调用、API操作

### 框架对比

| 维度 | LangGraph | CrewAI |
|------|-----------|--------|
| 状态管理 | 内置持久化层 | 基础状态管理 |
| 多轮对话 | 原生支持 | 需额外配置 |
| 工作流 | DAG编排 | 角色定义 |
| 适用场景 | 复杂多轮 | 多角色协同 |

### 混合架构

"规则引擎（如Drools）+ LLM"混合决策机制：
- 大模型处理复杂推理
- 规则引擎处理确定性流程
- 置信度低时自动降级

## Context

是构建复杂智能客服系统的关键技术，特别适用于需要多工具调用的场景。

## Related Pages

- [[patterns/multi-agent]]
- [[patterns/intelligent-customer-service]]

## Sources

- [[智能客服专栏] 多智能体架构设计](./04-multi-agent.md)
- [[智能客服专栏] 多智能体架构设计v2](./10-multi-agent-v2.md)