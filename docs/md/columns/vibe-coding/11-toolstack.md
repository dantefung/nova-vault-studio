---
title: "Vibe Coding 速度工具栈 — CLI & Skill & MCP 全配齐"
date: "2026-05-20"
source: "整合自 07-toolstack/vibe-coding-speed-stack.md"
url: "/columns/vibe-coding/11-toolstack"
---

# Vibe Coding 速度工具栈 — CLI & Skill & MCP 全配齐

> Vibe Coding 要快，工具链不能拖后腿。前端、后端、支付、域名、SEO、邮件——每个环节都配上 CLI 和 Skill，一条命令到位。

---

## 全景

| 环节 | 服务 | CLI | Skill / MCP | 一句话 |
|------|------|-----|-------------|--------|
| 前端 | **Vercel** | `vercel` | `frontend-design` | 部署 Next.js/React，一键上生产 |
| 后端 | **Supabase** | `supabase` | MCP: supabase | Postgres + Auth + Storage，开箱即用 |
| 支付 | **Stripe** | `stripe` | — | 支付、订阅、发票，API 先行 |
| 域名 & 图床 | **Cloudflare** | `wrangler` | — | DNS + R2 图床 + Workers + Pages |
| SEO | **GSC + GA4** | `gsc` / `ga4` | — | 搜索表现 + 流量分析 |
| 邮件 | **Resend** | `resend` | — | 事务邮件，React 模板直接渲染 |
| 服务器 | **SSH Agent** | `ssh` | — | 不用 Serverless 就自己配，一样快 |

---

## 各环节速配指南

### 前端：Vercel

```bash
npm i -g vercel
vercel login
vercel                        # 项目根目录一键部署
vercel --prod                 # 生产环境
```

**Skill**：`frontend-design` — 生成高质量前端界面，直接输出代码。

---

### 后端：Supabase

```bash
npm i -g supabase
supabase login
supabase init                 # 初始化项目
supabase start                # 本地开发
supabase link --project-ref xxx
supabase db push              # 推送数据库变更
```

**MCP**：配置 `@supabase/mcp-server-supabase` 让 Agent 直接操作数据库。

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase", "--token", "$SUPABASE_ACCESS_TOKEN"]
    }
  }
}
```

---

### 支付：Stripe

```bash
npm i -g stripe
stripe login
stripe triggers init          # 本地 Webhook 调试
stripe listen --forward-to localhost:3000/api/webhook
```

**关键**：Stripe 的强项在 API 设计，直接读文档比任何工具都快。配合 Agent 写 checkout session 代码即可。

---

### 域名 & 图床：Cloudflare

```bash
npm i -g wrangler
wrangler login
wrangler r2 bucket create my-images   # 创建图床
wrangler pages deploy ./out            # 部署静态站
```

**常用场景**：
- **图床**：R2 bucket + 自定义域名，图片上传后返回公开 URL
- **域名**：DNS 管理、SSL 自动签发
- **Worker**：边缘函数，处理图片压缩/转换等

---

### SEO：Google Search Console + GA4

```bash
# GSC - 搜索表现
gsc-cli sites list
gsc-cli query --site example.com --days 30

# GA4 - 流量分析
ga4-cli report --property 123456 --metrics activeUsers,sessions
```

**Agent 用法**：定期跑 SEO 报告→生成优化建议→写 meta 标签。

---

### 邮件：Resend

```bash
npx resend setup
```

```ts
// React 邮件模板 → 直接发送
import { Resend } from "resend"
const resend = new Resend(process.env.RESEND_API_KEY)
await resend.emails.send({
  from: "noreply@example.com",
  to: "user@example.com",
  subject: "Welcome",
  react: WelcomeTemplate({ name: "User" })
})
```

---

### 服务器：SSH Agent（不用 Serverless 就自己来）

```bash
# ~/.ssh/config
Host my-server
  HostName 1.2.3.4
  User deploy
  IdentityFile ~/.ssh/id_ed25519
  ForwardAgent yes

# 配好以后
ssh my-server "cd /app && git pull && docker compose up -d"
```

**Agent 配合**：把部署命令写成脚本，Agent 一条 `bash` 调用搞定全流程。

---

## 终极组合：一条 prompt 出产品

配齐上面的 CLI + Skill + MCP 后，一个完整的 vibe coding 流程大概是这样：

```
"用 Next.js + Supabase + Stripe 做一个 SaaS 模板，
Cloudflare 挂域名，Resend 发邮件，Vercel 部署"

→ Agent 执行：
1. frontend-design Skill 出 UI
2. Supabase MCP 建表
3. Stripe CLI 初始化支付
4. wrangler 配 DNS
5. vercel deploy
```

---

## 说在最后

工具链的本质是**消除摩擦**——每一步从"打开网页、点按钮、填表单"变成"敲一行命令"。当你把所有环节的 CLI 都配好了，Vibe Coding 的速度才能真正起飞。
