export interface Article {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  readTime: string;
}

export const articles: Article[] = [
  {
    slug: "ai-made-me-smarter-later-to-reality",
    title: "AI 让我更聪明，也让我更晚碰到现实",
    date: "2026-08-15",
    category: "成长与生活",
    excerpt: "一个 48 小时工程任务里，我记下了一句话：任务到现在，其实花了一半的时间去设计，调研，理解需求，判断边界，扩展训练自己的审美、直觉。没有开始写代码。",
    readTime: "6 min",
  },
  {
    slug: "fear-does-not-decide-for-me",
    title: "不会让恐惧替我做决定",
    date: "2026-08-10",
    category: "成长与生活",
    excerpt: "8 月 9 日深夜，第二天就要去新的公司。偏偏在这个时候，搭子给我发来了消息。搭子平常很少主动说自己的焦虑和痛苦。",
    readTime: "6 min",
  },
  {
    slug: "agent-system-design-synthesis",
    title: "Agent 不是一种产品：十套系统如何重新分配控制权、状态、身份与副作用",
    date: "2026-08-07",
    category: "AI Agent",
    excerpt: "系统 A 有十二个 Agent、长期记忆、云端电脑、事件日志和自动恢复。系统 B 只做一次 document → structured candidate，把结果放进表单，等人核对原件后再保存。",
    readTime: "25 min",
  },
  {
    slug: "conversation-as-database",
    title: "Conversation as Database：OpenHands 的无状态 Agent 与事件运行时",
    date: "2026-08-07",
    category: "AI Agent",
    excerpt: "凌晨两点，Agent 准备给一个 GitHub issue 添加「修复已完成」的标签。ActionEvent 已经写进日志。GitHub API 也返回了 200。",
    readTime: "18 min",
  },
  {
    slug: "tradingagents-organization",
    title: "多 Agent 辩论真的增加了信息吗：TradingAgents 的组织图与相关性风险",
    date: "2026-08-07",
    category: "AI Agent",
    excerpt: "法庭里坐着九位证人。四位负责市场、情绪、新闻与基本面；两位分别坚持看多和看空；三位从激进、中性与保守的风险偏好发言。",
    readTime: "22 min",
  },
  {
    slug: "n8n-growth-automation",
    title: "n8n 入门：给超级个体搭一条会被结果改写的增长流水线",
    date: "2026-08-07",
    category: "成长与生活",
    excerpt: "先别连接邮箱、CRM 或社媒账号。打开一张空白的 n8n 画布，只放三个节点：Manual Trigger → Edit Fields → IF。",
    readTime: "15 min",
  },
  {
    slug: "history-needs-more-than-one-scale",
    title: "历史不能只活在一个尺度里：与 Archer 的一场夜谈",
    date: "2026-08-06",
    category: "成长与生活",
    excerpt: "「执」下面一个「贝」，是什么字？那晚，我和 Archer 先被这个字卡住了。贽。字认出来以后，我们很自然地聊到了李贽。",
    readTime: "12 min",
  },
  {
    slug: "flipkart-ai-seo-strategy",
    title: "Flipkart 如何用 AI 让私域消息被疯狂转发：285% CTR 背后的搜索召回新范式",
    date: "2026-08-20",
    category: "AI Agent",
    excerpt: "有人发了 15,061 条营销消息，换回 37,258 次访问。多出来的那部分，是用户自己转发出去的。起点在搜索日志里。",
    readTime: "14 min",
  },
  {
    slug: "ai-agent-skills-collection",
    title: "2026 AI Agent 必备 Skills 大全：从心智模型到实战清单",
    date: "2026-08-21",
    category: "AI Agent",
    excerpt: "裸用 Claude Code 就像雇了个聪明但啥都不懂的新人。装好 skill，你雇的是一个带全套 SOP 上岗的熟手。",
    readTime: "16 min",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter((a) => a.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(articles.map((a) => a.category))];
}
