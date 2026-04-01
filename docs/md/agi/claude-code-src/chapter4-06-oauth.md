Title: 认证授权 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/services/oauth.html

Markdown Content:
## 认证授权 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/oauth.html#%E8%AE%A4%E8%AF%81%E6%8E%88%E6%9D%83)

Claude Code 支持多种认证方式：OAuth 2.0（主要）、API Key（备用）和 SSO（企业）。

## 认证流程 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/oauth.html#%E8%AE%A4%E8%AF%81%E6%B5%81%E7%A8%8B)

```
启动时
  │
  ├── 检查 ANTHROPIC_API_KEY 环境变量
  │   └── 存在 → 直接使用 API Key 模式
  │
  ├── 检查 OAuth Tokens (~/.claude/oauth/)
  │   ├── Access Token 有效 → 直接使用
  │   └── Access Token 过期 → Refresh Token 续期
  │
  └── 无凭据
      ├── console.anthropic.com OAuth 流程
      │   ├── 打开浏览器 → 授权页面
      │   ├── 本地 HTTP 回调监听
      │   └── 获取 tokens → 保存
      └── SSO/OIDC（企业配置）
```

## OAuth 2.0 实现 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/oauth.html#oauth-2-0-%E5%AE%9E%E7%8E%B0)

OAuth 配置分为 `PROD_OAUTH_CONFIG` 和 `STAGING_OAUTH_CONFIG` 两份，包含授权端点、Token 端点、clientId、redirectUri 和 scopes 等字段。

登录流程（`authLogin` 位于 `src/cli/handlers/auth.ts`）：

1.   生成 PKCE challenge（`generateCodeVerifier` / `generateCodeChallenge` 位于 `src/services/oauth/crypto.ts`）
2.   构建授权 URL 并打开浏览器
3.   本地 HTTP 服务器监听回调，获取授权码
4.   用授权码交换 token
5.   存储 token 到 `~/.claude/oauth/`

## Token 管理 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/oauth.html#token-%E7%AE%A1%E7%90%86)

Token 刷新通过 `refreshOAuthToken`（`src/utils/auth.ts`）实现，另有 `checkAndRefreshOAuthTokenIfNeeded` 用于检查并按需刷新。流程：

1.   加载已存储的 token
2.   用 refresh_token 向 token 端点发请求
3.   获取新 token 后存储
4.   失败时返回 null，需要重新登录

## API Key 模式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/oauth.html#api-key-%E6%A8%A1%E5%BC%8F)

API provider 通过环境变量检测和配置解析确定，优先级：

1.   `ANTHROPIC_API_KEY` → Anthropic provider
2.   `AWS_ACCESS_KEY_ID` → Bedrock provider
3.   `GOOGLE_APPLICATION_CREDENTIALS` → Vertex provider
4.   无环境变量 → 降级到 OAuth 流程

## 登出 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/services/oauth.html#%E7%99%BB%E5%87%BA)

登出由 `performLogout`（`src/commands/logout/logout.tsx`）实现，主要步骤：

1.   移除 OAuth tokens
2.   清除 API key 缓存
3.   关闭相关服务
