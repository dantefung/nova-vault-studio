// src/components/pmaker/CardCover.tsx
// 卡片头图 SVG 缩略图组件
// 直接渲染 PMaker 145 个手绘 SVG 缩略图（来自 shots.js）
// 配色由卡片渐变底负责，SVG 内部用 rgba(22,21,26,*) 描边

import { COVERS } from '@/data/pmaker-covers'

export function CardCover({ shot }: { shot: string }) {
  const svg = shot ? COVERS[shot] : null
  if (svg) {
    return (
      <div
        className="card__cover"
        aria-hidden="true"
        // 真实 PMaker SVG 字符串，可信地保留
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    )
  }
  return <div className="card__cover" aria-hidden="true" />
}
