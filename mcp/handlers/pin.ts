import { z } from "npm:zod";
import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp";
import { CallToolResult } from "npm:@modelcontextprotocol/sdk";
import { getPins, Client } from "../../traq/client.ts";

const pinSchema = {
  channelId: z.string().describe("The channel ID to get pins from"),
};
const schema = z.object(pinSchema);
type Schema = z.infer<typeof schema>;

const getPinsHandler = (client: Client) => {
  return async ({ channelId }: Schema) => {
    try {
      const pins = await getPins(client, channelId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(pins, null, 2),
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
            text: `Error getting pins: ${errorMessage}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  };
};

export const setup = (server: McpServer, client: Client) => {
  server.tool(
    "getPins",
    "Get all pins in a traQ channel",
    pinSchema,
    getPinsHandler(client)
  );
};
