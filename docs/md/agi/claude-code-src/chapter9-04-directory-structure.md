Title: 完整目录结构 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/reference/directory-structure.html

Markdown Content:
## 完整目录结构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/directory-structure.html#%E5%AE%8C%E6%95%B4%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)

Claude Code v2.1.88 源码的完整目录树。

## 顶层结构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/directory-structure.html#%E9%A1%B6%E5%B1%82%E7%BB%93%E6%9E%84)

```
claude-code-2.1.88/
├── src/                  # 主源码
├── vendor/               # 第三方代码 (Native 扩展源码)
├── docs/                 # 文档 (VitePress)
├── package.json
├── tsconfig.json
└── ...
```

## src/ 核心源码 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/directory-structure.html#src-%E6%A0%B8%E5%BF%83%E6%BA%90%E7%A0%81)

```
src/
├── main.tsx              # 主入口
├── ink.ts                # Ink 终端渲染器 (~96 文件 fork)
├── commands.ts           # 命令路由注册
├── context.ts            # 上下文系统
├── cost-tracker.ts       # 成本追踪
├── costHook.ts           # 成本 Hook
├── dialogLaunchers.tsx   # 对话启动器
├── history.ts            # 历史记录
├── interactiveHelpers.tsx# 交互辅助
├── projectOnboardingState.ts    # 项目引导状态
├── query.ts              # 查询执行
├── QueryEngine.ts        # 查询引擎
├── replLauncher.tsx      # REPL 启动器
├── setup.ts              # 初始化设置
├── Task.ts               # 任务基类
├── tasks.ts              # 任务管理
├── Tool.ts               # 工具接口
├── tools.ts              # 工具注册
│
├── assistant/            # 助手会话
│   └── sessionHistory.ts    # 会话历史
│
├── bootstrap/            # 引导
│   └── state.ts              # 初始状态
│
├── bridge/               # Bridge 系统 (31 文件)
│   ├── bridgeMain.ts
│   ├── bridgeApi.ts
│   ├── bridgeConfig.ts
│   ├── bridgeDebug.ts
│   ├── bridgeEnabled.ts
│   ├── bridgeMessaging.ts
│   ├── bridgePermissionCallbacks.ts
│   ├── bridgePointer.ts
│   ├── bridgeStatusUtil.ts
│   ├── bridgeUI.ts
│   ├── capacityWake.ts
│   ├── codeSessionApi.ts
│   ├── createSession.ts
│   ├── debugUtils.ts
│   ├── envLessBridgeConfig.ts
│   ├── flushGate.ts
│   ├── inboundAttachments.ts
│   ├── inboundMessages.ts
│   ├── initReplBridge.ts
│   ├── jwtUtils.ts
│   ├── pollConfig.ts
│   ├── pollConfigDefaults.ts
│   ├── remoteBridgeCore.ts
│   ├── replBridge.ts
│   ├── replBridgeHandle.ts
│   ├── replBridgeTransport.ts
│   ├── sessionIdCompat.ts
│   ├── sessionRunner.ts
│   ├── trustedDevice.ts
│   ├── types.ts
│   └── workSecret.ts
│
├── buddy/                # 伙伴系统 (6 文件)
│   ├── companion.ts
│   ├── CompanionSprite.tsx
│   ├── prompt.ts
│   ├── sprites.ts
│   ├── types.ts
│   └── useBuddyNotification.tsx
│
├── cli/                  # CLI 层
│   ├── exit.ts
│   ├── ndjsonSafeStringify.ts
│   ├── print.ts
│   ├── remoteIO.ts
│   ├── structuredIO.ts
│   ├── update.ts
│   ├── handlers/         # CLI 处理器 (6 文件)
│   └── transports/       # 传输层 (7 文件)
│
├── commands/             # 命令实现 (87+ 子目录)
│   ├── advisor.ts
│   ├── bridge-kick.ts
│   ├── brief.ts
│   ├── commit-push-pr.ts
│   ├── commit.ts
│   ├── init.ts
│   ├── init-verifiers.ts
│   ├── insights.ts
│   ├── install.tsx
│   ├── review.ts
│   ├── security-review.ts
│   ├── statusline.tsx
│   ├── ultraplan.tsx
│   ├── version.ts
│   ├── createMovedToPluginCommand.ts
│   ├── add-dir/
│   ├── agents/
│   ├── autofix-pr/
│   ├── branch/
│   ├── bridge/
│   ├── bughunter/
│   ├── chrome/
│   ├── clear/
│   ├── color/
│   ├── compact/
│   ├── config/
│   ├── context/
│   ├── copy/
│   ├── cost/
│   ├── debug-tool-call/
│   ├── diff/
│   ├── doctor/
│   ├── effort/
│   ├── env/
│   ├── export/
│   ├── fast/
│   ├── heapdump/
│   ├── help/
│   ├── hooks/
│   ├── issue/
│   ├── keybindings/
│   ├── login/
│   ├── logout/
│   ├── mcp/
│   ├── memory/
│   ├── model/
│   ├── output-style/
│   ├── permissions/
│   ├── plugin/
│   ├── pr_comments/
│   ├── remote-env/
│   ├── remote-setup/
│   ├── resume/
│   ├── rewind/
│   ├── session/
│   ├── share/
│   ├── skills/
│   ├── stats/
│   ├── status/
│   ├── stickers/
│   ├── tasks/
│   ├── teleport/
│   ├── theme/
│   ├── upgrade/
│   ├── vim/
│   ├── voice/
│   └── ...
│
├── components/           # React 组件 (389 文件)
├── constants/            # 常量定义 (21 文件)
├── context/              # React Context (9 providers)
├── coordinator/          # 协调器模式 (1 文件)
├── entrypoints/          # 入口点
│   ├── cli.tsx
│   ├── mcp.ts
│   ├── init.ts
│   └── sdk/
├── hooks/                # React Hooks (104 文件)
├── ink/                  # Ink 终端 UI 框架 (~96 文件)
├── keybindings/          # 快捷键系统 (14 文件)
├── memdir/               # 记忆目录 (8 文件)
├── migrations/           # 迁移 (11 文件)
├── moreright/            # 扩展右侧面板
├── native-ts/            # N-API TypeScript 绑定
├── outputStyles/         # 输出样式系统
├── plugins/              # 插件系统 (2 文件)
├── query/                # 查询子系统
├── remote/               # 远程会话 (4 文件)
├── schemas/              # Zod Schema (3+ 文件)
├── screens/              # 全屏界面 (3 文件)
├── server/               # Direct-Connect 服务器 (3 文件)
├── services/             # 后台服务
├── skills/               # 技能系统 (4 + bundled/)
├── state/                # 状态管理
├── tasks/                # 任务系统
├── tools/                # 工具实现 (40+ 工具)
├── types/                # 类型定义
├── upstreamproxy/        # 上游代理
├── utils/                # 工具函数 (300+ 文件)
├── vim/                  # Vim 模式 (5 文件)
└── voice/                # 语音输入
```

