import { z } from "npm:zod";
import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp";
import { CallToolResult } from "npm:@modelcontextprotocol/sdk";
import { searchMessages, Client } from "../../traq/client.ts";

const mcpSchema = {
  channelId: z
    .string()
    .optional()
    .describe("The channel ID to search messages from(optional)"),
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
  after: z
    .string()
    .optional()
    .describe("Search messages after this date (ISO string)"),
  before: z
    .string()
    .optional()
    .describe("Search messages before this date (ISO string)"),
  words: z.string().optional().describe("Search query string"),
  to: z
    .array(z.string())
    .optional()
    .describe("Array of user IDs to filter messages sent to"),
  from: z
    .array(z.string())
    .optional()
    .describe("Array of user IDs to filter messages from"),
  sort: z
    .enum(["createdAt", "-createdAt", "updatedAt", "-updatedAt"])
    .optional()
    .describe(
      "Sort order for messages(crearedAt: ascending, -createdAt: descending, updatedAt: ascending, -updatedAt: descending)"
    ),
  includeBot: z
    .boolean()
    .optional()
    .default(false)
    .describe("Include bot messages"),
};
const schema = z.object(mcpSchema);
type Schema = z.infer<typeof schema>;

export const createHandler = (client: Client) => {
  return async (params: Schema) => {
    try {
      const messages = await searchMessages(
        client,
        params.limit,
        params.after ? new Date(params.after) : undefined,
        params.before ? new Date(params.before) : undefined,
        params.words,
        params.channelId,
        params.to,
        params.from,
        params.offset,
        params.sort,
        params.includeBot
      );

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
