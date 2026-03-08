
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function readMarkdownFiles(dir, parentPath = '') {
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir).filter(file => !file.startsWith('index'));
    const markdownFiles = [];
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const relativePath = path.join(parentPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            markdownFiles.push(...readMarkdownFiles(filePath, relativePath));
        } else if (path.extname(file).toLowerCase() === '.md') {
            markdownFiles.push(relativePath);
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
    const content = fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/^#\s+(.*)/m);
    return titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
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
    let markdownFiles = readMarkdownFiles(dir);

    // for tutorial section we only want files inside subdirectories
    if (relativeDir.endsWith('/tutorial')) {
        markdownFiles = markdownFiles.filter(f => f.includes('/'));
    }

    const sidebarConfig = [];

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
            } else {
                let found = false;
                for (let item of currentLevel) {
                    if (item.text === part) {
                        currentLevel = item.items;
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
                    currentLevel.push(newItem);
                    currentLevel = newItem.items;
                }
            }
        });
    });

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
