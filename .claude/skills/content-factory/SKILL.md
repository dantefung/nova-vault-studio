---
name: content-factory
description: "Build and operate a personal content factory from local materials. Use when user says 'content factory', '素材库', '选题装配', '五类清洗', '主题地图', '内容流水线', '快速组合内容', or wants to build a local-source → categorized → templated → topic-assembled content pipeline. Trigger: content factory, source-to-content pipeline, local material → wiki content, topic assembly."
---

# Content Factory — 本地素材到选题装配的完整流水线

把本地素材变成可快速选题装配的知识库，实现六步闭环：

```
收集本地素材 → 五类清洗 → 标准化模板 → 主题地图 → 关系图谱 → 选题装配
```

---

## 何时使用

- 用户说"内容工厂"、"选题装配"、"素材库"、"快速组合内容"
- 用户有一堆本地文档/笔记，想从中快速提炼选题写文章
- 用户需要把散乱素材变成结构化、可复用的内容资产
- 触发词：`content-factory`、`素材工厂`、`选题`、`五类`、`主题地图`

---

## 核心概念

### 五类内容分类

| 类别 | 英文 | 说明 | 模板特征 |
|------|------|------|----------|
| 案例 | Case | 真实发生的事件/项目/产品 | 时间线 + 结果 + 关键动作 |
| 方案 | Solution | 解决问题的完整方法论 | 问题 → 方案 → 步骤 → 效果 |
| 概念 | Concept | 定义、理论、框架 | 一句话定义 + 3-5 关键点 + 细节 |
| 观点 | Opinion | 有立场的判断、评论、洞察 | 论点 + 论据 + 反方/支持 |
| 问题 | Problem | 待解决的问题、痛点、需求 | 描述 + 根因 + 约束条件 |

### 主题地图（Topic Map）

每个主题节点含：
- **名称**（topic name）
- **类型**（案例/方案/概念/观点/问题）
- **标签**（1-3 个分类标签）
- **核心摘要**（一句话）
- **关联主题**（哪些主题与它相关）

主题地图存储在 `topic-map.json`，供选题时查询。

---

## 目录结构

```
content-factory/
├── README.md                  # 本工厂说明
├── pipeline.md                # 六步流水线说明（本文档摘要）
├── raw/                       # 原始素材（不可变）
│   └── sources/              # 散乱原始文件（md/txt/pdf/截图）
├── cleaned/                  # 清洗后内容（五类分类）
│   ├── cases/
│   ├── solutions/
│   ├── concepts/
│   ├── opinions/
│   └── problems/
├── templates/                 # 标准化模板（五类 × 使用场景）
├── topic-map.json            # 主题地图（节点 + 关系）
├── graph.json                # 关系图谱（交叉引用）
├── assembly/                  # 选题装配输出
│   └── drafts/               # 草稿
├── index.md                   # 内容目录（所有主题索引）
└── log.md                    # 操作日志
```

---

## 六步流水线

### Step 1：收集本地素材

扫描指定目录，收集原始文件到 `raw/sources/`：

```bash
# 用户指定目录或文件
python3 scripts/scan-sources.py "/path/to/materials" --dest content-factory/raw/sources/
```

支持格式：`md`, `txt`, `pdf`, `docx`, `md`（剪藏内容）

**扫描结果**：列出所有文件清单 + 每文件 3 句话摘要 + 类型猜测。

---

### Step 2：五类清洗

读取 `raw/sources/` 中每个文件，分类到 `cleaned/` 对应目录：

**分类规则**：
- 有明确时间线 + 结果 → **案例**
- 有问题 + 解法 + 步骤 → **方案**
- 有定义/术语/理论框架 → **概念**
- 有立场 + 论点 → **观点**
- 有痛点/需求/未解问题 → **问题**
- 混合内容 → 拆分为多个单元，各自归类

**每条内容写入**：
- `cleaned/{category}/{slug}.md`
- frontmatter 含：`title`, `date`, `source_file`, `category`, `tags`, `summary`

---

### Step 3：标准化模板

每个清洗后的内容应用标准化模板，确保格式一致。

**模板规范**（见 `references/templates.md`）：

