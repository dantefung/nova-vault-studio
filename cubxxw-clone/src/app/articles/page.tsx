import { articles, getAllCategories } from "@/data/articles";
import ArticleList from "@/components/ArticleList";

interface Props {
  searchParams: Promise<{ cat?: string; page?: string }>;
}

export default async function ArticlesPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.cat;
  const allCategories = getAllCategories();

  let filtered = articles;
  if (category) {
    filtered = articles.filter((a) => a.category === category);
  }

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full max-w-[1024px] mx-auto px-6 md:px-8 py-6">
        <a href="/" className="font-display font-bold text-[1.125rem] tracking-[-0.02em] text-ink hover:text-accent transition-colors duration-140 no-underline">
          Nova Vault
        </a>
      </header>

      <main className="flex-1 w-full max-w-[720px] mx-auto px-6 md:px-8 pb-16">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <FilterChip href="/articles" active={!category}>全部</FilterChip>
          {allCategories.map((cat) => (
            <FilterChip key={cat} href={`/articles?cat=${encodeURIComponent(cat)}`} active={category === cat}>
              {cat}
            </FilterChip>
          ))}
        </div>

        <div className="flex items-baseline justify-between mb-8">
          <div className="flex items-baseline gap-4">
            <span className="section-num">02</span>
            <h1 className="font-display font-bold text-[1.5rem] tracking-[-0.01em] text-ink">
              {category ? category : "所有文章"}
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
