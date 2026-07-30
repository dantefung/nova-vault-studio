# 标题与编号

Typst 内置 `numbering()` 支持多种计数符号：`1` `a` `A` `i` `I` `一` `壹` 等。

## 常用编号模式

```typst
// 阿拉伯数字多级
#set heading(numbering: "1.1")        // 1  / 1.1  / 1.1.1

// 中文数字 + 顿号
#set heading(numbering: "一、")        // 一、/ 二、/ 三、

// 罗马数字
#set heading(numbering: "I.")          // I. / II. / III.
```

## 混合编号：一级"第X章"、其余阿拉伯

用自定义函数按层级切换模式：

```typst
#set heading(numbering: (..nums) => {
  let ns = nums.pos()
  if ns.len() == 1 { numbering("第一章", ..ns) }
  else { numbering("1.1", ..ns) }
})
// 效果：第一章 / 1.1 / 1.1.1 / 第二章 / 2.1
```

## 编号模式语法

模式由 **前缀 + 计数符号 + 后缀** 组成。计数符号被实际数字替换，前缀后缀原样显示。多级时最后一个计数符号及其前缀自动重复。

```typst
#numbering("1.1)", 1, 2)    // 1.2)
#numbering("第一章", 3)       // 第三章
#numbering("I – 1", 12, 2)   // XII – 2
```

## 嵌套 emph/strong 样式

```typst
#show strong: it => {
  show emph: set text(green)
  it
}
#show emph: it => {
  show strong: set text(blue)
  it
}
```


## 编号后多余空格

Typst 内部对编号后的空格使用一个固定的可见高度（当前版本约 h(0.3em)，此为实现细节，可能随版本变化），这在中文排版中很容易产生视觉上的对齐问题。这里给出两种常用的对齐方式：

- 方法 1：通过反向偏移抵消空格
```typst
#set heading(numbering: it => {
  numbering("一、", it) + h(-0.3em)
})
= 标题
= 思考
```

- 方法 2：显示为 none 以隐藏空格的占位
```typst
#set heading(numbering: "一、")
#show heading: it => {
  show h.where(amount: 0.3em): none
  it
}
```

⚠️ 注意：两种方法在不同版本的 Typst 行为可能略有差异，实际场景请结合当前 Typst 版本进行测试。

## 多级不同编号格式

自定义编号函数按层级切换格式：

```typst
#set heading(numbering: (..nums) => {
  let ns = nums.pos()
  if ns.len() == 1 {
    numbering("第 1 章", ns.first())
  }
  else if ns.len() == 2 {
    numbering("1.1", ..ns)
  }
  else {
    // 三级：用字母编号
    let letter = numbering("a", ns.last())
    numbering("1.1", ..ns.slice(0, -1)) + "." + letter
  }
})
// 效果：第 1 章 / 1.1 / 1.1.a
```

## 取消编号

若你需要在特定标题上取消编号，可以直接使用 none 作为编号选项：
```typst
#set heading(numbering: "第1章")

== 参考文献段落
#heading(numbering: none)[参考文献]
```

⚠️ 取消编号只对该标题生效，后续标题仍会按全局编号规则进行编号。

## 编号加粗

若要让编号变为粗体，而不影响标题文本的字体重量，可以将编号包裹在 strong 中（或通过 show 规则单独设置样式）:
```typst
#set heading(numbering: n => strong(numbering("第 I 卷", n)))
#show heading: it => {
  // 保持标题文本为常规重量
  // 具体样式依赖项目现有样式体系
}
```
示例等效演示：
```typst
#set heading(numbering: n => strong(numbering("第 I 卷", n)))
#show heading: set text(weight: "regular")

#heading("你说得对")
#heading("但是原神")
```

⚠️ 该技巧仅影响编号部分的样式，避免影响标题文本主体的字体属性。

## 从零开始编号

有时需要在首章之前留出空页或小节，此时可以让编号从 0 开始呈现。常见做法有两种：

- 将第一层编号写成“第零章”，并手动抵减计数器
```typst
#set heading(numbering: (..) => "第零章")[此处]
#counter(heading).update((a, ..) => a - 1)
= 小节 1
```

- 直接在数字上偏移，例如 1 开始改为 0（注意版本兼容性）
```typst
#set heading(
  numbering: n => numbering("第一章", n - 1),
)
```


## 变体标题

为不同场景创建视觉上明显的标题变体，可结合 show 规则和自定义标题函数实现。示例：定义两个同级标题的不同变体，然后再按需要切换显示。
```typst
#let chapter(title) = {
  heading(
    level: 1,
    {
      counter("chapter").step()
      context counter("chapter").display("第一章")
      h(0.3em)
      title
    },
  )
}

#let subject(title) = {
  heading(
    level: 1,
    {
      counter("subject").step()
      context counter("subject").display("专题一")
      h(0.3em)
      title
    },
  )
}

#chapter("对")
#chapter("对")
#chapter("对")

#subject("好")

#chapter("对")
#chapter("对")

#subject("好")
```

通过 show/样式规则，可以对变体标题所使用的计数器、前缀、间距进行定制，从而实现视觉层面的区分。
