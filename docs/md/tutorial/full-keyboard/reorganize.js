#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const docsDir = path.join(baseDir, 'docs');

// 定义类别映射
const categories = {
    'vim': { prefix: '01_vim', count: 18 },
    'vscode': { prefix: '02_vscode', count: 11 },
    'tools': { prefix: '03_tools', count: 9 },
    'chrome': { prefix: '04_chrome', count: 7 },
    'iterm': { prefix: '05_iterm', count: 1 },
    'zsh': { prefix: '06_zsh', count: 3 },
    'macos': { prefix: '07_macos', count: 3 },
    'obsidian': { prefix: '08_obsidian', count: 4 }
};

// 为每个类别创建 index.md 并复制文件
Object.entries(categories).forEach(([catName, catInfo]) => {
    const catDir = path.join(baseDir, catName);
    
    // 确保目录存在
    if (!fs.existsSync(catDir)) {
        fs.mkdirSync(catDir, { recursive: true });
        console.log(`✓ 创建目录: ${catName}/`);
    }
    
    // 创建 index.md
    const indexPath = path.join(catDir, 'index.md');
    if (!fs.existsSync(indexPath)) {
        const categoryTitles = {
            'vim': 'Vim 教程',
            'vscode': 'VSCode 教程',
            'tools': '工具教程',
            'chrome': 'Chrome 教程',
            'iterm': 'iTerm2 教程',
            'zsh': 'Zsh 教程',
            'macos': 'macOS 教程',
            'obsidian': 'Obsidian 教程'
        };
        
        const indexContent = `# ${categoryTitles[catName]}\n\n本章节包含 ${catName} 的完整学习路径。\n`;
        
        fs.writeFileSync(indexPath, indexContent, 'utf8');
        console.log(`✓ 创建 ${catName}/index.md`);
    }
    
    // 复制对应的 markdown 文件
    for (let i = 1; i <= catInfo.count; i++) {
        const paddedNum = String(i).padStart(2, '0');
        const srcFile = path.join(docsDir, `${catInfo.prefix}${paddedNum}.md`);
        const destFile = path.join(catDir, `${catInfo.prefix}${paddedNum}.md`);
        
        if (fs.existsSync(srcFile)) {
            const content = fs.readFileSync(srcFile, 'utf8');
            fs.writeFileSync(destFile, content, 'utf8');
            console.log(`✓ 复制: ${catName}/${catInfo.prefix}${paddedNum}.md`);
        }
    }
});

console.log('\n✨ 文件重新组织完成！');
console.log('\n下一步:');
console.log('1. 验证文件是否正确复制');
console.log('2. 删除 docs/ 目录（如果确认无误）');
console.log('3. 更新 full-keyboard/index.md 中的链接');
