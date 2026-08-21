import Link from "next/link";
import type { Article } from "@/data/articles";

interface Props {
  posts: Article[];
}

export default function RecentPosts({ posts }: Props) {
  return (
    <section className="w-full max-w-[720px] mx-auto px-6 md:px-8 py-0 pb-16">
      <div className="flex items-baseline justify-between mb-8">
        <div className="flex items-baseline gap-4">
          <span className="section-num">02</span>
          <h2 className="font-display font-bold text-[1.5rem] tracking-[-0.01em] text-ink">最新文章</h2>
        </div>
        <Link href="/articles" className="action-link">完整归档 →</Link>
      </div>
      <div className="divide-y divide-divider">
        {posts.map((post, i) => (
          <ArticleRow key={post.slug} post={post} index={i} />
        ))}
      </div>
    </section>
  );
}

function ArticleRow({ post, index }: { post: Article; index: number }) {
  return (
    <Link href={`/articles/${post.slug}`} className="flex items-center gap-6 py-5 hover:pl-3 transition-all duration-200 block border-b border-divider last:border-0">
      <time dateTime={post.date} className="meta-date whitespace-nowrap w-[100px] shrink-0">
        {post.date}
      </time>
      <span className="font-serif text-[1.0625rem] text-ink leading-[1.5] flex-1 hover:text-accent transition-colors duration-140">
        {post.title}
      </span>
      <span className="meta-label whitespace-nowrap hidden sm:block">{post.category}</span>
      <span className="text-ink-faint shrink-0" aria-hidden="true">↗</span>
    </Link>
  );
}
