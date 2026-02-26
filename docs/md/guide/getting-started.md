# 开始使用

欢迎使用 **System Vault**。 这是一个基于 VitePress 的系统知识库框架。

### 目录结构

- `docs/.vitepress`: 核心配置
- `docs/md`: 文档存放根目录
  - `guide`: 指南文档
  - `reference`: 参考文档

### 如何添加新文档

只需在 `docs/md/guide` 或 `docs/md/reference` 目录下创建 `.md` 文件，侧边栏会自动更新。

### 本地开发

```bash
npm install
npm run dev
```

### 搜索功能

页面右上角有内置搜索框，输入关键字即可在整个站点内进行全文索引查询。无需额外配置，构建时会自动生成索引。
