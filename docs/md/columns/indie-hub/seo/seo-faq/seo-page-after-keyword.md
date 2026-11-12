---
title: "我找到关键词后，如何精细的做出一个符合SEO的页面"
date: "2026-08-09"
source: "哥飞社群"
url: ""
---

# 我找到关键词后，如何精细的做出一个符合SEO的页面

## 一、选词确认：先判断这个关键词值不值得做

在动手写页面之前，先确认目标关键词的竞争格局。哥飞在社群中反复强调一个原则：**搜索结果首页出现了内页（而非首页/频道页）的，说明竞争弱，可以做；首页全是顶级域名的，慎重。**

### 竞争强度判断矩阵

| 信号 | 竞争弱（可做） | 竞争强（慎重） |
|------|---------------|---------------|
| 搜索结果类型 | 内页/子目录占多数 | 首页/品牌站占多数 |
| 域名权重 | 小域名、新站 | 大站、权威站 |
| 内容质量 | 单页、简单页面 | 深度长文、多图 |
| 外链数量 | 少/无外链 | 大量外链 |
| 搜索结果页广告 | 广告少 | 多广告位（说明商业价值高） |

### 确认搜索意图

同一个关键词在不同搜索意图下，页面的写法完全不同：

| 搜索意图 | 页面类型 | 举例 |
|---------|---------|------|
| 信息型 | 文章/指南 | "how to fix..." |
| 导航型 | 工具/产品页 | "online png compressor" |
| 交易型 | 产品页/购买页 | "buy..." |
| 本地型 | 本地服务页 | "SEO agency in..." |

哥飞强调：**不要只看搜索量，要看搜索意图。** 如果用户搜的是"best X"，但你的页面是"X 是什么"，用户进来会直接跳出，行为数据差，排名反而会掉。

---

## 二、页面结构：从 Title 到 H1 到正文的完整链路

### Title 标签

Title 是 Google 搜索结果中最重要的显示元素，直接决定 CTR。哥飞在社群中给出的 Title 写法建议：

```html
<title>主关键词 + 修饰词 | 品牌名（可选）</title>
```

**核心原则：**
- 主关键词尽量靠前
- 长度控制在 50-60 字符（中文 20-30 字）
- 每个页面 Title 唯一，不要重复
- 避免关键词堆砌

### Meta Description

Meta Description 不直接影响排名，但影响 CTR。

```html
<meta name="description" content="包含主关键词和次关键词，写清楚用户能获得什么价值，60-160字符">
```

### H1 标签

H1 是页面最重要的标题标签，**每页只有一个 H1**。H1 应该包含主关键词，但不要直接复制 Title。

| 错误做法 | 正确做法 |
|---------|---------|
| H1 和 Title 一模一样 | H1 是 Title 的扩展或改写 |
| 没有 H1 | 始终有且只有一个 H1 |
| H1 里放品牌名 | H1 放关键词，品牌名放 Title 后半段 |

### 正文结构

页面内容不是越长越好，而是**匹配搜索意图的前提下，覆盖足够的信息量**。

哥飞在 2026 年 8 月 6 日的小课堂里强调：**Google 不会因为同样的布局惩罚你，只会因为内容质量差——内容太少、没新意、没信息增量、跟别人重复——而惩罚你。**

#### 正文结构的黄金框架

```
H1: 主关键词
├── 引言（简要概括，100-200字）
├── H2: 细分主题 1
│   ├── 正文段落
│   └── 图片/表格/列表
├── H2: 细分主题 2
│   ├── ...
├── H2: 细分主题 3
│   ├── ...
├── H2: FAQ（常见问题，用 Schema 标记）
└── 结尾（总结 + 行动号召/CTA）
```

---

## 三、页面类型模板：针对不同关键词类型套用

### 工具站模板

```
H1: 在线 [关键词] 工具
├── H2: [工具] 是什么？
├── H2: 如何使用 [工具]（步骤）
├── H2: [工具] 的常见用途
├── H2: 常见问题 FAQ
├── H2: 相关工具推荐
└── Call to Action
```

哥飞在 2025 年 9 月的文章中强调：**工具站的关键是"让用户快速拿到结果"。** 工具本身的交互体验比页面文案更重要。页面文案是辅助工具被搜到的，不是让用户读的。

