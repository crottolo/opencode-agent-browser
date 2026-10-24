import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"
import { agentBrowserSkill, SKILL_NAME } from "./src/skills/agent-browser"

/**
 * OpenCode plugin for agent-browser automation.
 *
 * Provides a skill for browser automation with persistent cookies,
 * full dev tools access, and video streaming support.
 *
 * ## Configuration
 *
 * ```json
 * {
 *   "plugin": ["opencode-agent-browser"]
 * }
 * ```
 */
export const OpenCodeAgentBrowser: Plugin = async (ctx) => {
  return {
    tool: {
      load_agent_browser_skill: tool({
        description: `Load the agent-browser skill for browser automation. Use when tasks involve: screenshots, web scraping, form automation, browser navigation, visual testing, or webpage interaction.`,
        args: {},
        async execute(args, toolCtx) {
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
          return `Skill "${SKILL_NAME}" loaded. Use bash to execute agent-browser commands.`
        },
      }),
    },

    "experimental.chat.system.transform": async (input, output) => {
      output.system.push(`
<available-skills>
## agent-browser
${agentBrowserSkill.description}
To use: Call \`load_agent_browser_skill\` tool, then use bash to run agent-browser commands.
</available-skills>
`)
    },
  }
}

export default OpenCodeAgentBrowser
export { agentBrowserSkill, SKILL_NAME } from "./src/skills/agent-browser"
