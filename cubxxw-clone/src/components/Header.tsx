"use client";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/articles", label: "文章" },
  { href: "/about", label: "关于" },
  { href: "https://github.com/dantefung", label: "GitHub", external: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full max-w-[1024px] mx-auto px-6 md:px-8">
      <nav className="flex items-center justify-between h-[53px]" aria-label="主导航">
        <Link href="/" className="font-display font-bold text-[1.125rem] tracking-[-0.02em] text-ink hover:text-accent transition-colors duration-140">
          Nova Vault
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-5 list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="text-[0.875rem] font-medium text-ink-muted hover:text-ink transition-colors duration-140 tracking-[0.02em]"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                const html = document.documentElement;
                const isDark = html.dataset.theme === "dark";
                html.dataset.theme = isDark ? "light" : "dark";
                localStorage.setItem("theme", isDark ? "light" : "dark");
              }}
              className="p-1.5 rounded hover:bg-paper-alt transition-colors duration-140"
              aria-label="切换主题"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </button>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="菜单"
          aria-expanded={mobileOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden py-4 border-t border-divider">
          <ul className="flex flex-col gap-3 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="text-[0.875rem] font-medium text-ink-muted hover:text-ink transition-colors duration-140"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
