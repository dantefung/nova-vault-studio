---
title: "全栈 AI Agent 从 0 到 1：智能播客平台开发全记录"
date: "2026-08-25"
source: "微信公众号（京东科技 蔡欣彤）"
url: "https://mp.weixin.qq.com/s/IGSAgptmQ-ZDurI-pnhdog"
---

# 全栈 AI Agent 从 0 到 1：智能播客平台开发全记录

> 作者：京东科技 蔡欣彤。Smart Podcast Platform 是一个端到端的智能播客制作平台——用户上传一段视频或音频，AI 自动理解内容、设计音色、生成播客，全程无需人工干预。从后端 Python 到前端 Vue 3，从 LangGraph Agent 编排到 pydub 音频处理，完整覆盖了一个 AI 音频应用的方方面面。

<!-- more -->

## 一、引言

传统的 AI 音频工具通常停留在"生成文字脚本"的层面——用户拿到脚本后，还需要自己找配音、做剪辑、调音效，整个流程割裂且低效。这个项目试图把整个链条打通：从内容理解到音色设计，从语音合成到专业混音，全部由 AI Agent 自动完成。

## 二、项目架构总览

### 技术栈一览

| 层级 | 技术选型 | 核心作用 |
|------|----------|----------|
| 前端框架 | Vue 3 + TypeScript + Vite | 流式对话界面与播客管理 |
| UI 组件 | shadcn-vue + Tailwind CSS + ai-elements-vue | 深色主题的现代化交互体验 |
| AI 框架 | LangChain 1.0 + LangGraph 1.0.3 | Agent 编排与多轮对话记忆 |
| 后端服务 | FastAPI 0.104.1 + Uvicorn | REST API + SSE 流式响应 |
| 通信协议 | AG-UI Protocol 0.1.18 | 前后端 Agent 事件标准化通信 |
| 语音引擎 | 阿里云 DashScope (Qwen-TTS) | 音色设计、语音克隆、语音合成 |
| 语音识别 | 阿里云 DashScope (Qwen-ASR) | 高精度语音转文字，支持 ITN 标准化 |
| 多模态模型 | qwen3.5-omni-plus | 图片/视频/音频统一理解 |
| 音频处理 | pydub + FFmpeg | 音频拼接、混音、后期制作 |

## 三、第一阶段：项目初始化与核心框架搭建

### 3.1 前端框架：Vue 3 + TypeScript

Vue 3 使用 Composition API（组合式 API），逻辑聚合度更高，相比 Vue 2 的 Options API 更适合复杂交互场景。TypeScript 提供静态类型检查，在编写阶段就能发现大量潜在的 bug。构建工具 Vite 冷启动极快，HMR（热模块替换）几乎感知不到延迟。

### 3.2 UI 组件：Tailwind CSS + shadcn-vue + ai-elements-vue

- **Tailwind CSS** 采用原子化 CSS 方案，不需要单独维护 CSS 文件，所有样式直接写在类名上
- **shadcn-vue** 基于 Reka UI 的组件库，特点是组件代码直接复制到项目里，完全可定制，而不是黑盒的 npm 包
- **ai-elements-vue** 专门为 AI 对话场景设计，用到：
  - `Conversation` / `ConversationContent`：对话容器，自动处理滚动
  - `Message` / `MessageContent` / `MessageResponse`：消息气泡，支持 Markdown 渲染
  - `PromptInput` / `PromptInputTextarea`：输入框，内置提交状态管理
  - `ConversationScrollButton`：自动吸底滚动按钮

这些组件省去了几乎所有 AI 对话 UI 的基础建设，可以专注于业务逻辑。

### 3.3 后端框架：FastAPI

FastAPI 是 Python 生态中性能优秀的异步 Web 框架，基于 ASGI 标准，天然支持流式响应。

```python
# main.py 入口：注册路由 + 挂载静态文件
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(resources.router, prefix="/resources", tags=["resources"])
app.mount("/storage", StaticFiles(directory=storage_path), name="storage")

# routers/chat.py 聊天接口：直接返回 StreamingResponse
@router.post("/chat")
async def chat_normal(request: Request, chat_request: ChatRequest):
    accept_header = request.headers.get("accept", "text/event-stream")
    encoder = EventEncoder(accept=accept_header)
    return StreamingResponse(
        process_agent_stream(chat_request.message, chat_request.thread_id, encoder),
        media_type=encoder.get_content_type(),
    )
```

