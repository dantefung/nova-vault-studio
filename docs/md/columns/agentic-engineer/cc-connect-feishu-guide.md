---
title: "cc-connect 飞书接入指南 — Claude Code 远程调用"
date: "2026-05-22"
source: "GitHub chenhg5/cc-connect"
url: "https://github.com/chenhg5/cc-connect/blob/main/docs/feishu.md"
---

# cc-connect 飞书接入指南

> 通过飞书机器人远程调用 Claude Code，无需公网 IP、域名、反向代理。WebSocket 长连接模式。

---

## 核心优势

长连接模式，无需公网 IP、无需域名、无需 ngrok/frp。

```
用户消息 → 飞书开放平台 → WebSocket Gateway
                                │
                     WebSocket 长连接
                                │
                     cc-connect ← → Claude Code ← → 项目代码
```

---

## 快速配置

```bash
cc-connect feishu setup --project my-project
cc-connect feishu setup --project my-project --app cli_xxx:sec_xxx
```

| 命令 | 作用 |
|------|------|
| `setup` | 统一入口：无凭证走新建，有凭证走绑定 |
| `new` | 强制二维码新建 |
| `bind` | 强制关联已有凭证 |

---

## 关键配置

```toml
[[projects.platforms]]
type = "feishu"

[projects.platforms.options]
app_id = "cli_axxxxxxxxxxxx"
app_secret = "QhkMpxxxxxxxxxxxxxxxxxxxx"
enable_feishu_card = true    # 交互卡片（需订阅 card.action.trigger）
thread_isolation = true      # 按飞书 thread 隔离会话
resolve_mentions = true      # @显示名 自动替换为飞书 at 标签
progress_style = "compact"   # legacy | compact | card
done_emoji = "Done"          # agent 完成后添加表情回复
```

---

## 配置步骤摘要

1. 飞书开放平台 → 创建企业自建应用
2. 获取 App ID + App Secret
3. 启用机器人能力
4. 申请 6 项权限（`contact:user.base:readonly`、`im:message:*`、`im:message:send_as_bot`）
5. 配置事件订阅：`im.message.receive_v1` + `card.action.trigger`（长连接模式）
6. 发布应用版本
7. 启动 `cc-connect`
8. 添加机器人到单聊/群聊

---

## 长连接 vs Webhook

| 对比项 | 长连接 | Webhook |
|-------|--------|---------|
| 公网 IP | 不需要 | 需要 |
| 域名 | 不需要 | 需要 |
| HTTPS | 不需要 | 需要 |
| 反向代理 | 不需要 | 需要 |
| 适用场景 | 本地开发/内网 | 生产环境 |

---

## 相关信息

- [GitHub: chenhg5/cc-connect](https://github.com/chenhg5/cc-connect)
- [飞书开放平台](https://open.feishu.cn/)
- [飞书 WebSocket 长连接模式](https://m.blog.csdn.net/u014177256/article/details/158267848)
