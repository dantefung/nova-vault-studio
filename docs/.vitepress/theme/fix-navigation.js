/**
 * 修复导航和侧边栏交互问题
 * 在客户端运行时注入修复脚本
 */

export function fixNavigation() {
  if (typeof window === 'undefined') return

  // 等待 DOM 加载完成
  const setupFixes = () => {
    // 修复侧边栏折叠/展开
    document.querySelectorAll('.VPSidebarItem.has-children').forEach(item => {
      const button = item.querySelector('.caret-button, button')
      if (button) {
        button.style.pointerEvents = 'auto'
        button.style.cursor = 'pointer'
      }
    })

    // 修复所有链接
    document.querySelectorAll('a').forEach(link => {
      link.style.pointerEvents = 'auto'
    })

    // 修复所有按钮
    document.querySelectorAll('button').forEach(btn => {
      btn.style.pointerEvents = 'auto'
      btn.style.cursor = 'pointer'
    })

    // 修复下拉菜单
    document.querySelectorAll('.VPFlyout, .VPMenu, .VPNavBarMenuGroup').forEach(menu => {
      menu.style.pointerEvents = 'auto'
    })

    console.log('[Navigation Fix] Applied fixes to interactive elements')
  }

  // 初始修复
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFixes)
  } else {
    setupFixes()
  }

  // 监听路由变化，重新应用修复
  if (window.__VP_HASH_MAP__) {
    const observer = new MutationObserver(() => {
      setupFixes()
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }
}
