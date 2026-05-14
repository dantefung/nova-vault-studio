# 生产环境部署

> 智能客服系统生产级部署的最佳实践，包括数据安全、混合架构、转人工机制、性能优化、可观测性。

## Problem Context

智能客服系统从原型到生产环境需要考虑安全性、稳定性、可维护性等多方面问题。

## Solution

### 1. 数据安全优先

- 本地私有化部署（Ollama部署LLM和Embedding）
- 敏感数据不离开企业内网

### 2. 混合架构双重保障

- "规则引擎（如Drools）+ LLM"混合决策
- 大模型异常或置信度低时自动降级
- 注意：增加维护成本

### 3. 灵活转人工机制

- 预设拦截词（"转人工"）
- 多次重复相似问题
- 情感分析识别负面情绪
- 点差评触发

### 4. 重运营轻微调

- 建立运营平台监控点赞/点踩
- 通过Few-Shot示例和知识库更新纠错
- 模型微调仅在特定场景使用

### 5. 性能与并发优化

- Redis缓存热点知识（LRU策略）
- 滑动窗口算法限制QPS
- 异步处理提升响应速度

### 6. 可观测性体系

- LangSmith：测试、评估、监控
- 行业基准：85%+准确率
- Budget Guard：成本控制

## Trade-offs

- 混合架构增加系统复杂度
- 私有化部署增加运维成本
- 可观测性需要额外投入

## Related Pages

- [[patterns/intelligent-customer-service]]
- [[products/langchain]]

## Sources

- [[智能客服专栏] 生产部署指南](./06-production-deployment.md)
- [[智能客服专栏] 生产部署指南v2](./12-production-deployment-v2.md)