### 3.4 AI Agent 核心：LangChain 1.0 + LangGraph

#### LangChain 1.0 全新 API

项目使用的是 LangChain 1.0.0，这个版本相比旧版有较大 API 变动。核心变化是 Agent 创建方式统一为 `create_agent`，工具注册更加简洁。

#### LLM 工厂模式

LLM 实例的创建单独抽成一个工厂函数，而不是在 Agent 里直接 hard-code。好处是以后切换模型只需要改环境变量：

```python
# app/llm/factory.py
def create_llm(temperature: float = 0.7, max_tokens=None, **kwargs) -> ChatOpenAI:
    openai_api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_API_BASE")
    model_name = os.getenv("MODEL_NAME", "deepseek-chat")
    return ChatOpenAI(
        model=model_name,
        api_key=openai_api_key,
        base_url=base_url,
        temperature=temperature,
        max_tokens=max_tokens,
        **kwargs
    )
```

#### Prompt 模块抽离

系统提示词单独放在 `services/prompt.py` 里，支持动态注入工具列表描述：

```python
# agent_service.py — 动态生成工具列表，注入 Prompt
tool_descriptions = []
for tool in tools:
    description = getattr(tool, 'description', None)
    tool_descriptions.append(f"- {tool.name}: {description}")
full_prompt = get_full_prompt("\n".join(tool_descriptions))
```

#### Agent 创建与工具注册

```python
def create_multimodal_agent():
    model = create_llm(temperature=0.7)
    tools = [
        qwen_voice_design_tool,    # 工具1：文字描述生成定制语音
        qwen_voice_cloning_tool,    # 工具2：音色复刻 + 语音合成
    ]
    agent = create_agent(
        name="tts_agent",
        model=model,
        tools=tools,
        system_prompt=full_prompt,
        checkpointer=InMemorySaver(),  # 多轮对话记忆，按 thread_id 隔离
    )
    return agent
```

#### LangGraph 的多轮记忆机制

LangGraph 的 `InMemorySaver` 会按 `thread_id` 保存每次对话的完整消息历史。每次用户发新消息，只需要传入当前这条，LangGraph 会自动从 checkpoint 中恢复上下文。

```python
async def process_agent_stream(message: str, thread_id: str = "default", encoder=None):
    processor = StreamProcessor(thread_id, encoder=encoder)
    messages = [HumanMessage(content=message)]  # 只传当前消息
    async for event in processor.process_stream(agent, messages):
        yield event
```

这样前端不需要维护对话历史、不需要每次把全量历史发给后端，后端按 `thread_id` 自动恢复，接口保持简洁。

### 3.5 流式通信：SSE + AG-UI 协议

#### 为什么用 SSE 而不是 WebSocket

SSE（Server-Sent Events）是单向的服务器推送，基于普通 HTTP 连接，比 WebSocket 轻量得多。对于 AI 对话这种"用户发一条，AI 持续回复"的场景，SSE 完全够用，而且不需要额外的握手和连接管理。

#### AG-UI 协议

AG-UI 是一套专门为 AI Agent 与前端通信设计的事件规范：

| 事件类型 | 含义 |
|----------|------|
| `RUN_STARTED` | Agent 开始运行 |
| `TEXT_MESSAGE_START` | 文本消息开始 |
| `TEXT_MESSAGE_CONTENT` | 文本增量内容（流式输出） |
| `TEXT_MESSAGE_END` | 文本消息结束 |
| `TOOL_CALL_START` | 开始调用工具 |
| `TOOL_CALL_ARGS` | 工具调用参数 |
| `TOOL_CALL_END` | 工具调用结束 |
| `TOOL_CALL_RESULT` | 工具调用结果（含音频 URL） |
| `RUN_FINISHED` | Agent 运行完成 |

`StreamProcessor` 类把 SSE 事件的编码和分发封装好，和 Agent 逻辑完全解耦。

## 四、第二阶段：播客后期制作能力

### 4.1 音频混音工具模块

新增 `backend/app/tools/audio_mixing.py`，提供三个核心音频处理工具：

