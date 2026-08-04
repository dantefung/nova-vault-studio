# OpenVPN 3 Debian Guide Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 Debian 文档目录新增一篇 OpenVPN 3 Linux 安装与连接教程。

**Architecture:** 复用现有 Debian 指南的中文实操风格，按“安装 -> 导入配置 -> 连接 -> 验证 -> 管理”组织内容。命令块直接可复制，避免引入与用户环境强绑定的私有参数。

**Tech Stack:** Markdown、Debian/Ubuntu `apt`、OpenVPN 3 Linux CLI

---

### Task 1: Review existing guide style

**Files:**
- Review: `docs/md/guide/os/debian/flatpak-guide.md`
- Review: `docs/md/guide/os/debian/keyd-guide.md`

**Step 1: Inspect existing Debian guides**

Run: `sed -n '1,220p' docs/md/guide/os/debian/flatpak-guide.md`
Expected: 当前 Debian 文档使用中文标题、分节步骤和可复制命令块。

**Step 2: Extract formatting conventions**

Check: 标题风格、命令块、说明段落和常见问题组织方式。
Expected: 新文档可沿用相同写法，无需额外模板。

### Task 2: Draft the OpenVPN 3 guide

**Files:**
- Create: `docs/md/guide/os/debian/openvpn3-linux-setup-and-connection-guide.md`

**Step 1: Write the document outline**

Include sections:
- 背景与适用范围
- 添加 OpenVPN 官方仓库
- 安装客户端
- 导入 `.ovpn` 配置
- 启动 VPN 连接
- 查看和管理会话
- 验证 VPN 是否生效
- 断开连接与常用命令

**Step 2: Fill in exact commands**

Use commands for:
- `apt install apt-transport-https curl`
- 导入 GPG key 与 apt source
- `apt update`
- `apt install openvpn3-client`
- `openvpn3 config-import`
- `openvpn3 session-start`
- `openvpn3 sessions-list`
- `openvpn3 session-stats`
- `openvpn3 session-manage`

**Step 3: Keep placeholders generic**

Replace environment-specific values with:
- `<发行版代号>`
- `<配置文件路径>`
- `<配置名>`
- `<session-path>`

Expected: 文档可被不同 Debian/Ubuntu 用户直接复用。

### Task 3: Review wording and structure

**Files:**
- Review: `docs/md/guide/os/debian/openvpn3-linux-setup-and-connection-guide.md`

**Step 1: Check readability**

Verify: 标题清晰、步骤顺序正确、说明不过度冗长。
Expected: 文档和现有 Debian 指南风格一致。

**Step 2: Check command formatting**

Verify: 所有命令都位于 fenced code block 中，示例路径和名称统一。
Expected: 用户可以直接复制执行。
