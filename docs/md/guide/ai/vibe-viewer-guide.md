# vibe-viewer

**`vibe-viewer` 本身是一个工具**它的文档都在 npm 官网上：[https://www.npmjs.com/package/vibe-viewer](https://www.npmjs.com/package/vibe-viewer)

如果你想要一份关于如何使用 `vibe-viewer` 的说明文档，我可以帮你生成一个 Markdown 格式的使用指南：

# Vibe Viewer 使用指南

## 简介
Vibe Viewer 是一个本地 Markdown 预览服务器，支持 Mermaid 图表渲染，无需配置即可使用。

## 安装

### 使用 npx（无需安装，推荐）
```bash
npx -y vibe-viewer
```

### 全局安装
```bash
npm install -g vibe-viewer
```

## 使用方法

### 基本使用
```bash
# 交互式选择目录
npx -y vibe-viewer

# 指定目录启动
npx -y vibe-viewer --dir /path/to/your/docs

# 不自动打开浏览器
npx -y vibe-viewer --no-open
```

### 与 fzf 结合使用
```bash
# 选择目录后预览
vibe-viewer --dir "$(find . -type d | fzf)"

# 选择文件后预览其所在目录
fzf | xargs -I{} vibe-viewer --dir "$(dirname {})"

# 添加为别名（在 .zshrc 或 .bashrc 中）
alias md-preview='fzf --preview "glow {}" --preview-window=right:60% | xargs -I{} vibe-viewer --dir "$(dirname {})"'
```

## 功能特性

- ✅ **Mermaid 支持**：完美渲染 ` ```mermaid ` 代码块为 SVG
- ✅ **实时刷新**：文件修改后自动刷新预览（WebSocket + chokidar）
- ✅ **文件树浏览**：左侧显示目录文件树，方便切换
- ✅ **数学公式**：支持 KaTeX 数学公式渲染
- ✅ **主题配置**：可自定义主题、安全级别等
- ✅ **跨平台**：支持 macOS、Linux、Windows

## 配置选项

```bash
# 查看所有可用选项
npx -y vibe-viewer --help

# 主要选项：
--dir <path>      # 指定要预览的目录
--port <number>   # 指定端口号（默认：3000）
--no-open         # 不自动打开浏览器
--theme <name>    # 指定主题（light/dark）
```

## 注意事项

1. **Mermaid 渲染**：所有图表都会在服务器端转换为 SVG，兼容所有浏览器
2. **文件监控**：修改文件后自动刷新，无需手动刷新页面
3. **首次启动**：会下载必要的依赖，请保持网络通畅

## 常见问题

**Q: 启动后看不到 Mermaid 图表？**  
A: 确保你的 Markdown 中使用的是标准的 ` ```mermaid ` 代码块格式。

**Q: 可以预览其他格式的文件吗？**  
A: 主要针对 .md 文件，其他文件会以文本形式显示。

**Q: 支持中文文件名吗？**  
A: 完全支持 UTF-8 编码，包括中文文件名和内容。

## 相关资源

- [NPM 包地址](https://www.npmjs.com/package/vibe-viewer)
- [Mermaid 官方文档](https://mermaid.js.org/)

