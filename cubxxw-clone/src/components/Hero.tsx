export default function Hero() {
  return (
    <section className="w-full max-w-[720px] mx-auto px-6 md:px-8 pt-[5rem] pb-[4rem]">
      <p className="kicker mb-5 reveal">A PERSONAL KNOWLEDGE VAULT</p>
      <h1 className="font-display font-bold text-[clamp(2.5rem,6vw,4rem)] tracking-[-0.03em] leading-[1.1] text-ink mb-6 reveal reveal-delay-1">
        凡是过往，皆为序章
      </h1>
      <p className="font-serif text-[1.25rem] leading-[1.7] text-ink-muted max-w-[560px] mb-8 reveal reveal-delay-2">
        AI、工程、独立开发与长期思考的公开档案。把零散知识，整理成可以反复使用的系统。
      </p>
      <div className="reveal reveal-delay-3">
        <a href="/articles" className="link-arrow">
          开始阅读 <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