## vendor/ 第三方代码 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/directory-structure.html#vendor-%E7%AC%AC%E4%B8%89%E6%96%B9%E4%BB%A3%E7%A0%81)

```
vendor/
├── audio-capture-src/    # 本机音频捕获 (Rust/C++)
├── image-processor-src/  # 图片处理 (N-API)
├── modifiers-napi-src/   # 修改器 N-API 绑定
└── url-handler-src/      # URL 处理器
```

## 文件统计 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/reference/directory-structure.html#%E6%96%87%E4%BB%B6%E7%BB%9F%E8%AE%A1)

| 目录 | 文件数 | 说明 |
| --- | --- | --- |
| `commands/` | 80+ | 用户命令实现 |
| `components/` | 389 | React 组件 |
| `hooks/` | 104 | React Hooks |
| `ink/` | ~96 | 终端 UI 框架 |
| `utils/` | 300+ | 工具函数 |
| `tools/` | 40+ | AI 工具实现 |
| `bridge/` | 31 | Bridge 通信 |
| `constants/` | 21 | 常量定义 |
| `keybindings/` | 14 | 快捷键系统 |
| `migrations/` | 11 | 迁移文件 |
| `memdir/` | 8 | 记忆系统 |
| `vim/` | 5 | Vim 模式 |
| **总计** | **~1500+** |  |
