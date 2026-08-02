# opencode-notify

OpenCode 通用 Webhook 通知插件。会话完成或出错时，自动发送通知到任意支持 Webhook 的平台。

**支持的平台**：企业微信、Slack、飞书、Discord、钉钉等任意 Webhook 端点。

## 安装

```bash
opencode plugin vastfuture/opencode-notify
```

或手动在 `opencode.json` 中添加：

```json
{
  "plugin": ["vastfuture/opencode-notify"]
}
```

## 配置

### 必需

| 环境变量 | 说明 |
|----------|------|
| `OPENCODE_NOTIFY_WEBHOOK` | Webhook URL（完整地址） |

### 可选

| 环境变量 | 说明 | 默认值 |
|----------|------|--------|
| `OPENCODE_NOTIFY_TITLE` | 通知标题模板 | `{{event}}: {{title}}` |
| `OPENCODE_NOTIFY_BODY` | 通知正文模板 | 见下方 |

### 模板变量

| 变量 | 说明 |
|------|------|
| `{{event}}` | 事件类型：`✅ 会话完成` / `❌ 会话出错` |
| `{{title}}` | 会话标题 |
| `{{project}}` | 项目名（从工作目录推断） |
| `{{agent}}` | Agent 名称 |
| `{{sessionId}}` | 会话 ID（前 8 位） |
| `{{error}}` | 错误信息（仅出错时有效） |

### 条件模板

正文模板支持 `{{#if error}}...{{/if}}` 行级条件，仅在变量非空时渲染该行：

```
- **项目**: {{project}}
{{#if error}}- **错误**: {{error}}{{/if}}
```

### 平台示例

**企业微信**：
```bash
export OPENCODE_NOTIFY_WEBHOOK="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx"
```

**飞书**：
```bash
export OPENCODE_NOTIFY_WEBHOOK="https://open.feishu.cn/open-apis/bot/v2/hook/xxx"
```

**Slack**：
```bash
export OPENCODE_NOTIFY_WEBHOOK="https://hooks.slack.com/services/xxx/xxx/xxx"
```

**Discord**：
```bash
export OPENCODE_NOTIFY_WEBHOOK="https://discord.com/api/webhooks/xxx/xxx"
```

**钉钉**：
```bash
export OPENCODE_NOTIFY_WEBHOOK="https://oapi.dingtalk.com/robot/send?access_token=xxx"
```

## 触发时机

- **会话完成**：`session.idle` 事件触发时发送完成通知
- **会话出错**：`session.error` 事件触发时发送错误通知（含错误信息）