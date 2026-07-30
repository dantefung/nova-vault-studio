# 首行缩进

中文排版要求段落首行缩进两个字符：

```typst
#set par(first-line-indent: (amount: 2em, all: true))
```

⚠️ **必须加 `all: true`**：不加则标题后的第一段不缩进。默认行为是标题后首段不缩进（西文排版习惯），`all: true` 强制所有段落都缩进。

如果只想让标题后缩进（其他元素后不缩进），不要用 `all: true`，而是对特定元素单独处理。

## 块级元素后不缩进

行间公式后的文本会被错误缩进，因为公式被当作段间分隔。

### 方法 1：show rule 遍历抵消（实用）

在所有 show/set 规则之后添加：

```typst
#set par(first-line-indent: (all: true, amount: 2em))

// 以下规则必须放在最后
#show: rest => {
  let immediately-after = false

  for it in rest.children {
    if immediately-after and it.func() == text {
      context h(-par.first-line-indent.amount)
    }
    it

    if it != [ ] {
      immediately-after = false
    }

    if (
      (it.func() == math.equation and it.block)
        or it.func() == list.item
        or it.func() == enum.item
    ) {
      immediately-after = true
    }
  }
}
```

公式后不空行则不缩进，空行则另起一段并缩进。

⚠️ 局限性：
- 后文以 `*strong*`、`_emph_` 开头时失效，需手动 `#h(-2em)`
- 仅抵消缩进，未改变分段语义
- 公式上下仍是段间距（比行间距大）

### 方法 2：box 包裹（语义正确）

用 `#box()` 将行间公式包裹，且不能有空行：

```typst
#set par(first-line-indent: (amount: 2em, all: true))

正文内容，例如，
#box[$ integral x + y = z $]
紧接的文本不缩进。
```

⚠️ 若启用两端对齐，box 前需加 `\` 换行；若公式无编号，需加 `width: 100%`。

```typst
// 两端对齐时
#set par(justify: true, first-line-indent: (amount: 2em, all: true))
正文，例如，\
#box[$ integral x + y = z $]
紧接的文本不缩进。

// 无编号公式
#box(width: 100%)[$ integral x + y = z $]
```
