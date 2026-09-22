
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 侧边栏排除的目录名：页面 URL 仍可访问，只是不出现在侧边栏
// images 是插图目录，误留在里面的 .md 会在侧边栏长出无 link 的死节点
// _quarantine 里的 README.md 是施工说明，不是对外内容
const SIDEBAR_EXCLUDED_DIRS = new Set(['system-design-101', 'images', '_quarantine']);

// 按 link 前缀排除：同一份内容可能被多个扫描根各自的 sidebar 生成（md/columns 整棵树 +
// vibe-coding 专栏各自一份），相对路径在这里不可靠。link 前缀与扫描根无关，且以 / 结尾
// 不会误伤同名前缀的其他目录
// vibe-coding/references 被专栏 index.md 附录标注为「原始文件备份」，内容与上层 37 个
// 文件逐字节重复，同时出现在侧边栏会让读者看到两遍同样的文章
const SIDEBAR_EXCLUDED_LINKS = ['/md/columns/vibe-coding/references/'];

function isSidebarExcludedLink(link) {
    return SIDEBAR_EXCLUDED_LINKS.some(p => link.startsWith(p));
}

// 指定目录下子项的展示顺序（key 为该目录的 link，value 为子目录名顺序）。
// 未列出的子项排在已列出项之后，并保持原有相对顺序。
const SIDEBAR_CHILD_ORDER = {
    '/md/guide/cs/': ['system-internals', 'software-engineering', 'architecture', 'code-reading', 'software-philosophy'],
    '/md/guide/ai/': ['prompt-engineering', 'prompt-hub', 'claude-code', 'skills', 'intelligent-customer-service', 'drawing', 'ai-programming-slides'],
};

// 无 index.md 的目录分组中文名（key 为该分组的 link）。
// 缺省回落成英文目录名，那等于把英文直接暴露在侧边栏里。
// 中文名一律照抄各专栏 index.md 已定义好的栏目名，不自行发明
const SIDEBAR_DIR_LABELS = {
    // indie-hub / 出海工具站实战笔记
    '/md/columns/indie-hub/outsea-tool-station/overview/': '上站总览',
    '/md/columns/indie-hub/outsea-tool-station/demand-mining/': '需求挖掘',
    '/md/columns/indie-hub/outsea-tool-station/launch-process/': '上站流程',
    '/md/columns/indie-hub/outsea-tool-station/ai-coding/': 'AI 编程',
    '/md/columns/indie-hub/outsea-tool-station/mindset/': '认知随笔',
    '/md/columns/indie-hub/telegram-tools/': 'Telegram 工具',
    '/md/columns/indie-hub/wechat-command/': '公众号命令',
    '/md/columns/indie-hub/ai-cross-border-ecommerce-research/': 'AI 跨境电商研究',
    '/md/columns/indie-hub/seo/uiux/': 'UI/UX',
    // indie-hub / PMaker 系列专栏
    '/md/columns/indie-hub/pmaker-series/learn/': 'AI 基础知识',
    '/md/columns/indie-hub/pmaker-series/basics/': '产品基础',
    '/md/columns/indie-hub/pmaker-series/patterns/': '产品实践模式',
    // guide / 提示词工程
    '/md/guide/ai/prompt-engineering/01-01-intro/': '概念入门',
    '/md/guide/ai/prompt-engineering/02-01-methods/': '方法框架',
    '/md/guide/ai/prompt-engineering/03-02-patterns/': '核心模式',
    '/md/guide/ai/prompt-engineering/04-03-output-control/': '输出控制',
    '/md/guide/ai/prompt-engineering/05-04-official-guides/': '官方指南',
    '/md/guide/ai/prompt-engineering/06-05-anti-patterns/': '避坑反模式',
    '/md/guide/ai/prompt-engineering/07-06-case-studies/': '案例研究',
    '/md/guide/ai/prompt-engineering/08-07-resources/': '资源导航',
    // columns / 绘图指南
    '/md/columns/drawing/01-01-intro/': '概念入门',
    '/md/columns/drawing/02-02-svg-drawing/': 'SVG 绘图',
    '/md/columns/drawing/03-03-uml-drawing/': 'UML 绘图',
    '/md/columns/drawing/04-04-ai-image/': 'AI 生图',
    '/md/columns/drawing/05-05-architecture/': '架构图',
    '/md/columns/drawing/06-06-drawio/': 'Drawio',
    '/md/columns/drawing/07-07-tools/': '工具',
    // columns / Java 最佳实践
    '/md/columns/java-best-practices/01-domain-modeling/': '业务建模与领域驱动',
    '/md/columns/java-best-practices/02-architecture-design/': '架构设计与系统设计',
    '/md/columns/java-best-practices/03-clean-code/': '整洁代码与业务编码',
    '/md/columns/java-best-practices/04-reliability/': '可靠性与稳定性',
    '/md/columns/java-best-practices/05-engineering-practice/': '工程实践',
    // columns / Harness Engineering
    '/md/columns/harness-engineering/concepts/': '核心概念',
    '/md/columns/harness-engineering/practice/': '实践指南',
    '/md/columns/harness-engineering/templates/': '模板',
    // columns / Vibe Coding
    '/md/columns/vibe-coding/08-hooks/': 'Hooks 自动化',
    // columns / 日记按年月归档
    '/md/columns/diary/2026/': '2026 年',
    '/md/columns/diary/2026/05/': '5 月',
    // business
    '/md/business/business-models/': '商业模式',
    '/md/business/digital-products/': '数字产品副业',
};

