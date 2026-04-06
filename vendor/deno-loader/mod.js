/**
 * Resolver and loader for Deno code.
 *
 * This can be used to create bundler plugins or libraries that use deno resolution.
 *
 * Works in both Deno and Node.js. For Node.js, install from JSR
 * (`npx jsr add @deno/loader`) which provides pre-transpiled JavaScript.
 *
 * @example
 * ```ts
 * import { Workspace, ResolutionMode, type LoadResponse, RequestedModuleType } from "@deno/loader";
 *
 * const workspace = new Workspace({
 *   // optional options
 * });
 * const loader = await workspace.createLoader();
 * const diagnostics = await loader.addEntrypoints(["./mod.ts"])
 * if (diagnostics.length > 0) {
 *   throw new Error(diagnostics[0].message);
 * }
 * // alternatively use resolve to resolve npm/jsr specifiers not found
 * // in the entrypoints or if not being able to provide entrypoints
 * const resolvedUrl = loader.resolveSync(
 *   "./mod.test.ts",
 *   "https://deno.land/mod.ts", // referrer
 *   ResolutionMode.Import,
 * );
 * const response = await loader.load(resolvedUrl, RequestedModuleType.Default);
 * if (response.kind === "module") {
 *   console.log(response.specifier);
 *   console.log(response.code);
 *   console.log(response.mediaType);
 * } else if (response.kind === "external") {
 *   console.log(response.specifier)
 * } else {
 *   const _assertNever = response;
 *   throw new Error(`Unhandled kind: ${(response as LoadResponse).kind}`);
 * }
 * ```
 * @module
 */ var _computedKey, _computedKey1
