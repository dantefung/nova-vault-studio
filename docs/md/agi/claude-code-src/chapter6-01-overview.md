Title: 命令大全 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/commands/

Markdown Content:
## 命令大全 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/#%E5%91%BD%E4%BB%A4%E5%A4%A7%E5%85%A8)

Claude Code 包含 **70~100+ 个斜杠命令**（取决于用户类型和 feature flag），分布在 `src/commands/` 的 80+ 个子目录/文件中。

## 命令类型 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/#%E5%91%BD%E4%BB%A4%E7%B1%BB%E5%9E%8B)

typescript

```
// 3 种命令类型（非 4 种，无 resume 类型）
// src/types/command.ts
type Command = CommandBase &
  (PromptCommand | LocalCommand | LocalJSXCommand)

// PromptCommand — 生成提示词给 AI
// LocalCommand  — 直接执行函数
// LocalJSXCommand — 渲染 React/Ink 组件
// 注意: ResumeEntrypoint 是独立类型，描述 resume 入口方式，不是命令类型
```

## 命令分类总览 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/#%E5%91%BD%E4%BB%A4%E5%88%86%E7%B1%BB%E6%80%BB%E8%A7%88)

### 会话管理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/#%E4%BC%9A%E8%AF%9D%E7%AE%A1%E7%90%86)

| 命令 | 类型 | 功能 |
| --- | --- | --- |
| `/clear` | local | 清除对话并重置会话 |
| `/compact` | local | 压缩上下文（三层压缩） |
| `/resume` | local-jsx | 恢复历史会话 |
| `/export` | local-jsx | 导出对话为文本文件 |
| `/diff` | local-jsx | 查看本次会话的文件变更 |
| `/session` | local-jsx | 显示会话信息（QR 码 + URL） |

### 代码工作流 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/#%E4%BB%A3%E7%A0%81%E5%B7%A5%E4%BD%9C%E6%B5%81)

| 命令 | 类型 | 功能 |
| --- | --- | --- |
| `/commit` | prompt | Git 安全提交 |
| `/commit-push-pr` | prompt | 分支→提交→推送→PR 完整流程 |
| `/review` | prompt | 代码审查 |
| `/security-review` | prompt | 安全审查 |

### 配置管理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/#%E9%85%8D%E7%BD%AE%E7%AE%A1%E7%90%86)

| 命令 | 类型 | 功能 |
| --- | --- | --- |
| `/config` | local-jsx | 打开设置界面 |
| `/permissions` | local-jsx | 权限规则管理 |
| `/hooks` | local-jsx | 钩子配置 |
| `/model` | local-jsx | 模型选择 |
| `/vim` | local | 切换 Vim 模式 |
| `/advisor` | local | 配置顾问模型 |

### 系统工具 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/#%E7%B3%BB%E7%BB%9F%E5%B7%A5%E5%85%B7)

| 命令 | 类型 | 功能 |
| --- | --- | --- |
| `/help` | local-jsx | 帮助界面 |
| `/doctor` | local-jsx | 环境诊断 |
| `/login` | local-jsx | OAuth 登录 |
| `/logout` | local | 登出 |
| `/install` | local-jsx | 安装/更新 |
| `/version` | local | 显示版本 |

### 高级功能 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/#%E9%AB%98%E7%BA%A7%E5%8A%9F%E8%83%BD)

| 命令 | 类型 | 功能 |
| --- | --- | --- |
| `/agents` | local-jsx | Agent 管理 |
| `/tasks` | local-jsx | 后台任务管理 |
| `/bridge` | local-jsx | Bridge 连接管理 |
| `/context` | local-jsx | 上下文可视化 |
| `/voice` | local | 语音模式切换 |
| `/insights` | local | 会话分析 |

## 文档导航 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/#%E6%96%87%E6%A1%A3%E5%AF%BC%E8%88%AA)

| 文档 | 涵盖内容 |
| --- | --- |
| [会话管理命令](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/session-commands.html) | clear, compact, resume, export, diff |
| [代码工作流命令](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/code-commands.html) | commit, review, security-review |
| [配置命令](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/config-commands.html) | config, permissions, hooks, model |
| [工具与系统命令](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/utility-commands.html) | help, doctor, login, install, agents, tasks |
