# 部署指南

System Vault 推荐使用 **Vercel** 进行自动化部署，实现 GitHub 推送即发布。

## 1. Vercel 设置
1. 在 Vercel 后台点击 **Import Project**，选择对应的 GitHub 仓库。
2. **Framework Preset**: 选择 `Other` (Vercel 会自动识别 VitePress，但手动确认更安全)。
3. **Build Command**: `npm run build`
4. **Output Directory**: `docs/.vitepress/dist`

## 2. 自动化配置 (`vercel.json`)
根目录下的 `vercel.json` 已经预设了路由重写规则，解决 `cleanUrls` 可能带来的路径问题：

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/$1" }
  ]
}
```

## 3. 环境变量
如果需要使用 Algolia 搜索，请在 Vercel 后台设置以下变量：
- `ALGOLIA_APP_ID`
- `ALGOLIA_API_KEY`
- `ALGOLIA_INDEX_NAME`
