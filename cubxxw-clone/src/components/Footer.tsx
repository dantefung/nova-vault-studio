import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-divider mt-auto">
      <div className="max-w-[1024px] mx-auto px-6 md:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[0.8125rem] text-ink-faint">© 2026 Nova Vault · 公开的实践与思想档案</span>
        </div>
        <div className="flex flex-wrap gap-5 text-[0.8125rem]">
          <FooterLink href="/">首页</FooterLink>
          <FooterLink href="/articles">文章</FooterLink>
          <FooterLink href="/about">关于</FooterLink>
          <FooterLink href="https://github.com/dantefung" external>GitHub</FooterLink>
          <FooterLink href="/feed.xml">RSS</FooterLink>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="text-ink-muted hover:text-accent transition-colors duration-140"
    >
      {children}
    </Link>
  );
}
