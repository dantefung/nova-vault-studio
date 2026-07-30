# typst query — 提取元数据

从编译后的文档中提取指定元素。

```
typst query [OPTIONS] <INPUT> <SELECTOR>
```

## 参数

| 参数 | 说明 |
|------|------|
| `<INPUT>` | 输入文件路径，`-` 表示从 stdin 读取 |
| `<SELECTOR>` | CSS 选择器语法，选取要提取的元素 |

## 选项

| 选项 | 说明 |
|------|------|
| `--field <FIELD>` | 仅提取指定字段 |
| `--one` | 期望恰好匹配一个元素 |
| `--format <json\|yaml>` | 输出格式（默认 json） |
| `--pretty` | 美化输出（仅 JSON） |
| `--target <paged\|html>` | 编译目标（默认 paged） |
| `--root <DIR>` | 项目根目录（用于绝对路径解析）[env: TYPST_ROOT=] |
| `--input <key=value>` | 传入键值对，代码中通过 `sys.inputs` 访问 |
| `--font-path <DIR>` | 额外字体搜索目录（Windows 用 `;` 分隔，Unix 用 `:`）[env: TYPST_FONT_PATHS=] |
| `--ignore-system-fonts` | 不搜索系统字体 [env: TYPST_IGNORE_SYSTEM_FONTS=] |
| `--ignore-embedded-fonts` | 不使用 Typst 内嵌字体 [env: TYPST_IGNORE_EMBEDDED_FONTS=] |
| `--package-path <DIR>` | 本地包路径 [env: TYPST_PACKAGE_PATH=] |
| `--package-cache-path <DIR>` | 包缓存路径 [env: TYPST_PACKAGE_CACHE_PATH=] |
| `--creation-timestamp <UNIX>` | 文档创建时间戳 [env: SOURCE_DATE_EPOCH=] |
| `-j, --jobs <N>` | 并行编译线程数，默认等于 CPU 核心数，`1` 禁用并行 |
| `--features <FEATURES>` | 启用实验性功能 [env: TYPST_FEATURES=]，可选：`html`, `a11y-extras` |
| `--diagnostic-format <human\|short>` | 诊断信息格式（默认 human） |

## 常用示例

```bash
# 提取所有标题
typst query doc.typ "<heading>"

# 提取 metadata 元素的 value 字段（stdin 探测）
echo '#metadata(1 + 2) <probe>' | typst query - "<probe>" --field value --one

# 查询指定标签的元素
typst query doc.typ "<my-label>"

# YAML 格式输出
typst query doc.typ "<heading>" --format yaml --pretty

# 提取 figure 的 caption
typst query doc.typ "<figure>" --field caption --one
```
