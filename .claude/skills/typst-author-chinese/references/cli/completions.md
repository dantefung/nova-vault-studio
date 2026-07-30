# typst completions — Shell 补全

生成 shell 自动补全脚本。

```
typst completions <SHELL>
```

## 参数

| 参数 | 说明 |
|------|------|
| `<SHELL>` | 目标 shell，可选：`bash`、`elvish`、`fish`、`powershell`、`zsh` |

## 常用示例

```bash
# PowerShell
typst completions powershell | Out-File ~/.config/powershell/typst.ps1

# Bash
typst completions bash > /etc/bash_completion.d/typst

# Zsh
typst completions zsh > ~/.zfunc/_typst

# Fish
typst completions fish > ~/.config/fish/completions/typst.fish
```
