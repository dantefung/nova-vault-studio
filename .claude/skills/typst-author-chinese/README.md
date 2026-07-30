# typst-author-chinese

Typst 中文排版 SKILL。This is an agent skill designed for the purpose of authoring documents utilising native Chinese typography. 

## 安装

### Claude Code

```bash
# 方式一：marketplace（推荐）
claude plugin marketplace add gakusyun/typst-author-chinese
claude plugin install typst-author-chinese@typst-author-chinese

# 方式二：手动安装（源码）
git clone https://github.com/Gakusyun/typst-author-chinese.git ~/.claude/plugins/typst-author-chinese
```

重启 Claude Code，skill 将自动激活。

### OpenAI Codex CLI

```bash
git clone https://github.com/Gakusyun/typst-author-chinese.git ~/.codex/skills/typst-author-chinese
```

### 其他平台

本 skill 遵循 [Agent Skills 开放标准](https://agentskills.io/specification)，支持 Claude Code、Codex CLI、Cursor、Kiro、CodeBuddy、OpenClaw 等主流 AI Coding 工具。将本项目克隆到对应平台的 skills 目录即可。

## 功能

- 生成、编辑、调试 Typst（`.typ`）文档
- 中文排版专项支持：字体配置、首行缩进、标点挤压、中英混排
- 内置完整 Typst 参考文档（语法、样式、脚本、数学等）
- 编译验证（需 `typst`）

## 验证命令

```bash
# 编译验证（需要 typst）
typst compile <file.typ>
```

## 项目结构

```
typst-author-chinese/
├── SKILL.md              # skill 入口文件
├── README.md             # 项目说明
├── docs/                 # Typst 官方参考文档（只读）
│   ├── tutorial/         # 教程
│   ├── guides/           # 指南（页面设置、表格等）
│   └── reference/        # API 参考
└── references/           # 中文排版参考（可编辑）
    ├── README.md         # 索引
    ├── font.md           # 字体配置
    ├── font-size.md      # 中文字号规范
    ├── spacing.md        # 行距段距
    ├── margins.md        # 边距配置
    ├── first-line-indent.md
    ├── heading-numbering.md
    ├── underline.md      # 下划线
    ├── table.md
    ├── math.md
    ├── figure.md
    ├── page.md
    ├── list.md
    ├── bibliography.md
    ├── templates.md      # 可套用模板
    ├── docs-index.md     # Typst 官方文档索引
    └── cli/              # Typst CLI 命令参考
        ├── README.md
        ├── compile.md
        ├── watch.md
        ├── init.md
        ├── query.md
        ├── fonts.md
        ├── update.md
        ├── completions.md
        └── info.md
```

## 致谢

本项目基于 [typst-skills](https://github.com/apcamargo/typst-skills) 改编，增加了中文排版适配。