### 内容站/攻略站模板

```
H1: [关键词] 完整指南/攻略
├── H2: 什么是 [关键词]？
├── H2: 为什么 [关键词] 重要？
├── H2: 如何做 [关键词]（分步骤）
├── H2: 常见误区
├── H2: 进阶技巧
├── H2: 常见问题 FAQ
└── 结语
```

### 游戏站模板

```
H1: [游戏名] 完整攻略/玩法指南
├── H2: [游戏名] 是什么？
├── H2: 如何开始玩 [游戏名]
├── H2: [游戏名] 核心玩法
├── H2: [游戏名] 技巧与策略
├── H2: [游戏名] 常见问题 FAQ
└── 相关游戏推荐
```

---

## 四、SEO 精细化：技术细节不能漏

### URL 结构

- 使用短链接，包含关键词
- 用连字符 `-` 分隔单词
- 保持层级不超过 3 层
- 不要包含日期（除非是新闻页）

**好例子：** `example.com/online-png-compressor`
**坏例子：** `example.com/2026/08/09/page123?pid=abc`

### 图片优化

图片在搜索结果中占的流量越来越大，但很多新手忽略了：

| 要素 | 要求 |
|------|------|
| 文件名 | 关键词相关，用连字符分隔，如 `online-png-compressor.png` |
| Alt 文本 | 描述图片内容，自然包含关键词，不要堆砌 |
| 尺寸 | 压缩到合理大小，用 WebP 格式 |
| 懒加载 | 使用 `loading="lazy"` 属性 |
| 响应式 | 用 `srcset` 提供多尺寸版本 |

### 内链策略

哥飞在社群中强调：**内链是传递页面权重的核心手段。**

- 每个页面至少链接到 3-5 个相关页面
- 用关键词作为锚文本，不要用"点击这里"
- 新页面链接到老页面（传递权重给新页面）
- 相关度高的页面之间互相链接

### 外部链接

- 引用权威来源（.gov、.edu、知名媒体）
- 用 `rel="noopener noreferrer"` 打开外部链接
- 设置 `target="_blank"` 让用户留在你的站

### Schema 结构化数据

