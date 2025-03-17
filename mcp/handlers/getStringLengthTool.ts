import { z } from "npm:zod";
import { McpServer } from "npm:@modelcontextprotocol/sdk/server/mcp";
import { CallToolResult } from "npm:@modelcontextprotocol/sdk";

const mcpSchema = {
  input: z.string().describe("The input string"),
};
const schema = z.object(mcpSchema);
type Schema = z.infer<typeof schema>;

export const handler = ({ input }: Schema) => {
  return {
    content: [
      {
        type: "text",
        text: `${Array.from(input).length}`,
      },
    ],
    isError: false,
  } as CallToolResult;
};

export const setup = (server: McpServer) => {
  server.tool(
    "getStringLength",
    "Get the length of a string",
    mcpSchema,
    handler
  );
};
