# Setup Instructions

## 🔒 Secure Configuration

This project has been configured to handle sensitive information securely. Follow these steps to set up your environment properly.

## 📋 Prerequisites

- Node.js v18.0.0 or higher
- ClickUp API key ([Get yours here](https://app.clickup.com/settings/apps))
- ClickUp Team ID (from your workspace URL)

## 🚀 Quick Setup

### 1. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

### 2. Edit the `.env` file with your credentials:

```env
# ClickUp API Configuration
CLICKUP_API_KEY=your_actual_clickup_api_key_here
CLICKUP_TEAM_ID=your_actual_team_id_here

# Optional Configuration
LOG_LEVEL=trace
ENABLE_SSE=true
PORT=3231
DOCUMENT_SUPPORT=true
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Build the Project

```bash
npm run build
```

### 5. Run the Server

```bash
./run.sh
```

Or manually:

```bash
export CLICKUP_API_KEY=your_api_key
export CLICKUP_TEAM_ID=your_team_id
npm start
```

## ⚡ Testing the Tools

Once the server is running, you can test the checklist functionality:

1. **Server Endpoints:**
   - HTTP Streamable: `http://127.0.0.1:3231/mcp`
   - SSE: `http://127.0.0.1:3231/sse`
   - Health: `http://127.0.0.1:3231/health`

2. **Available Checklist Tools:**
   - `get_task_checklists` - Retrieve task checklists
   - `create_checklist_item` - Create new checklist items
   - `update_checklist_item` - Update item status
   - `delete_checklist_item` - Remove checklist items

3. **MCP Client Integration:**
   Configure your MCP client (Claude Desktop, etc.) to use this server.

## 🔒 Security Notes

- ✅ Never commit `.env` files to Git
- ✅ Use environment variables for sensitive data
- ✅ Keep your API keys secure
- ❌ Never hardcode credentials in scripts
- ❌ Never share API keys publicly

## 🏗️ Architecture

The project implements:
- **Secure environment handling** for API keys
- **Complete checklist management** for ClickUp tasks
- **MCP protocol** for AI integration
- **HTTP/SSE transport** support
- **TypeScript** with full type safety

Happy coding! 🎉
