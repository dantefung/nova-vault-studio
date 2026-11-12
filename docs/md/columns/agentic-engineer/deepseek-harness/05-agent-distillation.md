---
title: "DeepSeek Harness 做 Agent 蒸馏：天然蒸馏数据工厂"
date: "2026-08-14"
source: "微信公众号"
---

# DeepSeek Harness 做 Agent 蒸馏：天然蒸馏数据工厂

> DeepSeek Harness 专栏第 05 篇。DSH 的 append-only 事件流天然构成 ReAct 推理轨迹——一条 JSONL 日志就是一份现成的 SFT 训练样本。

---

## DSH 的事件流：天然蒸馏轨迹

DSH 记录的事件类型构成完整的 ReAct 轨迹：`turn/start → user/message → assistant/message → tool/call → tool/result → assistant/message → ... → turn/end`。

| 事件 | 说明 |
|------|------|
| turn/start | 对话轮次开始 |
| step/start | 一次模型请求 + 工具执行开始 |
| user/message | 用户输入 |
| assistant/chunk | 流式 token（原始逐字输出） |
| assistant/message | 模型完整回复（含 token 消耗） |
| tool/call | 工具调用请求（含参数 JSON） |
| tool/result | 工具返回结果 |
| step/end | 步骤结束 |
| turn/end | 轮次结束 |

## 批量生产蒸馏数据

DSH 支持 headless 模式——无 UI、纯命令行，批量跑任务自动产出蒸馏数据：

```bash
dsh --profile headless "读取data/orders.csv，统计每个区域的订单总量，画一个柱状图保存到output/"
```

## 三个坑

1. 蒸馏数据的「多样性」取决于任务模板的覆盖度
2. 工具名称、参数结构的漂移会让旧数据失效
3. 蒸馏出来的 Agent 能否泛化取决于训练时覆盖了足够的工具调用路径

> 📎 完整原文见知识库：[wiki/sources/deepseek-harness-agent-distillation.md](../../../wiki/sources/deepseek-harness-agent-distillation.md)

---

[← 上一篇：Agent 构建工具](./04-agent-build-tools.md) | [下一篇：DSH vs Pi →](./06-cordis-dsh-vs-pi.md)