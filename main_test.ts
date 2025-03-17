import { server } from "./main.ts";
import { Client } from "npm:@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "npm:@modelcontextprotocol/sdk/inMemory.js";
import { expect } from "jsr:@std/expect";

const client = new Client(
  {
    name: "test client",
    version: "1.0",
  },
  {
    capabilities: {},
  }
);
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
await Promise.all([
  client.connect(clientTransport),
  server.connect(serverTransport),
]);

Deno.test("getStringLength", async () => {
  const result = await client.callTool({
    name: "getStringLength",
    arguments: {
      input: "Hello, world!",
    },
  });

  expect(result).toEqual({
    content: [{ type: "text", text: "13" }],
    isError: false,
  });
});