// Use the appropriate WASM loader for the runtime.
// Deno natively supports WASM imports; Node.js needs manual instantiation.
// deno-lint-ignore no-explicit-any
let _lib
if (typeof Deno !== "undefined") {
  _lib = await import("./lib/rs_lib.js")
} else {
  _lib = await import("./rs_lib_node.js")
}
const WasmLoader = _lib.DenoLoader
const WasmWorkspace = _lib.DenoWorkspace
export class ResolveError extends Error {
  /**
   * Possible specifier this would resolve to if the error did not occur.
   *
   * This is useful for implementing something like `import.meta.resolve` where
   * you want the resolution to always occur and not error.
   */ specifier
  /** Node.js error code. */ code
  /**
   * If the specifier being resolved was an optional npm dependency.
   *
   * @remarks This will only be true when the error code is
   * `ERR_MODULE_NOT_FOUND`.
   */ isOptionalDependency
}
/** File type. */ export var MediaType = /*#__PURE__*/ function (MediaType) {
  MediaType[MediaType["JavaScript"] = 0] = "JavaScript"
  MediaType[MediaType["Jsx"] = 1] = "Jsx"
  MediaType[MediaType["Mjs"] = 2] = "Mjs"
  MediaType[MediaType["Cjs"] = 3] = "Cjs"
  MediaType[MediaType["TypeScript"] = 4] = "TypeScript"
  MediaType[MediaType["Mts"] = 5] = "Mts"
  MediaType[MediaType["Cts"] = 6] = "Cts"
  MediaType[MediaType["Dts"] = 7] = "Dts"
  MediaType[MediaType["Dmts"] = 8] = "Dmts"
  MediaType[MediaType["Dcts"] = 9] = "Dcts"
  MediaType[MediaType["Tsx"] = 10] = "Tsx"
  MediaType[MediaType["Css"] = 11] = "Css"
  MediaType[MediaType["Json"] = 12] = "Json"
  MediaType[MediaType["Jsonc"] = 13] = "Jsonc"
  MediaType[MediaType["Json5"] = 14] = "Json5"
  MediaType[MediaType["Html"] = 15] = "Html"
  MediaType[MediaType["Markdown"] = 16] = "Markdown"
  MediaType[MediaType["Sql"] = 17] = "Sql"
  MediaType[MediaType["Wasm"] = 18] = "Wasm"
  MediaType[MediaType["SourceMap"] = 19] = "SourceMap"
  MediaType[MediaType["Unknown"] = 20] = "Unknown"
  return MediaType
}({})
/** Kind of resolution. */ export var ResolutionMode = /*#__PURE__*/ function (
  ResolutionMode,
) {
  /** Resolving from an ESM file. */ ResolutionMode[
    ResolutionMode["Import"] = 0
  ] = "Import"
  /** Resolving from a CJS file. */ ResolutionMode[
    ResolutionMode["Require"] = 1
  ] = "Require"
  return ResolutionMode
}({})
_computedKey = Symbol.dispose
/** Resolves the workspace. */ export class Workspace {
  #inner
  #debug
  /** Creates a `DenoWorkspace` with the provided options. */ constructor(
    options = {},
  ) {
    this.#inner = new WasmWorkspace(options)
    this.#debug = options.debug ?? false
  }
  [_computedKey]() {
    this.#inner.free()
  }
  /** Creates a loader that uses this this workspace. */ async createLoader() {
    const wasmLoader = await this.#inner.create_loader()
    return new Loader(wasmLoader, this.#debug)
  }
}
export var RequestedModuleType = /*#__PURE__*/ function (RequestedModuleType) {
  RequestedModuleType[RequestedModuleType["Default"] = 0] = "Default"
  RequestedModuleType[RequestedModuleType["Json"] = 1] = "Json"
  RequestedModuleType[RequestedModuleType["Text"] = 2] = "Text"
  RequestedModuleType[RequestedModuleType["Bytes"] = 3] = "Bytes"
  return RequestedModuleType
}({})
_computedKey1 = Symbol.dispose
/** A loader for resolving and loading urls. */ export class Loader {
  #inner
  #debug
  /** @internal */ constructor(loader, debug) {
    if (!(loader instanceof WasmLoader)) {
      throw new Error("Get the loader from the workspace.")
    }
    this.#inner = loader
    this.#debug = debug
  }
  [_computedKey1]() {
    this.#inner.free()
  }
  /** Adds entrypoints to the loader.
   *
   * It's useful to specify entrypoints so that the loader can resolve
   * npm: and jsr: specifiers the same way that Deno does when not using
   * a lockfile.
   */ async addEntrypoints(entrypoints) {
    const messages = await this.#inner.add_entrypoints(entrypoints)
    return messages.map((message) => ({
      message,
    }))
  }
  /** Synchronously resolves a specifier using the given referrer and resolution mode.
   * @throws {ResolveError}
   */ resolveSync(specifier, referrer, resolutionMode) {
    if (this.#debug) {
      console.error(
        `DEBUG - Resolving '${specifier}' from '${
          referrer ?? "<undefined>"
        }' (${resolutionModeToString(resolutionMode)})`,
      )
    }
    try {
      const value = this.#inner.resolve_sync(
        specifier,
        referrer,
        resolutionMode,
      )
      if (this.#debug) {
        console.error(`DEBUG - Resolved to '${value}'`)
      }
      return value
    } catch (err) {
      Object.setPrototypeOf(err, ResolveError.prototype)
      throw err
    }
  }
  /** Asynchronously resolves a specifier using the given referrer and resolution mode.
   *
   * This is useful for resolving `jsr:` and `npm:` specifiers on the fly when they can't
   * be figured out from entrypoints, but it may cause multiple "npm install"s and different
   * npm or jsr resolution than Deno. For that reason it's better to provide the list of
   * entrypoints up front so the loader can create the npm and jsr graph, and then after use
   * synchronous resolution to resolve jsr and npm specifiers.
   *
   * @throws {ResolveError}
   */ async resolve(specifier, referrer, resolutionMode) {
    if (this.#debug) {
      console.error(
        `DEBUG - Resolving '${specifier}' from '${
          referrer ?? "<undefined>"
        }' (${resolutionModeToString(resolutionMode)})`,
      )
    }
    try {
      const value = await this.#inner.resolve(
        specifier,
        referrer,
        resolutionMode,
      )
      if (this.#debug) {
        console.error(`DEBUG - Resolved to '${value}'`)
      }
      return value
    } catch (err) {
      Object.setPrototypeOf(err, ResolveError.prototype)
      throw err
    }
  }
  /** Loads a specifier. */ load(specifier, requestedModuleType) {
    if (this.#debug) {
      console.error(
        `DEBUG - Loading '${specifier}' with type '${
          requestedModuleTypeToString(requestedModuleType) ?? "<default>"
        }'`,
      )
    }
    return this.#inner.load(specifier, requestedModuleType)
  }
  /** Gets the module graph.
   *
   * WARNING: This function is very unstable and the output may change between
   * patch releases.
   */ getGraphUnstable() {
    return this.#inner.get_graph()
  }
}
function requestedModuleTypeToString(moduleType) {
  switch (moduleType) {
    case RequestedModuleType.Bytes:
      return "bytes"
    case RequestedModuleType.Text:
      return "text"
    case RequestedModuleType.Json:
      return "json"
    case RequestedModuleType.Default:
      return undefined
    default: {
      const _never = moduleType
      return undefined
    }
  }
}
function resolutionModeToString(mode) {
  switch (mode) {
    case ResolutionMode.Import:
      return "import"
    case ResolutionMode.Require:
      return "require"
    default: {
      const _assertNever = mode
      return "unknown"
    }
  }
}
//# sourceMappingURL=mod.js.map
