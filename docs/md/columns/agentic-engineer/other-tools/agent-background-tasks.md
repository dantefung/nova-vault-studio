---
title: "Agent之：后台任务"
date: "2026-05-29"
source: "微信公众号"
url: "https://mp.weixin.qq.com/s/G2YKmrvVUJnXbltdqIVm3g"
---

# Agent之：后台任务

后台任务就是将一个待执行任务放在后台去执行，而主流程可以继续做剩下的事情。适合耗时且不依赖其他任务的操作，实现并行处理。

## 1. 后台任务的架构

核心要点：
- **子进程运行**：任务以 subprocess.run() 在后台运行，不干扰主任务
- **结果捕获**：主线程捕获完成的子进程，将结果带入下一轮对话

```
主线程 (Agent Loop)              后台线程 (Worker)
┌─────────────────────┐         ┌─────────────────────┐
│ 1. drain_notifications()        │ subprocess.run()    │
│ 2. 注入 <background-results>    │ 捕获 stdout/stderr  │
│ 3. LLM 调用                     │ 判断状态            │
│ 4. 解析 tool_use                │ _persist_task()    │
│ 5. 执行工具, 返回结果            │ notification_queue │
└─────────────────────┘         └─────────────────────┘
```

## 2. 后台任务具体设计

### 2.1 工具系统

```python
TOOLS = [
    {
        "name": "background_run",
        "description": "Run command in background thread. Returns task_id immediately.",
        "input_schema": {
            "type": "object",
            "properties": {"command": {"type": "string"}},
            "required": ["command"]
        }
    },
    {
        "name": "check_background",
        "description": "Check background task status. Omit task_id to list all.",
        "input_schema": {
            "type": "object",
            "properties": {"task_id": {"type": "string"}}
        }
    }
]
```

### 2.2 BackgroundManager 类

```python
class BackgroundManager:
    def __init__(self):
        self.tasks = {}  # task_id -> {status, result, command, started_at}
        self._notification_queue = []  # 已完成任务的结果通知
        self._lock = threading.Lock()

    def run(self, command: str) -> str:
        """启动后台线程，立即返回 task_id。"""
        task_id = str(uuid.uuid4())[:8]
        # 启动后台线程
        thread = threading.Thread(target=self._execute, args=(task_id, command), daemon=True)
        thread.start()
        return f"Background task {task_id} started: {command[:80]}"

    def check(self, task_id: str = None) -> str:
        """查看单个任务状态，或列出所有任务。"""

    def drain_notifications(self) -> list:
        """返回所有已完成的任务，并清空所有待处理完成通知。"""
```

### 2.3 关键设计点

- **结果持久化**：后台任务结果以 JSON 存储在本地磁盘，会话关闭不丢失
- **通知队列**：完成任务结果推入队列，主循环通过 drain_notifications() 取出

## 3. 主循环

```python
def agent_loop(messages: list):
    while True:
        # 排空后台通知，注入到新一轮输入
        notifs = BG.drain_notifications()
        if notifs and messages:
            notif_text = "\n".join(
                f"[bg:{n['task_id']}]{n['status']}:{n['preview']}"
                f"(output_file={n['output_file']})"
                for n in notifs
            )
            messages.append({"role": "user", "content": f"<background-results>\n{notif_text}\n</background-results>"})

        # 大模型调用
        response = client.messages.create(model=MODEL, system=SYSTEM, messages=messages, tools=TOOLS)

        # 处理工具调用...
```

## 相关章节

- [Agent之：任务系统](/md/columns/agentic-engineer/)
- [Agent之：错误恢复机制](/md/columns/agentic-engineer/)
- [Agent之：系统提示词](/md/columns/agentic-engineer/)
- [Agent之：记忆系统](/md/columns/agentic-engineer/)