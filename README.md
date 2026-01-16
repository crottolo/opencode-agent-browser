# opencode-agent-browser

OpenCode plugin for [agent-browser](https://github.com/vercel-labs/agent-browser) - browser automation for AI agents with persistent sessions, dev tools, and video streaming.

## Features

- **Auto Viewport 1920x1080** - Browser opens with consistent viewport size
- **Cookie Banner Handling** - Automatically dismisses cookie consent popups
- **Persistent Sessions** - Cookies saved across navigations, login once and stay authenticated
- **Full Dev Tools** - Console logs, network requests, cookies, localStorage, sessionStorage
- **JavaScript Execution** - Run arbitrary JS in page context
- **Video Streaming** - Real-time WebSocket streaming for visual monitoring
- **Network Mocking** - Intercept and mock API responses
- **Zero Config** - Works out of the box

## Installation

### 1. Install agent-browser CLI

```bash
npm install -g agent-browser
agent-browser install  # Download Chromium
```

### 2. Install this plugin

```bash
# In your OpenCode config directory
cd ~/.config/opencode
npm install opencode-agent-browser
```

Add to your `opencode.json`:

```json
{
  "plugin": ["opencode-agent-browser"]
}
```

## Usage Examples

### Basic Navigation
```
"Go to amazon.it and accept the cookies"
"Navigate to github.com and take a screenshot"
```

### Web Scraping
```
"Scrape product prices from this Amazon search page"
"Get all the links from the homepage"
"Extract the main article text from this news page"
```

### Form Automation
```
"Fill the login form with username 'test' and password 'test123'"
"Submit the contact form with my details"
"Search for 'laptop' on Amazon"
```

### Debugging & Development
```
"Check the browser console for JavaScript errors"
"Show me all network requests to the API"
"What cookies does this site set?"
"Get the localStorage data"
```

### Testing
```
"Test if the checkout flow works correctly"
"Verify the login redirects to dashboard"
"Check if the form validation shows error messages"
```

## How It Works

### Architecture

```
OpenCode                    Plugin                      agent-browser
   |                          |                              |
   |-- loads plugin --------->|                              |
   |                          |-- injects skill awareness -->|
   |                          |                              |
   |-- "go to amazon" ------->|                              |
   |                          |-- load_agent_browser_skill ->|
   |                          |                              |
   |                          |<-- skill instructions -------|
   |                          |                              |
   |                          |-- bash: agent-browser ------>|
   |                          |                              |
   |<-- page opened ----------|<-- success -----------------|
```

### Plugin Components

1. **Skill Injection** - Adds `<available-skills>` to system prompt so the AI knows when to use browser automation

2. **Tool Registration** - Registers `load_agent_browser_skill` tool that injects detailed instructions into the conversation

3. **Skill Template** - Comprehensive documentation for agent-browser CLI including:
   - Opening browser with correct viewport
   - Cookie banner handling
   - Element interaction via @refs
   - Dev tools access
   - Troubleshooting

## Quick Reference

### Open Browser (MUST use this pattern first time)
```bash
pkill -f agent-browser; sleep 1; agent-browser open <url> --headed && agent-browser set viewport 1920 1080
```

### Handle Cookie Banner
```bash
agent-browser snapshot -i              # Check for cookie banner
agent-browser click @eX                # Click "Accept" button
```

### Interact with Elements
```bash
agent-browser snapshot -i              # Get interactive elements with @refs
agent-browser click @e1                # Click element
agent-browser fill @e2 "text"          # Fill input field
agent-browser press Enter              # Press key
agent-browser select @e1 "value"       # Select dropdown option
agent-browser scroll down 500          # Scroll page
```

### Screenshots
```bash
agent-browser screenshot ./screenshot.png        # Viewport
agent-browser screenshot ./screenshot.png --full # Full page
```

### Dev Tools (ALWAYS use --json!)
```bash
agent-browser console --json           # Console logs
agent-browser errors --json            # Page errors only
agent-browser cookies get --json       # Get all cookies
agent-browser storage local --json     # Get localStorage
agent-browser storage session --json   # Get sessionStorage
agent-browser eval "document.title"    # Execute JavaScript
```

### Network
```bash
agent-browser network requests --json              # View requests
agent-browser network route "*/api/*" --abort      # Block requests
agent-browser network route "*/api/*" --body '{}'  # Mock response
```

### Video Streaming
```bash
AGENT_BROWSER_STREAM_PORT=9223 agent-browser open <url> --headed
# Connect via WebSocket at ws://localhost:9223
```

## Customization

### Modify the Plugin

Clone and customize:

```bash
git clone https://github.com/crottolo/opencode-agent-browser.git
cd opencode-agent-browser
```

Edit `index.ts` to customize:

#### Change Default Viewport
```typescript
// Find this line in skillTemplate:
agent-browser set viewport 1920 1080

// Change to your preferred size:
agent-browser set viewport 1440 900
```

#### Add Custom Headers
```typescript
// Add to the open command:
agent-browser open <url> --headed --headers '{"Accept-Language": "en-US"}'
```

#### Modify Cookie Banner Behavior
```typescript
// In the RULES section, change:
2. **Cookie banner**: ALWAYS dismiss cookie banners...

// To:
2. **Cookie banner**: ASK user before dismissing...
```

### Build and Use Locally

```bash
bun install
bun run build

# In opencode.json, use local path:
{
  "plugin": ["/path/to/opencode-agent-browser"]
}
```

## Troubleshooting

### "Browser not launched" Error
```bash
# Kill any existing daemon and restart:
pkill -f agent-browser; sleep 1; agent-browser open <url> --headed
```

### Browser Window Not Visible
```bash
# Always use --headed flag:
agent-browser open <url> --headed  # Correct
agent-browser open <url>           # Wrong - headless mode
```

### Console/Cookies Show Empty
```bash
# Always use --json flag for dev tools:
agent-browser console --json       # Correct
agent-browser console              # Wrong - may show empty
```

### Cookie Banner Not Detected
```bash
# Run snapshot to see all interactive elements:
agent-browser snapshot -i

# Look for buttons with text like "Accept", "Accetta", "OK", "Agree"
# Then click the correct @ref
```

### Session Lost / Need to Re-login
```bash
# DON'T use 'close' - it deletes all cookies!
agent-browser close               # Destroys session

# Instead, just navigate to new URLs:
agent-browser open <new-url>      # Keeps cookies
```

### Element Not Found
```bash
# Always re-snapshot after navigation or page changes:
agent-browser open <url>
agent-browser snapshot -i         # Get fresh @refs
agent-browser click @e1           # Use new refs
```

## Auto-Trigger Prompts

The plugin automatically suggests loading the skill when your prompt contains:

| Category | Trigger Words |
|----------|---------------|
| Screenshots | screenshot, capture, snapshot |
| Scraping | scrape, extract, get data from |
| Navigation | go to, navigate, open website, browse |
| Forms | fill form, submit, login, signup |
| Testing | test website, verify, check page |
| Debugging | console log, network request, cookies |

### Examples That Auto-Trigger
- "Take a screenshot of google.com"
- "Scrape the prices from Amazon"
- "Fill the contact form on the website"
- "Check if there are any JavaScript errors"
- "Navigate to the login page and sign in"

## Requirements

- **OpenCode** >= 1.0.0
- **agent-browser** CLI installed globally
- **Chromium** (installed via `agent-browser install`)
- **macOS/Linux** (Windows support may vary)

## Development

```bash
# Clone
git clone https://github.com/crottolo/opencode-agent-browser.git
cd opencode-agent-browser

# Install dependencies
bun install

# Build
bun run build

# The build creates:
# - dist/index.js (bundled plugin)
# - dist/index.d.ts (TypeScript types)
```

### Project Structure
```
opencode-agent-browser/
├── index.ts          # Main plugin code with skill template
├── package.json      # npm package config
├── tsconfig.json     # TypeScript config
├── dist/             # Built output
│   ├── index.js
│   └── index.d.ts
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Credits

- [agent-browser](https://github.com/vercel-labs/agent-browser) by Vercel Labs
- [OpenCode](https://opencode.ai) plugin system
