import { assertEquals } from "@std/assert"

Deno.test("nested steps", async (t) => {
  await t.step("step 1", () => {
    assertEquals(1 + 1, 2)
  })

  await t.step("step 2", async (t) => {
    await t.step("step 2a", () => {
      assertEquals(2 * 2, 4)
    })
    await t.step("step 2b", () => {
      assertEquals(3 * 3, 9)
    })
  })
})
