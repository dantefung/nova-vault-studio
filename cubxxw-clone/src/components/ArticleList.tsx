import Link from "next/link";
import type { Article } from "@/data/articles";

interface Props {
  articles: Article[];
}

export default function ArticleList({ articles }: Props) {
  if (articles.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-ink-muted font-serif">暂无文章</p>
        <Link href="/articles" className="action-link mt-4 inline-block">返回全部 →</Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-divider">
      {articles.map((post) => (
        <ArticleCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

function ArticleCard({ post }: { post: Article }) {
  return (
    <Link href={`/articles/${post.slug}`} className="block py-7 hover:pl-3 transition-all duration-200 group">
      <div className="flex items-start gap-6">
        <time dateTime={post.date} className="meta-date whitespace-nowrap w-[100px] shrink-0 pt-1">
          {post.date}
        </time>
        <div className="flex-1 min-w-0">
          <span className="meta-label text-[#862122] mb-2 block">{post.category}</span>
          <h3 className="font-serif text-[1.125rem] text-ink leading-[1.5] group-hover:text-accent transition-colors duration-140 mb-2">
            {post.title}
          </h3>
          <p className="font-serif text-[0.9375rem] text-ink-muted leading-[1.75] line-clamp-2">
            {post.excerpt}
          </p>
        </div>
        <span className="text-ink-faint shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
          ↗
        </span>
      </div>
    </Link>
  );
}