#### 音频拼接工具（`concatenate_audio`）

将多个音频片段按顺序拼接成完整对话，适用于播客场景：

- 支持交叉淡入淡出过渡（crossfade），使音频过渡更自然
- 可配置音频片段之间的静音时长（默认 1200 ms，播客推荐 1000-1500 ms）
- 自动生成带时间戳的唯一文件名
- 自动记录到音频索引系统

#### 智能 BGM 选择工具（`select_background_music`）

根据场景描述智能匹配合适的背景音乐：

- 基于文件名的语义匹配（BGM 文件名即场景描述）
- 自动循环播放或裁剪以匹配目标时长
- 支持直接指定 BGM 文件路径
- 自动添加淡出效果

#### 音频混音工具（`mix_audio_with_bgm`）

将人声对话与背景音乐混合，生成专业的播客成品：

- 前 N 秒（默认 3 秒）：BGM 原音量播放
- 过渡阶段：音量渐变至背景音量
- 后续阶段：BGM 降低至约 5% 音量作为背景
- 音量归一化处理，确保音质一致性
- 支持自定义 BGM 音量（推荐 -24 到 -28 dB）

```
BGM 音量变化：
原音量 ───────────┐
                  │ \
                  │  \  过渡时段（2秒）
                  │   \
背景音量 ─────────┘    └────────── 背景音量 ↑
    开场时段（3秒）
```

### 4.2 音频资源管理 API

新增 `backend/app/routers/resources.py`，提供音频资源的 RESTful API。

## 五、第三阶段：多模态识别与储存架构升级

### 5.1 音频/视频文件储存路径重构

原先音频文件统一保存在 `storage/audios/` 目录下，现在改为保存到临时目录 `storage/temp/`，实现临时文件与永久文件的分离管理。

新增 `save_media_to_temp()` 函数，支持三种输入类型：

```python
def save_media_to_temp(media_data, filename: str) -> str:
    """将音频/视频文件保存到临时目录"""
    temp_dir = STORAGE_DIR / "temp"
    temp_dir.mkdir(parents=True, exist_ok=True)
    file_path = temp_dir / filename
    if isinstance(media_data, str):
        file_data = base64.b64decode(media_data)
        file_path.write_bytes(file_data)
    elif isinstance(media_data, bytes):
        file_path.write_bytes(media_data)
    else:
        file_format = filename.split('.')[-1]
        media_data.export(str(file_path), format=file_format)
    return f"storage/temp/{filename}"
```

设计思路：音色设计、声音克隆等工具生成的中间产物统一放在 `storage/temp/`，当用户确认满意后再通过 `save_voice` 工具将音色永久迁移到 `storage/audios/`。

### 5.2 定时临时文件清理任务

新增定时清理机制，自动清除 `storage/temp/` 目录下超过指定时间的过期文件：

- 默认保留时间 10 分钟，可灵活配置
- 递归清理所有子目录，并自动移除空目录
- 返回详细统计信息（文件数、删除数、释放空间）
- 提供 `schedule_cleanup_task()` 函数，方便接入 APScheduler

### 5.3 音色保存工具

新增 `save_voice` 工具，将用户满意的定制音色从临时目录永久保存到 `storage/audios/`，并记录到 `voice_index.json` 索引文件。

设计亮点：

- 支持两种输入方式：临时文件路径（直接复制）和 base64 编码数据（解码保存）
- 自动生成唯一文件名，包含时间戳、UUID、音色 ID 和文本片段
- 使用文件锁（`fcntl.flock`）保证索引文件并发写入安全
- 工作流衔接：音色设计 → 临时保存 → 用户确认 → 永久保存

### 5.4 语音识别工具（ASR）

集成阿里云 DashScope `qwen3-asr-flash` 模型，提供高精度语音识别能力：

- 多格式支持：MP3、WAV、OGG、FLAC、M4A、AAC 等
- ITN 逆文本标准化：自动将口语化表达转为书面形式（如"二零二五年" → "2025 年"）
- 智能来源解析：支持本地路径和网络 URL，本地文件自动转为 base64 data URI
- MIME 类型自动推断

### 5.5 多模态识别工具