function applySidebarChildOrder(items) {
    for (const item of items) {
        const order = item.link && SIDEBAR_CHILD_ORDER[item.link];
        if (order && Array.isArray(item.items)) {
            const rank = new Map(order.map((name, i) => [name, i]));
            const rankOf = (it) => {
                if (!it.link || !it.link.startsWith(item.link)) return order.length;
                const name = it.link.slice(item.link.length).replace(/\/$/, '');
                return rank.has(name) ? rank.get(name) : order.length;
            };
            item.items.sort((a, b) => rankOf(a) - rankOf(b));
        }
        if (item.items) applySidebarChildOrder(item.items);
    }
}

function readMarkdownFiles(dir, linkPrefix, childPrefix = '') {
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir).filter(file => !file.startsWith('index') && !SIDEBAR_EXCLUDED_DIRS.has(file));
    const markdownFiles = [];
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            const dirLink = `${linkPrefix}${childPrefix}${file}/`;
            if (isSidebarExcludedLink(dirLink)) {
                return;
            }
            markdownFiles.push(...readMarkdownFiles(filePath, linkPrefix, `${childPrefix}${file}/`));
        } else if (path.extname(file).toLowerCase() === '.md') {
            markdownFiles.push(`${childPrefix}${file}`);
        }
    });
    // 文件名自然排序
    markdownFiles.sort((a, b) => {
        const aName = path.basename(a, '.md');
        const bName = path.basename(b, '.md');
        return aName.localeCompare(bName);
    });
    return markdownFiles;
}

