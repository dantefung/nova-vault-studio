# markdown-preview.nvim 依赖说明（Vim / Neovim 通用）

生成时间：2026-04-28 05:31:47 UTC

---

## 一、核心依赖（必须）

### 1. Node.js
- 用途：启动本地 HTTP 服务、Markdown 渲染、Mermaid 渲染
- 验证：
```bash
node -v
npm -v
```

---

### 2. npm / npx（用于安装前端依赖）
- 安装命令（推荐）：
```vim
Plug 'iamcco/markdown-preview.nvim', { 'do': 'cd app && npx --yes yarn install' }
```

---

### 3. 浏览器
- 用途：渲染最终页面（Markdown / Mermaid）
- 默认会自动打开系统浏览器

---

### 4. Vim 8+（支持 job/channel）
- 验证：
```vim
:echo has('job')
```

---

## 二、内部前端依赖（自动安装）

执行 `yarn install` 时会安装：

- Markdown 渲染：markdown-it
- 代码高亮：highlight.js
- 图表支持：
  - Mermaid
  - flowchart.js
  - sequence-diagram
- 前端框架：Vue

---

## 三、运行架构

```text
[Vim]
   │
   │ :MarkdownPreview
   ↓
[Node.js 本地服务] (localhost:端口)
   │
   ↓
[浏览器]
   │
   ├─ 渲染 Markdown
   ├─ 执行 Mermaid.js
   └─ 实时刷新
```

说明：
- Mermaid 实际运行在浏览器中，而不是 Vim 内部

---

## 四、常见问题

### 1. Vim 中找不到 Node
```vim
:!node -v
```
如果报错，说明 PATH 没有继承

---

### 2. yarn 不存在
使用：
```bash
npx --yes yarn install
```

---

### 3. 离线 / 公司网络问题
- yarn install 可能失败
- 解决方案：
  - 使用 npm 镜像
  - 或预先准备 node_modules

---

### 4. 端口占用
- 插件会启动本地端口
- 被占用时可能启动失败

---

## 五、Vim 集成配置

### vim-plug

```vim
" 基础安装
Plug 'iamcco/markdown-preview.nvim', { 'do': 'cd app && npx --yes yarn install' }

" 国内镜像（可选，解决 yarn 安装慢的问题）
Plug 'iamcco/markdown-preview.nvim', { 'do': 'cd app && yarn install --registry https://registry.npmmirror.com' }
```

### dein

```toml
[[plugins]]
repo = 'iamcco/markdown-preview.nvim'
hook_add = '''
  " 安装后执行
  let g:markdown_preview_shutdown_config = {}
'''
post_hook = '''
  let g:markdown_preview_open = 'chrome'
'''
```

### 常用配置项

```vim
" 浏览器设置（默认自动选择）
let g:markdown_preview_browser = 'Chrome'

" 映射快捷键
let g:markdown_preview_hotkey = '<leader>mp'

" 是否自动启动（0=手动，1=打开文件时自动）
let g:markdown_preview_auto_start = 0

" 关闭时清理后台进程
let g:markdown_preview_shutdown_config = {
  \ 'cmd': 'pkill -f "markdown-preview"'
  \ }

" 自定义 CSS
let g:markdown_preview_css = '~/path/to/custom.css'

" 对特定文件类型启用（默认已有 markdown）
let g:markdown_preview_filetypes = ['markdown', 'md']
```

### 快捷命令

```vim
:MarkdownPreview    " 启动预览
:MarkdownPreviewStop " 停止预览
```

### 验证安装

```vim
:echo has('job')     " 返回 1 表示支持
:checkhealth markdown_preview   " Neovim 用户用此命令排查问题
```

---

## 六、一句话总结

> markdown-preview.nvim 本质是：Vim + Node.js + 浏览器 的本地 Web 渲染方案

---
