# 页面与文档
## 一般页码（推荐）

Typst 内置 `numbering()` 支持多种计数符号：`1` `a` `A` `i` `I` `一` `壹` 等。

```typst
#set page(numbering: "1")
```

## 自定义页码

自定义页脚显示"第 X 页"：

```typst
#set page(
  footer: context [
    #set align(center)
    第 #counter(page).display("1") 页
  ],
)
```

显示总页数（使用页面编号模式）：

```typst
#set page(numbering: "1 / 1")
```

或者手动在页脚中显示：

```typst
#set page(
  footer: context [
    第 #counter(page).display("1") 页 / 共 #counter(page).final().first() 页
  ],
)
```

手动重置页码：

```typst
#counter(page).update(1)
```

## 奇偶页不同页眉页脚

```typst
#set page(
  header: context {
    let num = counter(page).get().first()
    if calc.even(num) {
      align(right)[偶数页眉]
    } else {
      align(left)[奇数页眉]
    }
  },
)
```

## 多文件项目

长文档按章节拆分，主文件用 `#include` 引入：

```typst
// main.typ
#include "chapter1.typ"
#include "chapter2.typ"
```

注释掉未定稿章节时，引用可能失效。用 show rule 容错：

```typst
#show ref: it => {
  if query(it.target).len() == 0 {
    return text(fill: red, "<未找到引用 " + str(it.target.key) + ">")
  }
  it
}
```

## 目录问题

### 标题不进入目录

```typst
#heading(outlined: false)[前言]  // 不出现在目录中
```

### 目录自身不重复

多次使用 `#outline()` 时需注意不会互相包含。

## 脚注问题

### 标题中的脚注不进入目录

```typst
#let show-footnote = state("show-footnote", true)
#let footnote(..args) = context if show-footnote.get() { std.footnote(..args) }
#show outline: it => {
  show-footnote.update(false)
  it
  show-footnote.update(true)
}

#outline()
= 标题#footnote[脚注内容]
```

### 脚注在 block 内

脚注在某些 block 元素（figure、grid 等）内可能不显示。将脚注移到 block 外部，或使用 state 手动管理。

## above/below 间距

控制元素上方和下方的间距：

```typst
#show heading.where(level: 1): set block(above: 24pt, below: 18pt)
#show heading.where(level: 2): set block(above: 12pt, below: 6pt)
```

⚠️ 每次 `#set page` 都会产生一个新页。用 `#pagebreak()` 分页而不影响页面设置。
