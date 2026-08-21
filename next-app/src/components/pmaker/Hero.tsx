// src/components/pmaker/Hero.tsx
// Hero：左侧标题 + 右侧 7.5s 循环动画 SVG
// 构想 → 设计 → 实现

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__copy">
        <p className="hero__kicker">
          Think product. Make products.
          <span>做产品 PMaker</span>
        </p>
        <h1>
          探索 AI 时代，<br />
          产品如何被构想、设计与实现。
        </h1>
        <p className="hero__lead">
          AI 让更多人能把想法做成产品。做得越快，越要想清楚做什么、怎么做、做完之后怎么改。
        </p>
      </div>

      <div className="hero__art" aria-hidden="true">
        <svg className="reel" viewBox="0 0 500 250" role="img">
          <g fontFamily="-apple-system, PingFang SC, sans-serif">
            {/* 三个面板的框 + 标题一直在 */}
            <g className="frames">
              <text x="75" y="26" fontSize="12.5" fill="#78757f" textAnchor="middle">构想</text>
              <text x="250" y="26" fontSize="12.5" fill="#78757f" textAnchor="middle">设计</text>
              <text x="425" y="26" fontSize="12.5" fill="#78757f" textAnchor="middle">实现</text>
              <rect x="4" y="42" width="142" height="156" rx="10" fill="#fff" stroke="#16151a" strokeOpacity=".13" />
              <rect x="179" y="42" width="142" height="156" rx="10" fill="#fff" stroke="#16151a" strokeOpacity=".13" />
              <rect x="354" y="42" width="142" height="156" rx="10" fill="#fff" stroke="#16151a" strokeOpacity=".13" />
            </g>

            {/* ── 构想 ── */}
            <g className="st1">
              <rect x="22" y="64" width="106" height="26" rx="6" fill="#fffdf7" stroke="#f0a01e" strokeOpacity=".45" />
              <circle cx="34" cy="77" r="3.2" fill="#f0a01e" fillOpacity=".7" />
              <text x="46" y="81" fontSize="11" fill="#45434e">用户说的</text>
            </g>
            <g className="st1" style={{ ['--d' as string]: '0.12s' } as React.CSSProperties}>
              <rect x="22" y="100" width="106" height="26" rx="6" fill="#fffdf7" stroke="#f0a01e" strokeOpacity=".45" />
              <circle cx="34" cy="113" r="3.2" fill="#f0a01e" fillOpacity=".7" />
              <text x="46" y="117" fontSize="11" fill="#45434e">老板要的</text>
            </g>
            <g className="st1" style={{ ['--d' as string]: '0.24s' } as React.CSSProperties}>
              <rect x="22" y="136" width="106" height="26" rx="6" fill="#fffdf7" stroke="#f0a01e" strokeOpacity=".45" />
              <circle cx="34" cy="149" r="3.2" fill="#f0a01e" fillOpacity=".7" />
              <text x="46" y="153" fontSize="11" fill="#45434e">数据里的</text>
            </g>
            <g className="st1" style={{ ['--d' as string]: '0.36s' } as React.CSSProperties}>
              <rect x="22" y="172" width="106" height="26" rx="6" fill="#fffdf7" stroke="#f0a01e" strokeOpacity=".45" />
              <circle cx="34" cy="185" r="3.2" fill="#f0a01e" fillOpacity=".7" />
              <text x="46" y="189" fontSize="11" fill="#45434e">我的订单</text>
            </g>

            {/* 箭头 1 */}
            <g className="ar1">
              <path d="M148 130 L177 130" stroke="#16151a" strokeOpacity=".42" strokeWidth="1.5" fill="none" className="flow" />
              <path d="m172 124 6 6-6 6" stroke="#16151a" strokeOpacity=".55" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* ── 设计 ── */}
            <g className="st2">
              <rect x="197" y="60" width="106" height="100" rx="6" fill="#faf9fc" stroke="#8b85d0" strokeOpacity=".5" />
              <rect x="207" y="74" width="86" height="10" rx="3" fill="#16151a" fillOpacity=".18" />
              <rect x="207" y="92" width="50" height="6" rx="3" fill="#16151a" fillOpacity=".1" />
              <rect x="207" y="106" width="86" height="44" rx="3" fill="#fff" stroke="#16151a" strokeOpacity=".22" />
              <rect x="213" y="112" width="22" height="22" rx="4" fill="#8b85d0" fillOpacity=".35" />
              <rect x="240" y="115" width="46" height="3" rx="1.5" fill="#16151a" fillOpacity=".18" />
              <rect x="240" y="123" width="34" height="3" rx="1.5" fill="#16151a" fillOpacity=".12" />
              <rect x="240" y="131" width="40" height="3" rx="1.5" fill="#16151a" fillOpacity=".12" />
              <rect x="207" y="172" width="34" height="14" rx="4" fill="#8b85d0" />
              <text x="224" y="182" fontSize="9" fill="#fff" textAnchor="middle">保存</text>
            </g>

            {/* 箭头 2 */}
            <g className="ar2">
              <path d="M323 130 L352 130" stroke="#16151a" strokeOpacity=".42" strokeWidth="1.5" fill="none" className="flow" />
              <path d="m347 124 6 6-6 6" stroke="#16151a" strokeOpacity=".55" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* ── 实现 ── */}
            <g className="st3">
              <rect x="372" y="60" width="106" height="40" rx="6" fill="#fff" stroke="#16151a" strokeOpacity=".2" />
              <text x="378" y="76" fontSize="9" fill="#16151a" fillOpacity=".55" fontFamily="monospace">{'pipeline.run()'}</text>
              <text x="378" y="90" fontSize="9" fill="#2f7a5a">{'✓ in 0.42s'}</text>
              <rect x="372" y="108" width="106" height="40" rx="6" fill="#fff" stroke="#16151a" strokeOpacity=".2" />
              <text x="378" y="124" fontSize="9" fill="#16151a" fillOpacity=".55" fontFamily="monospace">{'deploy()'}</text>
              <text x="378" y="138" fontSize="9" fill="#2f7a5a">{'✓ live'}</text>
              <rect x="372" y="156" width="106" height="20" rx="6" fill="#16151a" />
              <text x="425" y="170" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="600">已上线</text>
            </g>

            {/* 进度条 */}
            <g className="pin">
              <rect x="15" y="222" width="155" height="2" rx="1" fill="#16151a" fillOpacity=".08" />
              <circle cx="20" cy="223" r="6" fill="#16151a" />
              <text x="20" y="246" fontSize="9.5" fill="#16151a" textAnchor="middle" fontWeight="600">构想</text>
            </g>
          </g>
        </svg>
      </div>
    </section>
  )
}
