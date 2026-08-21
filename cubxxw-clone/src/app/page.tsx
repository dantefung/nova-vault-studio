import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import RecentPosts from "@/components/RecentPosts";
import { articles } from "@/data/articles";

export default function HomePage() {
  const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <div className="w-full max-w-[1024px] mx-auto px-6 md:px-8">
          <div className="border-t border-border/40 my-0" />
        </div>
        <CategoryGrid />
        <div className="w-full max-w-[720px] mx-auto px-6 md:px-8">
          <div className="border-t border-divider my-0" />
        </div>
        <RecentPosts posts={latest} />
      </main>
      <Footer />
    </div>
  );
}
