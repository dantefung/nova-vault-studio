import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[720px] mx-auto px-6 md:px-8 py-12 md:py-16">
        <p className="kicker mb-5">ABOUT</p>
        <h1 className="font-display font-bold text-[2.25rem] tracking-[-0.02em] leading-[1.15] text-ink mb-8">
          关于这个站点
        </h1>

        <article className="font-serif prose">
          <p className="text-lg text-ink-muted">
            这里是 Nova Vault —— 一个公开的实践与思想档案。
          </p>

          <p>
            把真实实践，沉淀成能穿越时间的知识。这里公开 AI 工作流、真实项目与工程方法，
            也记录关于个人成长、哲学与人生的长期思考。
          </p>

          <h2>核心理念</h2>
          <p>
            知识不应该只是信息——它应该是可以反复使用的系统。
            每一篇文章、每一个项目记录，都应该能帮你节省下一次重新思考的时间。
          </p>

          <blockquote>
            <p>催单是在花用户的耐心。做功课是在存用户的信任。
            耐心花完了就没了，信任存下来是复利。</p>
          </blockquote>

          <h2>内容分类</h2>
          <ul>
            <li><strong>AI Agent</strong> — 多 Agent 系统设计与工程实践</li>
            <li><strong>成长与生活</strong> — 个人成长、哲学思考与人生决策</li>
            <li><strong>独立产品</strong> — Talent Signal、Solo Compass 等构建记录</li>
            <li><strong>工程方法</strong> — 系统设计、架构决策与工程纪律</li>
            <li><strong>旅行</strong> — 越南、吴哥窟等地的田野笔记</li>
          </ul>

          <h2>联系方式</h2>
          <p>
            <Link href="https://github.com/dantefung" className="text-accent hover:underline">GitHub</Link> ·
            {" "}
            <Link href="/feed.xml" className="text-accent hover:underline">RSS</Link> ·
            {" "}
            <Link href="mailto:hello@system-vault.site" className="text-accent hover:underline">邮箱</Link>
          </p>

          <hr />

          <p className="text-sm text-ink-faint">
            本站由 VitePress 驱动，设计灵感来源于 cubxxw.com。
            所有文章均为原创或经过许可的翻译整理。
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
