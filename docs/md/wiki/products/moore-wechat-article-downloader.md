---
title: "moore-wechat-article-downloader"
date: "2026-07-14"
---

# moore-wechat-article-downloader

> **核心结论**：本地优先的 **Skill 形式** 公众号内容情报库——同步公众号文章、保存精选评论和互动数据，供 Codex/Claude Code 做内容研究。**核心差异化**：4 大场景闭环（同步/研究/收藏/链接归档）+ 写回评论互动 + 本地 SQLite 状态。

> **关键洞察**：
> - **本地优先**：不把公众号资料和会话数据交给第三方
> - **不是「导出就结束」**——而是「**继续可搜索/拆解/分析的本地资料库**」
> - **4 大场景闭环**：同步更新 / 公众号研究 / 微信收藏会话 / 链接归档
> - **Skill 形式**：装入 `~/.codex/skills/` 或 `~/.claude/skills/` 后用自然语言驱动

## 一句话定义

```
把公众号从信息流里捞出来，变成你的本地内容情报库。
```

## 适合谁

- **内容创作者**：拆选题、拆标题、拆表达方式
- **研究者 / 产品人**：长期跟踪多个公众号，比较变化
- **知识管理用户**：把微信内容沉到自己的本地资料库、wiki 或第二大脑
- **AI 用户**：把公众号内容变成 Codex/Claude Code 可以继续分析的输入

## 4 个核心场景

### 1) 同步更新

```text
同步我关注的公众号，按日期列出最近 50 篇新文章
```

**目标**：按日期列出最近更新的文章。

### 2) 公众号研究

```text
把「<某公众号>」最近 20 篇文章收进本地资料库
研究「<某公众号>」最近 10 篇文章，拆出它的选题方法和内容结构
结合「<某公众号>」最近 5 篇文章的精选评论和互动数据，判断读者真正买账的点
```

**目标**：一次下载一批 + 引导后续分析。**带「研究」动词**——告诉 skill 要拆解什么。

### 3) 微信收藏会话

```text
开启微信收藏会话，边看边把正文、评论和互动信号保存到本地
```

**目标**：在微信端**边看边保存**（不是事后导入）。需要 macOS 微信桌面客户端 + 本地证书 + mitmproxy。

### 4) 链接归档

```text
把这些公众号文章链接导入本地：https://mp.weixin.qq.com/s/xxx
把群里发来的公众号文章链接整理成本地资料库
```

**目标**：把零散链接变成统一的本地文章库。

## 和常见导出工具的区别

| 维度 | 常见导出工具 | moore-wechat-article-downloader |
|------|--------------|-------------------------------|
| 产品形态 | 脚本或一次性导出 | **本地优先的 Skill**，围绕 4 场景形成闭环 |
| 用户入口 | 需要理解脚本和参数 | **直接用自然语言**说场景 |
| 评论互动 | 额外 JSON 或增强导出 | **写回对应文章 Markdown** |
| 当前页收藏 | 多只处理批量导出 | **边看边点 `收藏到本地`**，保存已加载评论 |
| 输出方式 | 按任务/run-id 分散 | 固定 `~/Downloads/wechat-articles/<公众号名>/` |
| 本地状态 | 一次性 batch/export | **SQLite** 管理公众号/文章/下载/互动 |
| 隐私边界 | 有些依赖外部服务/API | **本地优先**，不把数据交给第三方 |

## 输出目录

```
~/Downloads/wechat-articles/<公众号名>/
├── articles/<文章标题>.md
├── images/<文章标题>/
└── index.csv
```

**本地还保存**：
- 文章正文 Markdown
- 图片
- 索引
- SQLite 状态
- 页面数据 + 互动数据

## 边界

> 作者明确划线了——这个工具**不**做的事：

