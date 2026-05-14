---
title: "AI Agent 操作规范"
---

# Agent 操作规范 (Nova Vault Studio)

> VitePress 文档站点，没有传统工程工具链（无 lint/test/TS），内容即代码。

---

## 项目本质

- 这是一个 **纯内容站点**，不要运行 `npm test`/`npm run lint` — 这些命令不存在
- 所有 `.md` 文件放在 `docs/md/` 下，侧边栏和导航由文件系统扫描自动生成

---

## ⚠️ 致命坑

### Frontmatter `title` 是必填的，缺失会阻断提交

pre-commit hook (`check-frontmatter.py`) 检查所有 staged `.md` 文件，缺 `title` 直接拒绝提交。
`date`、`url` 缺失仅警告不阻断。

```yaml
---
title: "标题"          # 必填
date: "YYYY-MM-DD"     # 推荐
source: "来源"         # 推荐
url: "https://..."     # 推荐
---
```

### 微信 CDN 图片是 WebP 假扮 PNG

URL 后缀 `.png` 不代表文件格式就是 PNG。必须用 `convert` 转换后再确认：

```bash
curl -L -o /tmp/temp.png "URL"
convert /tmp/temp.png images/{文章名}/{图片名}.png
file images/{文章名}/{图片名}.png    # 必须输出 "PNG image data"
```

### `ignoreDeadLinks: true` — 死链接静默放过

构建时不会因为死链接报错。如果改动了文件路径或删除了页面，相关引用不会自动发现。

---

## 归档文章到专栏

1. 文件放到专栏目录（如 `docs/md/guide/ai/agentic-engineer/`）
2. **手动更新专栏 `index.md` 的表格** — 侧边栏自动生成，但 index.md 的索引表不自动维护
3. YAML frontmatter 必须含 `title`, `date`, `source`, `url`

---

## 图片存放规范

```
docs/md/{分类}/{子目录}/images/{文章英文名}/{图片文件}
```

- 图片放在文章同级的 `images/` 目录
- **每篇文章必须有独立的图片子目录**（以文章英文名命名）
- 引用路径用相对路径：`images/{文章英文名}/{图片文件}.png`

---

## 构建与预览

```bash
npm run dev       # 开发预览（自动生成 PDF 页面 + 本地字体）
npm run build     # 生产构建（同上）
npm run preview   # 预览构建产物
```

每次 dev/build 前自动运行 `generate-pdf-pages.js` 生成 PDF 入口页面。

---

## 侧边栏行为

- 侧边栏完全自动生成，新增 `.md` 文件即自动出现
- `index.md` 不出现在侧边栏中，但其所在目录会作为分组入口
- `tutorial/` 目录有特殊规则：只保留子目录中的文件，根目录文件被过滤
