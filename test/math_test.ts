import { assertEquals, assertThrows } from "@std/assert"

Deno.test("multiply", () => {
  assertEquals(3 * 4, 12)
})

Deno.test("divide", () => {
  assertEquals(10 / 2, 5)
})

Deno.test("divide by zero is Infinity", () => {
  assertEquals(1 / 0, Infinity)
})

Deno.test("assertThrows works", () => {
  assertThrows(
    () => {
      throw new Error("boom")
    },
    Error,
    "boom",
  )
})
