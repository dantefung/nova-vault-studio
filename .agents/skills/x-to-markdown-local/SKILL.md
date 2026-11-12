---
name: x-to-markdown-local
description: 本项目 X 长文归档流水线。基于 baoyu-danger-x-to-markdown（逆向 X GraphQL + Chrome CDP 复用登录态），把推文 / Thread / X Article 转成带 frontmatter 的 Markdown，并自动配图本地化、盘古之白排版、去导流话术。触发词：采集 X 链接、x 归档、X 长文归档。
metadata:
  depends-on: baoyu-danger-x-to-markdown
---

# X 长文归档流水线（本地封装版）

> 本项目封装自 [baoyu-danger-x-to-markdown](https://github.com/JimLiu/baoyu-skills) Skill。上游负责「抓取」，本 Skill 负责「归档 + 规范化」。

---

## 工作原理（简版）

**认证层**：读取本机 Chrome profile 目录里的 X session cookie（`auth_token` / `ct0`），无需重新登录。首次使用需确认同意书（`~/.local/share/baoyu-skills/x-to-markdown/consent.json`）。

**数据层**：调 X 私有 GraphQL 接口 `TweetDetail`（带 feature switches / field toggles），取推文 JSON。

**输出层**：按单推 / Thread / X Article 三种格式生成 Markdown + YAML frontmatter。

**本 Skill 的增值**：Thread 外壳剥离、标题层级修正、列表规范化、配图本地化 + 压缩、去导流话术、盘古之白排版。

---

## 完整流水线

```bash
# 1) 写 manifest（见下方格式）
# 2) 一键跑完
python3 scripts/x-pipeline.py all _sandbox/manifest.json
```

也可分步调用：

| 子命令 | 作用 |
|---|---|
| `fetch <url>...` | 调上游 Skill 抓取推文 |
| `images <manifest>` | 下载配图到 `docs/md/wiki/images/<slug>/`，单图 > 450KB 自动 sharp 压缩 |
| `build <manifest>` | 构建 `docs/md/wiki/sources/<slug>.md` |
| `normalize <manifest>` | 盘古之白 + 全角标点 + 配对引号 |
| `check <manifest>` | 校验悬空 wikilink / 远程图残留 / 图片引用存在性 |

---

## Manifest 格式

`_sandbox/manifest.json`：

```json
[
  {
    "slug": "author-topic-slug",
    "src": "x-to-markdown/User/123/0.md",
    "out": "docs/md/wiki/sources/author-topic-slug.md",
    "title": "作者：标题",
    "author": "作者 (@user)",
    "url": "https://x.com/user/status/123",
    "desc": "一句话摘要（渲染成标题下的引用块）",
    "related": ["sources/xxx", "patterns/yyy"],
    "links": {
      "https://t.co/abc": "https://real.url"
    },
    "sections": ["一、第一节", "二、第二节"],
    "insert_before": [["锚点文本", "插入的小标题"]],
    "note": "::: info 说明\\n正文\\n:::",
    "remove_lines": ["正则：整行删除"],
    "replace_lines": [["正则", "替换文本"]]
  }
]
```

字段说明：

| 字段 | 必填 | 说明 |
|---|---|---|
| `slug` | ✅ | 图片目录名、源文件名 |
| `src` | ✅ | 抓取产物的相对路径 |
| `out` | ✅ | 归档输出路径 |
| `title` | ✅ | 归档标题 |
| `author` | ✅ | 作者署名 |
| `url` | ✅ | 原始推文 URL |
| `desc` | ✅ | 一句话摘要 |
| `related` | | 结尾「相关页面」wikilink |
| `links` | | 短链还原（`t.co` → 真实 URL） |
| `sections` | | 多段 Thread 的自定义小标题 |
| `insert_before` | | 在指定位置前插入小标题 |
| `note` | | frontmatter 后的提示块（`:warning:` 或 `:info:`） |
| `remove_lines` | | 整行删除（去导流话术） |
| `replace_lines` | | 行内正则替换 |

---

## 自动处理约定

build 阶段自动做（无需在 manifest 声明）：

1. **Thread 外壳剥离**：`## N` 分段、推文 URL 行、`> Author:` / `> URL:` 引述头
2. **标题层级**：原 H1 丢弃（frontmatter 已生成），其余标题整体下沉一级
3. **列表规范化**：`N、` / `N．` / `1⃣` → Markdown 有序列表；`▸` / `* ` → 无序列表
4. **推文行间补段**：连续非空行补空行（表格行不打断）
5. **引用块还原**：`\\X\\` → `**X**`
6. **配图本地化**：`coverImage` 优先，其次正文 `pbs.twimg.com/media/` 按出现顺序编号
7. **去导流话术**：自动删除末尾「点赞 / 关注 / 加微信 / 私信 / 加群」话术

---

## 去导流话术正则（内置）

以下模式会被自动整行删除：

- `.*欢迎点个赞或者关注.*`
- `.*也欢迎关注我。后续我会继续在这里.*`
- `.*关注我一定是不会吃亏的.*`
- `.*有什么问题一定要主动私信我.*`
- `.*能解决不能解决我都会回复.*`
- `.*只要不是让我帮你远程.*`
- `.*都是free的.*`
- `.*这里借着自己的流量说一下.*`
- `.*我宣布：.*`
- `.*Bot时代正式到来！.*`
- `.*谢谢大家，欢迎随时讨论.*`

如需自定义，用 manifest 里的 `remove_lines` / `replace_lines`。

---

## 排版规范化（normalize 子命令）

调用 `scripts/normalize-typo.py`：

1. **盘古之白**：汉字与英文 / 数字之间补半角空格（保留行首缩进）
2. **全角标点**：中文语境下的 `,` `;` `:` `?` `!` 转全角
3. **配对引号**：跨行成对的 `"` 转 `""` 与 `''`，`'` 统一为 `′`

---

## 校验（check 子命令）

- 悬空 wikilink：`[[path]]` 目标文件不存在
- 远程图残留：正文仍含 `pbs.twimg.com/media/`
- 图片引用存在性：`![alt](../images/…)` 指向的文件不存在

---

## 临时产物清理

完成归档后执行：

```bash
rm -rf _sandbox x-to-markdown
```

`scripts/x-pipeline.py` 与 `scripts/normalize-typo.py` 是常驻工具，不要删。
