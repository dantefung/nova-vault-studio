// src/components/pmaker/TopBar.tsx
// 顶栏：sticky 60px + backdrop-filter blur
// Logo + Language Toggle + Creator Profile

export function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a href="#top" className="wordmark">
          <img
            src="/pmaker-assets/logo.png"
            alt="做产品 PMaker"
            className="wordmark__img"
          />
        </a>

        <nav className="topnav" aria-label="主导航">
          <a href="#top">首页</a>
          <a href="#basics">基础</a>
        </nav>

        <div className="lang-toggle" role="group" aria-label="语言切换">
          <a className="lang-toggle__opt" href="#" aria-current="true" lang="zh">中</a>
          <a className="lang-toggle__opt" href="#" lang="en">EN</a>
        </div>

        <details className="creator-profile">
          <summary className="creator-profile__trigger">
            <img
              src="/pmaker-assets/avatar.jpg"
              alt="空格的键盘"
              className="creator-profile__avatar"
            />
            <span className="creator-profile__name">空格的键盘</span>
            <svg className="creator-profile__chevron" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="creator-profile__panel">
            <div className="creator-profile__intro">
              <img src="/pmaker-assets/avatar.jpg" alt="空格的键盘" />
              <span>
                <strong>空格的键盘</strong>
                <small>产品经理 · AI Builder</small>
              </span>
            </div>
            <div className="creator-profile__links">
              <a className="creator-profile__link" href="https://xhslink.com/m/7IKqVTqRKp3" target="_blank" rel="noreferrer">
                <span className="creator-profile__platform-icon">小</span>
                <span className="creator-profile__platform-copy">
                  <strong>小红书</strong>
                  <small>AI 与产品笔记</small>
                </span>
                <span className="creator-profile__arrow">↗</span>
              </a>
              <a className="creator-profile__link" href="https://web.okjike.com/u/695ACB1F-CBA8-4896-B105-4FE7981E4300" target="_blank" rel="noreferrer">
                <span className="creator-profile__platform-icon">即</span>
                <span className="creator-profile__platform-copy">
                  <strong>即刻</strong>
                  <small>日常想法与动态</small>
                </span>
                <span className="creator-profile__arrow">↗</span>
              </a>
              <a className="creator-profile__link" href="https://b23.tv/USChDUV" target="_blank" rel="noreferrer">
                <span className="creator-profile__platform-icon">B</span>
                <span className="creator-profile__platform-copy">
                  <strong>B 站</strong>
                  <small>AI 实践视频</small>
                </span>
                <span className="creator-profile__arrow">↗</span>
              </a>
              <a className="creator-profile__link" href="https://www.zhihu.com/people/wang-xiao-ye-22-95" target="_blank" rel="noreferrer">
                <span className="creator-profile__platform-icon">知</span>
                <span className="creator-profile__platform-copy">
                  <strong>知乎</strong>
                  <small>产品方法与回答</small>
                </span>
                <span className="creator-profile__arrow">↗</span>
              </a>
              <a className="creator-profile__link" href="https://mp.weixin.qq.com/s/SPOH_g4SXSxXA1e3ozBBYQ" target="_blank" rel="noreferrer">
                <span className="creator-profile__platform-icon">公</span>
                <span className="creator-profile__platform-copy">
                  <strong>公众号</strong>
                  <small>空格的键盘</small>
                </span>
                <span className="creator-profile__arrow">↗</span>
              </a>
            </div>
          </div>
        </details>
      </div>
    </header>
  )
}
