import { assertEquals } from "@std/assert"
import bytes from "./fixture.txt" with { type: "bytes" }
import text from "./fixture.txt" with { type: "text" }

Deno.test("bytes import", () => {
  assertEquals([...bytes], [...new TextEncoder().encode(text)])
})

Deno.test("text import", () => {
  assertEquals(text.trimEnd(), "Hello, 世界")
})
