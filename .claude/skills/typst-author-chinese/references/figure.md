# 图与浮动体

## 基本图片插入

```typst
#figure(
  image("photo.jpg", width: 80%),
  caption: [图片说明],
)
```

`width` 和 `height` 可选，只设一个时按比例缩放。Typst 支持本地图片文件和 raw bytes，不支持 HTTP URL 直接引用。可用 `image.decode()` 从字符串解码图片。支持格式：png、jpg、gif、svg、pdf、webp。

## 子图

原生 grid 布局实现，手动编号：

```typst
#figure(
  grid(columns: 2, gutter: 1em,
    figure(rect(width: 100%, height: 3cm, fill: luma(230)), numbering: none, caption: [a) 实验 1]),
    figure(rect(width: 100%, height: 3cm, fill: luma(200)), numbering: none, caption: [b) 实验 2]),
  ),
  caption: [实验结果对比],
) <fig:test>

引用 @fig:test (a) 是实验 1。
```

## 双语 caption

用 `metadata` 存储双语标题，`show` 规则取出并分别显示：

```typst
#let bifig(body, capzh, capen) = figure(
  body,
  supplement: none,
  kind: "bifig",
  caption: metadata((capzh, capen)),
)
#show figure.where(kind: "bifig"): it => {
  let (capzh, capen) = it.caption.body.value
  let c = it.counter.display("1")
  it.body
  parbreak()
  [图 #c: #capzh]
  parbreak()
  [Figure #c: #capen]
}

#bifig(rect(), "启动流程", "Startup process")
```

## 插入 PDF 页面

Typst 可将 PDF 作为图片插入，通过 `page` 参数选择页码：

```typst
#image("document.pdf", page: 1, width: 100%)
```
