Title: 协调器模式 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/coordinator.html

Markdown Content:
## 协调器模式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/coordinator.html#%E5%8D%8F%E8%B0%83%E5%99%A8%E6%A8%A1%E5%BC%8F)

`src/coordinator/coordinatorMode.ts` (~370 行) 实现多 Agent 编排的协调器。

## 启用方式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/coordinator.html#%E5%90%AF%E7%94%A8%E6%96%B9%E5%BC%8F)

typescript

```
function isCoordinatorMode(): boolean {
  // 通过环境变量 CLAUDE_CODE_COORDINATOR_MODE 启用
  // 特性门控保护
  return feature('COORDINATOR_MODE') &&
    process.env.CLAUDE_CODE_COORDINATOR_MODE === '1'
}

function matchSessionMode(sessionMode: string): void {
  // 恢复会话时匹配模式
  // 翻转 CLAUDE_CODE_COORDINATOR_MODE 环境变量
}
```

## 协调器系统提示 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/coordinator.html#%E5%8D%8F%E8%B0%83%E5%99%A8%E7%B3%BB%E7%BB%9F%E6%8F%90%E7%A4%BA)

typescript

```
function getCoordinatorSystemPrompt(): string {
  // 多段落的协调器角色定义
  return `
    ## 角色定义
    你是一个编排者，不是实现者。
    你的工作是分解任务、分配给 Worker、监控进度。

    ## 可用工具
    - AgentTool: 创建/恢复 Worker Agent
    - SendMessageTool: 向 Worker 发消息
    - TaskStopTool: 停止任务
    - subscribe_pr_activity: 订阅 PR 活动

    ## Worker 管理
    使用 <task-notification> XML 格式分配任务：
    <task-notification>
      <worker-id>worker-1</worker-id>
      <task>实现登录功能</task>
      <files>src/auth/*.ts</files>
    </task-notification>

    ## 工作流阶段
    1. Research: 调研代码库，理解现有模式
    2. Synthesis: 综合分析，形成实施方案
    3. Implementation: 分配任务给 Worker
    4. Verification: 验证结果，处理问题

    ## 并发指导
    - 只读操作可以并行
    - 写入操作应串行化（避免冲突）

    ## Worker Prompt 编写
    - 自包含（Worker 没有协调器上下文）
    - 综合的规格说明
    - 明确的目的说明

    ## Continue vs Spawn 决策矩阵
    - 上下文重叠高 → continue（继续现有 Worker）
    - 上下文重叠低 → spawn（创建新 Worker）
  `
}
```

## 用户上下文 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/coordinator.html#%E7%94%A8%E6%88%B7%E4%B8%8A%E4%B8%8B%E6%96%87)

typescript

```
function getCoordinatorUserContext(
  mcpClients: MCPClient[],
  scratchpadDir?: string
): string {
  // 生成协调器的用户上下文
  // 包含：
  // 1. 可用 Worker 工具列表
  // 2. MCP 服务器信息
  // 3. 暂存目录路径
}
```

## 工作流示例 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/coordinator.html#%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A4%BA%E4%BE%8B)

```
用户: "重构所有 API 端点使用新的认证系统"

协调器:
  1. [Research] 扫描 src/api/ 目录
  2. [Synthesis] 发现 15 个端点需要修改
  3. [Implementation]
     ├─ Worker-1: auth 中间件 (串行)
     ├─ Worker-2: GET 端点 (并行)
     ├─ Worker-3: POST 端点 (并行)
     └─ Worker-4: 测试更新 (等待 2,3)
  4. [Verification] 运行测试套件
```