Schema 标记可以帮助 Google 更好地理解页面内容，并可能获得富媒体摘要（Rich Snippet）。

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "页面标题",
  "description": "页面描述",
  "author": {
    "@type": "Person",
    "name": "作者名"
  },
  "datePublished": "2026-08-09"
}
</script>
```

**不同类型的页面使用不同的 Schema 类型：**
- 文章页 → Article / BlogPosting
- 工具页 → WebApplication / SoftwareApplication
- 产品页 → Product
- 游戏页 → VideoGame / Game
- FAQ 页 → FAQPage（可以获取搜索结果中的 FAQ 富摘要）

---

## 五、内容质量：Google 算法两大假设的实操落地

哥飞在 2026 年 8 月 6 日的小课堂里提出了两个核心假设，直接指导页面内容的质量标准：

### 假设一：优质用户行为数据

你的页面要在某个关键词下拿到排名，需要积累足够多的**优质用户行为数据**——用户进来后不跳出、停留时间长、有互动。

**实操落地：**
- 页面内容要真正解决用户问题（匹配搜索意图）
- 用表格、图片、列表等增加可读性
- 适当使用视频、交互式元素增加停留时间
- 避免弹出层干扰用户体验

### 假设二：100 亿优质网页池子

Google 取全球前 10% 的网页（约 100 亿）放进"标准网页池"，你的网站能进这个池子的页面比例越高，整体权重越高。

**实操落地：**
- 不要批量生产低质量页面
- 每个页面都要有信息增量——哥飞原话：**"追求网页数量，不如追求网页质量"**
- 宁缺毋滥：一天只上线 5 个高质量页面，比一天上线 50 个垃圾页面好得多

---

## 六、发布前的检查清单

### 页面技术检查

| 项目 | 检查标准 |
|------|---------|
| Title | 唯一、包含关键词、50-60 字符 |
| Meta Description | 唯一、包含关键词、60-160 字符 |
| H1 | 有且只有一个，包含关键词 |
| URL | 短、包含关键词、无乱码 |
| 图片 Alt | 所有图片都有 Alt 文本 |
| 图片尺寸 | 已压缩，使用 WebP |
| 内链 | 至少 3-5 个相关页面链接 |
| 外链 | 引用权威来源（如有） |
| Schema | 匹配页面类型的结构化数据 |
| 加载速度 | Lighthouse 移动端 > 70 分 |
| 移动端适配 | 响应式设计，内容完整显示 |
| Canonical | 设置正确的 canonical URL |
| 404/500 错误 | 页面正常返回 200 |

### 内容质量检查

| 项目 | 检查标准 |
|------|---------|
| 搜索意图匹配 | 页面类型匹配用户搜索目的 |
| 信息增量 | 提供了竞品页面没有的内容 |
| 原创性 | 不是 AI 批量生成/拼凑 |
| 可读性 | 段落分明、标题清晰、列表简化 |
| 错别字 | 全文检查无错别字 |
| 数据准确性 | 所有数字、日期、引用正确 |

---

## 七、上线后的跟进

### 提交 GSC

页面上线后，立即在 Google Search Console 中提交 URL 请求索引。

### 观察数据

| 指标 | 正常范围 | 需要优化 |
|------|---------|---------|
| 收录时间 | 24 小时内 | 超过 1 周未收录 → 检查索引问题 |
| 展示次数 | 持续增长 | 0 展示 → 关键词竞争太大或页面质量不够 |
| 点击率 | 2-5% | < 1% → 优化 Title 和 Meta Description |
| 平均排名 | 前 30 以内 | 30 名以外 → 需要更多外链/内链 |
| 跳出率 | 40-60% | > 80% → 内容不匹配搜索意图 |
| 停留时间 | 2-3 分钟 | < 30 秒 → 内容需要优化 |

### 迭代优化

**哥飞的核心建议：循序渐进。**

> "你先上几个页面，看看数据表现，回来调整你的内容生成策略……等这样来了几个轮回后，你大概率已经知道怎么做出一个质量不错的页面了，这时候才可以考虑多上几个页面。"

如果页面排名不理想，优先检查：
1. 搜索意图是否匹配
2. 内容质量是否足够
3. 内链是否充足
4. 外链是否太少
5. 技术 SEO 是否完整

---

## 八、常见误区

### 误区一：关键词密度

不要刻意追求关键词密度。Google 使用语义理解，一个关键词在正文中出现 1-2 次就足够了。**过度堆砌关键词会被判定为 Keyword Stuffing 而受到惩罚。**

### 误区二：字数越多越好

哥飞在社群中强调：**内容的长度要匹配搜索意图。** 用户搜"how to compress PNG"只需要 3 步操作指南，不需要 5000 字的论文。多余的内容反而会稀释页面质量。

### 误区三：复制竞品结构

哥飞在 2026 年 8 月 6 日明确说：**Google 不会因为同样的布局惩罚你，但内容雷同会。** 你可以参考竞品的页面结构，但内容必须有自己的信息增量。

### 误区四：一次性上太多页面

哥飞警告：**不要一次上太多页面。** 每天 5 个页面，一个月就有 150 个页面。循序渐进，根据数据反馈调整策略。

---

## 九、总结：从关键词到页面的完整流程

```
1. 找词 → 2. 确认搜索意图 → 3. 判断竞争强度 → 4. 设计页面结构 →
5. 撰写内容（信息增量） → 6. 图片优化 → 7. 技术 SEO 配置 →
8. 检查清单 → 9. 上线 → 10. GSC 提交 → 11. 观察数据 → 12. 迭代优化
```

每一步都在哥飞社群中反复被验证过。**核心只有一句话：内容质量 > 页面数量，匹配意图 > 堆砌关键词，循序渐进 > 一次铺满。**

---

# 补充：程序化 SEO 页面（以 wickeduncle.com 为例）

## 核心思路：翻译意图 + 模板思维

找到关键词之后，精细做出一个符合 SEO 的页面，本质上要做两件事：**把搜索意图翻译成页面结构**，然后**用模板思维批量覆盖同类词**。

哥飞在拆解 wickeduncle.com 这个玩具礼物网站时把这条路讲得很透[1](https://new.web.cafe/tutorial/detail/2pobte3keb)。这个站的核心页面都是玩具列表页，但每一页都精准覆盖了一个用户真的会在谷歌搜的关键词组合，比如 "gifts for 8 year old boys"、"gifts for 5 year old girls"。所有页面的 UI 布局完全一样，不同的是关键词组合——这就是程序化 SEO。

## 第一步：从关键词里拆变量

拿到一批关键词后，先别急着写页面，而是做一道"反向工程"——把这些词的主干和变量分离出来。以 wickeduncle 为例，关键词长这样[1](https://new.web.cafe/tutorial/detail/2pobte3keb)：

- gifts for 8 year old boys
- gifts for 9 year old girls
- gift ideas for 10 year old boy
- best gifts for 10 year old boy

一眼就能看出，变量只有两个：**性别**（boys / girls）和**年龄**（1、2、3……8、9、10）。有些玩具男女都能玩、跨多个年龄段也能玩，那性别属性的枚举值就要设成 boys / girls / all 三个；年龄则更适合记录"最小年龄"和"最大年龄"两个值，而不是硬枚举[1](https://new.web.cafe/tutorial/detail/2pobte3keb)。

除了这两个核心维度，还可以加一层**分类标签**（categories），一个产品可以归属到多个分类下。这样，URL 的拼法就变成了：

- `/gifts/boys/age-1`
- `/gifts/girls/age-1`
- `/gifts/all/age-2`

然后看 Title 的写法，万变不离其宗，都是把变量填进模板里：

> Best Toys for 1 Year Old Boys | Gifts & Presents from Wicked Uncle USA
> Best Gifts for 1 Year Old Girls | Toys & Presents from Wicked Uncle USA
> Toys for 2 Year Old Boys | Gifts from Wicked Uncle USA

不管哪个标题，格式差不多，却能同时覆盖 "Best Toys""Gifts""Presents""xx Year Old Boys/Girls/Kids" 等多组关键词[1](https://new.web.cafe/tutorial/detail/2pobte3keb)。

## 第二步：数据库怎么设计

确定了变量，数据库结构就自然出来了[1](https://new.web.cafe/tutorial/detail/2pobte3keb)：

- **产品表**：记录每个玩具的详细信息，这是网站的最小单元，每个产品对应一个详情页（也是下单入口）。
- **属性字段**：在产品表上加性别（boys / girls / all）、最小年龄、最大年龄，以及分类/标签。
- **列表页查询逻辑**：前端选好性别和年龄后，后端按条件筛产品，渲染到同一个列表模板里，URL 和 Title 动态拼接。

这样，一个页面模板就能生成成百上千个独立 URL，每个 URL 对谷歌来说都是一个专门优化的页面。

## 第三步：页面上具体要优化什么

根据社区教程里的 SEO 优化六步框架[2](https://new.web.cafe/tutorial/detail/if8ls06pcd)，"页面内容优化"是排在关键词研究之后的独立一步；页面 SEO 的核心又落在单页面优化、元素优化和内容优化三个维度上[3](https://new.web.cafe/tutorial/detail/m8mfyxjzlk)。具体到操作层面，至少要把这几个坑填实：

- **Title 标签**：必须包含目标关键词，且每个页面 Title 不重复。像 wickeduncle 那样，用变量拼出独一无二的 Title。
- **H1 标题**：和 Title 呼应，但要写成用户读得舒服的自然语句，不要把关键词硬塞。
- **URL 结构**：短、可读、带上核心关键词路径（如 `/gifts/boys/age-5`），不要用参数和无意义的 ID。
- **页面内关键词分布**：在 H1、开头段落、产品卡片标题里自然地出现目标词和相关变体，不堆砌。
- **内容质量**：光有列表不够——列表页如果有引导性的介绍文字，或者每个产品有丰富的描述和结构化数据（评分、价格、适用年龄），搜索排名和点击率都会更好。

## 目前已覆盖

我读完了**哥飞对 wickeduncle.com 的完整案例拆解**[1](https://new.web.cafe/tutorial/detail/2pobte3keb)，以及社区教程里的 **SEO 优化六步框架**[2](https://new.web.cafe/tutorial/detail/if8ls06pcd) 和 **页面优化基础表格**[3](https://new.web.cafe/tutorial/detail/m8mfyxjzlk)。以上回答综合了这三篇的核心内容，重点以 wickeduncle 的实操为例，把"从关键词到页面结构"的路径讲清楚了。

---

# 补充：完整路径（五步法）

所有材料已读完，下面把完整的路径串起来。

## 从关键词到精细 SEO 页面：完整路径

路径可以拆成五步走：**收集关键词 → 对齐搜索量 → 拆变量、分类 → 设计模板 → 落地为页面**。每一步社区里都有详细的实操拆解。

### 第一步：收集关键词——九个渠道

哥飞在 2024 年 11 月的教程里系统梳理了九个关键词拓展渠道[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)：

1. 谷歌下拉搜索
2. 谷歌相关搜索（People also search for）
3. Similarweb 的关键词研究 & 着陆页查询
4. Semrush 的关键词查询
5. Ahrefs
6. 谷歌趋势（相关查询里的"搜索量上升"和"热门"两个 Tab 都要看）
7. 谷歌 Ads 关键词规划工具（发现新关键词 + 获取搜索量和预测数据）
8. YouTube、TikTok 等平台的搜索框下拉
9. 更多平台的搜索框推荐

实际操作时，每一个渠道都能作为种子——拿到一批词后，再拿这些词去下一个渠道滚第二轮、第三轮。尤其 Ads 关键词规划工具可以做语义层面扩展，同一个 "ai photo" 能带出 "ai image""ai picture" 等不同表达[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)。

### 第二步：对齐搜索量，去重排序

不同渠道给的搜索量不一致，哥飞的办法是回到谷歌自己的数据[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)：

- 把所有关键词导入 Ads 的"获取搜索量和预测数据"工具，清除地理位置限制，拿到统一口径的搜索量和预估出价区间。
- Ads 会把同义词归到一起给相同搜索量（如 "ai image" 和 "ai images"），这时候需要再用**谷歌趋势**做对比——尤其要加双引号精确匹配，才能看清到底哪种写法搜索热度更高。
- 去重后导出 CSV，粘贴到 Claude 里做初步需求分析。

这步做完，你就有了一个按搜索量排序的关键词清单，顺带能看到哪些词值钱（出价高）、哪些词需求真实（搜索量不虚）。

### 第三步：从关键词里拆变量、分类

拿到关键词清单后不要直接拿来写页面，先做"反向工程"——把一堆词拆出共性和变量。这一步把"关键词列表"变成"可编程的模板参数"。

以 **wickeduncle.com**（玩具礼物站）为例[1](https://new.web.cafe/tutorial/detail/2pobte3keb)：

> gifts for 8 year old boys
> gifts for 9 year old girls
> gift ideas for 10 year old boy

变量只有两个：**性别**（boys / girls / all）和**年龄**（取最小年龄和最大年龄两个字段）。一个产品可以标记性别 + 年龄范围，页面 URL 就是拼变量：`/gifts/boys/age-5`、`/gifts/girls/age-1`。

以 **bookseriesinorder.com**（图书系列信息站）为例，关键词被分成三类：

- `{作家名字} books in order`
- `{图书主角名字} books in order`
- `{系列作品名字} books in order`

这三类分别对应三个页面模板，而背后共享一套数据库表结构（书籍表、作者表、图书系列表、主角表）。哥飞特别强调，这类结构化页面和直接用 AI 生成博客文章有本质区别——前者是基于数据套模板，后者容易出低质量内容，他不推荐。

### 第四步：设计页面模板，把关键词"填"进去

有了变量和分类，下一步就是为每一类关键词设计一个页面模板。同一个模板 + 不同数据 = 成百上千个独立页面，每个页面精准命中一个长尾关键词。

**wickeduncle 的列表页模板**[1](https://new.web.cafe/tutorial/detail/2pobte3keb)：所有 `gifts/boys/age-X` 页面 UI 完全一致，只有产品列表不同。Title 写法像填空一样：

> Best Toys for 1 Year Old Boys | Gifts & Presents from Wicked Uncle USA
> Best Gifts for 1 Year Old Girls | Toys & Presents from Wicked Uncle USA

**bookseriesinorder 的三套模板**：

- 作家模板：介绍作家信息 → 他的图书系列列表 → 每个系列的图书列表 → 每本书的简介
- 主角模板：介绍主角 → 作家信息 → 所属系列 → 系列下的图书列表
- 系列模板：介绍系列 → 图书列表 → 作家信息 → 每本书的简介

每个页面单词数量都不少，既满足用户信息需求，又向搜索引擎清晰传达"这个页面讲的是什么"。

**readupnext.com 的拆解亮点**：哥飞让群友观摩这个页面后公布了"SEO 精髓"——

1. **Title、Description、H1 紧紧围绕用户会搜索的关键词去写**；
2. **合理引用第三方权威网页的推荐结果**——不是"我觉得这些书好"，而是"大家（第三方）都说好"，既增加 social proof，又提升了核心关键词密度；
3. **页面排版是结构化的**，不是普通图文文章，利于程序化生成——哥飞说"不懂 SEO 的人即使拿到页面也抄不会"。

### 第五步：落地到具体页面元素

模板框架搭好后，每个页面可以按 SEO 优化六步框架里"页面内容优化"这一环来打磨[2](https://new.web.cafe/tutorial/detail/if8ls06pcd)[3](https://new.web.cafe/tutorial/detail/m8mfyxjzlk)：

- **Title、URL、H1 各不重复**，都带上目标关键词（但 H1 写成自然语句）。
- **页面内容长度达标、关键词密度合理、Headings 结构合理**。
- **结构化数据标记**要设置好。
- **社媒分享卡片**不要漏。

还有一条铁律，来自哥飞 2024 年 4 月在群里总结的新站必须做的八条原则：

> 1、坚持一个关键词一个页面不动摇；
> 2、坚持后端渲染而不是前端渲染；
> 3、网页 TDH 要合理；
> 4、满足用户的需求，而不是谷歌的需求；
> 5、工具页也需要内容；
> 6、工具站也需要内容页；
> 7、合理的导航和内链结构；
> 8、适当的外链，拒绝垃圾外链。

关于"一个关键词一个页面"的理解，第二天群里就有人追问：如果同一个意思有不同写法怎么办（比如 "space download" vs "space downloader"）？哥飞的回答非常明确：**不同意思的关键词要分开，同一个意思的不同写法要放在同一个页面里**。换句话说，"一个关键词一个页面"指的是**搜索意图**不同才分页，语法变体可以合并覆盖。

另外哥飞在讲 bookseriesinorder 时顺带补充了两条配套原则：**分门别类罗列**（图书系列站就是这么做的）、**新站初期不要上太多页面，先找感觉，再慢慢上**。

### 目前已经覆盖的

以上回答综合了以下全部资料：

- 哥飞文章《从需求调研到网站规划：如何收集关键词，获取搜索量，并基于关键词规划网站结构》[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)
- 哥飞拆解 wickeduncle.com 的案例[1](https://new.web.cafe/tutorial/detail/2pobte3keb)
- SEO 优化六步框架[2](https://new.web.cafe/tutorial/detail/if8ls06pcd) 和页面优化基础[3](https://new.web.cafe/tutorial/detail/m8mfyxjzlk)
- 2024-04-23 群聊中哥飞提出的新站八条原则
- 2024-04-24 群聊中关于"一个关键词一个页面"含义的澄清
- 2025-08-17 群聊中 readupnext.com 页面 SEO 精髓的完整拆解
- 2026-01-22 群聊中哥飞用 bookseriesinorder.com 和 meetnewbooks.com 系统讲解 PSEO 的全过程

### 尚未完全展开的

文章《从需求调研到网站规划》末尾还有一段——把关键词列表 Markdown 粘贴给 Claude，用提示词「请帮我规划一个 SEO 友好的网站结构，并告诉我需要做哪些页面」「基于以上规划，假设域名是 X，请给出我的所有页面 URL 和用途说明」——Claude 返回了具体的 URL 结构和用途说明，这部分实操示例目前在文章剩余段落里。需要我继续把它读完吗？

---

# 补充：把关键词列表喂给 Claude——实操演示

哥飞在教程后半段完整演示了怎么用 AI 辅助做网站结构规划，这比之前拆的模板设计更进一步——是从"关键词清单"直接到"完整 URL 地图"的全过程。

## 准备工作：关键词 → Markdown → Claude

拿到 Ads 关键词规划工具导出的 CSV 后，做三件事：

1. **手动清理**：删除不相关的关键词（比如搜 "ai photo" 时冒出来的 "download video instagram"），按搜索量从高到低排序；
2. **转格式**：用 `tableconvert.com` 把关键词和搜索量两列转成 Markdown 表格；
3. **喂给 Claude**：把 Markdown 粘贴过去，第一次让它做需求分析，第二次让它规划网站结构[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)。

## 提示词一：做需求分析

先把 Markdown 表格直接粘贴进 Claude，让它完成初步的需求分析，帮你理解用户在这些关键词背后到底想干什么——生成、编辑、增强、还是格式转换[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)。

## 提示词二：规划网站结构

分析完之后，用一句很简单的提示词：

> 请帮我规划一个 SEO 友好的网站结构，并且告诉我，需要做哪些页面。

Claude 会基于关键词的语义分类，自动帮你拆出页面层级。从哥飞展示的结果来看，Claude 为 "ai photo" 这个方向输出了这样的结构[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)：

### 1. 核心页面

- **首页** — aiphoto.com 展示核心功能、最新作品、用户评价。SEO 目标："ai photo generator""ai image generator"。
- **工具中心** — aiphoto.com/tools/ 汇总所有 AI 图像处理工具，提供分类导航。SEO 目标："ai photo tools""ai image tools"。

### 2. 图像生成工具（Generation）

- **文本生成图像** — aiphoto.com/tools/generation/text-to-image  SEO 目标："ai image generator from text""text to image ai"。功能包括提示词输入、风格选择、参数调整。
- **图像生成图像** — aiphoto.com/tools/generation/image-to-image  SEO 目标："image to image ai""ai image generator from image"。功能包括图片上传、风格迁移、参数控制。
- **批量生成工具** — aiphoto.com/tools/generation/batch  SEO 目标："bulk ai image generator""batch image generation"。

## 这与前面说的"拆变量做模板"是什么关系？

前面讲 wickeduncle 和 bookseriesinorder 时，核心思路是**关键词本身已经暴露了变量**（性别+年龄，或者作家+系列+主角），所以 URL 结构是和变量直接绑定的。Claude 这边的做法更适用于**关键词还没那么结构化**的情况——先让 AI 帮你按语义归成"图像生成""图像增强""格式转换"等等几大类，然后再判断每一类下面要不要进一步拆参数。

两套方法本质是同一件事的两条入口：

- 关键词如果自带明显的维度变量 → 直接拆变量、套模板（wickeduncle 模式）；
- 关键词如果比较散、分类不直观 → 先让 Claude 帮忙分类和建体系（aiphoto 模式）。

## 目前已经覆盖的

我已经读完了《从需求调研到网站规划》这篇文章从开头到 Claude 输出"批量生成工具"页面为止的全部内容[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)。目前文章中展示的 Claude 规划结果已经覆盖了：核心页面（首页 + 工具中心）和图像生成工具（Generation）大类下的三个子页面。

## 阶段性收束：当前挖掘进度

我已经把哥飞这篇《从需求调研到网站规划》从头读到了 Claude 输出 URL 规划的中间位置。以下是精确进度：

### 一、已完整读完的部分

**关键词收集的九个渠道（完整覆盖）**：

1. 谷歌下拉搜索
2. 谷歌相关搜索（People also search for）
3. Similarweb 的关键词研究 & 着陆页查询
4. Semrush 的关键词查询
5. Ahrefs
6. 谷歌趋势（"搜索量上升"和"热门"两个 Tab，以及翻页取满 25 个相关关键词）[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)
7. 谷歌 Ads 关键词规划工具（"发现新关键词"功能——语义层面扩展，同一个 "ai photo" 带出 "ai image""ai picture" 等不同表达）[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)
8. YouTube 搜索框下拉
9. TikTok 搜索框下拉，以及更多平台

哥飞还列了群友做过的谷歌下拉关键词提取工具[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)：
- `https://github.com/niemingxing/search-recommendations`（作者 **聂明星**）
- `https://searchsuggest.tips/`（作者 **Insight**）
- `https://keywordtool.io/`（**大罗** 推荐）
- `https://www.searchsug-extractor.com/`

