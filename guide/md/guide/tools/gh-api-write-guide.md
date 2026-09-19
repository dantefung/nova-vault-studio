# 用 gh api 往 GitHub 知识库写指南

> 适用场景：你想往 GitHub 仓库写一个 markdown 文档，但仓库太大不想 clone 到本地
> 记录日期：2026-09-19

## 概述

GitHub CLI (`gh`) 提供 `gh api` 子命令，可以直接调 GitHub REST API，**免 clone 整个仓库**就能在 remote 上创建/更新/删除文件。这是往知识库写文档最快的路径。

## 核心命令

### 1. 验证 gh 已认证

```bash
gh auth status
```

### 2. 创建文件

GitHub REST API 创建文件需要三个东西：

- 仓库路径（`OWNER/REPO`）
- base64 编码后的内容
- commit message

```bash
# 步骤 1：把 markdown 写到本地文件
# （用 Write 工具或者其他编辑器）

# 步骤 2：base64 编码（注意：-w 0 去掉换行，避免 JSON 格式问题）
B64=$(base64 -w 0 /path/to/file.md)

# 步骤 3：构造 JSON payload
printf '{"message":"docs: 提交说明","branch":"main","content":"%s"}' "$B64" > /tmp/payload.json

# 步骤 4：调用 GitHub API 创建文件
gh api --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "repos/OWNER/REPO/contents/PATH/TO/FILE.md" \
  --input /tmp/payload.json
```

### 3. 更新文件

更新文件比创建多一步：需要现有文件的 `sha`。

```bash
# 先获取文件 SHA
SHA=$(gh api "repos/OWNER/REPO/contents/PATH/TO/FILE.md" | jq -r '.sha')

# 用同样的方式构造 payload，但加上 sha 字段
printf '{"message":"docs: 更新说明","branch":"main","content":"%s","sha":"%s"}' \
  "$B64" "$SHA" > /tmp/payload.json

# 调用 API（同样是 PUT）
gh api --method PUT \
  "repos/OWNER/REPO/contents/PATH/TO/FILE.md" \
  --input /tmp/payload.json
```

### 4. 删除文件

```bash
gh api --method DELETE \
  -H "Accept: application/vnd.github+json" \
  "repos/OWNER/REPO/contents/PATH/TO/FILE.md" \
  -f message="docs: 删除说明" \
  -f sha="$SHA"
```

---

## 关键坑点

### 1. URL 路径不要带前导斜杠

```bash
# 错误（bash 把路径当成本地文件系统路径）
gh api "/repos/OWNER/REPO/contents/foo.md"
# 报错：invalid API endpoint: "D:/.../repos/OWNER/REPO/contents/foo.md"

# 正确（用 repos 开头，无前导斜杠）
gh api "repos/OWNER/REPO/contents/foo.md"
```

### 2. 自动创建父目录

GitHub API 创建文件时，如果父目录不存在会自动创建。所以**不需要先 mkdir**，直接 PUT 即可。

### 3. base64 编码要去掉换行

`base64` 命令默认每 76 字符换行，会破坏 JSON 字符串。必须用 `-w 0`（Linux/Git Bash）。

```bash
# 正确
base64 -w 0 file.md

# 错误（会有换行符破坏 JSON）
base64 file.md
```

### 4. UTF-8 编码

GitHub API 要求 base64 编码的是 **UTF-8 字节**。

- bash 里 `base64 file.md` 默认处理字节流，直接用即可。
- PowerShell 里要用：

  ```powershell
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
  $base64 = [Convert]::ToBase64String($bytes)
  ```

### 5. 大文件 base64 编码的性能

`$(base64 -w 0 file.md)` 这种命令替换会把整个 base64 字符串塞进 shell argv。如果文件很大（几百 KB 以上），建议用文件：

```bash
base64 -w 0 file.md > /tmp/content.b64
# 然后在 JSON 里手动嵌入或用 jq 处理
```

### 6. "Silent Success" 现象

**症状**：执行 `gh api PUT` 后 stdout 输出被吞掉或管道截断，看起来好像失败了，但实际上文件已经写到 remote。

**复现**：用 `tail` / `head` / `grep` 等管道截断 gh api 输出时容易出现。

