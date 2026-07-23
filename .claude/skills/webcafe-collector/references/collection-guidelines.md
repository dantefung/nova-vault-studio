# web.cafe 采集归档规范

> 基于实操总结的经验规范，适用于将 web.cafe 文章归档到本知识库。

---

## 一、环境准备

```bash
# 验证 opencli 与浏览器桥接
opencli doctor
# 预期输出：Everything looks good!
```

- Chrome 必须已登录 web.cafe（复用 session）
- Browser Bridge 扩展已加载到 Chrome

---

## 二、抓取方式（二选一）

### 方式 A：opencli（首选）

```bash
opencli web read --url "https://new.web.cafe/tutorial/detail/{UID}"
# 输出到 web-articles/{标题}/
```

**优点**：自动下载图片，输出 Markdown
**缺点**：有时被 Cloudflare 拦截，只返回工具栏 UI（size < 1KB）

### 方式 B：Chrome DevTools MCP（备用）

```bash
# 导航到文章
chrome-devtools_navigate_page url="https://new.web.cafe/tutorial/detail/{UID}"

# 提取正文（Python 脚本取 mainText）
chrome-devtools_evaluate_script "document.querySelector('main').innerText"
```

**适用场景**：opencli 返回 size < 1KB 或被 Cloudflare 拦截时

---

## 三、归档规范

### 3.1 文件命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 文章 | `英文-kebab-case.md` | `what-to-do-after-launching-site-50k-revenue-seo-ranking-guide.md` |
| 图片目录 | `images/{文章英文名}/` | `images/what-to-do-after-launching-site-50k-revenue-seo-ranking-guide/` |
| 图片文件 | `img_NNN.jpg/png`（保留原始命名） | `images/{文章英文名}/img_001.jpg` |

**注意**：图片目录名不要带 `.md` 后缀！

### 3.2 图片引用路径

```markdown
![描述](images/{文章英文名}/img_001.jpg)
```

### 3.3 目录结构

```
docs/md/columns/indie-hub/seo/{专栏目录}/
├── index.md                                      ← 专栏索引
├── {文章英文名1}.md
├── {文章英文名2}.md
└── images/
    ├── {文章英文名1}/
    │   ├── img_001.jpg
    │   └── img_002.png
    └── {文章英文名2}/
        ├── img_001.jpg
        └── img_002.png
```

### 3.4 目标专栏目录映射

| 专栏名 | 目录 | 来源 URL |
|--------|------|----------|
| 新手入门 | `webcafe-beginner/` | `tutorial/7c36c9a7c6e34d21b8f3efd857d980aa` |
| 进阶教程 | `webcafe-advanced/` | `tutorial/{advanced_uid}` |
| 需求挖掘 | `webcafe-demand/` | `tutorial/566236a5bb414c7eba92dcbadbf00240` |
| 上站推广 | `webcafe-ship/` | `tutorial/detail/sk5je1bj0f` |

---

## 四、Frontmatter 模板

```yaml
---
title: "文章标题（原文标题）"
date: "YYYY-MM-DD"
source: "web.cafe"
author: "作者名"
url: "https://new.web.cafe/tutorial/detail/{UID}"
---
```

**必填字段**：`title`（缺失会阻断 git commit）
**推荐字段**：`date`, `source`, `author`, `url`

---

## 五、正文清洗规则

### 5.1 需要删除的噪音

| 噪音类型 | 内容示例 | 位置 |
|----------|----------|------|
| 重复标题 | `# 文章标题`（第二次出现） | 正文开头 |
| 副标题 | `## 新手入门` / `## 哥飞小课堂` | 正文开头 |
| 收藏按钮 | `收藏` | 正文开头 |
| 评论区 | `评论区` 及之后的所有内容 | 正文末尾 |
| 评论区分页 | `1` `2` 等分页按钮 | 评论区下方 |
| Web.Cafe 页脚 | `Web.Cafe`, `153 results`, `Use arrow keys` | 文件末尾 |
| chrome-extension | `chrome-extension://...` | 文件末尾 |

### 5.2 正文起始点

找到第一句正文内容，通常是：
- `"大家好，我是哥飞"`
- `"今天..."`
- `"今天#哥飞小课堂..."`

### 5.3 正文结束点

找到 `评论区` 关键字所在行，取其前一行。

### 5.4 图片路径转换

```python
# 原始路径
images/img_NNN.jpg
# 转换后
images/{文章英文名}/img_NNN.jpg
```

---

## 六、索引更新

### 6.1 专栏 index.md

每个专栏目录的 `index.md` 需要维护文章列表：

```markdown
## 目录

- [1. 文章标题](./文章文件名.md)
- [2. 文章标题](./文章文件名.md)
```

**注意**：侧边栏自动生成，但 index.md 中的文章链接需要手动维护。

### 6.2 顶层 seo/index.md

新增专栏目录时，在 `docs/md/columns/indie-hub/seo/index.md` 中添加：

```markdown
| N | [专栏名](./专栏目录/index.md) | 关键词 |
```

---

## 七、Cloudflare 应对策略

| 情况 | 判断依据 | 解决方案 |
|------|----------|----------|
| 正常抓取 | size > 1KB，有完整正文 | 正常归档 |
| 工具栏 UI | size < 1KB，只有 TextColor 等工具栏文字 | 切换到 Chrome DevTools MCP |
| 频率限制 | opencli 返回 Security Verification | 等待 15-30 秒后重试 |
| 登录墙 | 返回"本文登录可见" | 在 Chrome 中手动登录 web.cafe |

**经验法则**：连续抓取多篇文章时，每篇间隔 15 秒。

---

## 八、验证清单

归档完成后，逐条检查：

- [ ] Frontmatter 含 `title`（必填）
- [ ] Frontmatter 含 `url`（指向原文）
- [ ] 正文无重复标题、无 `收藏`、无 `评论区`
- [ ] 图片路径格式正确（`images/{文章英文名}/img_NNN.ext`）
- [ ] 图片目录已创建，图片文件已复制
- [ ] 专栏 index.md 已更新文章链接
- [ ] 顶层 seo/index.md 已添加新专栏（首次创建专栏时）
- [ ] 临时目录 `web-articles/` 已清理

---

## 九、常见坑

| 坑 | 原因 | 解决 |
|----|------|------|
| 图片路径多了 `images/images/` 前缀 | bash sed 替换时 `#` 在文件名中被当作注释符截断 | 用 Python 脚本做替换，不用 bash sed |
| 图片目录名带 `.md` 后缀 | 复制目录时直接用了文章文件名（含 .md） | 图片目录名 = 文章英文名，不含 `.md` |
| opencli 只返回工具栏 | Cloudflare 拦截，返回了浏览器扩展 UI 而非正文 | 切换到 Chrome DevTools MCP |
| Frontmatter 检查报 file not found | hook 脚本路径相对于 repo root 执行 | 在 repo root 运行 `python3 .claude/hooks/check-frontmatter.py <文件路径>` |
| 中文文件名 bash 变量展开异常 | bash 对中文和特殊字符（如 `#`、`$`）处理不稳定 | 关键操作（sed 替换、文件移动）用 Python 脚本 |

---

## 十、快速参考

```bash
# 抓取单篇
opencli web read --url "https://new.web.cafe/tutorial/detail/{UID}"

# 批量抓取（间隔15秒）
for uid in UID1 UID2; do
  opencli web read --url "https://new.web.cafe/tutorial/detail/$uid"
  sleep 15
done

# 验证 frontmatter
python3 .claude/hooks/check-frontmatter.py "path/to/article.md"

# 检查图片引用
grep "images/" "path/to/article.md" | wc -l
```
