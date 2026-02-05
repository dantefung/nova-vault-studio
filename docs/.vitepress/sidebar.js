
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

function generateSidebar(relativeDir, linkPrefix) {
    const dir = path.join(process.cwd(), relativeDir);
    const markdownFiles = readMarkdownFiles(dir);
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

export { generateSidebar };
