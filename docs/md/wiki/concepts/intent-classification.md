# 意图识别（Intent Classification）

> 智能客服系统的入口层优化技术，准确理解用户输入的问题意图，决定后续的路由和响应策略。

## Key Points

- 是智能客服准确率的第一道门槛
- 核心挑战：准确性与速度的平衡
- 常用方法：Prompt格式优化、置信度体系、nano模型选型

## Details

### 核心流程

1. **预处理**：用户输入清洗、分词
2. **特征提取**：Embedding或关键词匹配
3. **分类器**：BERT/Transformer模型或规则匹配
4. **后处理**：置信度判断、转人工触发

### 优化策略

- **Prompt格式**：结构化Prompt包含意图定义、示例、输出格式
- **置信度体系**：设定阈值，低于阈值则转人工
- **nano模型**：使用小模型（如Qwen2-0.5B）降低延迟
- **CICLe路由**：分层路由，先大类再细分

### 关键指标

- 意图识别覆盖率
- 响应延迟（通常要求<200ms）
- 准确率（行业基准85%+）

## Context

出现在智能客服专栏第14篇文章，专门讨论入口层优化对整体系统体验的影响。

## Related Pages

- [[patterns/intelligent-customer-service]]
- [[patterns/production-deployment]]

## Sources

- [[智能客服专栏] 意图分类：准确性与速度优化](./14-intent-classification.md)