集成阿里云 DashScope `qwen3.5-omni-plus` 模型，支持图片、视频、音频的统一多模态理解。

| 工具名 | 功能 | 适用场景 |
|--------|------|----------|
| `qwen_multimodal_tool` | 单媒体多模态识别 | 分析单张图片 / 单个视频 / 单段音频 |
| `qwen_combined_multimodal_tool` | 组合多模态识别 | 同时分析多个媒体（如图片+音频组合） |

大视频智能分割：当视频文件超过 21 MB 时，自动使用 moviepy 分割为多个片段分别处理（每段 10 MB）。

额外能力：支持流式输出（`stream=True`），支持音频输出模态（`enable_audio_output`）。

### 5.6 提示词优化

对播客 Agent 的系统提示词进行了全面精炼和增强：

- **结构重组**：将原本杂乱的提示词拆分为清晰的模块化结构——核心能力定位、工作方式、工具调用规则、沟通规范、上下文理解、执行流程
- **新增音视频识别内容**：明确区分语音识别和多模态理解的使用场景
- **工具使用策略表格化**：用清晰的映射关系说明各工具职责，降低 LLM 误调用概率
- **音色保存流程标准化**：明确"设计 → 临时保存 → 用户确认 → 永久保存"四步流程
- **避免重复调用**：强调"对于简单请求，调用一次工具后立即结束回复"

音视频转播客工作流：

1. 内容识别：调用 `qwen_multimodal_tool` 或 `qwen_asr_tool` 识别音视频中的内容
2. 脚本整理：基于识别出的内容，整理为播客脚本
3. 播客制作：按照工作流步骤继续执行，完成播客制作

### 5.7 架构总结

```
用户上传音视频
    │
    ▼
┌─────────────────────────┐
│   内容识别层             │
│  ├─ qwen_asr_tool       │  语音→文字
│  └─ qwen_multimodal     │  音视频→理解
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   Agent 编排层           │
│  ├─ 播客脚本生成         │
│  ├─ 音色设计             │
│  └─ 语音合成             │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   音频后期层             │
│  ├─ 音频拼接             │
│  ├─ BGM 选择             │
│  └─ 音频混音             │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   存储管理层             │
│  ├─ 临时目录             │
│  ├─ 永久目录             │
│  └─ 定时清理             │
└─────────────────────────┘
```

## 六、第四阶段：配置管理，资源管理与工程实践总结

### 6.1 配置管理：多层级优先级策略

配置文件 > 环境变量 > 默认值的三级配置优先级：

```python
def get_config_value(key: str, env_key: str, default: str = "") -> str:
    # 1. 先读 config.json（前端可视化配置）
    config = load_config()
    value = config.get("llm", {}).get("openai_api_key")
    # 2. 再读环境变量
    if not value:
        value = os.getenv("OPENAI_API_KEY")
    # 3. 最后用默认值
    return value or default
```

设计意图：用户可以通过前端界面（VisualConfig.vue）直接修改配置，无需手动编辑 `.env` 文件。配置自动持久化到 `storage/config.json`，降低使用门槛。

### 6.2 音频索引系统：轻量级的资源管理

项目没有引入数据库，而是用 JSON 文件实现了轻量级的音频资源索引：

- `voice_index.json`：记录所有音色文件的路径、ID、模型名称
- `audio_index.json`：记录所有音频文件的元数据
- 文件锁（`fcntl.flock`）保证并发写入安全

---

## 文章速查

| 项目 | 内容 |
|------|------|
| **作者** | 京东科技 蔡欣彤 |
| **定位** | 个人独立开发的全栈 AI 智能播客平台 |
| **核心能力** | 音视频上传 → 多模态理解 → 音色设计 → TTS 合成 → 音频后期 → 播客成品 |
| **全栈技术** | Vue 3 + TypeScript + FastAPI + LangGraph + AG-UI + pydub |
| **模型依赖** | qwen3.5-omni-plus（多模态）+ Qwen-ASR + Qwen-TTS（阿里云 DashScope） |
| **关键设计** | LLM 工厂模式、动态 Prompt 注入、SSE 流式通信、临时/永久存储分离、多层级配置 |
| **四阶段演进** | 框架搭建 → 音频后期 → 多模态识别+存储升级 → 配置与工程管理 |