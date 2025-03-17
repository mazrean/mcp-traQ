import { expect } from "@std/expect";
import { handler } from "./getStringLengthTool.ts";

Deno.test("getStringLength", () => {
  const result = handler({ input: "Hello, world!" });

  expect(result).toEqual({
    content: [{ type: "text", text: "13" }],
    isError: false,
  });
});
