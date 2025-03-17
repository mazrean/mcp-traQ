import { z } from "npm:zod";
import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp";
import { CallToolResult } from "npm:@modelcontextprotocol/sdk";
import { getChannels, getChannelTopic, Client } from "../../traq/client.ts";

const channelSchema = {
  path: z
    .string()
    .describe("path Retrieve only channels with matching paths")
    .optional(),
  limit: z
    .number()
    .gte(1)
    .lte(100)
    .default(50)
    .describe("The number of channels to return"),
};
const schema = z.object(channelSchema);
type Schema = z.infer<typeof schema>;

const getChannelsHandler = (client: Client) => {
  return async ({ path, limit }: Schema) => {
    try {
      const channels = await getChannels(client, path, limit);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(channels, null, 2),
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
            text: `Error getting channels: ${errorMessage}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  };
};

const channelTopicSchema = {
  channelId: z.string().describe("The channel ID to get the topic from"),
};
const topicSchema = z.object(channelTopicSchema);
type TopicSchema = z.infer<typeof topicSchema>;

const getChannelTopicHandler = (client: Client) => {
  return async ({ channelId }: TopicSchema) => {
    try {
      const topic = await getChannelTopic(client, channelId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ topic }, null, 2),
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
            text: `Error getting channel topic: ${errorMessage}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  };
};

export const setup = (server: McpServer, client: Client) => {
  server.tool(
    "getChannels",
    "Get all channels in traQ",
    channelSchema,
    getChannelsHandler(client)
  );

  server.tool(
    "getChannelTopic",
    "Get topic of a traQ channel",
    channelTopicSchema,
    getChannelTopicHandler(client)
  );
};
