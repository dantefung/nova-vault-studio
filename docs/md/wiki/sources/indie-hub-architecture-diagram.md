---
title: "又一个神级画图Skill开源，再见draw.io！"
date: "2026-07-17"
source: "梦想de星空"
url: "https://mp.weixin.qq.com/s/WtBGpFuCxUfEZd2YjdTXEw"
---

# 又一个神级画图Skill开源，再见draw.io！

之前用 draw.io 的 MCP 画架构图，能用，但样式总感觉差点意思——配色偏老气，布局也不够精致。最近发现一款叫 architecture-diagram-generator 的开源 Skill，跟 Claude 描述一下系统结构，几秒钟就出一张高大上的架构图。

## 简介

architecture-diagram-generator 是一款专为 AI 设计的系统架构图生成 Skill，支持 Cursor、Claude Code、Windsurf 等 AI 编程工具，目前在 GitHub 上已有 6.3k+ star。

**核心特性：**
- **零设计门槛**：仅需描述项目架构，不用懂配色、不用懂布局
- **迭代飞快**：想加组件、调布局、换样式？一句话的事，AI 秒改
- **分享零成本**：输出就是一个 HTML 文件，浏览器打开即看
- **内置导出**：图表自带复制/PNG/PDF 按钮

## 安装

1. 去 release 页面下载压缩包：https://github.com/Cocoon-AI/architecture-diagram-generator/releases
2. 在 Claude Desktop 中选择自定义 → 技能 → 上传技能 → 上传压缩包

## 使用

### 画架构图

通过 `/architecture-diagram` 命令调用，例如：

```
/architecture-diagram 画一张 mall 项目的系统架构图，项目地址：D:\developer\github\mall
```

输出为 HTML 文件，右上角支持复制/PNG/PDF 三种格式导出。

### 画流程图

使用同系列的 `process-flow-diagram-generator` Skill：
https://github.com/Cocoon-AI/process-flow-diagram-generator

通过 `/process-flow-diagram` 命令调用，例如：

```
/process-flow-diagram 根据 mall 项目中生成确认单流程（generateConfirmOrder方法），画一张业务流程图
```

## 总结

搭配同系列的 `process-flow-diagram-generator`，架构图和流程图都能轻松搞定，相比 draw.io 不仅上手门槛更低，出图效果也更现代化。

## 配图

% 图片已移除（原始图片未下载）

% 图片已移除（原始图片未下载）

% 图片已移除（原始图片未下载）

% 图片已移除（原始图片未下载）

% 图片已移除（原始图片未下载）

% 图片已移除（原始图片未下载）

% 图片已移除（原始图片未下载）

% 图片已移除（原始图片未下载）

% 图片已移除（原始图片未下载）

% 图片已移除（原始图片未下载）
