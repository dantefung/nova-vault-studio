# 数学公式

## 行内与行间

行内公式 `$...$`，行间公式在 `$` 内侧留空格：

```typst
行内：$(a+b)^2 = a^2 + 2 a b + b^2$

行间：
$ (a+b)^2 = a^2 + 2 a b + b^2 $
```

强制行内公式使用显示样式：

```typst
#show math.equation.where(block: false): math.display

已知 $f(x)=1/2 x^2$
```

## 公式编号

### 仅对带标签的公式编号

```typst
#set math.equation(numbering: "(1)")
#show math.equation.where(block: true): it => {
  if not it.has("label") {
    let fields = it.fields()
    let _ = fields.remove("body")
    fields.numbering = none
    [#counter(math.equation).update(v => v - 1)#math.equation(..fields, it.body)]
  } else {
    it
  }
}

$ x + y $ <eq1>   // 编号为 (1)

$ x + y + z $     // 无编号

$ x + y $ <eq2>   // 编号为 (2)

引用 @eq1
```

### 手动指定编号

类似 LaTeX 的 `\tag{}`：

```typst
#set math.equation(numbering: "(1)")
$ f(x) $
#math.equation($g(x)$, block: true, numbering: n => "(foo)")
$ h(x) $
```

## 中文字体

公式中中文的显示取决于系统可用字体和 math font 的 fallback 规则。Typst 0.13+ 可通过 `covers` 精确控制：
```typst
#show math.equation: set text(font: (
  (name: "New Computer Modern Math", covers: "latin-in-cjk"),
  "Source Han Serif",
))
```

⚠️ 中文字体排在数学字体之前时，必须设置 `covers`，否则中文字体会被误作数学基准字体，导致间距异常。

## 分隔符大小

`lr()` 自动调整分隔符高度：

```typst
$ lr( \(sum_(i=0)^n i^2 , a+b) ) $
```

向量/矩阵的方括号：

```typst
#set math.mat(delim: "[")
#set math.vec(delim: "[")
$ mat(1, 2; 3, 4) $
$ vec(a, b, c) $
```

## cases 环境

```typst
$ f = cases(
  1 & "if" x > 0,
  0 & "otherwise",
) $
```

cases 默认左对齐。若需右对齐某列，用 `lr` + `&` 交替：

```typst
#let lrcases(it) = math.lr($\{$ + block(it))

$ f = #lrcases($
  & 137 & "if" (n+1) in NN \
  & 0   &      "otherwise"
$) $
```

## 自定义矩阵

默认矩阵方括号距数字较近，可加间距：

```typst
#let mat(..args) = $lr([med #math.mat(..args, delim: none) med])$
$ mat(2, 3, 4; 5, 6, 7; 8, 9, 9) $
```

## 自定义算子

修改符号类型以控制间距：

```typst
$ *x $                    // 默认：星号后有间距

$ y + class("unary", *) x $  // 改为单目前缀，无间距
```

## 化学式

直接用上下标排版：

```typst
$ H_2 O $
$ Ca(OH)_2 $
$ Fe_2 O_3 $
```

## 常见符号

| 需求 | Typst 写法 | 备注 |
|------|-----------|------|
| 空集 | `$emptyset$` | 默认是 0 加斜线 |
| 胖空集（∅） | `#show math.equation: set text(features: ("cv01",))` | OpenType 特性变体 |
| 花体 A | `$cal(A)$` | mathcal |
| 手写体 B | `$scr(B)$` | mathscr，需字体支持 |

## 加粗直立

LaTeX 的 `\mathbf` 和 `\mathrm`：

```typst
#let mathrm(x) = math.upright(x)
#let mathbf(x) = math.bold(math.upright(x))

$ y = 3 + 4 mathrm(i) $         // 虚数单位正体
$ nabla times mathbf(H) $        // 向量加粗直立
```
