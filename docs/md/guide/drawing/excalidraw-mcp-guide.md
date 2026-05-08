---
title: "Excalidraw MCP Integration Guide"
date: "2026-05-08"
source: "GitHub awesome-agent-skills"
url: "https://github.com/libukai/awesome-agent-skills"
---

# Excalidraw MCP Integration Guide

## Overview

This project integrates the Excalidraw MCP server to provide hand-drawn style diagram creation capabilities directly within Claude Code.

## Configuration

The Excalidraw MCP server is configured in `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "excalidraw": {
      "url": "https://mcp.excalidraw.com",
      "description": "Excalidraw MCP server for creating hand-drawn style diagrams with interactive editing"
    }
  }
}
```

## Features

- **Hand-drawn Style**: Creates diagrams with a casual, sketch-like appearance
- **Interactive Editing**: Full-screen browser-based editing interface
- **Real-time Streaming**: Diagrams are rendered as they're created
- **Smooth Camera Control**: Pan and zoom through your diagrams
- **No Installation Required**: Uses remote SSE/HTTP connection

## Usage Examples

### Basic Diagram Creation

```
Create a flowchart showing the user authentication process
```

### Architecture Diagrams

```
Draw a system architecture diagram with:
- Frontend (React)
- API Gateway
- Microservices (Auth, Users, Orders)
- Database (PostgreSQL)
```

### Creative Visualizations

```
Draw a cute cat with a computer
```

## When to Use Excalidraw vs tldraw-helper

| Use Case | Recommended Tool |
|----------|------------------|
| Quick sketches and brainstorming | **Excalidraw MCP** |
| Casual presentations | **Excalidraw MCP** |
| Hand-drawn style diagrams | **Excalidraw MCP** |
| Technical architecture diagrams | **tldraw-helper** |
| Precise, professional diagrams | **tldraw-helper** |
| Complex multi-step workflows | **tldraw-helper** |

## Technical Details

### Connection Type
- **Protocol**: SSE (Server-Sent Events) over HTTPS
- **Endpoint**: `https://mcp.excalidraw.com`
- **Authentication**: None required (public endpoint)

### Advantages of Remote MCP
1. **Zero Setup**: No local installation or build process
2. **Always Updated**: Automatically uses the latest version
3. **Cross-Platform**: Works on any system with internet access
4. **No Dependencies**: No Node.js or package manager required

### Limitations
- Requires internet connection
- Depends on external service availability
- Less control over customization compared to local installation

## Alternative: Local Installation

If you need offline access or want to customize the server, you can install it locally:

```bash
# Clone the repository
git clone https://github.com/excalidraw/excalidraw-mcp.git
cd excalidraw-mcp-app

# Install dependencies and build
pnpm install && pnpm run build

# Update .claude/mcp.json to use local installation
{
  "mcpServers": {
    "excalidraw": {
      "command": "node",
      "args": ["/path/to/excalidraw-mcp-app/dist/index.js", "--stdio"]
    }
  }
}
```

## Troubleshooting

### MCP Server Not Available

If Excalidraw tools don't appear:

1. Check that `.claude/mcp.json` exists and is valid JSON
2. Restart Claude Code to reload MCP configuration
3. Verify internet connection (for remote mode)
4. Check Claude Code logs for MCP connection errors

### Diagrams Not Rendering

1. Ensure you have a stable internet connection
2. Try refreshing the Claude Code interface
3. Check if `https://mcp.excalidraw.com` is accessible in your browser

## Resources

- [Excalidraw MCP GitHub](https://github.com/excalidraw/excalidraw-mcp)
- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [Excalidraw Official Site](https://excalidraw.com/)
