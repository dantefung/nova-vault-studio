# Typst 官方文档索引

本文件是 `docs/` 目录的快速导航。references/ 下的文件是中文排版常见问题的精简参考；当 references 中找不到答案时，请查阅本索引对应的官方文档。

> 路径均相对于本项目根目录。例如 `docs/reference/model/title.md`。

## 入门

| 主题 | 路径 | 说明 |
|------|------|------|
| 总览 | `docs/index.md` | Typst 简介与文档结构 |
| 教程：写作 | `docs/tutorial/writing-in-typst.md` | 基本文本、图片、公式 |
| 教程：格式化 | `docs/tutorial/formatting.md` | 字号、标题样式、页面设置 |
| 教程：高级样式 | `docs/tutorial/advanced-styling.md` | 复杂页面布局（作者列表、行内标题等） |
| 教程：制作模板 | `docs/tutorial/making-a-template.md` | 从论文构建可复用模板 |
| LaTeX 用户指南 | `docs/guides/for-latex-users.md` | LaTeX → Typst 对照 |
| 页面设置指南 | `docs/guides/page-setup.md` | 纸张、边距、分栏、页眉页脚 |
| 表格指南 | `docs/guides/tables.md` | 表格布局详解 |
| 无障碍指南 | `docs/guides/accessibility.md` | PDF 无障碍与标签 |

## 语言基础

| 主题 | 路径 | 说明 |
|------|------|------|
| 语法 | `docs/reference/syntax.md` | 标记、代码、数学三种模式 |
| 样式 | `docs/reference/styling.md` | set/show 规则 |
| 脚本 | `docs/reference/scripting.md` | 变量、函数、流程控制、导入 |
| 上下文 | `docs/reference/context.md` | context 关键字与上下文敏感函数 |

## 文档结构（Model）

| 函数 | 路径 | 说明 |
|------|------|------|
| `document` | `docs/reference/model/document.md` | 文档元数据（标题、作者等） |
| `title` | `docs/reference/model/title.md` | 文档标题 |
| `heading` | `docs/reference/model/heading.md` | 章节标题 |
| `outline` | `docs/reference/model/outline.md` | 目录 |
| `figure` | `docs/reference/model/figure.md` | 图表（含 caption） |
| `bibliography` | `docs/reference/model/bibliography.md` | 参考文献 |
| `cite` | `docs/reference/model/cite.md` | 引用 |
| `ref` | `docs/reference/model/ref.md` | 交叉引用 |
| `footnote` | `docs/reference/model/footnote.md` | 脚注 |
| `enum` | `docs/reference/model/enum.md` | 有序列表 |
| `list` | `docs/reference/model/list.md` | 无序列表 |
| `terms` | `docs/reference/model/terms.md` | 术语/定义列表 |
| `table` | `docs/reference/model/table.md` | 表格 |
| `par` | `docs/reference/model/par.md` | 段落（缩进、对齐、行距） |
| `link` | `docs/reference/model/link.md` | 超链接 |
| `quote` | `docs/reference/model/quote.md` | 引用块 |
| `strong` / `emph` | `docs/reference/model/strong.md` / `emph.md` | 加粗 / 斜体 |
| `numbering` | `docs/reference/model/numbering.md` | 编号格式 |
| `parbreak` | `docs/reference/model/parbreak.md` | 段落分隔 |

## 文本（Text）

| 函数 | 路径 | 说明 |
|------|------|------|
| `text` | `docs/reference/text/text.md` | 字体、字号、颜色、语言、行高等 |
| `raw` | `docs/reference/text/raw.md` | 代码块、语法高亮 |
| `underline` | `docs/reference/text/underline.md` | 下划线 |
| `overline` | `docs/reference/text/overline.md` | 上划线 |
| `strike` | `docs/reference/text/strike.md` | 删除线 |
| `highlight` | `docs/reference/text/highlight.md` | 高亮/荧光笔 |
| `sub` / `super` | `docs/reference/text/sub.md` / `super.md` | 下标 / 上标 |
| `smallcaps` | `docs/reference/text/smallcaps.md` | 小型大写字母 |
| `smartquote` | `docs/reference/text/smartquote.md` | 智能引号 |
| `linebreak` | `docs/reference/text/linebreak.md` | 换行 |
| `lorem` | `docs/reference/text/lorem.md` | 占位文本 |
| `upper` / `lower` | `docs/reference/text/upper.md` / `lower.md` | 大小写转换 |

