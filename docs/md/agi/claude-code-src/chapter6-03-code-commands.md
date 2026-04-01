Title: 代码工作流命令 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/commands/code-commands.html

Markdown Content:
## 代码工作流命令 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/code-commands.html#%E4%BB%A3%E7%A0%81%E5%B7%A5%E4%BD%9C%E6%B5%81%E5%91%BD%E4%BB%A4)

## /commit — Git 安全提交 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/code-commands.html#commit-%E2%80%94-git-%E5%AE%89%E5%85%A8%E6%8F%90%E4%BA%A4)

`/commit` 是 `prompt` 类型命令（文件：`commands/commit.ts`），向 AI 发送提示词指导其执行 Git 提交流程。

主要流程：

1.   检查暂存区（`git diff --staged`）
2.   如没有暂存内容，让用户选择（`git add -p`）
3.   根据变更起草 Conventional Commits 提交消息
4.   使用 HEREDOC 格式执行提交
5.   不使用 `--no-verify`
6.   报告提交哈希

## /commit-push-pr — 完整发布流程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/code-commands.html#commit-push-pr-%E2%80%94-%E5%AE%8C%E6%95%B4%E5%8F%91%E5%B8%83%E6%B5%81%E7%A8%8B)

`/commit-push-pr` 是 `prompt` 类型命令（文件：`commands/commit-push-pr.ts`），包含完整的 PR 工作流。

四个阶段：

1.   **Branch**：检查/创建功能分支
2.   **Commit**：执行 `/commit` 流程
3.   **Push**：推送到远程
4.   **PR**：使用 `gh pr create` 创建或更新 PR，可选 Slack 通知

## /review — 代码审查 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/code-commands.html#review-%E2%80%94-%E4%BB%A3%E7%A0%81%E5%AE%A1%E6%9F%A5)

`/review` 是 `prompt` 类型命令（文件：`commands/review.ts`），审查当前 PR 的代码变更。

主要流程：

1.   获取 PR diff（`gh pr diff`）
2.   分析代码变更：逻辑正确性、边界条件、错误处理、性能、安全、风格
3.   按文件逐一给出审查意见
4.   给出整体评估

另有 `/ultrareview` 版本，使用 AgentTool 启动远程 bug 狩猎 Agent。

## /security-review — 安全审查 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/commands/code-commands.html#security-review-%E2%80%94-%E5%AE%89%E5%85%A8%E5%AE%A1%E6%9F%A5)

`/security-review` 是 `prompt` 类型命令（文件：`commands/security-review.ts`），从安全角度审查代码。

检查方面：

1.   **输入验证** — SQL 注入、XSS、命令注入
2.   **认证/授权** — 凭据处理、权限检查
3.   **加密** — 密钥管理、算法选择
4.   **注入攻击** — 模板注入、LDAP 注入
5.   **数据暴露** — 敏感数据泄露、日志输出
6.   **依赖安全** — 已知漏洞
7.   **配置安全** — 默认密码、调试模式
8.   **SSRF/CSRF** — 请求伪造防护

对每个发现给出严重程度、具体位置和修复建议。