```
案例模板：时间线 → 背景 → 关键动作 → 结果 → 启示
方案模板：问题定义 → 解决思路 → 具体步骤 → 效果 → 适用范围
概念模板：定义 → 核心要素 → 场景 → 关联概念 → 常见误区
观点模板：核心论点 → 论据 → 反方/支持 → 适用边界
问题模板：问题描述 → 根因分析 → 约束条件 → 已有解法 → 开放问题
```

---

### Step 4：构建主题地图

从所有清洗后内容提取主题节点，构建 `topic-map.json`：

```json
{
  "topics": [
    {
      "id": "case-alibaba-cloud",
      "title": "阿里云降本案例",
      "category": "case",
      "tags": ["云计算", "降本增效", "企业IT"],
      "summary": "通过架构优化实现 40% 成本下降的完整过程",
      "related": ["solution-k8s-cost", "concept-finops"]
    }
  ],
  "tags": {
    "云计算": ["case-alibaba-cloud", "case-aws-saving"],
    "降本增效": ["case-alibaba-cloud", "solution-finops"]
  }
}
```

**提取规则**：
- 每个清洗文件生成一个 topic 节点
- 标签从内容中提取 1-3 个
- 关联主题：同标签 / 同领域 / 互引用的内容

---

### Step 5：形成关系图谱

在主题地图基础上，建立交叉引用关系 `graph.json`：

```json
{
  "nodes": ["topic-id-1", "topic-id-2"],
  "edges": [
    {"from": "topic-a", "to": "topic-b", "reason": "同标签'云计算'", "weight": 0.8},
    {"from": "topic-a", "to": "topic-c", "reason": "案例引用了方案", "weight": 0.9}
  ]
}
```

**边权重规则**：
| 关联类型 | 权重 |
|----------|------|
| 同一清洗文件生成 | 1.0 |
| 同标签 | 0.8 |
| A 明确引用 B | 0.9 |
| 同一主题大类 | 0.5 |

---

### Step 6：选题装配

用户给定一个**选题方向**，系统快速组合内容：

**输入**：选题（如"帮我写一篇关于中小企业上云的文章"）

**查询流程**：
1. 读取 `topic-map.json`，匹配标签 + 类型
2. 按相关性排序，取 Top-N 节点
3. 读取对应 `cleaned/` 内容
4. 按模板拼接成文章大纲
5. 输出草稿到 `assembly/drafts/{timestamp}-{topic}.md`

**输出草稿结构**：
```markdown
---
title: "中小企业上云避坑指南"
assembly-date: "2026-06-04"
sources: [case-alibaba-cloud, solution-k8s-cost, concept-finops]
---

# 中小企业上云避坑指南

## 引言
（综合相关案例的一句话引入）

## 主体
（按方案模板展开各个要点，每个要点附相关案例）

## 结论
（综合观点模板，给出行动建议）
```

---

## 文件命名规范

| 内容类型 | 命名格式 |
|----------|----------|
| 清洗后内容 | `{category}-{slug}.md`，如 `case-alibaba-cost-optimization.md` |
| 模板 | `template-{category}-{scenario}.md` |
| 草稿 | `draft-{topic}-{date}.md` |

---

## 操作命令

| 操作 | 命令 |
|------|------|
| 扫描素材 | `python3 scripts/scan-sources.py <dir>` |
| 批量清洗 | `python3 scripts/clean-all.py` |
| 更新主题地图 | `python3 scripts/build-topic-map.py` |
| 构建关系图谱 | `python3 scripts/build-graph.py` |
| 选题装配 | `python3 scripts/assemble.py "<选题描述>"` |
| 快速全流程 | `python3 scripts/run-pipeline.py <dir>` |

---

## 质量规则

- **原始素材只读**：清洗后的内容从不覆盖原始文件
- **五类必填**：每条内容必须归入五类之一，不存在"杂项"
- **标签精准**：每个 topic 的标签不超过 3 个，避免标签爆炸
- **图谱实时更新**：每次新清洗内容后自动刷新 `topic-map.json` 和 `graph.json`
- **草稿必留痕**：装配草稿保存原始节点引用，便于核查