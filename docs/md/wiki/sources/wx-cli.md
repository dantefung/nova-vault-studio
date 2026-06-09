---
title: "jackwener/wx-cli — 微信本地数据 CLI 工具（3.3k Stars）"
date: "2026-06-08"
source: "GitHub"
url: "https://github.com/jackwener/wx-cli"
---

# jackwener/wx-cli — 微信本地数据 CLI 工具（3.3k Stars）

> WeChat local data CLI with daemon architecture. 从命令行查询本地微信数据：会话/聊天记录/搜索/联系人/群成员/朋友圈/公众号文章/收藏/统计/导出。Rust 实现，零依赖，毫秒级响应，AI Agent Skill 支持。

<!-- more -->

## 核心特性

- **零依赖安装**：单一 Rust 二进制，一行命令装完（macOS/Linux/Windows 全平台）
- **毫秒级响应**：后台 daemon 持久缓存解密数据库，mtime 不变则复用
- **AI 友好**：`history` / `search` / `sessions` / `new-messages` / `stats` / `attachments` 默认返回 `{..., meta}` wrapper，Agent 能直接消费 freshness / source 信息
- **完全本地**：数据不出本机，实时解密，无需全量预解密
- **多语言支持**：中文/英文双语输出
- **AI Agent Skill**：`npx skills add jackwener/wx-cli` 一键安装到 Claude Code / Cursor / Codex 等

## 功能覆盖

| 命令 | 功能 |
|------|------|
| `wx sessions` | 最近 20 个会话 |
| `wx unread` | 有未读消息的会话 |
| `wx new-messages` | 上次检查后的新消息（增量） |
| `wx history "联系人"` | 最近消息历史，支持 `-n` 条数和 `--since/until` 时间范围 |
| `wx search "关键词"` | 全库搜索，支持 `-n` 条数和 `--in` 会话限定 |
| `wx contacts` | 联系人列表，支持 `--query` 搜索 |
| `wx members "群名"` | 群成员列表，含群昵称/群主标识 |
| `wx sns-notifications` | 朋友圈点赞/评论通知 |
| `wx sns-feed` | 朋友圈时间线，支持 `--user` / `--since` 限定 |
| `wx sns-search "关键词"` | 朋友圈全文搜索 |
| `wx biz-articles` | 公众号文章列表（支持 `--account` 限定公众号） |
| `wx attachments "联系人"` | 聊天图片附件列表 |
| `wx extract <attachment_id>` | 解密并导出图片附件到本地文件 |
| `wx favorites` | 收藏列表，支持 `--type` 筛选和 `--query` 搜索 |
| `wx stats "联系人"` | 聊天统计（消息数/活跃时段/Top 发送者） |
| `wx export "联系人"` | 导出聊天记录为 Markdown/JSON |
| `wx daemon status/stop/logs` | Daemon 进程管理 |

## 技术原理

微信 4.x 使用 **SQLCipher 4** 加密本地数据库（AES-256-CBC + HMAC-SHA512，PBKDF2 256,000 次迭代）。WCDB 在进程内存中缓存派生后的 raw key，格式为 `x'<64hex_key><32hex_salt>'`。

wx-cli 通过内存扫描提取密钥：
- **macOS**：`mach_vm_region` + `mach_vm_read` 扫描微信进程内存
- **Linux**：`/proc/<pid>/mem` 扫描
- **Windows**：`VirtualQueryEx` + `ReadProcessMemory`

匹配到密钥后，daemon 按需解密并缓存到 `~/.wx-cli/cache/`。

### 解码档位

| 档位 | 说明 |
|------|------|
| **legacy XOR** | 早期单字节 XOR，无 magic |
| **V1 fixed-AES** | AES-128-ECB + 固定 key `cfcd208495d565ef` |
| **V2 AES + XOR** | AES-128-ECB + raw + XOR；key 跨平台派生 |

## 架构

```
wx (CLI) ──Unix socket──▶ wx-daemon (后台进程)
                              │
                    ┌─────────┴──────────┐
               DBCache               联系人缓存
           (mtime 感知复用)
```

```
~/.wx-cli/
├── config.json       # 配置
├── all_keys.json     # 数据库密钥
├── daemon.sock       # Unix socket
├── daemon.pid / .log
└── cache/
    ├── _mtimes.json  # mtime 索引
    └── *.db          # 解密后的数据库
```

## 安装

```bash
# npm（推荐）
npm install -g @jackwener/wx-cli

# macOS/Linux
curl -fsSL https://raw.githubusercontent.com/jackwener/wx-cli/main/install.sh | bash

# Windows（PowerShell 管理员）
irm https://raw.githubusercontent.com/jackwener/wx-cli/main/install.ps1 | iex

# AI Agent 一键安装
npx skills add jackwener/wx-cli
```

### macOS 初始化

```bash
# 1. 对微信做 ad-hoc 重签名（只需做一次，微信更新后重做）
codesign --force --deep --sign - /Applications/WeChat.app

# 2. 重启微信后初始化
sudo wx init

# 3. 验证
wx sessions
```

## 数据

- **3.3k Stars** · **1.3k Forks** · **161 Commits** · **11 Releases**
- Rust 98.5%
- Apache-2.0 License

## 注意事项

- 仅用于学习研究，解密**自己的**微信数据
- macOS 重签名后会有 TCC 权限弹窗副作用
- V2 图片 key 在 Linux 上暂不支持（上游空白）