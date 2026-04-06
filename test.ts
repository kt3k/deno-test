import { assertEquals, assertStringIncludes } from "@std/assert"
import { spawnSync } from "node:child_process"
import { resolve } from "node:path"

const cli = resolve(import.meta.dirname!, "bin/deno-test.mjs")

function run(
  args: string[],
  { cwd = import.meta.dirname }: { cwd?: string } = {},
) {
  return spawnSync("node", [cli, ...args], { encoding: "utf-8", cwd })
}

Deno.test("runs all test files in a directory", () => {
  const { stdout, status } = run(["test/"])
  assertEquals(status, 0)
  assertStringIncludes(stdout, "pass 11")
})

Deno.test("runs a single test file", () => {
  const { stdout, status } = run(["test/math_test.ts"])
  assertEquals(status, 0)
  assertStringIncludes(stdout, "multiply")
  assertStringIncludes(stdout, "pass 4")
})

Deno.test("--filter filters tests by name", () => {
  const { stdout, status } = run(["--filter", "divide", "test/"])
  assertEquals(status, 0)
  assertStringIncludes(stdout, "divide")
  assertStringIncludes(stdout, "pass 2")
})

Deno.test("auto-discovers test files from cwd", () => {
  const { stdout, status } = run([], {
    cwd: resolve(import.meta.dirname!, "test"),
  })
  assertEquals(status, 0)
  assertStringIncludes(stdout, "pass 11")
})

Deno.test("exits with error for nonexistent path", () => {
  const { stderr, status } = run(["nonexistent_file.ts"])
  assertEquals(status, 1)
  assertStringIncludes(stderr, "Cannot find")
})
