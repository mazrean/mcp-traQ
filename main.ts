import { program, Option } from "npm:commander";

import { run } from "./mcp/server.ts";

program.name("mcp-traq").description("MCP server for traQ").version("0.1.0");

program.addOption(
  new Option("-t, --token <token>", "traQ bot token").env("TRAQ_BOT_TOKEN")
);
program.parse();

await run();
console.error("MCP server exited");
