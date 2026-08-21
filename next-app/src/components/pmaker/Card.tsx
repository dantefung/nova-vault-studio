// src/components/pmaker/Card.tsx
// 卡片：8px padding + 1px border + 12px radius
// hover 抬升 -2px + 阴影 + 边框变深

import { CardCover } from './CardCover'
import type { CardKind } from '@/data/pmaker'

export function Card({ card }: { card: CardKind }) {
  const cls = ['card']
  if (card.soon) cls.push('card--soon')
  return (
    <a className={cls.join(' ')} href={card.href || '#'}>
      <div className="card__art">
        <span className="card__no">{card.no}</span>
        {card.demo && <span className="card__demo">可交互</span>}
        <div className="card__stage">
          <CardCover shot={card.shot} />
        </div>
      </div>
      <div className="card__body">
        <h3 className="card__name">{card.name}</h3>
        {card.desc && <p className="card__desc">{card.desc}</p>}
      </div>
    </a>
  )
}
