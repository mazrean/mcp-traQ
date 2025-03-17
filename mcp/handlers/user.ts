import { z } from "npm:zod";
import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp";
import { CallToolResult } from "npm:@modelcontextprotocol/sdk";
import { getUser, getUsers, Client } from "../../traq/client.ts";

const userIdSchema = {
  userId: z.string().describe("The user ID to get information for"),
};
const schema = z.object(userIdSchema);
type Schema = z.infer<typeof schema>;

const getUserHandler = (client: Client) => {
  return async ({ userId }: Schema) => {
    try {
      const user = await getUser(client, userId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(user, null, 2),
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
            text: `Error getting user: ${errorMessage}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  };
};

const getUsersHandler = (client: Client) => {
  return async () => {
    try {
      const users = await getUsers(client);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(users, null, 2),
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
            text: `Error getting users: ${errorMessage}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  };
};

export const setup = (server: McpServer, client: Client) => {
  server.tool(
    "getUser",
    "Get information about a specific traQ user",
    userIdSchema,
    getUserHandler(client)
  );

  server.tool(
    "getUsers",
    "Get information about all traQ users",
    {},
    getUsersHandler(client)
  );
};
