---
title: xhs-mcp配置步骤:




项目级别配置文件:
```
.cursor
|____mcp.json
|____rules
| |____code-principle.mdc
| |____project-structure.mdc
```

系统级别配置文件:
C:/Users/Administrator/.cursor/mcp.json


## xhs-mcp配置步骤:

**第一步:**

```
git clone git@github.com:jobsonlook/xhs-mcp.git
cd xhs-mcp
uv sync 
```




> 如果 ssh clone 有问题，也可以用git clone https://github.com/jobsonlook/xhs-mcp.git

**步骤二:**

添加小红书 MCP

```
{
    "mcpServers": {
        "xhs-mcp": {
            "command": "uv",
            "args": [
                "--directory",
                "你clone下来的小红书mcp项目路径",
                "run",
                "main.py"
            ],
            "env": {
                "XHS_COOKIE": "你的小红书cookies"
            }
        }
    }
}

```


mcp.json配置的内容:

```json
{
    "mcpServers": {
        "grep": {
            "url": "https://mcp.grep.app"
        },
        "conetext7": {
            "url": "https://mcp.context7.com/mcp"
        },
        "spec-workflow": {
            "command": "npx",
            "args": [
                "-y",
                "spec-workflow-mcp@latest"
            ]
        },
        "sequential-thinking": {
            "command": "npx",
            "args": [
                "-y",
                "@modelcontextprotocol/server-sequential-thinking"
            ]
        },
        "fetch": {
            "command": "uvx",
            "args": ["mcp-server-fetch"]
        },
        "amap-maps":
        {
            "command": "npx",
            "args":
            [
                "-y",
                "@amap/amap-maps-mcp-server"
            ],
            "env":
            {
                "AMAP_MAPS_API_KEY": "这里这里！！！粘贴您在高德官网上申请的key"
            }
        },
        "metaso": {
            "transport": "http",
            "url": "https://metaso.cn/api/mcp",
            "headers": {
              "Authorization": "Bearer 你的秘钥"
            }
        },
        "jina-mcp-server": {
            "url": "https://mcp.jina.ai/sse",
            "headers": {
                "Authorization": "Bearer 你的秘钥"
            }
        },
        "duckduckgo-mcp-server": {
            "command": "cmd",
            "args": [
                "/c",
                "npx",
                "-y",
                "@smithery/cli@latest",
                "run",
                "@nickclyde/duckduckgo-mcp-server",
                "--key",
                "c885a563-1d3b-4cad-94b9-48e666eadeef"
            ]
        },
        "xhs-mcp": {
            "command": "uv",
            "args": [
                "--directory",
                "你克隆的https://github.com/jobsonlook/xhs-mcp.git的所在目录",
                "run",
                "main.py"
            ],
            "env": {
                "XHS_COOKIE": "你的小红书cookies"
            }
        },
      
    }
}
```

**联网能力:**
- jina-mcp-server
- duckduckgo-mcp-server
- metaso
- exa search
- 

**攻略知识:**
- xhs-mcp
 - 在线服务: https://smithery.ai/server/@123BeginToLove/xhs-mcp
 - 本地安装:  


```
{
    "mcpServers": {
        "grep": {
            "url": "https://mcp.grep.app"
        },
        "conetext7": {
            "url": "https://mcp.context7.com/mcp"
        },
        "spec-workflow": {
            "command": "npx",
            "args": [
                "-y",
                "spec-workflow-mcp@latest"
            ]
        },
        "sequential-thinking": {
            "command": "npx",
            "args": [
                "-y",
                "@modelcontextprotocol/server-sequential-thinking"
            ]
        }
    }
}
```

`https://mcp.grep.app`:
`searchGitHub` - 搜索 GitHub 上的实际使用案例



**context7**

Context7 MCP为您的提示直接提供最新文档和代码示例库。

`https://mcp.context7.com/mcp`: