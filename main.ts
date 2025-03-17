import { program, Option } from "npm:commander";

import { run } from "./mcp/server.ts";
import { z } from "npm:zod";
import { createBotClient } from "./traq/client.ts";

program.name("mcp-traq").description("MCP server for traQ").version("0.1.0");

const botOption = z.object({
  token: z.string(),
});

program
  .command("bot")
  .addOption(
    new Option("-t, --token <token>", "traQ bot token").env(
      "MCP_TRAQ_BOT_TOKEN"
    )
  )
  .action(async (options) => {
    try {
      const { token } = botOption.parse(options);
      const client = createBotClient(token);

      await run(client);
    } catch (e) {
      console.error("Error running bot", e);
    }
  });
program.parse();
