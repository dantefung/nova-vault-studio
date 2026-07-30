# typst fonts — 列出可用字体

列出系统路径和自定义路径中发现的所有字体。

```
typst fonts [OPTIONS]
```

## 选项

| 选项 | 说明 |
|------|------|
| `--font-path <DIR>` | 额外字体搜索目录 [env: TYPST_FONT_PATHS=] |
| `--ignore-system-fonts` | 不搜索系统字体 |
| `--ignore-embedded-fonts` | 不使用内嵌字体 |
| `--variants` | 同时列出每个字体的样式变体（粗体、斜体等） |

## 常用示例

```bash
# 列出所有字体
typst fonts

# 只看自定义路径中的字体
typst fonts --ignore-system-fonts --font-path ./fonts

# 查看字体变体（粗体、斜体等）
typst fonts --variants

# 检查特定字体是否存在（配合 grep）
typst fonts | grep "SimSun"
```
