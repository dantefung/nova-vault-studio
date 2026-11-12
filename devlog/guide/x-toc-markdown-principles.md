---
title: "X 长文采集：baoyu-danger-x-to-markdown 工作原理"
date: "2026-10-29"
source: "项目自档"
---

# X 长文采集：baoyu-danger-x-to-markdown 工作原理

> 本项目 X / Twitter 长文的采集走的是 **baoyu-danger-x-to-markdown** 这个 Skill。它不是 opencli，也不是 playwright，而是一套**逆向 X GraphQL API + Chrome CDP 复用登录态**的方案。

---

## 1. 一句话定义

> 用你本机 Chrome 里已登录的 X session cookie，调用 X 的私有 GraphQL 接口，把推文 / Thread / X Article 转成带 YAML frontmatter 的 Markdown。

---

## 2. 认证层：Chrome CDP 复用登录态

### 2.1 原理

X 的反爬核心是 cookie（`auth_token`、`ct0` 等）。这个 Skill 不自己登录，而是**直接读本机 Chrome 已登录的 profile 目录里的 cookie 文件**，拿到已经过 X 验证的 session，然后用它去调 API。

所以流程是：

```
本机 Chrome（已登录 X）
    ↓
读 Chrome profile 目录（~/.config/google-chrome/… 或自定义路径）
    ↓
提取 auth_token / ct0 / gt / twid
    ↓
拼成 HTTP Cookie header
```

### 2.2 两种模式

| 模式 | 触发条件 | 行为 |
|---|---|---|
| **静默复用** | 本机 Chrome 已登录 X | 直接读 cookie，无需任何交互 |
| **`--login` 刷新** | 显式传 `--login`，或 cookie 过期 | 启动 Chrome → 导航到 x.com/login → 等你扫码/输密码 → 抓取新 cookie → 写入缓存 |

### 2.3 CDP 连接路径（`scripts/cookies.ts`）

```
findChromeExecutable()        → 找本机 Chrome / Edge 可执行文件
launchChrome(profileDir, port)→ 用同一个 profileDir 启动 Chrome，保留已有登录态
waitForChromeDebugPort(port)  → 等 CDP WebSocket 端口就绪
CdpConnection.connect(wsUrl)  → 建立 CDP 会话
→ 从 Chrome 文件系统读 cookies 并拼成 header
```

关键依赖包：`baoyu-chrome-cdp`（宝玉老师自维护的 Chrome DevTools Protocol 封装）。

### 2.4 同意书文件

```json
// ~/.local/share/baoyu-skills/x-to-markdown/consent.json
{
  "version": 1,
  "accepted": true,
  "acceptedAt": "2026-05-27T00:00:00.000Z",
  "disclaimerVersion": "1.0"
}
```

首次使用前必须显示免责声明并让用户选择「Yes / No」。本项目在 2026-05-27 已接受。

---

## 3. 数据层：GraphQL 请求

X 的 API 有两层：公开 REST（信息量有限）和私有 GraphQL（完整数据）。这个 Skill 走后者。

### 3.1 查询方式

```
POST https://x.com/i/api/graphql/<QUERY_ID>/TweetDetail
Headers:
  Cookie: <session cookies>
  x-twitter-auth-type: OAuth2Session
  x-client-transaction-id: <bearer token>
Body:
  { "variables": { "tweetId": "2115386721391333769" } }
```

### 3.2 为什么需要 feature switches 和 field toggles？

X 通过 A/B 实验控制不同的功能开关，GraphQL 请求必须带上这些开关才能让后端返回**完整字段**（比如含文章的推文、带视频附件的推文）。这些值是从 X 前端静态资源逆向提取的：

```typescript
// http.ts → fetchHomeHtml("https://x.com") → 正则提取
// 关键 key：__NEXT_DATA__ 里的 featureSwitches / fieldToggles
```

`FALLBACK_*` 常量是在逆向失败时的兜底值。

### 3.3 三个核心查询 ID（`constants.ts`）

| 用途 | QUERY_ID |
|---|---|
| 推文元信息 | `FALLBACK_TWEET_QUERY_ID = "HJ9lpOL-ZlOk5CkCw0JW6Q"` |
| 推文详情（Thread） | `FALLBACK_TWEET_DETAIL_QUERY_ID = "_8aYOgEDz35BrBcBal1-_w"` |
| X Article（长文） | `FALLBACK_QUERY_ID = "id8pHQbQi7eZ6P9mA1th1Q"` |

### 3.4 环境变量覆盖

- `X_AUTH_TOKEN` / `X_CT0`：手动指定 cookie，跳过 CDP
- `X_DEBUG_PORT`：指定 CDP 端口（调试用）

---

## 4. 输出层：Markdown 模板

拿到 GraphQL JSON 后，按三种格式分别处理：

### 4.1 单条推文（`tweet-to-markdown.ts`）

```markdown
---
url: "https://x.com/user/status/123"
author: "Name (@user)"
tweetCount: 1
coverImage: "https://pbs.twimg.com/media/..."
---

正文内容...
```

