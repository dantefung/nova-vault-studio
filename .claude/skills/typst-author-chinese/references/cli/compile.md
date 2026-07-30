# typst compile — 编译文档

将 `.typ` 文件编译为 PDF、PNG、SVG 或 HTML。

```
typst compile [OPTIONS] <INPUT> [OUTPUT]
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
| `--pdf-standard <STANDARD>` | PDF 标准合规（见下方 PDF 标准表） |
| `--no-pdf-tags` | 禁用 PDF 标签（可减小文件体积） |
| `--ppi <PPI>` | PNG 导出的 PPI（默认 144） |
| `--deps <PATH>` | 输出依赖列表文件路径，`-` 输出到 stdout |
| `--deps-format <json\|zero\|make>` | 依赖列表格式（默认 json） |
| `-j, --jobs <N>` | 并行编译线程数，默认等于 CPU 核心数，`1` 禁用并行 |
| `--features <FEATURES>` | 启用实验性功能 [env: TYPST_FEATURES=]，可选：`html`, `a11y-extras` |
| `--diagnostic-format <human\|short>` | 诊断信息格式（默认 human） |
| `--open [<VIEWER>]` | 编译完成后用默认查看器或指定程序打开 |
| `--timings [<JSON>]` | 输出编译性能计时（实验性，可用 [perfetto](https://ui.perfetto.dev) 分析） |

## PDF 标准

`--pdf-standard` 支持的值（可逗号分隔多个）：

| 值 | 标准 |
|----|------|
| `1.4` / `1.5` / `1.6` / `1.7` / `2.0` | PDF 版本 |
| `a-1b` / `a-1a` | PDF/A-1 |
| `a-2b` / `a-2u` / `a-2a` | PDF/A-2 |
| `a-3b` / `a-3u` / `a-3a` | PDF/A-3 |
| `a-4` / `a-4f` / `a-4e` | PDF/A-4 |
| `ua-1` | PDF/UA-1（无障碍） |

## 常用示例

```bash
# 基本编译（输出同名 PDF）
typst compile doc.typ

# 指定输出路径
typst compile doc.typ output.pdf

# 输出 PNG（多页模板）
typst compile doc.typ page-{0p}-of-{t}.png

# 从 stdin 读取
echo '#text[Hello]' | typst compile - output.pdf

# 指定输出格式
typst compile -f svg doc.typ

# 编译后打开
typst compile doc.typ --open

# 使用自定义字体目录
typst compile --font-path ./fonts doc.typ

# 只导出第 2 页和第 5-8 页
typst compile --pages "2,5-8" doc.typ

# 传入变量
typst compile --input version=1.0 doc.typ

# 输出 PDF/A-2b 归档格式
typst compile --pdf-standard a-2b doc.typ
```
