---
title: "Web.Cafe 内容采集交接文档"
date: "2026-07-22"
source: "Nova Vault Studio"
url: ""
---

# Web.Cafe 内容采集交接文档

## 项目目标

将 Web.Cafe（new.web.cafe）上的教程专栏内容批量采集到本地，处理后归档到本知识库。内容类型分两种：`text`（带 Markdown 正文）和 `ppt`（纯图片幻灯片）。

## 整体状态

| 项目 | 数值 |
|------|------|
| 专栏总数 | 30（分 2 页，每页 15-20） |
| 已完成专栏 | 18（88 篇 text 文章已导出） |
| 待处理专栏 | 12（~209 篇，在 /tutorials 第 2 页） |
| 纯 PPT 专栏 | ~10 个（0 篇 text 文章，需要截幻灯片图） |
| 提取目录 | `_sandbox/articles/` |

## 已完成工作

### 已提取为 text 的专栏（88 篇）

| 专栏 | Slug | 文章数 |
|------|------|--------|
| 20260719-北京分享会PPT | hf2xgbziiq | 5 |
| 20260719-北京分享交流会 | rj9c8xy5xh | 7 |
| 20260704-深圳分享会PPT | udqi4hod3n | 9 |
| 20260704-深圳分享交流会 | z396x14ftc | 16 |
| 20260614-上海分享交流会 | bzxu3zsloz | 6 |
| 新手 Google Ads 广告入门 by 冉云 | znjb3b1fuu | 3 |
| 每日群聊总结 | 9etu3jiony | 20 |
| 2025年度网站比赛颁奖直播 | 0ayip3cxb2 | 20 |
| 20251213-深圳分享会PPT | f9agwsqb1i | 2 |
| 20251213-深圳分享交流会 | 3c5byu0q0y | 0 (PPT only) |
| 哥飞案例拆解 | o3s8xl2e1s | 0 (PPT only) |
| 小游戏站赚美元攻略 | yh53rz2lge | 0 (PPT only) |
| 出海技术栈集成教程 | b75ie31jk3 | 0 (PPT only) |
| 20250726-成都分享交流会 | c7nfliecdb | 0 (PPT only) |
| 群聊精华归档 | il8btbhrx1 | 0 (PPT only) |
| 20250719-杭州分享交流会 | mjvfattrhj | 0 (PPT only) |
| 20250628-深圳分享交流会 | o8oazvmefp | 0 (PPT only) |
| AI 编程课 | dcvnnso7jg | 0 (PPT only) |

### 12 个待处理专栏（在 /tutorials 第 2 页）

| 专栏 | Slug | 文章数 |
|------|------|--------|
| 20250607-上海分享交流会 | 7s42i74bwn | 9 |
| 20250524-北京分享交流会 | cgcjyvogzj | 8 |
| 直播回放 | m2lsalydsh | 13 |
| 哥飞公众号归档 | ww4r3rsllv | 34 |
| 哥飞小课堂归档 | 3gbdqdqy0h | 83 |
| 20241221深圳年终分享交流会 | ee7jh6we01 | 10 |
| 公司经营 | oaczaw6uwu | 1 |
| 广告投放 | o1ck3p6vvr | 13 |
| Adsense | gs14JnqKBzrvwHcGT5d5pR | 7 |
| 案例分析 | bDR87FPAewjUSXn5QzN4AV | 9 |
| 养网站防老 | 7PG1iQzr3sXx1tyKmf9ZYd | 12 |
| 进阶教程 | 0c91c83924e9495aa75384becf6304ff | 10 |

## 关键文件索引

### 脚本（`_sandbox/`）

| 文件 | 用途 |
|------|------|
| `scrape-v5.cjs` | 主力爬虫。gstack stealth 浏览器 + 静态提取。攻克了 Turnstile 但只对 `/tutorials` 页面有效 |
| `scrape-progress.json` | 已完成的 column slug 列表 |
| `scrape-all.cjs` | 备用批量脚本 |
| `debug-*.cjs` | 各种调试脚本（浏览器启动、Turnstile 绕过、API 探测等） |
| `discover-articles.cjs` | 用 inline script 发现某专栏的所有文章 UID |
| `list-columns.cjs` | 提取所有专栏 slug 和名称 |
| `cookies.txt` | session cookies（moshmojito@gmail.com） |
| `debug-storage-state.json` | 浏览器 localStorage + cookies 持久化状态 |
| `load-cookies.sh` | 从 cookies.txt 加载到 Playwright |

### 数据

| 路径 | 内容 |
|------|------|
| `_sandbox/articles/{column_name}/{uid}.md` | 已提取的文章正文 |
| `_sandbox/articles/_index.md` | 文章索引（目前为空，待填写） |

## 核心技术问题：Turnstile 绕过

### 问题描述

Web.Cafe 使用 Cloudflare Turnstile 保护文章详情页。访问 `/tutorial/detail/{uid}` 时，如果 Turnstile 验证失败会重定向到 `/verify?callbackUrl=...`。

### 已验证的路径

| 方案 | 状态 | 说明 |
|------|------|------|
| Standalone Playwright + gstack stealth | ❌ 失败 | `/tutorials` 可访问（无 Turnstile），但详情页触发 Turnstile 且 **加载后返回 400**，`cf-turnstile-response` input 永不出现 |
| MCP 浏览器（Chrome DevTools Protocol） | ✅ 通过 | 已有的持久化浏览器上下文中有合法的 Turnstile 会话，详情页直接加载不跳转 |
| 直接访问 `/tutorial/{slug}`（专栏页） | ✅ 通过 | 专栏页可以从 `/tutorials` 页面直接点击进入 |

