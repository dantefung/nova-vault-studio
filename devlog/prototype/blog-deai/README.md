# Blog 去AI味 · 视觉原型

> 去掉博客的模板化 AI 味，让博客看起来像出版物而不是模板。

**部署地址**: https://blog-deai.vercel.app

## 方案

| 方案 | 文件 | 核心理念 |
|------|------|---------|
| A 印刷编辑 | `approach-editorial.html` | 纯文字目录，无卡片无边框，标题是唯一主角 |
| B 杂志布局 | `approach-magazine.html` | 头条 + 侧栏 + 故事栏，编辑层级驱动 |
| C 极简档案 | `approach-archive.html` | 按年/月时间线索引，最安静、扫描最快 |
| D 组件级改造 | `approach-components.html` | Before/After 对比，渐进收敛 |

## 改造原则

1. 无伪封面 — 分类首字封面没有信息价值
2. 无圆角卡片 — 22px border-radius 是 SaaS 模板标志
3. 无悬浮阴影 — hover 上移 + 阴影是通用模板行为
4. 无标签胶囊 — 999px border-radius pill 是提示词工程痕迹
5. 无模板文案 — "所有文章的统一入口" 这类话没有信息量
6. 标题即入口 — 去掉装饰性元素，标题是唯一的信息锚点

## 部署

```bash
vercel --token $VERCEL_TOKEN --prod
```

## 相关文档

- [方案 PRD](../../prd/blog-deai-approaches-2026-08-06.md)
- [开发日志](../../logs/blog-deai-prototype-2026-08-06.md)