import { assert, assertEquals } from "@std/assert"

Deno.test("trim whitespace", () => {
  assertEquals("  hello  ".trim(), "hello")
})

Deno.test("includes substring", () => {
  assert("hello world".includes("world"))
})

Deno.test("repeat string", () => {
  assertEquals("ab".repeat(3), "ababab")
})