### 4.2 Thread（`thread-markdown.ts`）

每段推文之间用 `## N` 分段，引用块（`> Author:` / `> URL:`）区分「被回复的原推」和「当前推文的引用」。

### 4.3 X Article（长文，`tweet-article.ts`）

X 的 Article 是把推文本身当作文章载体，GraphQL 返回的 `legacy.article` 字段里是富文本结构（章节、图片、列表等）。`extractArticleFromEntity()` 递归提取。

---

## 5. 图片本地化（`media-localizer.ts`）

推文里的配图 URL 是 `https://pbs.twimg.com/media/<hash>.jpg`。本地化流程：

```
读取 markdown → 正则匹配 pbs.twimg.com/media/
→ urllib 下载（User-Agent: Mozilla/5.0）
→ 按出现顺序编号 001.jpg / 002.png …
→ 替换 markdown 里的 URL 为相对路径 ../images/<slug>/<n>.jpg
```

⚠️ `amplify_video_thumb/` 视频缩略图不下载（X 会 302 重定向到视频源，且不在 `pbs.twimg.com/media/` 路径下）。

---

## 6. 在项目中的实际用法

本项目（nova-vault-studio）的流水线封装在 `scripts/x-pipeline.py`：

```bash
# 抓取（自动找 baoyu-danger-x-to-markdown）
python3 scripts/x-pipeline.py fetch "https://x.com/user/status/123"

# 写 manifest，跑完整流水线
python3 scripts/x-pipeline.py all _sandbox/manifest.json
```

manifest 只承载人工判断部分（title / desc / related / links / sections / note），其余全部自动化：
- Thread 外壳剥离（`## N` 分段、推文 URL 行、引述头）
- 标题层级（原 H1 丢弃，其余下沉一级）
- 列表规范化（`N、` / `1⃣` / `▸` → Markdown 列表）
- 推文行间补段
- 配图本地化 + sharp 压缩（> 450KB 自动压）
- 去导流话术（正则匹配文末关注 / 私信 / 加群）
- 盘古之白排版 + 全角标点 + 配对引号

---

## 7. 与 opencli / playwright 的对比

| 维度 | baoyu-danger-x-to-markdown | opencli X adapter | playwright / chrome-devtools |
|---|---|---|---|
| **定位** | X 专用爬虫工具 | 多平台 CLI 框架（每个站一个 adapter） | 浏览器自动化通用框架 |
| **认证** | 复用本机 Chrome session cookie | 各 adapter 自持登录态（多数也是 CDP） | `setup-browser-cookies` 导入，或手动操作 |
| **速度** | 快（GraphQL 直接拉，不用等 DOM） | 中 | 慢（要等页面渲染） |
| **反爬对抗** | 中等，X 改 API 会断（依赖逆向的 query id / feature flags） | 中等，依赖 adapter 维护 | 最强，真实浏览器可过验证码 |
| **适合场景** | 快速抓几条长文归档 | 批量建/用多平台 CLI | QA 测试 / 需要交互的页面 |
| **在本项目的地位** | **主方案**（长期稳定） | 备选（微信/公众号用 markdown-proxy） | 不用来采 X |

---

## 8. 已知风险

1. **X 改 API**：query id / feature switches 一旦失效，抓取返回空或错误，需要重新逆向 X 前端。这是最大的脆弱点。
2. **账号风险**：复用 cookie 等同于用你的真实账号身份调非官方接口。X ToS 禁止这类操作，极端情况下可能触发账号限制（本项目用的是公开账号信息，实际风险较低）。
3. **cookie 过期**：`auth_token` 约 30–90 天过期，需要重新 `--login` 或更新环境变量。
4. **付费墙内容**：X Premium+ 订阅者才能看到的推文（如部分长文）需要额外权限，普通 cookie 拿不到。

---

## 9. 相关文件

| 文件 | 说明 |
|---|---|
| `~/.agents/skills/baoyu-danger-x-to-markdown/SKILL.md` | 上游 Skill 说明（v1.56.1） |
| `~/.agents/skills/baoyu-danger-x-to-markdown/scripts/main.ts` | 入口，640 行 |
| `~/.agents/skills/baoyu-danger-x-to-markdown/scripts/cookies.ts` | CDP 认证逻辑，281 行 |
| `~/.agents/skills/baoyu-danger-x-to-markdown/scripts/graphql.ts` | GraphQL 查询构造，389 行 |
| `~/.agents/skills/baoyu-danger-x-to-markdown/scripts/markdown.ts` | Markdown 生成，725 行 |
| `~/.agents/skills/baoyu-danger-x-to-markdown/scripts/media-localizer.ts` | 图片下载与路径重写，339 行 |
| `scripts/x-pipeline.py` | 本项目封装的流水线（`build` / `images` / `normalize` / `check`） |
| `scripts/normalize-typo.py` | 盘古之白排版工具 |
