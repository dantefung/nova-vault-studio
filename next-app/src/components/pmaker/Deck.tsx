// src/components/pmaker/Deck.tsx
// 板块 + 章节
// 每个 cat 内部多个 row（阶段 + 卡片组）

import { CATS } from '@/data/pmaker'
import { Card } from './Card'

function Row({ row }: { row: { n: string; t: string; d: string; cards: import('@/data/pmaker').CardKind[] } }) {
  return (
    <div>
      <div className="step">
        <span className="step__chip" />
        <span className="step__n">{row.n}</span>
        <span className="step__t">{row.t}</span>
        <span className="step__d">{row.d}</span>
        <span className="step__rule" />
      </div>
      <div className="cards">
        {row.cards.map((card, ci) => (
          <Card key={`${card.no}-${ci}`} card={card} />
        ))}
      </div>
    </div>
  )
}

function Cat({ id }: { id: string }) {
  const cat = CATS[id]
  // 跳过第一个空 row（占位用）
  const rows = cat.rows.filter((r) => r.t || r.cards.length > 0)
  return (
    <section className="cat" id={id}>
      <div className="cat__head">
        <h2 className="cat__name">{cat.name}</h2>
        <p className="cat__desc">{cat.desc}</p>
      </div>
      {rows.map((row, i) => (
        <Row key={i} row={row} />
      ))}
    </section>
  )
}

export function Deck({ name, cats }: { name: string; cats: string[] }) {
  return (
    <section className="deck">
      <div className="deck__head">
        <h2 className="deck__name">{name}</h2>
      </div>
      {cats.map((cid) => (
        <Cat key={cid} id={cid} />
      ))}
    </section>
  )
}
