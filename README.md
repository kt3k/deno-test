# deno-test

Run [Deno-style tests](https://docs.deno.com/runtime/fundamentals/testing/) with Node.js.

`deno-test` lets you use `Deno.test` and `t.step` in your test files and run them on Node.js via `npx`. It resolves Deno-style imports (`jsr:`, `@std/*`, import maps) and supports TypeScript out of the box.

> **Tip:** This is especially useful for verifying Node.js compatibility of packages developed Deno-first. Run your existing Deno tests on Node.js without rewriting them.

## Install

```sh
npm install --save-dev deno-test
```

## Usage

```sh
npx deno-test [options] [files/dirs...]
```

### Options

| Option | Description |
| --- | --- |
| `--filter <string>` | Run only tests whose name contains the given string |
| `-h, --help` | Show help message |

### Test file patterns

When no files are specified, `deno-test` auto-discovers test files in the current directory (recursively) matching these patterns:

- `*_test.{ts,tsx,js,jsx,mts,mjs}`
- `*.test.{ts,tsx,js,jsx,mts,mjs}`
- `test.{ts,tsx,js,jsx}`

Directories named `node_modules`, `.git`, and `vendor` are skipped.

### Examples

```sh
# Run all test files in current directory
npx deno-test

# Run all test files in a specific directory
npx deno-test test/

# Run a single test file
npx deno-test test/math_test.ts

# Filter tests by name
npx deno-test --filter "add"

# Combine filter with directory
npx deno-test --filter "add" test/
```

## Writing tests

Write tests using `Deno.test` just like you would for Deno:

```ts
import { assertEquals } from "@std/assert";

Deno.test("addition", () => {
  assertEquals(1 + 1, 2);
});

Deno.test("nested steps", async (t) => {
  await t.step("step 1", () => {
    assertEquals(2 * 2, 4);
  });

  await t.step("step 2", () => {
    assertEquals(3 * 3, 9);
  });
});
```

Import maps and `jsr:` specifiers work via `deno.json`:

```json
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.19"
  }
}
```

## How it works

1. The CLI discovers test files and spawns Node.js with a custom module resolution hook (`register-deno-hooks.mjs`) that handles Deno-style imports using `@deno/loader`.
2. Test files are imported and `Deno.test()` calls are collected via `@deno/shim-deno-test`.
3. Collected tests are registered with Node.js's built-in `node:test` runner, with `t.step()` mapped to `node:test`'s subtests.

## Requirements

- Node.js >= 23.6.0

> **Note:** This tool uses `module.registerHooks()`, a synchronous module resolution hook API added in Node.js 23.6.0.

## License

MIT
