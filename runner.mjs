// Imports test files and runs collected Deno.test definitions via node:test

import process from "node:process"
import { test } from "node:test"
import { pathToFileURL } from "node:url"
import { Deno, testDefinitions } from "@deno/shim-deno-test"

// Set up Deno.test global
globalThis.Deno = Deno

// Import all test files (they call Deno.test, which populates testDefinitions)
const testFiles = process.env.DENO_TEST_FILES?.split("\n").filter(Boolean) ?? []
const filter = process.env.DENO_TEST_FILTER

for (const file of testFiles) {
  await import(pathToFileURL(file).href)
}

// Wrap node:test TestContext to provide Deno.TestContext (t.step)
function wrapContext(nodeCtx) {
  return {
    step(nameOrFn, fn) {
      let name
      let testFn
      if (typeof nameOrFn === "function") {
        name = nameOrFn.name
        testFn = nameOrFn
      } else {
        name = nameOrFn
        testFn = fn
      }
      return nodeCtx.test(name, (childCtx) => testFn(wrapContext(childCtx)))
    },
  }
}

// Register collected tests with node:test
for (const testDef of testDefinitions) {
  if (filter && !testDef.name.includes(filter)) {
    continue
  }
  const wrappedFn = (nodeCtx) => testDef.fn(wrapContext(nodeCtx))
  if (testDef.ignore) {
    test.skip(testDef.name, wrappedFn)
  } else {
    test(testDef.name, wrappedFn)
  }
}
