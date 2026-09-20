/**
 * useClaudeCodeNav - 读取由 scripts/build-resource-nav.js 预生成的 Claude Code 资源导航数据。
 */
import claudeCodeNav from '../../generated/claude-code-nav.js'

function walk(items, ctx, out) {
  for (const item of items || []) {
    out.push({ ...item, category: ctx.category, group: ctx.group })
    if (item.children?.length) walk(item.children, ctx, out)
  }
}

export function useClaudeCodeNav() {
  const categories = claudeCodeNav.categories || []

  const flatItems = []
  for (const category of categories) {
    for (const group of category.groups || []) {
      walk(group.items, { category, group }, flatItems)
    }
  }

  return {
    data: claudeCodeNav,
    categories,
    flatItems,
    stats: claudeCodeNav.stats || { categories: categories.length, items: flatItems.length },
  }
}