## 布局（Layout）

| 函数 | 路径 | 说明 |
|------|------|------|
| `page` | `docs/reference/layout/page.md` | 页面大小、边距、页眉页脚、编号 |
| `pagebreak` | `docs/reference/layout/pagebreak.md` | 分页 |
| `align` | `docs/reference/layout/align.md` | 对齐 |
| `block` | `docs/reference/layout/block.md` | 块级容器 |
| `box` | `docs/reference/layout/box.md` | 行内容器 |
| `grid` | `docs/reference/layout/grid.md` | 网格布局 |
| `columns` | `docs/reference/layout/columns.md` | 多栏布局 |
| `stack` | `docs/reference/layout/stack.md` | 堆叠布局 |
| `place` | `docs/reference/layout/place.md` | 浮动/绝对定位 |
| `pad` | `docs/reference/layout/pad.md` | 内边距 |
| `h` / `v` | `docs/reference/layout/h.md` / `v.md` | 水平 / 垂直间距 |
| `colbreak` | `docs/reference/layout/colbreak.md` | 分栏断点 |
| `rotate` / `scale` / `skew` | `docs/reference/layout/rotate.md` 等 | 变换 |
| `move` | `docs/reference/layout/move.md` | 偏移 |
| `hide` | `docs/reference/layout/hide.md` | 隐藏内容 |
| `repeat` | `docs/reference/layout/repeat.md` | 重复内容 |
| `layout` / `measure` | `docs/reference/layout/layout.md` / `measure.md` | 测量尺寸 |
| `length` / `ratio` / `relative` / `fraction` / `alignment` / `angle` / `direction` | 同目录 | 类型参考 |

## 数学（Math）

| 函数 | 路径 | 说明 |
|------|------|------|
| `equation` | `docs/reference/math/equation.md` | 公式（行内/行间、编号） |
| `mat` | `docs/reference/math/mat.md` | 矩阵 |
| `vec` | `docs/reference/math/vec.md` | 向量 |
| `cases` | `docs/reference/math/cases.md` | 分段函数 |
| `frac` | `docs/reference/math/frac.md` | 分数 |
| `lr` | `docs/reference/math/lr.md` | 左右分隔符 |
| `accent` | `docs/reference/math/accent.md` | 重音符号 |
| `attach` | `docs/reference/math/attach.md` | 上下标 |
| `op` | `docs/reference/math/op.md` | 算子 |
| `class` | `docs/reference/math/class.md` | 符号类别 |
| `binom` | `docs/reference/math/binom.md` | 二项式系数 |
| `cancel` | `docs/reference/math/cancel.md` | 取消线 |
| `roots` | `docs/reference/math/roots.md` | 根号 |
| `sizes` | `docs/reference/math/sizes.md` | 尺寸控制 |
| `styles` | `docs/reference/math/styles.md` | 字体样式 |
| `stretch` | `docs/reference/math/stretch.md` | 拉伸符号 |
| `underover` | `docs/reference/math/underover.md` | 上下括号 |
| `variants` | `docs/reference/math/variants.md` | 符号变体 |
| `primes` | `docs/reference/math/primes.md` | 撇号 |

## 绘图与可视化（Visualize）

| 函数 | 路径 | 说明 |
|------|------|------|
| `image` | `docs/reference/visualize/image.md` | 图片插入 |
| `color` | `docs/reference/visualize/color.md` | 颜色 |
| `gradient` | `docs/reference/visualize/gradient.md` | 渐变 |
| `stroke` | `docs/reference/visualize/stroke.md` | 描边 |
| `line` | `docs/reference/visualize/line.md` | 线条 |
| `rect` / `square` | `docs/reference/visualize/rect.md` / `square.md` | 矩形 / 正方形 |
| `circle` / `ellipse` | `docs/reference/visualize/circle.md` / `ellipse.md` | 圆 / 椭圆 |
| `polygon` | `docs/reference/visualize/polygon.md` | 多边形 |
| `path` / `curve` | `docs/reference/visualize/path.md` / `curve.md` | 路径 / 曲线 |
| `tiling` | `docs/reference/visualize/tiling.md` | 平铺图案 |

## 内省（Introspection）

