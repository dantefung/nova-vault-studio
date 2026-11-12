/**
 * VitePress 侧边栏 / 导航（薄包装）
 *
 * 实际逻辑已抽到 scripts/lib/sidebar-core.mjs，由 Astro 侧共用。
 * 原因：侧边栏里有 100+ 条中文目录名映射与排序规则，两边各维护一份必然漂移。
 * 迁移完成后删除 VitePress 侧即可，核心逻辑继续被 Astro 使用。
 */

import {
    generateSidebar,
    generateNavItems,
    generateNavItemsFromFiles,
    generateSidebarMappingForSubdirectories,
    generateBookNavItems
} from '../../scripts/lib/sidebar-core.mjs';

export { generateSidebar, generateNavItems, generateNavItemsFromFiles, generateSidebarMappingForSubdirectories, generateBookNavItems };
