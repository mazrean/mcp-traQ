import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp";
import { CallToolResult } from "npm:@modelcontextprotocol/sdk";
import { getStamps, Client } from "../../traq/client.ts";

const getStampsHandler = (client: Client) => {
  return async () => {
    try {
      const stamps = await getStamps(client);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(stamps, null, 2),
          },
        ],
        isError: false,
      } as CallToolResult;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      return {
        content: [
          {
            type: "text",
            text: `Error getting stamps: ${errorMessage}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  };
};

export const setup = (server: McpServer, client: Client) => {
  server.tool(
    "getStamps",
    "Get all stamps in traQ",
    {},
    getStampsHandler(client)
  );
};
