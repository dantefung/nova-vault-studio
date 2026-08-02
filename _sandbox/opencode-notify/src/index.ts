import type { TuiPlugin } from "@opencode-ai/plugin/tui"

interface NotifyConfig {
  webhookUrl: string
  titleTemplate?: string
  bodyTemplate?: string
}

function getConfig(): NotifyConfig | undefined {
  const webhookUrl = process.env["OPENCODE_NOTIFY_WEBHOOK"]
  if (!webhookUrl) return
  return {
    webhookUrl,
    titleTemplate: process.env["OPENCODE_NOTIFY_TITLE"],
    bodyTemplate: process.env["OPENCODE_NOTIFY_BODY"],
  }
}

const DEFAULT_TITLE = "{{event}}: {{title}}"
const DEFAULT_BODY = [
  "- **项目**: {{project}}",
  "- **Agent**: {{agent}}",
  "- **会话ID**: `{{sessionId}}`",
  "{{#if error}}- **错误**: {{error}}{{/if}}",
].join("\n")

function render(template: string, vars: Record<string, string>): string {
  let text = template
  for (const [key, val] of Object.entries(vars)) {
    text = text.replaceAll(`{{${key}}}`, val)
  }
  text = text.split("\n").filter((line) => {
    const m = line.match(/\{\{#if (\w+)\}\}(.*)\{\{\/if\}\}/)
    if (!m) return true
    const [, cond, content] = m
    return vars[cond] && vars[cond].length > 0 ? content.trim().length > 0 : false
  }).map((line) => {
    const m = line.match(/\{\{#if (\w+)\}\}(.*)\{\{\/if\}\}/)
    return m ? m[2] : line
  }).join("\n")
  return text
}

function detectPlatform(url: string): "wecom" | "feishu" | "slack" | "discord" | "dingtalk" | "generic" {
  if (url.includes("qyapi.weixin.qq.com")) return "wecom"
  if (url.includes("open.feishu.cn") || url.includes("open.larksuite.com")) return "feishu"
  if (url.includes("hooks.slack.com")) return "slack"
  if (url.includes("discord.com/api/webhooks")) return "discord"
  if (url.includes("oapi.dingtalk.com")) return "dingtalk"
  return "generic"
}

function buildPayload(platform: ReturnType<typeof detectPlatform>, title: string, body: string): object {
  const markdown = `## ${title}\n${body}`
  switch (platform) {
    case "wecom":
      return { msgtype: "markdown", markdown: { content: markdown } }
    case "dingtalk":
      return { msgtype: "markdown", markdown: { title, text: markdown } }
    case "slack":
      return { text: markdown }
    case "discord":
      return { content: markdown }
    case "feishu":
      return {
        msg_type: "interactive",
        card: {
          header: { title: { tag: "plain_text", content: title } },
          elements: [{ tag: "markdown", content: body }],
        },
      }
    default:
      return { text: markdown }
  }
}

async function sendWebhook(url: string, title: string, body: string) {
  const platform = detectPlatform(url)
  const payload = buildPayload(platform, title, body)
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!resp.ok) {
      const text = await resp.text()
      console.error(`[opencode-notify] webhook returned ${resp.status}: ${text.slice(0, 200)}`)
    }
  } catch (err) {
    console.error(`[opencode-notify] webhook error:`, err)
  }
}

function formatSessionId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}\u2026` : id
}

function buildVars(
  sessionID: string,
  session: { title?: string; agent?: string; directory?: string } | undefined,
  error?: string,
): Record<string, string> {
  const dir = session?.directory ?? ""
  return {
    event: error ? "\u2757 会话出错" : "\u2705 会话完成",
    title: session?.title ?? "unknown",
    project: dir.split("/").pop() ?? dir,
    agent: session?.agent ?? "unknown",
    sessionId: formatSessionId(sessionID),
    error: error ?? "",
  }
}

const plugin: TuiPlugin = async (api) => {
  const cfg = getConfig()
  if (!cfg) {
    console.warn("[opencode-notify] OPENCODE_NOTIFY_WEBHOOK not set, plugin disabled")
    return
  }

  api.event.on("session.idle", (event) => {
    const { sessionID } = event.properties
    const session = api.state.session.get(sessionID)
    const vars = buildVars(sessionID, session)
    const title = render(cfg.titleTemplate ?? DEFAULT_TITLE, vars)
    const body = render(cfg.bodyTemplate ?? DEFAULT_BODY, vars)
    sendWebhook(cfg.webhookUrl, title, body)
  })

  api.event.on("session.error", (event) => {
    const { sessionID, error } = event.properties
    if (!sessionID) return
    const session = api.state.session.get(sessionID)
    const errMsg = typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: string }).message)
      : String(error)
    const vars = buildVars(sessionID, session, errMsg)
    const title = render(cfg.titleTemplate ?? DEFAULT_TITLE, vars)
    const body = render(cfg.bodyTemplate ?? DEFAULT_BODY, vars)
    sendWebhook(cfg.webhookUrl, title, body)
  })
}

export { plugin as tui }