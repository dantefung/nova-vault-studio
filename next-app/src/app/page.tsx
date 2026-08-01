import { cookies } from 'next/headers'
import SiteHeader from '@/components/SiteHeader'
import EastonCloneHome from '@/components/EastonCloneHome'
import QuietHome, { EastonHome } from '@/components/QuietHome'
import { readLandingThemeFromCookies, type LandingTheme } from '@/lib/theme'
import { latest, allSeries, allCategories } from '@/lib/blog-index'

export default async function HomePage() {
  const cookieStore = await cookies()
  const theme = readLandingThemeFromCookies(cookieStore)
  const recent = latest(6)
  const allCats = allCategories()
  const allSer = allSeries()

  const featured = recent.slice(0, 3)
  const recentList = recent.slice(0, 4)
  const topCategories = allCats.slice(0, 3)
  const featuredSeries = allSer.slice(0, 3)

  return (
    <>
      <SiteHeader theme={theme} />
      {theme === 'easton-clone' && (
        <EastonCloneHome
          featured={featured}
          recentList={recentList}
          topCategories={topCategories}
          featuredSeries={featuredSeries}
        />
      )}
      {theme === 'easton' && <EastonHome recent={recent} />}
      {theme === 'quiet' && <QuietHome recent={recent} />}
      <footer className="footer">
        <p>System Vault · Next.js rebuild · 主题：{theme}</p>
      </footer>
    </>
  )
}