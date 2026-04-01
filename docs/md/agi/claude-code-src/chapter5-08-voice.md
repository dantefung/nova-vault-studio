Title: 语音模式 | Claude Code 深度技术文档

URL Source: https://plain-sun-1ffe.hunshcn429.workers.dev/ui/voice.html

Markdown Content:
## 语音模式 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/voice.html#%E8%AF%AD%E9%9F%B3%E6%A8%A1%E5%BC%8F)

> **注意**: `src/voice/` 目录实际仅包含 1 个文件 (`voiceModeEnabled.ts`)，为 feature flag 控制文件。下面描述的完整语音状态机、音频捕获管道等功能可能分布在其他目录中（如 `vendor/audio-capture-src/`、`src/context/voice.tsx` 等），或为规划中功能。

## 语音状态机 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/voice.html#%E8%AF%AD%E9%9F%B3%E7%8A%B6%E6%80%81%E6%9C%BA)

typescript

```
// 实际类型是对象类型，非简单字符串联合
export type VoiceState = {
  voiceState: 'idle' | 'recording' | 'processing'
  voiceError: string | null
  voiceInterimTranscript: string
  voiceAudioLevels: number[]
  voiceWarmingUp: boolean
}

// 状态转换
// idle → (按下快捷键) → recording
// recording → (松开快捷键/静音检测) → processing
// processing → (转写完成) → idle
```

## 技术栈 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/voice.html#%E6%8A%80%E6%9C%AF%E6%A0%88)

`麦克风 → 音频捕获(native) → 语音识别 API → 文字 → 输入框`

| 组件 | 说明 |
| --- | --- |
| `vendor/audio-capture-src/` | 原生音频捕获 |
| Whisper API / 其他 | 语音识别 |
| `useVoice()` | React Hook 集成（`src/hooks/useVoice.ts`） |

## 身份验证与可用性 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/voice.html#%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81%E4%B8%8E%E5%8F%AF%E7%94%A8%E6%80%A7)

`src/voice/voiceModeEnabled.ts` 提供基本检查，包括 `hasVoiceAuth()` 函数和 `isVoiceStreamAvailable` 布尔值。

## 快捷键 [​](https://plain-sun-1ffe.hunshcn429.workers.dev/ui/voice.html#%E5%BF%AB%E6%8D%B7%E9%94%AE)

typescript

```
// 语音模式快捷键（feature-gated: VOICE_MODE）
// Space — 按住录音
// 在 Chat 上下文中激活
```
