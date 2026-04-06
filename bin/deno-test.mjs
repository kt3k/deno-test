#!/usr/bin/env node

// CLI entry point for deno-test
// Usage: npx deno-test [options] [files/dirs...]

import process from "node:process"
import { execFileSync } from "node:child_process"
import { readdirSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const hooksPath = resolve(__dirname, "../register-deno-hooks.mjs")
const runnerPath = resolve(__dirname, "../runner.mjs")

// deno test default file patterns
const TEST_PATTERN =
  /(?:_test|\.test)\.[tj]sx?$|(?:_test|\.test)\.[cm][tj]s$|(?:^|[/\\])test\.[tj]sx?$/

function isTestFile(name) {
  return TEST_PATTERN.test(name)
}

function findTestFiles(dir) {
  const results = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === "node_modules" || entry.name === ".git" ||
      entry.name === "vendor"
    ) {
      continue
    }
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findTestFiles(fullPath))
    } else if (entry.isFile() && isTestFile(entry.name)) {
      results.push(fullPath)
    }
  }
  return results
}

// Parse args
const args = process.argv.slice(2)
const files = []
let filter = undefined

for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if (arg === "--filter" && i + 1 < args.length) {
    filter = args[++i]
  } else if (arg.startsWith("--filter=")) {
    filter = arg.slice("--filter=".length)
  } else if (!arg.startsWith("-")) {
    files.push(arg)
  }
}

// Find test files
let testFiles
if (files.length === 0) {
  testFiles = findTestFiles(process.cwd())
} else {
  testFiles = []
  for (const f of files) {
    const fullPath = resolve(f)
    try {
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        testFiles.push(...findTestFiles(fullPath))
      } else {
        testFiles.push(fullPath)
      }
    } catch {
      console.error(`Error: Cannot find '${f}'`)
      process.exit(1)
    }
  }
}

if (testFiles.length === 0) {
  console.error("No test files found.")
  process.exit(1)
}

testFiles.sort()

const env = { ...process.env }
if (filter) {
  env.DENO_TEST_FILTER = filter
}
env.DENO_TEST_FILES = testFiles.join("\n")

try {
  execFileSync(
    process.execPath,
    ["--test", "--import", hooksPath, runnerPath],
    {
      stdio: "inherit",
      env,
      cwd: process.cwd(),
    },
  )
} catch (e) {
  process.exit(e.status ?? 1)
}
