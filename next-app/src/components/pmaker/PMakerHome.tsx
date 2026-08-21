// src/components/pmaker/PMakerHome.tsx
// PMaker 首页装配
// TopBar + Hero + Index(CatNav + Decks) + Foot

import { TopBar } from './TopBar'
import { Hero } from './Hero'
import { CatNav } from './CatNav'
import { Deck } from './Deck'
import { Foot } from './Foot'
import { DECKS } from '@/data/pmaker'

export function PMakerHome() {
  return (
    <>
      <TopBar />
      <Hero />
      <main className="index">
        <CatNav />
        <div className="cats">
          {DECKS.map((deck) => (
            <Deck key={deck.name} name={deck.name} cats={deck.cats} />
          ))}
        </div>
      </main>
      <Foot />
    </>
  )
}
