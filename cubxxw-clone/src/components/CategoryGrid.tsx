import Link from "next/link";

const categories = [
  { label: "AI Agent", description: "多 Agent 系统设计与工程实践。", href: "/articles?cat=ai-agent", featured: true },
  { label: "成长与生活", description: "个人成长、哲学思考与人生决策。", href: "/articles?cat=growth" },
  { label: "独立产品", description: "Talent Signal、Solo Compass 等产品构建记录。", href: "/articles?cat=products" },
  { label: "工程方法", description: "系统设计、架构决策与工程纪律。", href: "/articles?cat=engineering" },
  { label: "旅行", description: "越南、吴哥窟等地的田野笔记。", href: "/articles?cat=travel" },
  { label: "全部文章", description: "177 篇文章，持续更新中。", href: "/articles" },
];

export default function CategoryGrid() {
  return (
    <section className="w-full max-w-[720px] mx-auto px-6 md:px-8 py-12">
      <div className="flex items-baseline justify-between mb-8">
        <div className="flex items-baseline gap-4">
          <span className="section-num">01</span>
          <h2 className="font-display font-bold text-[1.5rem] tracking-[-0.01em] text-ink">知识分类</h2>
        </div>
        <Link href="/articles" className="action-link">查看全部 →</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className={`flex flex-col gap-2 p-6 bg-paper hover:bg-entry transition-colors duration-200 ${cat.featured ? "bg-accent-soft" : ""}`}
          >
            <span className="font-display font-semibold text-[1.125rem] text-ink">{cat.label}</span>
            <span className="font-serif text-[0.9375rem] text-ink-muted leading-[1.6]">{cat.description}</span>
            <span className="text-[1rem] text-ink-faint self-end opacity-0 group-hover:opacity-100 transition-opacity ml-auto" aria-hidden="true">
              ↗
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