```bash
# 典型翻车流程：
gh api --method PUT ... --input /tmp/payload.json | tail -10
# ↑ stdout 被吞，看起来像失败
# ↑ 实际上文件已经写进去了

# 然后再调一次：
gh api --method PUT ... --input /tmp/payload.json
# ↑ 返回 422 "sha wasn't supplied"（因为文件已存在）
# ↑ 这才让你意识到上一步其实成功了
```

**正确做法**：

- **避免**在 `gh api` 后接 `tail` / `head` / `grep` 截断
- 用临时文件保存完整输出，再用 `jq` 解析：

  ```bash
  gh api --method PUT ... --input /tmp/payload.json > /tmp/api-response.json 2>&1
  cat /tmp/api-response.json | jq -r '.commit.sha'
  ```

- PUT 失败时**第一时间 GET 验证**，别急着再 PUT 一次：

  ```bash
  gh api "repos/OWNER/REPO/contents/PATH/TO/FILE.md" | jq -r '.sha'
  # 如果能拿到 sha，说明文件其实写进去了
  ```

### 7. PATH 传播陷阱（同类问题：看似失败但其实不是这层的问题）

**这是个跟 silent success 同类的"工具/系统反馈不到位"现象**，但发生在 PATH 设置的语境里，跟 gh api 调用无关。补充在这里是为了交叉提醒：

**症状**：装完某个工具后改了 Windows 用户 PATH，**新开 cmd / PowerShell 能用**，但**新开 bash / zsh 用不了**。

**根本原因**：bash / zsh 启动时是从 **Windows 父进程**继承 PATH 的，**不读 Windows 注册表**。修改注册表 PATH 后，已经在跑的 Windows 进程已经把 PATH 快照到内存，之后启动的 bash 还是看不到。

**解决方法**：在 `~/.bashrc` 和 `~/.zshrc` 里手动 `export PATH=...`，跟修改注册表 PATH 同步做。

**类比关系**：

| 现象 | 看似状态 | 实际状态 |
|------|---------|---------|
| Silent Success（gh api） | 调用失败 | 实际成功 |
| PATH 传播陷阱 | bash 用不了命令 | bash 不是错的，是父进程快照过期 |

两个现象的共同教训：**当命令反馈跟预期不符时，先验证实际状态再下结论**，而不是急着再执行一次。

**完整细节**：见 `guide/md/guide/terminal/win/yazi-cargo-install.md` 的"3.4 PATH 传播陷阱"小节。

---

## 实战示例

### 示例 1：在 nova-vault-studio 创建指南

```bash
B64=$(base64 -w 0 my-guide.md)
printf '{"message":"docs: add my-guide","branch":"main","content":"%s"}' "$B64" > /tmp/payload.json

gh api --method PUT \
  "repos/dantefung/nova-vault-studio/contents/guide/md/guide/tools/my-guide.md" \
  --input /tmp/payload.json
```

### 示例 2：列出仓库根目录（确认路径存在）

```bash
gh api "repos/OWNER/REPO/contents/" | jq -r '.[].name'
```

### 示例 3：列出子目录

```bash
gh api "repos/OWNER/REPO/contents/guide" | jq -r '.[].name'
```

### 示例 4：移动文件

GitHub API 没有原生的 move 接口。要"移动"必须两步：

1. GET 旧文件拿到 content + sha
2. PUT 到新路径
3. DELETE 旧文件

（整个流程在同一个 commit 里完成需要用 Git Data API，复杂度高，不推荐。）

---

## 适用 vs 不适用

✅ **适合**：

- 写一份文档（commit message 简单）
- 仓库太大不想 clone
- 临时小修小补
- 自动化脚本里写文件

❌ **不适合**：

- 大批量改动（应该 clone 后批量 commit）
- 需要 PR review 的场景（应该走正常 PR 流程）
- 需要解决冲突的场景（merge 冲突处理复杂）
- 涉及 git history 的操作（rename、cherry-pick 等）

---

## 参考资源

- GitHub REST API - Repositories contents: <https://docs.github.com/en/rest/repos/contents>
- gh api 文档: <https://cli.github.com/manual/gh_api>