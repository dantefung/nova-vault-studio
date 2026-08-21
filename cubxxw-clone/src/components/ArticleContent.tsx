"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Article } from "@/data/articles";

interface Props {
  article: Article;
  related: Article[];
}

export default function ArticleContent({ article, related }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[720px] mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* Meta */}
        <div className="mb-8">
          <span className="meta-label text-[#862122]">{article.category}</span>
          <h1 className="font-display font-bold text-[2.25rem] tracking-[-0.02em] leading-[1.15] text-ink mt-3 mb-6">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-[0.8125rem] text-ink-faint">
            <time dateTime={article.date}>{article.date}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readTime} 阅读</span>
          </div>
        </div>

        <hr className="border-border my-8" />

        {/* Article body - simulated content */}
        <article className="font-serif prose">
          <p className="text-lg leading-[2] text-ink-muted mb-8">
            {article.excerpt}
          </p>

          <p>这是这篇文章的正文内容。在实际部署时，这里会展示完整的文章内容——可以是 Markdown 渲染、手写内容或从其他数据源加载。</p>

          <h2>核心观点</h2>
          <p>文章的核心论点会放在这里。使用衬线字体（Noto Serif SC）呈现正文，行高 2.0，营造阅读感。</p>

          <blockquote>
            <p>这是一段引用。左边有红色边框装饰，背景是淡淡的强调色。</p>
          </blockquote>

          <p>正文继续……</p>

          <h2>进一步阅读</h2>
          <p>相关的文章推荐……</p>
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-divider">
            <p className="kicker mb-6">继续阅读</p>
            <div className="divide-y divide-divider">
              {related.map((post) => (
                <Link key={post.slug} href={`/articles/${post.slug}`} className="flex items-center gap-6 py-5 block hover:pl-3 transition-all duration-200">
                  <time className="meta-date whitespace-nowrap w-[100px] shrink-0">{post.date}</time>
                  <span className="font-serif text-[1.0625rem] text-ink leading-[1.5] flex-1 hover:text-accent transition-colors duration-140">
                    {post.title}
                  </span>
                  <span className="text-ink-faint shrink-0" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-divider">
          <Link href="/articles" className="action-link">← 返回文章列表</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
