import { articles, getArticleBySlug } from "@/data/articles";
import ArticleContent from "@/components/ArticleContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "文章不存在" };
  return {
    title: `${article.title} | Nova Vault`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display font-bold text-2xl text-ink mb-4">文章不存在</p>
          <a href="/articles" className="action-link">返回文章列表 →</a>
        </div>
      </div>
    );
  }

  const related = articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  return (
    <ArticleContent article={article} related={related} />
  );
}
