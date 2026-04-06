// register-deno-hooks.mjs
//
// Preload script that enables Deno module resolution in Node.js.
// Uses @deno/loader's resolveSync to resolve specifiers (import maps, jsr:, etc.)
// and relies on Node.js's TypeScript support for transpiling .ts/.tsx files.
//
// Usage:
//   node --experimental-transform-types --import ./register-deno-hooks.mjs app.ts

import process from "node:process"
import module from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  Workspace,
  ResolutionMode,
  RequestedModuleType,
  MediaType,
} from "./vendor/deno-loader/mod.js";

// Initialize @deno/loader
const workspace = new Workspace();
const loader = await workspace.createLoader();

// Build the module graph from entrypoints
const entrypoint = process.argv[1];
if (entrypoint) {
  const diagnostics = await loader.addEntrypoints([entrypoint]);
  for (const d of diagnostics) {
    console.error("[deno-hooks] diagnostic:", d.message);
  }
}

// Pre-load and cache all modules from the graph.
// The load hook is synchronous, so we run the async loader.load() ahead of time.
const moduleCache = new Map();
const graph = loader.getGraphUnstable();
await Promise.all(
  graph.modules
    .filter((m) => m.kind === "esm")
    .map(async (m) => {
      try {
        const response = await loader.load(
          m.specifier,
          RequestedModuleType.Default,
        );
        if (response.kind === "module") {
          moduleCache.set(m.specifier, response);
        }
      } catch {
        // Ignore load failures; Node.js will handle them as fallback
      }
    }),
);
console.error(`[deno-hooks] cached ${moduleCache.size} modules from graph`);

function isTypeScript(url) {
  return /\.[cm]?tsx?$/.test(url);
}

// Convert @deno/loader MediaType to Node.js module format string
function mediaTypeToFormat(mediaType) {
  switch (mediaType) {
    case MediaType.TypeScript:
    case MediaType.Tsx:
    case MediaType.Mts:
      return "module-typescript";
    case MediaType.Cts:
      return "commonjs-typescript";
    case MediaType.JavaScript:
    case MediaType.Jsx:
    case MediaType.Mjs:
      return "module";
    case MediaType.Cjs:
      return "commonjs";
    case MediaType.Json:
      return "json";
    default:
      return "module";
  }
}

module.registerHooks({
  resolve(specifier, context, nextResolve) {
    // Skip node: builtins
    if (specifier.startsWith("node:")) {
      return nextResolve(specifier, context);
    }

    try {
      const resolved = loader.resolveSync(
        specifier,
        context.parentURL,
        ResolutionMode.Import,
      );

      // Serve from cache if available
      if (moduleCache.has(resolved)) {
        return { url: resolved, shortCircuit: true };
      }

      // Return file:// URLs as-is
      if (resolved.startsWith("file://")) {
        return { url: resolved, shortCircuit: true };
      }

      // Fall back to Node.js for other schemes
      return nextResolve(specifier, context);
    } catch {
      return nextResolve(specifier, context);
    }
  },

  load(url, context, nextLoad) {
    // Return pre-transpiled code from cache
    const cached = moduleCache.get(url);
    if (cached) {
      const source = new TextDecoder().decode(cached.code);
      return {
        source,
        format: mediaTypeToFormat(cached.mediaType),
        shortCircuit: true,
      };
    }

    // Local TypeScript files
    if (url.startsWith("file://") && isTypeScript(url)) {
      const filePath = fileURLToPath(url);
      const source = readFileSync(filePath, "utf-8");
      return {
        source,
        format: "module-typescript",
        shortCircuit: true,
      };
    }

    return nextLoad(url, context);
  },
});

