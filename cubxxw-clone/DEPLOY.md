---
title: Cloudflare Pages 部署指南
---

# Nova Vault (cubxxw.com clone)

## 本地开发
```bash
npm install
npm run dev
```

## 部署到 Cloudflare Pages

### 方式一：手动部署（CLI）
```bash
# 1. 登录 Cloudflare
npx wrangler login

# 2. 创建 Pages 项目（首次）
npx wrangler pages project create nova-vault

# 3. 部署
npx wrangler pages deploy .next --project-name=nova-vault
```

### 方式二：GitHub Actions（自动）
1. 在 GitHub Settings → Secrets 中添加 `CLOUDFLARE_API_TOKEN`
2. Push 到 main 分支自动触发部署

### 方式三：Cloudflare Web UI
1. 登录 https://dash.cloudflare.com
2. Pages → Create a project → Connect to Git
3. 选择本仓库，框架选 Next.js
4. Build command: `next build`
5. Output directory: `.next`
6. Save and Deploy
