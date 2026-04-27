---
title: Sequential Thinking（分步问题解决框架）

## Sequential Thinking（分步问题解决框架）

使用 [Sequential Thinking](https://github.com/smithery-ai/reference-servers/tree/main/src/sequentialthinking) 工具，指导分步骤地解决问题，尤其适用于复杂、开放式任务。

- 使用 Sequential Thinking 协议将任务拆解为**思维步骤**。
- 每一步遵循以下结构：
  1. 明确当前目标或假设（如“评估身份验证选项”、“重构状态管理”）。
  2. 根据上下文选择合适的 MCP 工具（如 `search_docs`、`code_generator`、`error_explainer`）。
  3. 清晰地记录结果/输出。
  4. 确定下一步思考目标，继续推进。
- 存在不确定性时：
  - 可通过“分支思考”探索多种解决路径。
  - 比较权衡不同策略或方案。
  - 允许回滚或编辑前序思维步骤。
- 可用元数据包括：
  -`thought`：当前思维内容
  -`thoughtNumber`：当前步骤编号
  -`totalThoughts`：预计总步骤数