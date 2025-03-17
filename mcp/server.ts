import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk/server/stdio.js";

import { setup as setupGetStringLengthTool } from "./handlers/getStringLengthTool.ts";

const server = new McpServer({
  name: "local",
  version: "0.1.0",
});

setupGetStringLengthTool(server);

export const run = async () => {
  try {
    await server.connect(new StdioServerTransport());
  } catch (e) {
    console.error("Error running server", e);
  }
};
