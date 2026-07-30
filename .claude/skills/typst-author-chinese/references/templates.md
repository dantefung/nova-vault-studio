# 可直接套用的模板

每套提供 pointless-size（推荐）和手动磅值两个版本。使用前用 `typst fonts` 确认字体可用。

## 模板 1：毕业论文/学术论文

**pointless-size 版：**

```typst
#import "@preview/pointless-size:0.1.2": zh, zihao
#set document(title: "论文标题", author: "作者")
#set text(lang: "zh")

#set page(paper: "a4", margin: (top: 25mm, bottom: 20mm, inside: 28mm, outside: 20mm))
#set text(font: "Source Han Serif", size: zh("小四"))
#set par(first-line-indent: (amount: 2em, all: true), justify: true, leading: 0.67em, spacing: 0.75em)

#show heading: set text(font: "Source Han Sans")
#show heading.where(level: 1): set text(size: zh("二号"), weight: "bold")
#show heading.where(level: 1): set block(above: 24pt, below: 18pt)
#show heading.where(level: 2): set text(size: zh("小三"), weight: "bold")
#show heading.where(level: 2): set block(above: 12pt, below: 6pt)
#show heading.where(level: 3): set text(size: zh("四号"), weight: "bold")
#set heading(numbering: "1.1")
#set page(numbering: "1")
```

**手动磅值版：**

```typst
#set document(title: "论文标题", author: "作者")
#set text(lang: "zh")

#set page(paper: "a4", margin: (top: 25mm, bottom: 20mm, inside: 28mm, outside: 20mm))
#set text(font: "Source Han Serif", size: 12pt)
#set par(first-line-indent: (amount: 2em, all: true), justify: true, leading: 0.67em, spacing: 0.75em)

#show heading: set text(font: "Source Han Sans")
#show heading.where(level: 1): set text(size: 22pt, weight: "bold")
#show heading.where(level: 1): set block(above: 24pt, below: 18pt)
#show heading.where(level: 2): set text(size: 15pt, weight: "bold")
#show heading.where(level: 2): set block(above: 12pt, below: 6pt)
#show heading.where(level: 3): set text(size: 14pt, weight: "bold")
#set heading(numbering: "1.1")
#set page(numbering: "1")
```

## 模板 2：通用办公/商业方案

**pointless-size 版：**

```typst
#import "@preview/pointless-size:0.1.2": zh, zihao
#set document(title: "方案标题", author: "作者")
#set text(lang: "zh")

#set page(paper: "a4", margin: (top: 25mm, bottom: 20mm, left: 25mm, right: 20mm))
#set text(font: "Source Han Sans", size: zh("小四"))
#set par(first-line-indent: (amount: 2em, all: true), justify: true, leading: 0.67em, spacing: 0.75em)

#show heading.where(level: 1): set text(size: zh("小二"), weight: "bold")
#show heading.where(level: 1): set block(above: 20pt, below: 12pt)
#show heading.where(level: 2): set text(size: zh("小三"), weight: "bold")
#show heading.where(level: 2): set block(above: 12pt, below: 6pt)
#set heading(numbering: "一、")
#set page(numbering: "1")
```

**手动磅值版：**

```typst
#set document(title: "方案标题", author: "作者")
#set text(lang: "zh")

#set page(paper: "a4", margin: (top: 25mm, bottom: 20mm, left: 25mm, right: 20mm))
#set text(font: "Source Han Sans", size: 12pt)
#set par(first-line-indent: (amount: 2em, all: true), justify: true, leading: 0.67em, spacing: 0.75em)

#show heading.where(level: 1): set text(size: 18pt, weight: "bold")
#show heading.where(level: 1): set block(above: 20pt, below: 12pt)
#show heading.where(level: 2): set text(size: 15pt, weight: "bold")
#show heading.where(level: 2): set block(above: 12pt, below: 6pt)
#set heading(numbering: "一、")
#set page(numbering: "1")
```

## 模板 3：国标正式公文

**pointless-size 版：**

```typst
#import "@preview/pointless-size:0.1.2": zh, zihao
#set document(title: "公文标题")
#set text(lang: "zh")

#set page(paper: "a4", margin: (top: 37mm, bottom: 35mm, left: 28mm, right: 26mm))
#set text(font: "FangSong", size: zh("三号"))
#set par(first-line-indent: (amount: 2em, all: true), justify: true, leading: 1.75em)

#show heading: set text(font: "Source Han Sans")
#show heading.where(level: 1): set text(size: zh("二号"), weight: "bold")
#set page(numbering: "1")
```

**手动磅值版：**

```typst
#set document(title: "公文标题")
#set text(lang: "zh")

#set page(paper: "a4", margin: (top: 37mm, bottom: 35mm, left: 28mm, right: 26mm))
#set text(font: "FangSong", size: 16pt)
#set par(first-line-indent: (amount: 2em, all: true), justify: true, leading: 1.75em)

#show heading: set text(font: "Source Han Sans")
#show heading.where(level: 1): set text(size: 22pt, weight: "bold")
#set page(numbering: "1")
```

国标公文正文用三号仿宋，行高固定 28pt（`leading: 1.75em`，三号 = 16pt，16 × 1.75 ≈ 28pt）。
