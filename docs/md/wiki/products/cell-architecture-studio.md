---
title: "Cell Architecture Studio（3D细胞结构交互画廊）"
date: "2026-06-11"
---

# Cell Architecture Studio（3D细胞结构交互画廊）

> Interactive 3D cell architecture gallery built with React and Three.js. 7 种细胞类型，高保真 GLB 模型，细胞器详情面板，对比模式，AI Tutor，Playwright 视觉验证覆盖。

## Key Points

- **7 种标本视图**：植物细胞、白细胞、神经元、上皮细胞、细菌细胞、动物细胞、肌肉细胞
- **高保真 GLB 渲染**：Plant Cell 和 White Blood Cell 原生纹理保留
- **AI Tutor 面板**：学习提示、课程重点、掌握度追踪
- **对比模式**：多标本并排比较

## 技术栈

| 层级 | 工具 |
|------|------|
| App | React 19, TypeScript, Vite |
| 3D | Three.js, React Three Fiber, Drei |
| UI | CSS Modules, Lucide Icons |
| 资源 | GLB 模型，透明 PNG 缩略图，NIH 预览 |
| 验证 | Playwright Core，PNG 像素指标 |

## 标本资源

| 标本 | 资源 |
|------|------|
| Plant Cell | `plant-cell-first001.glb` |
| White Blood Cell | `white-blood-cell-user.glb` |
| Animal Cell | `animal-cell-nih.glb` |
| Neuron | `neuron-nih.glb` |
| Bacteria Wall | `bacteria-wall-nih.glb` |

## 安装与运行

```bash
npm install
npm run dev       # 本地开发
npm run build     # 生产构建
npm run verify    # 视觉验证（桌面/紧凑/移动端截图 + 像素指标检查）
```

## 数据

- **1k Stars** · **224 Forks** · **8 Commits**
- TypeScript 67.8% · CSS 24.2% · JavaScript 7.7%
- MIT License
- Live Demo: cell-architecture-studio-inky.vercel.app

## Sources

- GitHub cclank/cell-architecture-studio (2026-06-06)