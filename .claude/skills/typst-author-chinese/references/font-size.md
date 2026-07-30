# 字号规范

## 方式一：pointless-size 包（强烈推荐）

```typst
#import "@preview/pointless-size:0.1.2": zh, zihao
#set text(size: zh("小四"))  // 12pt
#show heading.where(level: 1): set text(size: zh("二号"))  // 22pt
#show: zihao(5)  // 全文五号
```

## 字号对照表

| 中文字号 | `zh()` 写法 | 磅值 | 典型用途 |
|----------|-------------|------|----------|
| 初号 | `zh(0)` | 42pt | 封面大标题 |
| 小初 | `zh("-0")` / `zh(0.5)` | 36pt | 封面标题 |
| 一号 | `zh(1)` | 26pt | 封面标题 |
| 小一 | `zh(-1)` / `zh(1.5)` | 24pt | 封面标题 |
| 二号 | `zh(2)` | 22pt | 一级标题 |
| 小二 | `zh(-2)` / `zh(2.5)` | 18pt | 一级标题 |
| 三号 | `zh(3)` | 16pt | 二级标题/公文正文 |
| 小三 | `zh(-3)` / `zh(3.5)` | 15pt | 二级标题 |
| 四号 | `zh(4)` | 14pt | 三级标题 |
| 小四 | `zh(-4)` / `zh(4.5)` | 12pt | 正文（通用） |
| 五号 | `zh(5)` | 10.5pt | 正文（论文/厚本） |
| 小五 | `zh(-5)` / `zh(5.5)` | 9pt | 注释/页眉/图表说明 |

## 方式二：手动磅值

| 层级 | 磅值 | Typst 设置 |
|------|------|------------|
| 封面主标题 | 36pt~26pt | `#text(size: 26pt)` |
| 一级标题 | 22pt/18pt | `#show heading.where(level: 1): set text(size: 22pt)` |
| 二级标题 | 16pt/15pt | `#show heading.where(level: 2): set text(size: 16pt)` |
| 三级标题 | 14pt | `#show heading.where(level: 3): set text(size: 14pt)` |
| 正文 | 12pt/10.5pt | `#set text(size: 12pt)` |
| 注释/页眉 | 9pt/7.5pt | `#text(size: 9pt)` |
