# 参考文献与引用

## 基本用法

```typst
引用文献 @key。

#bibliography("refs.bib")
```

`@key` 语法等价于 `#cite(<key>)`。

## 内联参考文献

用 `bytes()` 在 .typ 文件内嵌入文献，无需单独 .bib 文件：

````typst
引用文献 @key。

#let bib = ```bib
@misc{key,
  title = {Title},
  author = {Author},
  year = {2025},
}
```.text
#bibliography(bytes(bib), style: "gb-7714-2015-numeric")
````

## 引用样式

在 `#bibliography()` 中指定 CSL 样式：

```typst
// 国标数值引用
#bibliography("refs.bib", style: "gb-7714-2015-numeric")

// 国标作者-年份
#bibliography("refs.bib", style: "gb-7714-2015-author-date")

// IEEE
#bibliography("refs.bib", style: "ieee")
```

## 引用编号上标

引用编号飞出括号时，禁用排版上标：

```typst
#show cite: set super(typographic: false)
```

## "et al." / "等" 语言

使用中文 CSL 样式（如 `gb-7714-2015-numeric`）配合 `#set text(lang: "zh")` 通常会将 "et al." 显示为 "等"，具体行为取决于 CSL 样式。

## 缺失引用处理

多文件项目中，注释掉部分章节后引用可能失效。用 show rule 容错：

```typst
#show ref: it => {
  if query(it.target).len() == 0 {
    return text(fill: red, "<未找到引用 " + str(it.target.key) + ">")
  }
  it
}
```

## 常见编译错误

| 错误提示 | 原因 | 修复 |
|----------|------|------|
| missing group delimiter | .bib 中 `{}` 不配对 | 检查花括号嵌套 |
| missing page delimiter | 页码范围缺少 `--` | 用 `pages = {1--10}` |
| missing school | thesis 类型缺少学校字段 | 添加 `school = {...}` |
| duplicate key | 两个条目 key 相同 | 修改 key 使其唯一 |
