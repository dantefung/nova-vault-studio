# typst info — 调试信息

显示 Typst 版本、字体路径、包路径等调试信息。

```
typst info [OPTIONS]
```

## 选项

| 选项 | 说明 |
|------|------|
| `-f, --format <json\|yaml>` | 机器可读格式输出 |
| `--pretty` | 美化 JSON 输出 |

## 常用示例

```bash
# 人类可读格式
typst info

# JSON 格式（供脚本解析）
typst info --format json --pretty
```
