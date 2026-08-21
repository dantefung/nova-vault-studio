import { articles, getAllCategories } from "@/data/articles";
import ArticleList from "@/components/ArticleList";

export const metadata = {
  title: "所有文章 | Nova Vault",
  description: "Nova Vault 所有文章列表",
};

export default function ArticlesPage() {
  const allCategories = getAllCategories();
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full max-w-[1024px] mx-auto px-6 md:px-8 py-6">
        <a href="/" className="font-display font-bold text-[1.125rem] tracking-[-0.02em] text-ink hover:text-accent transition-colors duration-140 no-underline">
          Nova Vault
        </a>
      </header>

      <main className="flex-1 w-full max-w-[720px] mx-auto px-6 md:px-8 pb-16">
        {/* Category filter - client side */}
        <div className="flex flex-wrap gap-2 mb-10" id="category-filters">
          <FilterChip href="/articles" active={true}>全部</FilterChip>
          {allCategories.map((cat) => (
            <FilterChip key={cat} href={`/articles`} active={false}>{cat}</FilterChip>
          ))}
        </div>

        <div className="flex items-baseline justify-between mb-8">
          <div className="flex items-baseline gap-4">
            <span className="section-num">02</span>
            <h1 className="font-display font-bold text-[1.5rem] tracking-[-0.01em] text-ink">
              所有文章
            </h1>
          </div>
          <span className="meta-date">{sorted.length} 篇</span>
        </div>

        <ArticleList articles={sorted} />
      </main>
    </div>
  );
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={`px-4 py-2 text-[0.8125rem] font-medium rounded-full transition-all duration-140 ${
        active
          ? "bg-ink text-paper"
          : "bg-paper-alt text-ink-muted hover:text-ink hover:bg-paper"
      }`}
    >
      {children}
    </a>
  );
}
