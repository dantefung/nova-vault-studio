Title: 企业功能 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/services/enterprise.html

Markdown Content:
## 企业功能 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/enterprise.html#%E4%BC%81%E4%B8%9A%E5%8A%9F%E8%83%BD)

Claude Code 提供完整的企业级功能支持，包括策略限制、远程设置管理和团队记忆同步。

## 企业功能矩阵 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/enterprise.html#%E4%BC%81%E4%B8%9A%E5%8A%9F%E8%83%BD%E7%9F%A9%E9%98%B5)

| 功能 | 模块 | 说明 |
| --- | --- | --- |
| **远程托管设置** | remoteManagedSettings | 组织级设置覆盖 |
| **策略限制** | policyLimits | 功能使用限制 |
| **设置同步** | settingsSync | 跨环境设置同步 |
| **团队记忆同步** | teamMemorySync | 共享记忆 + 安全扫描 |
| **SSO/OIDC** | oauth/ | 企业单点登录 |

## 远程托管设置 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/enterprise.html#%E8%BF%9C%E7%A8%8B%E6%89%98%E7%AE%A1%E8%AE%BE%E7%BD%AE)

`loadRemoteManagedSettings`（`src/services/remoteManagedSettings/index.ts`）实现组织级设置管理。

托管设置可覆盖的配置项包括：

*   `permissions`: 权限配置
*   `mcpServers`: MCP 服务器配置
*   `allowedTools` / `deniedTools`: 工具白名单/黑名单
*   `features`: 功能开关
*   `model`: 模型配置

使用 ETag 条件请求 + 缓存机制，定期轮询获取更新。

## 策略限制 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/enterprise.html#%E7%AD%96%E7%95%A5%E9%99%90%E5%88%B6)

`isPolicyAllowed`（`src/services/policyLimits/index.ts`）检查组织策略是否允许某项功能。

策略可控制的内容：

*   工具限制（allowedTools / deniedTools）
*   模型限制（allowedModels）
*   功能限制（maxAgentDepth、maxConcurrentTasks 等）
*   安全限制（requirePermissionConfirmation 等）

## 团队记忆同步 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/enterprise.html#%E5%9B%A2%E9%98%9F%E8%AE%B0%E5%BF%86%E5%90%8C%E6%AD%A5)

团队共享记忆系统通过 `TeamMemorySyncFetchResult`、`TeamMemorySyncPushResult`、`TeamMemorySyncUploadResult` 类型管理。

功能：

*   **push**: 上传本地记忆到服务器
*   **fetch**: 拉取团队记忆
*   **scan**: 安全扫描（防止敏感信息泄露）

## 设置同步 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/enterprise.html#%E8%AE%BE%E7%BD%AE%E5%90%8C%E6%AD%A5)

跨环境设置同步通过 `src/services/settingsSync/` 实现，主要导出：

*   `uploadUserSettingsInBackground()`: 后台上传本地设置
*   `downloadUserSettings()`: 下载远程设置
*   `redownloadUserSettings()`: 重新下载设置

相关类型包括 `SettingsSyncFetchResult`、`SettingsSyncUploadResult`、`UserSyncData`（`src/services/settingsSync/types.ts`）。
