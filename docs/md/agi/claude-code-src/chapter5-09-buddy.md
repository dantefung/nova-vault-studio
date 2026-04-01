Title: Buddy 虚拟伙伴 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/ui/buddy.html

Markdown Content:
`src/buddy/` 实现了一个 ASCII 艺术虚拟宠物系统，feature-gated 在 `BUDDY` 下。

## 概览 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/buddy.html#%E6%A6%82%E8%A7%88)

Buddy 是一个 ASCII 艺术虚拟伙伴，出现在用户输入框旁边。每个用户拥有一个 **确定性生成** 的独特伙伴。

## 稀有度系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/buddy.html#%E7%A8%80%E6%9C%89%E5%BA%A6%E7%B3%BB%E7%BB%9F)

typescript

```
const RARITY_WEIGHTS = {
  common:    60,    // ★
  uncommon:  25,    // ★★
  rare:      10,    // ★★★
  epic:       4,    // ★★★★
  legendary:  1,    // ★★★★★
}
```

## 物种 (18 种) [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/buddy.html#%E7%89%A9%E7%A7%8D-18-%E7%A7%8D)

typescript

```
const SPECIES = [
  'duck', 'goose', 'blob', 'cat', 'dragon',
  'octopus', 'owl', 'penguin', 'turtle', 'snail',
  'ghost', 'axolotl', 'capybara', 'cactus', 'robot',
  'rabbit', 'mushroom', 'chonk',
]
```

## 伙伴结构 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/buddy.html#%E4%BC%99%E4%BC%B4%E7%BB%93%E6%9E%84)

typescript

```
// CompanionBones — 确定性生成（从 userId hash）
type CompanionBones = {
  rarity: Rarity       // 稀有度
  species: Species     // 物种
  eye: string          // 眼睛字符 ('·', '✦', '×', '◉', '@', '°')
  hat: Hat             // 帽子 (none/crown/tophat/propeller/halo/wizard/beanie/tinyduck)
  shiny: boolean       // 闪光变体
  stats: Record<StatName, number>  // 5 个属性值
}

// CompanionSoul — AI 生成（持久化存储）
type CompanionSoul = {
  name: string         // 名字
  personality: string  // 性格描述
}

// 完整的 Companion = Bones + Soul + hatchedAt
```

## 属性系统 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/buddy.html#%E5%B1%9E%E6%80%A7%E7%B3%BB%E7%BB%9F)

typescript

`const STAT_NAMES = ['DEBUGGING', 'PATIENCE', 'CHAOS', 'WISDOM', 'SNARK']`

属性生成规则：

1.   选一个峰值属性
2.   选一个低谷属性
3.   其余随机散开
4.   稀有度提升底线：common: 5, uncommon: 15, rare: 25, epic: 35, legendary: 50

## 精灵动画 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/buddy.html#%E7%B2%BE%E7%81%B5%E5%8A%A8%E7%94%BB)

`sprites.ts` 包含 ASCII 艺术精灵定义，每个物种有 3 帧（休息、躁动、特殊），使用 `{E}` 作为眼睛占位符。

动画时序：

*   `TICK_MS = 500`（每帧 500ms）
*   `IDLE_SEQUENCE`：15 帧循环（休息→躁动→眨眼）

## 语音气泡 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/buddy.html#%E8%AF%AD%E9%9F%B3%E6%B0%94%E6%B3%A1)

typescript

```
// SpeechBubble 组件
type SpeechBubbleProps = {
  text: string          // 气泡内容
  color: keyof Theme    // 颜色主题
  tail: 'right' | 'down'
  fading: boolean       // 淡出动画
}

// 显示时序
const BUBBLE_SHOW = 20    // 显示 20 tick (~10s)
const FADE_WINDOW = 6     // 最后 6 tick 淡出
const PET_BURST_MS = 2500 // 抚摸后心动画 2.5s
```

## 可用时间窗口 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/buddy.html#%E5%8F%AF%E7%94%A8%E6%97%B6%E9%97%B4%E7%AA%97%E5%8F%A3)

*   **外部用户**：仅 2026 年 4 月 1-7 日（预告）
*   **Anthropic 内部用户**：始终可用（`'ant'` build 跳过日期检查）
