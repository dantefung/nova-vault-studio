# 间距

## 行距

中文黄金行高为字号 1.5–1.75 倍。`1em` 等于当前字号，直接写倍数即可：

```typst
// 小四号（12pt）正文
#set text(size: 12pt)
#set par(leading: 1.5em)

// 五号（10.5pt）正文
#set text(size: 10.5pt)
#set par(leading: 1.5em)
```

设置 `top-edge` / `bottom-edge` 使文字外框更接近中文习惯：

```typst
#set text(top-edge: "ascender", bottom-edge: "descender")
```

## "行"的视觉定义

行的可见高度受 `text` 的 `top-edge` 和 `bottom-edge` 影响。西文默认用 `cap-height` / `baseline`，中文习惯用 `ascender` / `descender`：

```typst
// 西文习惯（默认）
#set text(top-edge: "cap-height", bottom-edge: "baseline")

// 中文习惯（推荐）
#set text(top-edge: "ascender", bottom-edge: "descender")
```

## 段距

段间距 > 行高，清晰区分段落。不要用空行控制段距。

```typst
#set par(spacing: 2em)  // 段距应明显大于行高（leading: 1.5em）
// 标题段前段后距
#show heading.where(level: 1): set block(above: 24pt, below: 18pt)
#show heading.where(level: 2): set block(above: 12pt, below: 6pt)
```


## 两端对齐

```typst
#set par(justify: true)
```

中文方块字必须两端对齐，右侧参差不齐破坏版面。

## 字距

正文用默认。短标题可加宽（≤3pt）：

```typst
#show heading.where(level: 1): set text(tracking: 1.5pt)
```

## 字距加宽

在字符间均匀插入空隙（`tracking`），适合短标题。注意：这不是真正的"分散对齐"（后者需根据行宽动态调整间距），而是固定宽度的字距加宽：

```typst
#set text(tracking: 2pt)
分散对齐效果
```

⚠️ 正文不建议使用，仅用于标题等短文本。

## 行内公式与中文间距

Typst 不自动在行内公式与中文间插入间距：

```typst
#show math.equation.where(block: false): it => {
  h(0.25em, weak: true) + it + h(0.25em, weak: true)
}
```

