import { assertEquals } from "@std/assert"

Deno.test("async test", async () => {
  const value = await Promise.resolve(42)
  assertEquals(value, 42)
})

Deno.test("setTimeout resolves", async () => {
  const result = await new Promise<string>((resolve) => {
    setTimeout(() => resolve("done"), 10)
  })
  assertEquals(result, "done")
})