function extractTitle(filePath) {
    // 仓库混有 CRLF 文件（微信抓取入库的居多），不归一化会让下方所有正则静默失配
    const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
    // 优先级：frontmatter title > 首个 H1 > 文件名
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
        const titleMatch = fmMatch[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
        if (titleMatch) return titleMatch[1].trim();
    }
    const h1Match = content.match(/^#\s+(.*)/m);
    return h1Match ? h1Match[1] : path.basename(filePath, '.md');
}

function compareByText(a, b) {
    return a.text.localeCompare(b.text, 'zh-Hans-CN');
}

function isMarkdownFile(name) {
    return path.extname(name).toLowerCase() === '.md';
}

function isIndexFile(name) {
    return name.toLowerCase() === 'index.md';
}

function buildDirectorySidebar(dir, linkPrefix, options = {}) {
    if (!fs.existsSync(dir)) return [];

    const {
        includeDirectoryIndexLink = true,
        skipFiles = () => false
    } = options;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const items = [];

    entries
        .filter(entry => entry.isFile() && isMarkdownFile(entry.name) && !skipFiles(entry.name) && !isIndexFile(entry.name))
        .forEach(entry => {
            const filePath = path.join(dir, entry.name);
            const base = entry.name.replace(/\.md$/i, '');
            items.push({
                text: extractTitle(filePath),
                link: `${linkPrefix}${base}`
            });
        });

    entries
        .filter(entry => entry.isDirectory())
        .forEach(entry => {
            const subdirPath = path.join(dir, entry.name);
            const subdirLinkPrefix = `${linkPrefix}${entry.name}/`;
            const indexPath = path.join(subdirPath, 'index.md');
            const childItems = buildDirectorySidebar(subdirPath, subdirLinkPrefix, options);
            const hasIndexPage = fs.existsSync(indexPath);

            if (!hasIndexPage && childItems.length === 0) {
                return;
            }

            const dirItem = {
                text: hasIndexPage ? extractTitle(indexPath) : entry.name,
                collapsed: true,
                items: childItems
            };

            if (includeDirectoryIndexLink && hasIndexPage) {
                dirItem.link = subdirLinkPrefix;
            }

            items.push(dirItem);
        });

    items.sort(compareByText);
    return items;
}

function generateSidebar(relativeDir, linkPrefix) {
    const dir = path.join(process.cwd(), relativeDir);
    let markdownFiles = readMarkdownFiles(dir, linkPrefix);

    // for tutorial section we only want files inside subdirectories
    if (relativeDir.endsWith('/tutorial')) {
        markdownFiles = markdownFiles.filter(f => f.includes('/'));
    }

    const sidebarConfig = [];
    // 目录分组按相对路径建立稳定身份：展示名可能被中文映射或 index.md 标题覆盖，
    // 若靠 text 反查，同目录第二个文件会重复建组
    const groupsByPath = new Map();

    markdownFiles.forEach(file => {
        const filePath = path.join(dir, file).replace(/\\/g, '/');
        const title = extractTitle(filePath);
        const link = linkPrefix + `${file.replace('.md', '').replace(/\\/g, '/')}`;
        file = file.replace(/\\/g, '/');
        const parts = file.split('/');
        let currentLevel = sidebarConfig;

        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                currentLevel.push({
                    text: title,
                    link: link
                });
                return;
            }
            const dirKey = parts.slice(0, index + 1).join('/');
            let group = groupsByPath.get(dirKey);
            if (!group) {
                const dirLink = `${linkPrefix}${dirKey}/`;
                // 有 index.md 的目录留给 addIndexOnlyDirectories 用其中文标题命名，
                // 没有的才会回落到英文目录名，此时才查映射表
                const hasIndex = fs.existsSync(path.join(dir, dirKey, 'index.md'));
                group = {
                    text: hasIndex ? part : (SIDEBAR_DIR_LABELS[dirLink] || part),
                    collapsed: true,
                    items: []
                };
                groupsByPath.set(dirKey, group);
                currentLevel.push(group);
            }
            currentLevel = group.items;
        });
    });

    // 在 sidebar 中递归查找条目（按 text 或 link 匹配）
    function findSidebarItem(level, textOrLink) {
        for (const item of level) {
            if (item.text === textOrLink || item.link === textOrLink) {
                return item;
            }
            if (item.items) {
                const result = findSidebarItem(item.items, textOrLink);
                if (result) return result;
            }
        }
        return null;
    }

    function addIndexOnlyDirectories(currentDir, currentLevel, currentLinkPrefix) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        entries.forEach(entry => {
            if (entry.isDirectory()) {
                const subdirPath = path.join(currentDir, entry.name);
                const subdirLinkPrefix = currentLinkPrefix + entry.name + '/';
                // 这条遍历独立于 readMarkdownFiles，排除规则必须两边都生效，
                // 否则被排除目录下的 index.md 会把分组重新塞回侧边栏
                if (isSidebarExcludedLink(subdirLinkPrefix)) {
                    return;
                }
                const indexPath = path.join(subdirPath, 'index.md');
                // 相对生成 Sidebar 的扫描根，仅用于下方导航到正确的父级
                const relativePath = subdirPath.replace(dir + path.sep, '');

                const hasIndex = fs.existsSync(indexPath);

                if (hasIndex) {
                    // 先递归处理子目录（子目录会在递归中自己导航到正确位置）
                    addIndexOnlyDirectories(subdirPath, currentLevel, subdirLinkPrefix);

                    // 导航到正确的父级
                    const pathParts = relativePath.split(path.sep);
                    let targetLevel = currentLevel;
                    
                    for (let i = 0; i < pathParts.length - 1; i++) {
                        const part = pathParts[i];
                        let found = false;
                        for (const item of targetLevel) {
                            if (item.text === part || (item.link && item.link === currentLinkPrefix + part + '/')) {
                                targetLevel = item.items;
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            const newItem = {
                                text: part,
                                collapsed: true,
                                items: []
                            };
                            targetLevel.push(newItem);
                            targetLevel = newItem.items;
                        }
                    }
                    
                    // 在 targetLevel 中查找已存在的条目
                    const title = extractTitle(indexPath) || entry.name;
                    const linkMatch = subdirLinkPrefix;
                    const linkMatchNoSlash = subdirLinkPrefix.slice(0, -1);
                    
                    let existingItem = targetLevel.find(item => 
                        item.text === title || item.text === entry.name || item.link === linkMatch || item.link === linkMatchNoSlash
                    );
                    if (!existingItem) {
                        existingItem = findSidebarItem(targetLevel, title);
                        if (!existingItem) {
                            existingItem = findSidebarItem(targetLevel, linkMatch);
                            if (!existingItem) {
                                existingItem = findSidebarItem(targetLevel, linkMatchNoSlash);
                            }
                        }
                    }
                    
                    if (existingItem) {
                        existingItem.text = title;
                        if (!existingItem.link) {
                            existingItem.link = linkMatch;
                        }
                    } else {
                        targetLevel.push({
                            text: title,
                            collapsed: true,
                            items: [],
                            link: linkMatch
                        });
                    }
                } else {
                    addIndexOnlyDirectories(subdirPath, currentLevel, subdirLinkPrefix);
                }
            }
        });
    }

    addIndexOnlyDirectories(dir, sidebarConfig, linkPrefix);
    applySidebarChildOrder(sidebarConfig);

    return sidebarConfig;
}

