/**
 * 导航菜单交互修复脚本 - 增强版
 * 解决知识库菜单无响应问题
 */

export function fixNavigation() {
  if (typeof window === 'undefined') return

  console.log('[Navigation Fix] Initializing enhanced navigation fixes...')

  // 修复函数
  const applyFixes = () => {
    // 1. 修复所有导航相关元素的 pointer-events
    const navSelectors = [
      '.VPNav',
      '.VPNavBar',
      '.VPNavBarMenu',
      '.VPNavBarMenuGroup',
      '.VPFlyout',
      '.VPMenu',
      '.VPMenuLink',
      '.VPMenuGroup',
      'a',
      'button'
    ]

    navSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.pointerEvents = 'auto'
        if (el.tagName === 'A' || el.tagName === 'BUTTON') {
          el.style.cursor = 'pointer'
        }
      })
    })

    // 2. 特别处理 Wiki 菜单的 z-index
    document.querySelectorAll('.VPFlyout').forEach(flyout => {
      flyout.style.position = 'relative'
      flyout.style.zIndex = '100'
      
      const menu = flyout.querySelector('.VPMenu')
      if (menu) {
        menu.style.position = 'absolute'
        menu.style.zIndex = '200'
        menu.style.pointerEvents = 'auto'
      }
    })

    // 3. 修复下拉菜单的显示逻辑
    document.querySelectorAll('.VPNavBarMenuGroup').forEach(group => {
      const button = group.querySelector('button')
      const menu = group.querySelector('.VPMenu')
      
      if (button && menu) {
        // 确保菜单初始隐藏
        if (!menu.style.display || menu.style.display === 'none') {
          menu.style.display = 'none'
        }
        
        // 添加悬停和点击事件
        const showMenu = () => {
          menu.style.display = 'block'
          menu.style.pointerEvents = 'auto'
          menu.style.visibility = 'visible'
          menu.style.opacity = '1'
        }
        
        const hideMenu = () => {
          menu.style.display = 'none'
        }
        
        // 鼠标悬停显示
        button.addEventListener('mouseenter', showMenu)
        group.addEventListener('mouseleave', hideMenu)
        
        // 点击切换
        button.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          if (menu.style.display === 'none') {
            showMenu()
          } else {
            hideMenu()
          }
        })
      }
    })

    // 4. 确保落地页不干扰导航
    const landingNav = document.querySelector('.vp-landing .landing-nav')
    if (landingNav) {
      landingNav.style.zIndex = '40'
    }

    const styleSwitcher = document.querySelector('.vp-landing .style-switcher')
    if (styleSwitcher) {
      styleSwitcher.style.zIndex = '1'
    }

    console.log('[Navigation Fix] Fixes applied successfully')
  }

  // 5. 初始化时应用修复
  const initialize = () => {
    applyFixes()
    
    // 监听 DOM 变化，重新应用修复
    const observer = new MutationObserver((mutations) => {
      let shouldReapply = false
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && (
              node.classList?.contains('VPNav') ||
              node.classList?.contains('VPMenu') ||
              node.querySelector?.('.VPNav, .VPMenu')
            )) {
              shouldReapply = true
            }
          })
        }
      })
      
      if (shouldReapply) {
        setTimeout(applyFixes, 100)
      }
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // 监听路由变化
    if (window.__VP_HASH_MAP__) {
      window.addEventListener('hashchange', () => {
        setTimeout(applyFixes, 200)
      })
    }
  }

  // 6. 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize)
  } else {
    initialize()
  }

  // 7. 额外的延迟修复（防止异步加载的组件）
  setTimeout(applyFixes, 500)
  setTimeout(applyFixes, 1000)
  setTimeout(applyFixes, 2000)
}
