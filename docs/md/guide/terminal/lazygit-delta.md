# Lazygit 与 Delta 结合配置指南

通过将 `delta` 配置为 `lazygit` 的分页器，你可以在终端中获得语法高亮、行号并支持点击跳转的 Git diff 体验。

## 基础配置

编辑 `lazygit` 的配置文件：

- **Linux/macOS**：`~/.config/lazygit/config.yml`
- **Windows**：`%APPDATA%\lazygit\config.yml`

添加或修改以下内容：

```yaml
git:
  paging:
    colorArg: always
    pager: delta --dark --paging=never --line-numbers
```

> [!NOTE]
> `--paging=never` 告诉 delta 禁用内置分页，因为 lazygit 自身处理分页。
