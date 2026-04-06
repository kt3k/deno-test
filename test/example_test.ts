import { assertEquals } from "@std/assert"

Deno.test("addition", () => {
  assertEquals(1 + 1, 2)
})

Deno.test("string concat", () => {
  assertEquals("hello" + " " + "world", "hello world")
})
