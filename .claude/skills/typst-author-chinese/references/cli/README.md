# Typst CLI 参考

基于 Typst 0.14.x（以实际安装版本为准）。所有命令均可通过 `typst help <command>` 查看最新帮助。

## 用法

```
typst [OPTIONS] <COMMAND>
```

### 全局选项

| 选项 | 说明 |
|------|------|
| `--color <auto\|always\|never>` | 彩色输出（默认 auto） |
| `--cert <CERT>` | 自定义 CA 证书路径 [env: TYPST_CERT=] |
| `-h, --help` | 显示帮助 |
| `-V, --version` | 显示版本 |

## 命令一览

Typst 提供以下 8 个子命令，每个命令的详细用法（参数、选项、示例）在对应的单独文件中：

| 命令 | 别名 | 说明 | 详细文档 |
|------|------|------|----------|
| `compile` | `c` | 编译为 PDF/PNG/SVG/HTML | [compile.md](compile.md) |
| `watch` | `w` | 监听文件变化并自动重编译 | [watch.md](watch.md) |
| `init` | | 从模板创建新项目 | [init.md](init.md) |
| `query` | | 提取文档元数据 | [query.md](query.md) |
| `fonts` | | 列出所有可用字体 | [fonts.md](fonts.md) |
| `update` | | 自更新 CLI | [update.md](update.md) |
| `completions` | | 生成 shell 补全脚本 | [completions.md](completions.md) |
| `info` | | 显示调试信息 | [info.md](info.md) |


