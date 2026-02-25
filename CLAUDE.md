# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development
- `npm run build` - Compile TypeScript to JavaScript (output to `build/`)
- `npm run dev` - Run TypeScript compiler in watch mode for development
- `npm start` - Run the compiled server from `build/index.js`
- `npm run prepare` - Build the project (runs automatically on npm install)

### Environment Configuration
The server supports multiple environment variables:
- `CLICKUP_API_KEY` - Required ClickUp API key
- `CLICKUP_TEAM_ID` - Required ClickUp team ID
- `ENABLED_TOOLS` - Comma-separated list of tools to enable (takes precedence)
- `DISABLED_TOOLS` - Comma-separated list of tools to disable
- `ENABLE_SSE` - Enable HTTP/SSE transport (default: false)
- `PORT` - Port for HTTP server (default: 3231)
- `LOG_LEVEL` - Log verbosity: trace, debug, info, warn, error (default: error)
- `DOCUMENT_SUPPORT` - Enable document tools (default: false)

## Architecture Overview

### Core Structure
This is a Model Context Protocol (MCP) server that provides AI applications with standardized access to ClickUp workspaces. The server supports both STDIO transport (traditional MCP) and HTTP/SSE transport for web integration.

### Key Components

#### Entry Point (`src/index.ts`)
- Main server initialization
- Transport selection (STDIO vs SSE)
- Error handling and process management
- Environment configuration

#### Server Configuration (`src/server.ts`)
- MCP server setup using `@modelcontextprotocol/sdk`
- Tool registration and handler mapping
- Request routing and validation

#### Services Layer (`src/services/`)
- **Base Service** (`clickup/base.ts`) - Common API client functionality
- **ClickUp Services** (`clickup/index.ts`) - Service factory and initialization
- **Domain Services** - Specialized services for each ClickUp entity:
  - `task/` - Task management (CRUD, comments, attachments, checklists, time tracking)
  - `list.ts` - List operations
  - `folder.ts` - Folder management
  - `document.ts` - Document operations
  - `workspace.ts` - Workspace hierarchy
  - `tag.ts` - Tag management
  - `time.ts` - Time tracking
  - `bulk.ts` - Bulk operations with concurrency

#### Tools Layer (`src/tools/`)
- MCP tool definitions and handlers
- Organized by domain (workspace, task, list, folder, tag, member, documents)
- Each tool module exports both tool definitions and handler functions
- Bulk operations support parallel processing

#### Utilities (`src/utils/`)
- `concurrency-utils.ts` - Parallel processing helpers
- `date-utils.ts` - Natural language date parsing
- `resolver-utils.ts` - Name-to-ID resolution
- `color-processor.ts` - Color processing for tags
- `sponsor-service.ts` - Attribution messaging

### Transport Support
- **STDIO Transport** - Standard MCP protocol for desktop applications
- **SSE Transport** (`src/sse_server.ts`) - HTTP Server-Sent Events for web integration
- **HTTP Streamable** - Modern HTTP transport (MCP Inspector compatible)

### Tool Organization
Tools are categorized by functionality:
- **Workspace** - Hierarchy navigation
- **Tasks** - Full CRUD operations, bulk operations, comments, attachments, checklists, time tracking
- **Lists/Folders** - Organization structure management
- **Tags** - Tag creation, assignment, management
- **Members** - User resolution and assignment
- **Documents** - Document and page management (when enabled)

### Key Patterns
- **Service Layer Pattern** - Business logic separated from MCP handlers
- **Name Resolution** - Support for both IDs and human-readable names
- **Bulk Operations** - Concurrent processing for multiple items
- **Error Handling** - Comprehensive error messages and validation
- **Type Safety** - Full TypeScript with Zod schemas for validation

### Configuration Notes
- Tools can be filtered using `ENABLED_TOOLS` or `DISABLED_TOOLS`
- Document support is opt-in via `DOCUMENT_SUPPORT`
- Security features available but disabled by default
- Rate limiting built into ClickUp API client