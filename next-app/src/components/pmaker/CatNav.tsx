// src/components/pmaker/CatNav.tsx
// 左侧 sticky 分类导航
// 14 个链接 + 2 分组 + scrollspy

'use client'

import { useEffect, useState } from 'react'
import { DECKS, CATS } from '@/data/pmaker'

export function CatNav() {
  const [active, setActive] = useState<string>('ai-basics')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 找到最靠近顶部且相交的章节
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          const id = visible[0].target.id
          setActive(id)
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    )

    DECKS.forEach((deck) => {
      deck.cats.forEach((cid) => {
        const el = document.getElementById(cid)
        if (el) observer.observe(el)
      })
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav className="catnav">
      <div className="catnav__list">
        {DECKS.map((deck, di) => (
          <div key={deck.name}>
            <span className="catnav__group">{deck.name}</span>
            {deck.cats.map((cid) => (
              <a
                key={cid}
                href={`#${cid}`}
                className={active === cid ? 'is-active' : ''}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: CATS[cid].svg }}
                />
                {CATS[cid].name}
              </a>
            ))}
            {di === 0 && <span className="catnav__group" style={{ marginTop: 22 }} />}
          </div>
        ))}
      </div>
    </nav>
  )
}
