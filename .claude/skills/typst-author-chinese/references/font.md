# 字体配置

## 中英文分别使用不同字体

Typst 0.13+ 提供 `covers` 选项。设置 `covers: "latin-in-cjk"` 防止共用标点使用西文字体：

```typst
#set text(font: (
  (name: "Times New Roman", covers: "latin-in-cjk"),
  "SimSun"
))
```

## 中文没有加粗

SimSun、SimHei、KaiTi、FangSong 没有粗体字形。解决方案：

1. 使用多字重字体（Source Han Serif/Sans SC、Noto Serif/Sans SC）
2. 用 [`cuti`](https://typst.app/universe/package/cuti) 伪粗体：

```typst
#import "@preview/cuti:0.4.0": show-cn-fakebold
#show: show-cn-fakebold
#set text(font: ("Times New Roman", "SimSun"))
现在可以使用*伪粗体*了
```

## 中文没有斜体 → 用楷体代替

```typst
#show emph: text.with(font: ("KaiTi",))
这是_斜体（实际为楷体）_
```

## 代码块中文显示异常

```typst
#show raw: set text(font: (
  (name: "Consolas", covers: "latin-in-cjk"),
  "SimSun",
))
```

不要设置 `#show raw: set text(fallback: false)`。

## 公式中文字体

```typst
#show math.equation: set text(font: (
  "New Computer Modern Math",
  "Source Han Serif",
))
```

## 字体与标点挤压不匹配

字体来源地区须与 `lang`/`region` 设置匹配，否则标点挤压异常。

## 按文档类型的字体搭配

| 文档类型 | 正文 | 标题 | 限制 |
|----------|------|------|------|
| 公文/论文/正式报告 | FangSong、Source Han Serif | Source Han Sans | ≤3 种 |
| 商业方案/办公 | Source Han Serif、Microsoft YaHei | Source Han Sans | ≤2 种 |
| 作品集/文艺 | Source Han Serif | 匹配正文气质的设计字体 | ≤2 种 |

 > 大段长文优先宋体（衬线），黑体适合短句标题。

## 智能引号字体

中英文字体混用时，智能引号（`""` `''`）可能使用错误的字体。确保 `covers` 配置正确：

```typst
#set text(font: (
  (name: "Times New Roman", covers: "latin-in-cjk"),
  "SimSun"
))
```

## 字体回退异常

字体在不同位置"跳动"通常是因为 fallback 规则不明确。解决方法：

1. 始终用 `covers` 明确每个字体覆盖的字符范围
2. 中文字体的 `region` 须与 `lang` 匹配（Typst 中 Simplified Chinese 使用 `lang: "zh"`, `region: "CN"`）
3. 用 `typst fonts` 确认字体确实存在