**搜索量对齐的完整流程（完整覆盖）**：

- 去重得到唯一关键词列表
- 用 Ads"获取搜索量和预测数据"工具统一搜索量口径，**清除地理位置限制**后得到谷歌自己口径的搜索量 + 预估出价区间[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)
- 手动删除不相关关键词（如 "download video instagram"）
- Ads 会把同义词归到一起给相同搜索量，需要用**谷歌趋势加双引号精确对比**来区分到底哪种写法搜索热度更高[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)
- 从 Ads 导出 CSV（选择"方案历史指标"），用 `tableconvert.com` 把关键词和搜索量两列转成 Markdown 表格[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)

**Claude 辅助规划（已读到中间位置）**：

- 第一条提示词：直接把 Markdown 粘贴给 Claude 做需求分析[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)
- 第二条提示词：「请帮我规划一个 SEO 友好的网站结构，并且告诉我，需要做哪些页面。」[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)
- 最终生成 URL 时用的提示词：「基于以上规划，假设域名是 aiphoto.com，请给出我的所有页面 url 和用途说明。」[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)

Claude 已输出的内容（已读完）：

| 分区 | 页面 | URL | SEO 目标关键词 |
|---|---|---|---|
| 1. 核心页面 | 首页 | aiphoto.com | "ai photo generator""ai image generator" |
| 1. 核心页面 | 工具中心 | aiphoto.com/tools/ | "ai photo tools""ai image tools" |
| 2. 图像生成工具 | 文本生成图像 | `/tools/generation/text-to-image` | "ai image generator from text""text to image ai" |
| 2. 图像生成工具 | 图像生成图像 | `/tools/generation/image-to-image` | "image to image ai""ai image generator from image" |
| 2. 图像生成工具 | 批量生成工具 | `/tools/generation/batch` | "bulk ai image generator""batch image generation" |

