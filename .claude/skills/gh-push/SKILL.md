---
name: gh-push
description: |
  使用 gh 命令进行 git 提交和推送。当用户说 "commit"、"提交"、"push"、"推送"、"保存" 时调用。
  自动处理 gh token 认证，解决 https 推送时的认证问题。
---

# Git 提交与推送

使用 gh 命令完成 git 提交和推送。

## 执行流程

1. **检查状态** - 运行 `rtk git status` 查看变更文件
2. **查看差异** - 运行 `rtk git diff` 查看具体变更
3. **添加文件** - `rtk git add <files>`
4. **提交** - `rtk git commit -m "<message>"`
5. **推送** - 推送前确保 remote URL 包含 gh token

## 认证处理

如果 push 失败（No such device or address），执行：

```bash
# 获取 gh token
TOKEN=$(gh auth token)

# 更新 remote URL
rtk git remote set-url origin https://dantefung:${TOKEN}@github.com/dantefung/nova-vault-studio.git

# 再次推送
rtk git push
```

## 使用示例

用户说 "提交这次修改" 或 "push 代码" 时自动触发。