- 不绕过登录、付费墙或私密内容（只处理公开文章）
- 不承诺全量评论（只承诺页面实际返回的数据）
- 精选评论可补，但**完整回复树不保证**
- 不打印 cookie / token / auth-key / pass_ticket 等敏感值
- 不做 SaaS / 云端托管 / 内容改写

## 安装

### Codex

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/Moore-developers/moore-wechat-article-downloader.git \
  ~/.codex/skills/moore-wechat-article-downloader
```

### Claude Code

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/Moore-developers/moore-wechat-article-downloader.git \
  ~/.claude/skills/moore-wechat-article-downloader
```

重新打开 Codex/Claude Code 后，**直接用自然语言说需求**即可。

### 按需依赖

| 依赖 | 适用场景 |
|------|----------|
| 扫码登录自己公众号后台 | Exporter 历史列表 |
| macOS 微信桌面客户端 + 本地证书 + mitmproxy | 微信收藏和旧代理历史 |
| macOS 系统 | 自动切换和恢复系统代理 |

## 核心脚本

| 脚本 | 作用 |
|------|------|
| `scripts/wechat_wizard.py` | 自然语言任务、登录和选择入口 |
| `scripts/wechat_exporter.py` | 公众号搜索、历史同步、订阅和增量下载 |
| `scripts/wechat_downloader.py` | 链接导入、微信收藏、旧代理历史和页面快照归档 |

## 测试

```bash
python3 -m unittest discover -s evals -p 'test_*contract.py'
```

## 关联资源

- 仓库：https://github.com/Moore-developers/moore-wechat-article-downloader
- 完整文档：
  - [SKILL.md](https://github.com/Moore-developers/moore-wechat-article-downloader/blob/main/SKILL.md)
  - [skill-cli-flow.md](https://github.com/Moore-developers/moore-wechat-article-downloader/blob/main/references/skill-cli-flow.md)
  - [output-formats.md](https://github.com/Moore-developers/moore-wechat-article-downloader/blob/main/references/output-formats.md)
  - [troubleshooting.md](https://github.com/Moore-developers/moore-wechat-article-downloader/blob/main/references/troubleshooting.md)
  - [compliance.md](https://github.com/Moore-developers/moore-wechat-article-downloader/blob/main/references/compliance.md)

## 与本仓其他工具的对比

| 工具 | 形态 | 核心能力 |
|------|------|----------|
| **moore-wechat-article-downloader** | 微信公众号 Skill | 公众号内容本地情报库 + 评论互动 |
| [[wiki-ingest-article]] (本仓 skill) | 公众号文章采集 Skill | 单篇精读 + 抓取 + 下载图片 |
| [[aichuhai-dev]] | 公众号导航站 | AI 导航站（droidHZ 案例） |

**互补关系**：
- `wiki-ingest-article` 单篇精读 + 概念提炼
- `moore-wechat-article-downloader` 批量同步 + 评论互动
- `aichuhai.dev` 浏览 + 跳转第三方

## 适合何时使用

| 场景 | 推荐 |
|------|------|
| 想批量跟踪某博主所有内容 | ✅ moore-wechat-article-downloader |
| 想采集单篇文章做精读 | ✅ wiki-ingest-article (本仓) |
| 想批量评论互动数据分析 | ✅ moore-wechat-article-downloader |
| macOS 想边看边保存 | ✅ moore-wechat-article-downloader 微信收藏会话 |
| 不想装新工具 | ⚠️ 用本仓 wiki-ingest-article 即可 |

## 评分（按使用场景）

| 维度 | 评分 |
|------|------|
| 公众号内容自动化跟踪 | ⭐⭐⭐⭐⭐ |
| 评论互动数据采集 | ⭐⭐⭐⭐⭐ |
| 单篇文章精读分析 | ⭐⭐（用本仓 wiki-ingest-article 更顺） |
| macOS 边看边保存 | ⭐⭐⭐⭐ |
| Windows/Linux 支持 | ⭐⭐（自动代理切换只支持 macOS） |