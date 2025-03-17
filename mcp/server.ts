import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk/server/stdio.js";

import { setup as setupGetStringLengthTool } from "./handlers/getStringLengthTool.ts";
import { setup as setupMessage } from "./handlers/message.ts";
import { setup as setupChannel } from "./handlers/channel.ts";
import { setup as setupUser } from "./handlers/user.ts";
import { setup as setupStamp } from "./handlers/stamp.ts";
import { setup as setupPin } from "./handlers/pin.ts";
import { Client } from "../traq/client.ts";

const server = new McpServer({
  name: "traQ",
  version: "0.1.0",
});

export const run = async (client: Client) => {
  try {
    setupGetStringLengthTool(server);
    setupMessage(server, client);
    setupChannel(server, client);
    setupUser(server, client);
    setupStamp(server, client);
    setupPin(server, client);

    await server.connect(new StdioServerTransport());
  } catch (e) {
    console.error("Error running server", e);
  }
};
