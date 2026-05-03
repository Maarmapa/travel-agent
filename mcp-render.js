#!/usr/bin/env node

/**
 * MCP Render Server
 * Integrates with Render API for deployment control, logs, and monitoring
 */

const http = require('http');
const https = require('https');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');
const { Server } = require('@modelcontextprotocol/sdk/server/index');
const { CallToolRequestSchema, TextContent, Tool } = require('@modelcontextprotocol/sdk/types');

const RENDER_API_KEY = process.env.RENDER_API_KEY || 'rnd_YLcwdhqslGGlWubEt5M24qLhbqre';
const RENDER_API_BASE = 'https://api.render.com/v1';

class RenderMCPServer {
  constructor() {
    this.server = new Server({
      name: 'render-mcp',
      version: '1.0.0',
    });

    this.setupTools();
    this.setupHandlers();
  }

  setupTools() {
    const tools = [
      {
        name: 'get_services',
        description: 'List all services on Render account',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_service_status',
        description: 'Get status of a specific service',
        inputSchema: {
          type: 'object',
          properties: {
            serviceId: {
              type: 'string',
              description: 'Service ID on Render',
            },
          },
          required: ['serviceId'],
        },
      },
      {
        name: 'get_service_logs',
        description: 'Get logs for a service',
        inputSchema: {
          type: 'object',
          properties: {
            serviceId: {
              type: 'string',
              description: 'Service ID on Render',
            },
            limit: {
              type: 'number',
              description: 'Number of log lines (default 50)',
            },
          },
          required: ['serviceId'],
        },
      },
      {
        name: 'deploy_service',
        description: 'Trigger a deployment for a service',
        inputSchema: {
          type: 'object',
          properties: {
            serviceId: {
              type: 'string',
              description: 'Service ID on Render',
            },
          },
          required: ['serviceId'],
        },
      },
      {
        name: 'restart_service',
        description: 'Restart a service',
        inputSchema: {
          type: 'object',
          properties: {
            serviceId: {
              type: 'string',
              description: 'Service ID on Render',
            },
          },
          required: ['serviceId'],
        },
      },
      {
        name: 'get_environment_variables',
        description: 'Get environment variables for a service',
        inputSchema: {
          type: 'object',
          properties: {
            serviceId: {
              type: 'string',
              description: 'Service ID on Render',
            },
          },
          required: ['serviceId'],
        },
      },
    ];

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      return await this.handleToolCall(name, args);
    });

    // Register tools
    tools.forEach((tool) => {
      this.server.tool(tool.name, tool.description, tool.inputSchema);
    });
  }

  async renderApiCall(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.render.com',
        port: 443,
        path: `/v1${path}`,
        method: method,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${RENDER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
          } else {
            reject(new Error(`Render API error (${res.statusCode}): ${data}`));
          }
        });
      });

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  async handleToolCall(toolName, args) {
    try {
      let result;
      switch (toolName) {
        case 'get_services':
          result = await this.renderApiCall('GET', '/services');
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result.data, null, 2),
              },
            ],
          };

        case 'get_service_status':
          result = await this.renderApiCall('GET', `/services/${args.serviceId}`);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result.data, null, 2),
              },
            ],
          };

        case 'get_service_logs':
          result = await this.renderApiCall('GET', `/services/${args.serviceId}/logs?limit=${args.limit || 50}`);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result.data, null, 2),
              },
            ],
          };

        case 'deploy_service':
          result = await this.renderApiCall('POST', `/services/${args.serviceId}/deploys`);
          return {
            content: [
              {
                type: 'text',
                text: `Deployment triggered. Deploy ID: ${result.data.id}`,
              },
            ],
          };

        case 'restart_service':
          result = await this.renderApiCall('POST', `/services/${args.serviceId}/restart`);
          return {
            content: [
              {
                type: 'text',
                text: `Service restart initiated.`,
              },
            ],
          };

        case 'get_environment_variables':
          result = await this.renderApiCall('GET', `/services/${args.serviceId}/env-vars`);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result.data, null, 2),
              },
            ],
          };

        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  setupHandlers() {
    this.server.setRequestHandler(require('@modelcontextprotocol/sdk/types').InitializeRequestSchema, async (request) => {
      return {
        protocolVersion: '2024-11-05',
        capabilities: {},
        serverInfo: {
          name: 'render-mcp',
          version: '1.0.0',
        },
      };
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Render MCP Server running on stdio');
  }
}

const server = new RenderMCPServer();
server.run().catch(console.error);
