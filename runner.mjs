// Imports test files and runs collected Deno.test definitions via node:test

import process from "node:process"
import { test } from "node:test"
import { Deno, testDefinitions } from "@deno/shim-deno-test"

// Set up Deno.test global
globalThis.Deno = Deno

// Import all test files (they call Deno.test, which populates testDefinitions)
const testFiles = process.env.DENO_TEST_FILES?.split("\n").filter(Boolean) ?? []
const filter = process.env.DENO_TEST_FILTER

for (const file of testFiles) {
  await import(file)
}

// Register collected tests with node:test
for (const testDef of testDefinitions) {
  if (filter && !testDef.name.includes(filter)) {
    continue
  }
  if (testDef.ignore) {
    test.skip(testDef.name, testDef.fn)
  } else {
    test(testDef.name, testDef.fn)
  }
}
