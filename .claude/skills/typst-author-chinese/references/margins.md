# 边距与版心

A4：210mm × 297mm。最佳版心宽度 100–120mm，对应小四号（12pt）正文一行 28–35 汉字。

## 通用单面打印

```typst
#set page(paper: "a4", margin: (top: 25mm, bottom: 20mm, left: 25mm, right: 20mm))
```

天头大于地脚，符合视觉重心。

## 双面装订（毕业论文/成册）

```typst
#set page(paper: "a4", margin: (inside: 28mm, outside: 20mm, top: 25mm, bottom: 20mm))
```

`inside` 为装订侧。50 页以上可加到 30–35mm。

## 国标正式公文（GB/T 9704-2012）

```typst
#set page(paper: "a4", margin: (top: 37mm, bottom: 35mm, left: 28mm, right: 26mm))
```

强制国标，不可修改。

## 作品集/文艺画册

```typst
#set page(paper: "a4", margin: 30mm)
```

大留白，适合图文，不适用大段长文。
