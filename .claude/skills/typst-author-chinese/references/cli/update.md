# typst update — 自更新

```
typst update [OPTIONS] [VERSION]
```

## 参数

| 参数 | 说明 |
|------|------|
| `[VERSION]` | 目标版本，不指定则更新到最新版 |

## 选项

| 选项 | 说明 |
|------|------|
| `--force` | 允许降级到旧版本 |
| `--revert` | 回退到上次更新前的版本 |
| `--backup-path <FILE>` | 自定义备份路径 [env: TYPST_UPDATE_BACKUP_PATH=] |

## 常用示例

```bash
# 更新到最新版
typst update

# 安装指定版本
typst update 0.12.0

# 降级（需要 --force）
typst update 0.11.0 --force

# 回退到更新前的版本
typst update --revert
```