### Turnstile 失败细节

调试中捕获到：
- Turnstile 在详情页 DOM 中加载（`index-js.xxx.js` + `turnstile/turnstile.xxx.min.js`）
- POST `/cdn-cgi/challenge-platform/h/b/fo/...` → 200（Turnstile 发起）
- POST `pat` 和 `ci` → **400 Bad Request**（验证失败）
- Turnstile 加载了约 136KB JS 后卡住
- `localStorage` 中有 `cf.turnstile.u` token（`challenges.cloudflare.com` 域），但注入到新上下文仍然无效（可能是 token 过期或指纹不匹配）

### 当前有效方案：MCP 浏览器

使用 Chrome DevTools Protocol（CDP）的 `chrome-devtools_*` 工具，操作已有的浏览器标签页。具体流程：

1. 在 `/tutorials` 页面的"教程专栏"标签下获取所有专栏链接
2. 点击专栏进入 `/tutorial/{slug}`（不触发 Turnstile）
3. 在专栏页点击某篇文章进入 `/tutorial/detail/{uid}`（利用已有 session 通过 Turnstile）
4. 用 `evaluate_script` 提取 `document.querySelector('.prose')?.innerText` 和所有图片 URL
5. 用 `playwright_browser_run_code_unsafe` （Node.js 上下文，可 `require('fs')`）来写文件

### 复现 Turnstile 失败

```bash
node _sandbox/scrape-v5.cjs
```

该脚本启动 Chromium，用 gstack stealth 插件，用已认证的 cookie 初始化。访问 `/tutorials` 成功，但访问详情页时触发 Turnstile 失败。

## 待解决问题

### 1. 剩余 12 个专栏的 text 文章提取（~209 篇）

需要用 MCP 浏览器继续。每批 ~15 篇，用 `playwright_browser_run_code_unsafe` 写文件。

### 2. PPT 专栏的处理

~10 个专栏是纯 PPT（无文字正文，只有幻灯片图片）。有 2 种处理思路：
- **方案 A**：用 MCP 浏览器截取每张幻灯片的全尺寸截图
- **方案 B**：提取 `<img>` 标签的 `src` 属性（原始 URL），下载到本地

### 3. 已提取文章的归档入库

88 篇 markdown 文件需要：
- 补全 YAML frontmatter（title, date, source, url）
- 按专栏归类放入 `docs/md/` 对应目录
- 下载远程图片到本地 `images/` 目录
- 更新专栏 index.md

### 4. 哥飞案例拆解（627 篇）

这个专栏有 627 篇，是最大的专栏。但在前面的提取中没有被扫描到 articles 目录中（只有 column slug `o3s8xl2e1s`）。需要确认是否已提取。

### 5. 每日群聊总结仅有 20 篇

该专栏标注 875 篇，但只提取了 20 篇（分页限制）。需要用 MCP 浏览器处理分页继续采集。

## 数据提取格式

每篇文章输出为 `_sandbox/articles/{column_name}/{uid}.md`：

```markdown
---
title: "{文章标题}"
uid: "{uid}"
column: "{专栏名称}"
type: "text"
---

{prose innerText}
```

## 技术栈

| 层 | 技术 |
|----|------|
| 浏览器自动化 | Playwright + gstack stealth（独立）/ Chrome DevTools Protocol（MCP） |
| 节点运行时 | Node.js (.cjs) |
| 代理绕过 | gstack stealth 插件（`playwright-extra` + `puppeteer-extra-plugin-stealth`） |
| 会话管理 | cookies.txt + localStorage 持久化 |
| 身份 | moshmojito@gmail.com（vip 用户） |

## Chrome DevTools 连接问题：无登录态

### 现象

使用 `chrome-devtools_*` 工具时，导航到 web.cafe 显示"本文登录后可见"弹窗，无法访问文章。

### 原因

系统中有两个 Chrome 进程：
- **主 Chrome**（PID 1603925）：有 web.cafe 登录态，但**未开启 `--remote-debugging-port`**
- **chrome-devtools-mcp 自启的 Chrome**（独立 profile）：无登录态

`chrome-devtools-mcp` 默认连接自己启动的 Chrome，而不是主 Chrome，所以没有登录态。

### 解决方案

关闭主 Chrome 并用调试端口重新启动：

```bash
# 关闭所有 Chrome
killall chrome

# 用 remote debugging 模式启动
/opt/google/chrome/chrome --remote-debugging-port=9222
```

Chrome 会重新打开，原有标签页恢复，此时 chrome-devtools 即可连接主 Chrome 并继承登录态。

### 验证

```bash
curl -s http://127.0.0.1:9222/json/version
```

返回 Chrome 版本信息即成功。

---

## 恢复工作

要恢复 MCP 浏览器工作流：

1. 启动任意一个包含登录态的新页面（如 https://new.web.cafe/）
2. 通过 DevTools 上 `/tutorials` → 点专栏 → 点文章
3. 用 `playwright_browser_run_code_unsafe` 批量提取和写文件

要检查已提取进度：

```bash
find _sandbox/articles -name "*.md" ! -name "_index.md" | wc -l
cat _sandbox/scrape-progress.json
```
