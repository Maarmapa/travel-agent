# MCP Render Integration Setup

## Overview
This integration connects OpenClaw with Render API via MCP (Model Context Protocol).

## Files Added
- `mcp-render.js` — MCP server for Render API
- `openclaw-mcp-config.json` — OpenClaw MCP configuration
- `package.json` — Updated with MCP dependencies

## Installation

1. Install MCP SDK dependency:
```bash
npm install @modelcontextprotocol/sdk
```

2. Add to OpenClaw config (`~/.openclaw/config.yaml`):
```yaml
mcp:
  servers:
    render:
      command: node
      args:
        - mcp-render.js
      env:
        RENDER_API_KEY: rnd_YLcwdhqslGGlWubEt5M24qLhbqre
```

## Available Tools

Via MCP, you now have:
- `get_services` — List all Render services
- `get_service_status` — Check service status
- `get_service_logs` — View service logs
- `deploy_service` — Trigger deployment
- `restart_service` — Restart a service
- `get_environment_variables` — List env vars for a service

## Usage

In OpenClaw or any MCP-compatible client:
```
Use the Render tools to manage services, check logs, deploy, restart, etc.
```

## Environment Variables
Ensure `RENDER_API_KEY` is set in your environment or in the config.

## Testing
```bash
node mcp-render.js
```

This starts the MCP server on stdio. Connect via your MCP client to test.

## Next Steps
1. Commit and push to GitHub
2. Deploy to Render
3. OpenClaw will auto-discover and use the MCP tools
