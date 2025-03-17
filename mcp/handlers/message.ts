import { z } from "npm:zod";
import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp";
import { CallToolResult } from "npm:@modelcontextprotocol/sdk";
import { searchMessages, Client } from "../../traq/client.ts";

const mcpSchema = {
  channelId: z.string().describe("The channel ID to search messages from"),
  limit: z
    .number()
    .gte(1)
    .lte(100)
    .default(10)
    .describe("The number of messages to return"),
  offset: z
    .number()
    .gte(0)
    .default(0)
    .describe("The offset to start searching from"),
};
const schema = z.object(mcpSchema);
type Schema = z.infer<typeof schema>;

export const createHandler = (client: Client) => {
  return async ({ channelId, limit, offset }: Schema) => {
    try {
      const messages = await searchMessages(client, channelId, limit, offset);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(messages, null, 2),
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
            text: `Error searching messages: ${errorMessage}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  };
};

export const setup = (server: McpServer, client: Client) => {
  server.tool(
    "searchMessages",
    "Search messages in a traQ channel",
    mcpSchema,
    createHandler(client)
  );
};
