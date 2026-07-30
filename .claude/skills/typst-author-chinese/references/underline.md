# 下划线

## 中英文下划线错位

中英文字体基线位置不同导致错位。修复：

```typst
#set underline(offset: .1em, stroke: .05em, evade: false)
#underline[1234 一二三四""]
```

## 下划线断断续续

默认在字母下伸部分（g、p、q）断开。关闭：

```typst
#underline(lorem(20), evade: false)
```

## 空白下划线

`#underline[     ]` 不产生下划线（空格被合并）。用 `box`：

```typst
// 空白下划线（无内容）
#let blank-uline(width) = box(width: width, stroke: (bottom: 0.5pt))
空空#blank-uline(2em)如也

// 带内容的下划线
#let uline(width, body) = box(width: width, stroke: (bottom: 0.5pt), align(center, body))
日期：#uline(3em)[2025]年#uline(1em)[6]月
```

## 波浪线下划线

```typst
#let pat = tiling(size: (4pt, 3pt), curve(
  stroke: blue + 0.5pt,
  curve.move((0%, 10%)),
  curve.cubic((20%, 0%), (30%, 30%), (50%, 30%), relative: true),
  curve.cubic(auto, (30%, -30%), (50%, -30%), relative: true),
))
#underline(stroke: (thickness: 3pt, paint: pat), evade: false, offset: 2pt)[波浪下划线]
```

不同 PDF 阅读器对 pattern/tiling 支持可能不同。
