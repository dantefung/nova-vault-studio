/**
 * useResourceNav - 读取由 scripts/build-resource-nav.js 预生成的资源导航数据。
 */
import resourceNav from '../../generated/resource-nav.js'

function walk(items, ctx, out) {
  for (const item of items || []) {
    out.push({ ...item, category: ctx.category, group: ctx.group })
    if (item.children?.length) walk(item.children, ctx, out)
  }
}

export function useResourceNav() {
  const categories = resourceNav.categories || []

  const flatItems = []
  for (const category of categories) {
    for (const group of category.groups || []) {
      walk(group.items, { category, group }, flatItems)
    }
  }

  return {
    data: resourceNav,
    categories,
    flatItems,
    stats: resourceNav.stats || { categories: categories.length, items: flatItems.length },
  }
}
