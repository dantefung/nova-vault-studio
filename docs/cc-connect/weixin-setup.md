---
title: "cc-connect 微信个人号接入指南"
date: "2026-08-03"
source: "内部运维实践"
url: "https://github.com/chenhg5/cc-connect/blob/main/docs/weixin.md"
---

# cc-connect 微信个人号接入指南

## 概述

cc-connect 通过腾讯 ilink 机器人 HTTP 网关接入微信个人号，支持文字、图片、文件、语音等消息类型。

**注意**：这是「个人微信 + ilink」通道，与企业微信（`type = "wecom"`）不是同一套协议。

---

## 前置条件

- 已安装 cc-connect（`/usr/bin/cc-connect`）
- 配置文件：`/root/.cc-connect/config.toml`
- opencode 路径：`/root/.opencode/bin/opencode`（需加入 PATH）

---

## 快速开始

### 1. 扫码绑定微信

```bash
cd /opt/workspace/openmind
cc-connect weixin setup --project 项目名
```

终端会显示 ASCII 二维码，同时输出可复制的 URL 链接。

**扫码方式**：
- 直接用微信扫描终端二维码
- 或复制 URL 到微信打开扫码

### 2. 重启 cc-connect

```bash
# 先 kill 旧进程
pkill -f cc-connect
sleep 2

# 启动（注意 PATH 要包含 opencode）
PATH=$PATH:/root/.opencode/bin cc-connect start
```

### 3. 触发关联

用绑定的微信给机器人发一条消息（任意文字），完成关联。

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `cc-connect weixin setup` | 扫码登录（无 token 时）/ 绑定已有 token |
| `cc-connect weixin new` | 强制重新扫码（创建新机器人） |
| `cc-connect weixin bind` | 仅绑定 token（不扫码） |

### 绑定已有 token

如果已有 Bearer Token（从其他平台导出）：

```bash
cc-connect weixin bind --project 项目名 --token '<你的_Bearer_Token>'
```

---

## 配置文件示例

### 微信平台配置

```toml
[[projects.platforms]]
type = "weixin"

[projects.platforms.options]
token = "ilink_bot_bearer_token"      # 必填；扫码或 bind 写入
base_url = "https://ilinkai.weixin.qq.com"  # 可选，默认同左
# account_id = "bot_id@im.bot"        # 多账号时区分状态目录
# allow_from = "user@im.wechat"       # 建议限制使用者
# chat_id = "群ID@chatroom"           # 群聊时填写
```

### 多个项目复用同一个微信机器人

同一 token 可以绑定到多个项目，但会导致**同一条消息被多个项目同时响应**。

解决方案：
1. 只保留一个项目绑定微信
2. 或设置 `allow_from` 限制使用者

---

## 重启注意事项

cc-connect 重启时必须指定 PATH 包含 opencode：

```bash
PATH=$PATH:/root/.opencode/bin cc-connect start
```

否则报错：`opencode: "opencode" CLI not found in PATH`

---

## 常见问题

### 扫码无反应 / 超时
- 检查网络、API URL
- 增加超时时间：`--timeout 480`

### 写入配置后仍收不到消息
- 确认 `allow_from` 配置正确
- 确认 cc-connect 进程已重启
- 用微信给机器人发一条消息触发 `context_token`

### 媒体无法解密
- 核对 `cdn_base_url` 配置
- 检查网关返回的加密字段是否齐全

### 返回 errcode -14
- 多为会话过期
- 解决方案：重新扫码登录

---

## 项目微信绑定状态

| 项目 | 微信 | 状态 |
|------|------|------|
| nova-vault-studio | 微信 A | ✅ 已绑定 |
| openmind | 微信 B | ✅ 已绑定 |
| vast-dev-skill | - | 仅飞书 |
| vibe-writer | - | 仅飞书 |
| money-hub | - | 仅飞书 |
| gtd_todo | - | 仅飞书 |
| openmind-tg | Telegram | ✅ 已连接 |

---

## 进阶：群聊支持

### 配置特定群聊

```toml
[[projects.platforms]]
type = "weixin"

[projects.platforms.options]
token = "ilink_bot_bearer_token"
chat_id = "your_group_chat_id@chatroom"
```

### 获取群聊 ID

1. 启动 cc-connect
2. 让机器人加入目标群
3. 让群里任意用户发一条消息
4. 查看 cc-connect 日志，会打印带 `@chatroom` 后缀的 `chat_id`

### 把机器人加群

个人微信没有"邀请机器人入群"的 API。需要：
1. 在群里发起"添加"或
2. 把机器人二维码发到群里让人扫码

---

## 参考资料

- 官方文档：https://github.com/chenhg5/cc-connect
- 微信配置文档：`docs/weixin.md`
