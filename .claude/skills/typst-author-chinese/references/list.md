# 列表与文本样式

## 无序列表

`-` 开头，缩进表示层级：

```typst
- 一级项目
  - 二级项目
    - 三级项目
- 另一个项目

// 紧凑与展开之间插入空行
- 项目 A

- 项目 B
```

## 有序列表

`+` 自动编号，`1.` 指定起始编号：

```typst
+ 第一项
  - 嵌套无序
+ 第二项
+ 第三项

// 从指定编号开始
4. 第四项
+  第五项
```

## 编号宽度控制

从个位到十位时列表跳变，用 `box` 固定宽度：

```typst
#set enum(numbering: n => box(numbering("1.", n), width: 1.5em))

+ 一位数
+ 一位数
+ 一位数

8. 两位数
+  两位数
+  两位数
```

## 列表样式自定义

通过 show rule 修改标记符号、间距：

```typst
#show enum: set text(weight: "bold")
#show enum: set par(leading: 0.5em)
```

## 粗体与斜体嵌套

控制 `strong` 和 `emph` 嵌套时的样式：

```typst
// 粗体中的斜体设为绿色
#show strong: it => {
  show emph: set text(fill: green)
  it
}

// 斜体中的粗体设为蓝色
#show emph: it => {
  show strong: set text(fill: blue)
  it
}
```

语法对比：`*粗体*`（`#strong[]`）vs `_斜体_`（`#emph[]`）。Typst 用单星号，不是双星号。