| 函数 | 路径 | 说明 |
|------|------|------|
| `counter` | `docs/reference/introspection/counter.md` | 计数器（页码、图表编号等） |
| `query` | `docs/reference/introspection/query.md` | 查询文档中的元素 |
| `state` | `docs/reference/introspection/state.md` | 状态管理 |
| `metadata` | `docs/reference/introspection/metadata.md` | 元数据暴露给查询系统 |
| `here` | `docs/reference/introspection/here.md` | 当前位置 |
| `locate` | `docs/reference/introspection/locate.md` | 定位元素 |
| `location` | `docs/reference/introspection/location.md` | 元素位置标识 |

## 基础类型与函数（Foundations）

| 类型/函数 | 路径 | 说明 |
|-----------|------|------|
| `str` / `int` / `float` / `decimal` / `bool` / `bytes` | 同目录 | 基本类型 |
| `array` | `docs/reference/foundations/array.md` | 数组 |
| `dictionary` | `docs/reference/foundations/dictionary.md` | 字典 |
| `content` | `docs/reference/foundations/content.md` | 内容类型 |
| `function` | `docs/reference/foundations/function.md` | 函数类型 |
| `type` | `docs/reference/foundations/type.md` | 类型类型 |
| `auto` / `none` | `docs/reference/foundations/auto.md` / `none.md` | 特殊值 |
| `calc` | `docs/reference/foundations/calc.md` | 数学计算 |
| `datetime` / `duration` | `docs/reference/foundations/datetime.md` / `duration.md` | 日期时间 |
| `regex` | `docs/reference/foundations/regex.md` | 正则表达式 |
| `assert` | `docs/reference/foundations/assert.md` | 断言 |
| `eval` | `docs/reference/foundations/eval.md` | 动态求值 |
| `repr` | `docs/reference/foundations/repr.md` | 调试表示 |
| `sys` | `docs/reference/foundations/sys.md` | 系统信息 |
| `selector` | `docs/reference/foundations/selector.md` | 选择器 |
| `label` | `docs/reference/foundations/label.md` | 标签 |
| `arguments` | `docs/reference/foundations/arguments.md` | 函数参数 |
| `plugin` | `docs/reference/foundations/plugin.md` | 插件 |
| `panic` | `docs/reference/foundations/panic.md` | 抛出错误 |
| `std` | `docs/reference/foundations/std.md` | 标准库 |
| `symbol` | `docs/reference/foundations/symbol.md` | 符号类型 |
| `target` | `docs/reference/foundations/target.md` | 导出目标检测 |
| `version` | `docs/reference/foundations/version.md` | 版本号 |
| `module` | `docs/reference/foundations/module.md` | 模块 |

## 符号与表情

| 模块 | 路径 | 说明 |
|------|------|------|
| `sym` | `docs/reference/symbols/sym.md` | 数学/文字符号大全 |
| `emoji` | `docs/reference/symbols/emoji.md` | 表情符号 |

## 数据加载

| 函数 | 路径 | 说明 |
|------|------|------|
| `csv` | `docs/reference/data-loading/csv.md` | CSV |
| `json` | `docs/reference/data-loading/json.md` | JSON |
| `toml` | `docs/reference/data-loading/toml.md` | TOML |
| `xml` | `docs/reference/data-loading/xml.md` | XML |
| `yaml` | `docs/reference/data-loading/yaml.md` | YAML |
| `cbor` | `docs/reference/data-loading/cbor.md` | CBOR |
| `read` | `docs/reference/data-loading/read.md` | 读取文件 |

## 导出格式

| 主题 | 路径 | 说明 |
|------|------|------|
| PDF 导出 | `docs/reference/pdf/index.md` | PDF 标准、配置选项 |
| PNG 导出 | `docs/reference/png.md` | 图片导出 |
| SVG 导出 | `docs/reference/svg.md` | 矢量图导出 |
| HTML 导出 | `docs/reference/html/index.md` | HTML 导出（实验性） |

## 更新日志

| 版本 | 路径 |
|------|------|
| 0.14.x | `docs/changelog/0.14.0.md` ~ `0.14.2.md` |
| 0.13.x | `docs/changelog/0.13.0.md` ~ `0.13.1.md` |
| 0.12.0 | `docs/changelog/0.12.0.md` |
| 更早版本 | `docs/changelog/earlier.md` |