每个页面 Claude 都规划了四个字段：URL、用途说明、SEO 目标关键词、主要功能[4](https://new.web.cafe/tutorial/detail/lmlpg7ae96)。

### 二、文章尚未读完的部分

文章最后一次返回的内容就是"批量生成工具"，且 `has_more` 为 true，说明 Claude 的输出还在继续。从已读完的结构规律（"2. 图像生成工具"是第 2 号大类）可以推断，后面至少还应该有：

- **3. 图像编辑工具（Editing）** — 覆盖 "remove background""image resizer""crop image" 等关键词
- **4. 图像增强工具（Enhancement）** — 覆盖 "enhance photo quality""image upscaler""photo restoration" 等关键词
- **5. 格式转换工具（Conversion）** — 覆盖 "jpg to png""heic to jpg""compress image" 等关键词
- 可能还有博客/内容页等支持性页面

这些大类下同样会有具体的子页面 URL、用途、SEO 目标和主要功能——和已读部分格式完全一致，拿到就能直接作为页面模板的输入。

### 目前你拥有的

你已经有了一套完整的操作链路：**九个渠道收集关键词 → Ads 统一搜索量 → tableconvert 转 Markdown → Claude 做需求分析和 URL 规划**，外加两个 Claude 提示词的精确写法。拿到 Claude 输出的完整 URL 列表后，剩下的就是起域名、搭框架、按图施工。

需要我等下一轮继续把 Claude 输出的剩余大类（编辑工具、增强工具、格式转换等）全部读完吗？

## 参考来源

[1] [【2024.7.25案例拆解】https://www.wickeduncle.com/](https://new.web.cafe/tutorial/detail/2pobte3keb)
[2] [5.7 🔍 SEO 优化策略](https://new.web.cafe/tutorial/detail/if8ls06pcd)
[3] [6.5 ⚙️ 页面优化（视频未录制）](https://new.web.cafe/tutorial/detail/m8mfyxjzlk)
[4] [从需求调研到网站规划：如何收集关键词，获取搜索量，并基于关键词规划网站结构](https://new.web.cafe/tutorial/detail/lmlpg7ae96)