---
name: webcafe-collector
description: "采集 web.cafe（new.web.cafe）文章到知识库。触发词：采集 web.cafe、webcafe 文章、哥飞教程、web.cafe 入库、新文章入库、采集专栏。支持专栏文章和帖子。两路方案：优先 opencli，备用 Chrome DevTools CDP。"
---

# Web.cafe Collector

## Iron Law

> **Turnstile 每次都会触发。** 不要假设第一次导航就能拿到正文。必须检查 URL 是否仍是 `/verify?`，如果是则执行绕过策略。

## Workflow Checklist

```
采集工作流：

- [ ] Step 1: 选择方法 ⛔ BLOCKING
  - [ ] 首选：opencli（快、自动下载图片）→ 加载 references/opencli-method.md
  - [ ] 备用：Chrome DevTools CDP（绕过 Cloudflare）→ 加载 references/chrome-cdp-method.md
- [ ] Step 2: 发现文章 UID ⚠️ REQUIRED
  - [ ] 打开专栏页，提取所有 /tutorial/detail/{UID} 链接
- [ ] Step 3: 逐篇抓取
  - [ ] 导航到文章详情页
  - [ ] 处理 Turnstile（见下方决策树）
  - [ ] 提取正文到 web-articles/
- [ ] Step 4: 下载图片
  - [ ] 用 curl -L 下载 → images/NNN.png
  - [ ] 替换 URL 为本地路径
- [ ] Step 5: 归档到 wiki ⚠️ REQUIRED
  - [ ] 复制到目标目录，添加 frontmatter
  - [ ] 下载图片到 images/{slug}/
  - [ ] 更新 index.md 索引
- [ ] Step 6: 验证
  - [ ] 所有文章有 frontmatter（title/date/source/author）
  - [ ] 图片路径为本地相对路径（无 https://）
  - [ ] index.md 包含新文章链接
  - [ ] git commit 成功
```

## Turnstile 决策树

每次导航后：

```
导航到文章 URL
  │
  ├─ URL 仍是 /verify? → 执行绕过
  │   ├─ 优先：列表页 onclick → evaluate_script 查找标题 <p> → 点击
  │   ├─ 其次：用户手动点 checkbox
  │   └─ 最后：重试导航（有时自动通过）
  │
  └─ URL 已是 /tutorial/detail/ → take_snapshot 提取正文
```

> ⚠️ `chrome-devtools_click` 点击 Turnstile checkbox **必定失败**（cross-origin iframe）。不要尝试。

## 方法选择

| 场景 | 推荐方法 |
|------|---------|
| opencli 可用 + Cloudflare 未频繁拦截 | opencli |
| opencli 持续返回 Security Verification | Chrome DevTools CDP |
| opencli 未安装 | Chrome DevTools CDP |
| 需要绕过登录墙 | Chrome DevTools CDP（复用已登录 session） |

## 资源

| 资源 | 何时加载 |
|------|---------|
| `references/opencli-method.md` | 使用 opencli 方法时 |
| `references/chrome-cdp-method.md` | 使用 Chrome DevTools CDP 方法时 |
| `references/common.md` | 归档步骤（frontmatter、命名、反模式） |
| `scripts/setup-chrome.sh` | 启动 Chrome CDP 时 |

## Anti-Patterns

- ❌ 跳过 Turnstile 检查 → 正文为空
- ❌ 用 `curl` 不带 `-L` 下载图片 → 下载失败
- ❌ 在 SKILL.md 里塞所有细节 → 应放 references/
- ❌ 忘记添加 frontmatter → pre-commit hook 拒绝提交
- ❌ 忘记更新 index.md → 文章在侧边栏不可见

## Pre-Delivery Checklist

- [ ] 每篇文章有 frontmatter（title/date/source/author）
- [ ] 所有图片为本地相对路径（无 `https://`）
- [ ] index.md 包含所有文章链接
- [ ] git commit 成功
- [ ] web-articles/ 临时目录已清理
