# opencode-agent-browser

OpenCode plugin for [agent-browser](https://github.com/vercel-labs/agent-browser) - headless browser automation for AI agents.

## Features

- **Builtin Skill** - Comprehensive documentation for agent-browser CLI
- **Auto-trigger** - Automatically suggests loading skill for browser tasks
- **Zero Config** - Works out of the box

## Installation

### 1. Install agent-browser CLI

```bash
npm install -g agent-browser
agent-browser install  # Download Chromium
```

### 2. Install this plugin

Add to your `opencode.json`:

```json
{
  "plugin": ["opencode-agent-browser"]
}
```

Or for local development:

```json
{
  "plugin": ["./path/to/opencode-agent-browser"]
}
```

## Usage

The plugin automatically makes the agent-browser skill available. When you ask for browser-related tasks, the AI will load the skill and use agent-browser CLI commands.

### Example prompts:

- "Take a screenshot of https://example.com"
- "Scrape the product list from this webpage"
- "Fill the login form on github.com"
- "Test the checkout flow on my website"

### Manual skill loading:

```
Load the agent-browser skill
```

## How It Works

1. Plugin injects skill awareness into the system prompt
2. When browser tasks are detected, AI calls `load_agent_browser_skill` tool
3. Skill documentation is injected into the conversation
4. AI uses bash to execute agent-browser CLI commands

## Trigger Phrases

The skill is suggested when your prompt contains:
- screenshot, capture, scrape
- browser, webpage, website
- navigate, fill form
- visual testing

## agent-browser Quick Reference

```bash
# Navigate
agent-browser open <url>
agent-browser back / forward / reload
agent-browser close

# Snapshot (get element refs)
agent-browser snapshot -i

# Interact (use @refs from snapshot)
agent-browser click @e1
agent-browser fill @e2 "text"
agent-browser press Enter

# Screenshots
agent-browser screenshot page.png
agent-browser screenshot --full page.png

# Sessions
agent-browser --session task1 open site.com
```

## Requirements

- OpenCode >= 1.0.0
- agent-browser CLI installed globally
- Chromium (installed via `agent-browser install`)

## Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Type check
bun run typecheck
```

## License

MIT
