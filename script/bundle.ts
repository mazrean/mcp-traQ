import { bundle } from "jsr:@deno/emit";

const url = new URL(import.meta.resolve("../main.ts"));
const { code } = await bundle(url, {
  minify: true,
  importMap: {
    baseUrl: "../",
  },
});

Deno.writeTextFile("dist/mcp-traQ.js", code);