function generateSidebarMappingForSubdirectories(parentRelativeDir, parentLinkPrefix) {
    const dir = path.join(process.cwd(), parentRelativeDir);
    if (!fs.existsSync(dir)) return {};

    const mapping = {};
    const entries = fs.readdirSync(dir);
    entries.forEach(name => {
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) {
            const key = `${parentLinkPrefix}${name}/`;
            const relativeSubDir = path.join(parentRelativeDir, name);
            mapping[key] = generateSidebar(relativeSubDir, key);
        }
    });

    return mapping;
}

function generateNavItems(relativeDir, linkPrefix) {
    const dir = path.join(process.cwd(), relativeDir);
    if (!fs.existsSync(dir)) return [];
    const items = [];
    const entries = fs.readdirSync(dir);
    // only directories correspond to separate tutorials
    entries.forEach(name => {
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) {
            const indexPath = path.join(full, 'index.md');
            let title = name;
            if (fs.existsSync(indexPath)) {
                title = extractTitle(indexPath) || title;
            }
            items.push({ text: title, link: linkPrefix + name + '/' });
        }
    });
    // sort alphabetically by text
    items.sort((a, b) => a.text.localeCompare(b.text));
    return items;
}

function generateNavItemsFromFiles(relativeDir, linkPrefix) {
    const dir = path.join(process.cwd(), relativeDir);
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir).filter(file => {
        return path.extname(file).toLowerCase() === '.md' && !file.toLowerCase().startsWith('index');
    });

    const items = files.map(file => {
        const filePath = path.join(dir, file);
        const title = extractTitle(filePath);
        const name = file.replace(/\.md$/, '');
        return {
            text: title,
            link: linkPrefix + name
        };
    });

    // sort alphabetically by text (supports Chinese sorting)
    items.sort((a, b) => a.text.localeCompare(b.text, 'zh-Hans-CN'));
    return items;
}

function generateBookNavItems(relativeDir, linkPrefix) {
    const dir = path.join(process.cwd(), relativeDir);
    return buildDirectorySidebar(dir, linkPrefix);
}


export { generateSidebar, generateNavItems, generateNavItemsFromFiles, generateSidebarMappingForSubdirectories, generateBookNavItems };
