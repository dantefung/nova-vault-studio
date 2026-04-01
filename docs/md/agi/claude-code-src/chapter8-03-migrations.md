Title: 迁移系统 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/migrations.html

Markdown Content:
## 迁移系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/migrations.html#%E8%BF%81%E7%A7%BB%E7%B3%BB%E7%BB%9F)

`src/migrations/` 包含 **11 个迁移文件**，负责在版本更新时自动升级用户配置。

## 迁移模式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/migrations.html#%E8%BF%81%E7%A7%BB%E6%A8%A1%E5%BC%8F)

所有迁移遵循统一模式：

typescript

```
// 通用迁移模板
async function migrate___() {
  // 1. 检查前置条件（幂等性）
  if (alreadyMigrated()) return

  // 2. 读取当前设置
  const settings = readSettings()

  // 3. 转换设置
  const newSettings = transform(settings)

  // 4. 写入新设置
  writeSettings(newSettings)

  // 5. 记录遥测事件
  logMigrationEvent('migrate___')
}
```

## 迁移清单 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/migrations.html#%E8%BF%81%E7%A7%BB%E6%B8%85%E5%8D%95)

### 配置迁移 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/migrations.html#%E9%85%8D%E7%BD%AE%E8%BF%81%E7%A7%BB)

| 迁移 | 说明 |
| --- | --- |
| `migrateAutoUpdatesToSettings` | `autoUpdates=false` → `DISABLE_AUTOUPDATER` 环境变量 |
| `migrateBypassPermissionsAcceptedToSettings` | 旧配置权限接受 → 新设置格式 |
| `migrateEnableAllProjectMcpServersToSettings` | 旧 MCP 服务器配置 → 新设置格式 |
| `migrateReplBridgeEnabledToRemoteControlAtStartup` | Bridge 配置 → 远程控制设置 |

### 模型迁移 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/migrations.html#%E6%A8%A1%E5%9E%8B%E8%BF%81%E7%A7%BB)

| 迁移 | 变更 | 条件 |
| --- | --- | --- |
| `migrateFennecToOpus` | `fennec-latest` → Opus 别名 | 仅 Anthropic 内部 |
| `migrateLegacyOpusToCurrent` | 旧 Opus 模型字符串 → 当前版本 | - |
| `migrateOpusToOpus1m` | `opus` → `opus[1m]` | - |
| `migrateSonnet1mToSonnet45` | `sonnet[1m]` → 显式 Sonnet 4.5 | - |
| `migrateSonnet45ToSonnet46` | Sonnet 4.5 → `sonnet` 别名 | 仅 Pro/Max/TeamPremium |

### 行为迁移 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/migrations.html#%E8%A1%8C%E4%B8%BA%E8%BF%81%E7%A7%BB)

| 迁移 | 说明 |
| --- | --- |
| `resetAutoModeOptInForDefaultOffer` | 重置自动模式选择加入状态 |
| `resetProToOpusDefault` | Pro 用户默认模型 → Opus |

## 执行时机 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/migrations.html#%E6%89%A7%E8%A1%8C%E6%97%B6%E6%9C%BA)

迁移在应用启动时自动运行：

typescript

```
// main.tsx 启动流程
// 注意：runMigrations 是同步函数，无参数，直接逐个调用
function runMigrations(): void {
  if (getGlobalConfig().migrationVersion !== CURRENT_MIGRATION_VERSION) {
    migrateAutoUpdatesToSettings()
    migrateBypassPermissionsAcceptedToSettings()
    migrateEnableAllProjectMcpServersToSettings()
    migrateFennecToOpus()
    migrateLegacyOpusToCurrent()
    migrateOpusToOpus1m()
    migrateReplBridgeEnabledToRemoteControlAtStartup()
    migrateSonnet1mToSonnet45()
    migrateSonnet45ToSonnet46()
    resetAutoModeOptInForDefaultOffer()
    resetProToOpusDefault()
    // 更新迁移版本号
  }
}
```

## 幂等性保证 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/infrastructure/migrations.html#%E5%B9%82%E7%AD%89%E6%80%A7%E4%BF%9D%E8%AF%81)

每个迁移都是幂等的 — 多次执行不会产生副作用：

typescript

```
// 典型的幂等检查
function migrateAutoUpdatesToSettings() {
  const settings = readSettings()

  // 检查是否已迁移
  if (settings.env?.DISABLE_AUTOUPDATER !== undefined) {
    return  // 已迁移，跳过
  }

  // 检查是否需要迁移
  const legacyConfig = readLegacyConfig()
  if (legacyConfig.autoUpdates !== false) {
    return  // 不需要迁移
  }

  // 执行迁移
  settings.env = settings.env || {}
  settings.env.DISABLE_AUTOUPDATER = 'true'
  writeSettings(settings)
}
```
