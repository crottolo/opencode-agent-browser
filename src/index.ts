import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"
import { agentBrowserSkill, SKILL_NAME } from "./skills/agent-browser"

export const AgentBrowserPlugin: Plugin = async (ctx) => {
  return {
    // Register skill as invocable tool
    tool: {
      load_agent_browser_skill: tool({
        description: `Load the agent-browser skill for browser automation. Use when tasks involve: screenshots, web scraping, form automation, browser navigation, visual testing, or webpage interaction. Trigger phrases: screenshot, scrape, browser, webpage, navigate, fill form, test website.`,
        args: {},
        async execute(args, toolCtx) {
          // Inject skill into context via silent message
          await ctx.client.session.prompt({
            path: { id: toolCtx.sessionID },
            body: {
              noReply: true,
              parts: [
                {
                  type: "text",
                  text: `# Skill Loaded: ${SKILL_NAME}\n\n${agentBrowserSkill.template}`,
                },
              ],
            },
          })

          return `Skill "${SKILL_NAME}" loaded successfully. You now have instructions for browser automation using agent-browser CLI. Use bash to execute agent-browser commands.`
        },
      }),
    },

    // Inject skill awareness into system prompt
    "experimental.chat.system.transform": async (input, output) => {
      output.system.push(`
<available-skills>
## agent-browser
${agentBrowserSkill.description}

To use: Call the \`load_agent_browser_skill\` tool, then use bash to execute agent-browser commands.

Quick workflow:
1. agent-browser open <url>
2. agent-browser snapshot -i
3. agent-browser click @e1 / fill @e2 "text"
4. agent-browser screenshot / close
</available-skills>
`)
    },
  }
}

export default AgentBrowserPlugin

// Export skill for external use
export { agentBrowserSkill, SKILL_NAME } from "./skills/agent-browser"
