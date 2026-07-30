# typst watch — 监听编译

监听输入文件变化，自动重新编译。

```
typst watch [OPTIONS] <INPUT> [OUTPUT]
```

## 参数

| 参数 | 说明 |
|------|------|
| `<INPUT>` | 输入文件路径，`-` 表示从 stdin 读取 |
| `[OUTPUT]` | 输出文件路径（PDF/PNG/SVG/HTML），`-` 表示写入 stdout |

**多页输出**（PNG/SVG）：用 `{p}` 表示页码、`{0p}` 补零页码、`{t}` 总页数。

## 选项

| 选项 | 说明 |
|------|------|
| `-f, --format <pdf\|png\|svg\|html>` | 输出格式，默认从扩展名推断 |
| `--root <DIR>` | 项目根目录（用于绝对路径解析）[env: TYPST_ROOT=] |
| `--input <key=value>` | 传入键值对，代码中通过 `sys.inputs` 访问 |
| `--font-path <DIR>` | 额外字体搜索目录（Windows 用 `;` 分隔，Unix 用 `:`）[env: TYPST_FONT_PATHS=] |
| `--ignore-system-fonts` | 不搜索系统字体 [env: TYPST_IGNORE_SYSTEM_FONTS=] |
| `--ignore-embedded-fonts` | 不使用 Typst 内嵌字体 [env: TYPST_IGNORE_EMBEDDED_FONTS=] |
| `--package-path <DIR>` | 本地包路径 [env: TYPST_PACKAGE_PATH=] |
| `--package-cache-path <DIR>` | 包缓存路径 [env: TYPST_PACKAGE_CACHE_PATH=] |
| `--creation-timestamp <UNIX>` | 文档创建时间戳 [env: SOURCE_DATE_EPOCH=] |
| `--pages <PAGES>` | 导出指定页，如 `2,3-6,8-`（页码从 1 开始，物理页码） |
| `--pdf-standard <STANDARD>` | PDF 标准合规（见 [compile.md](compile.md) 的 PDF 标准表） |
| `--no-pdf-tags` | 禁用 PDF 标签（可减小文件体积） |
| `--ppi <PPI>` | PNG 导出的 PPI（默认 144） |
| `--deps <PATH>` | 输出依赖列表文件路径，`-` 输出到 stdout |
| `--deps-format <json\|zero\|make>` | 依赖列表格式（默认 json） |
| `-j, --jobs <N>` | 并行编译线程数，默认等于 CPU 核心数，`1` 禁用并行 |
| `--features <FEATURES>` | 启用实验性功能 [env: TYPST_FEATURES=]，可选：`html`, `a11y-extras` |
| `--diagnostic-format <human\|short>` | 诊断信息格式（默认 human） |
| `--open [<VIEWER>]` | 编译完成后用默认查看器或指定程序打开 |
| `--timings [<JSON>]` | 输出编译性能计时（实验性，可用 [perfetto](https://ui.perfetto.dev) 分析） |
| `--no-serve` | 禁用 HTML 导出的内置 HTTP 服务器 |
| `--no-reload` | 禁用 HTML 导出的自动刷新脚本注入 |
| `--port <PORT>` | HTML 服务端口（默认 3000–3005 中首个空闲端口） |

## 常用示例

```bash
# 监听并自动编译为 PDF
typst watch doc.typ

# 监听 HTML 输出，浏览器自动刷新
typst watch doc.typ output.html --open

# 指定端口
typst watch doc.typ output.html --port 8080

# 使用自定义字体目录监听
typst watch --font-path ./fonts doc.typ
```
