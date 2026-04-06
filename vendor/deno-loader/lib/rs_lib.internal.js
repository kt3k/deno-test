// @generated file from wasmbuild -- do not edit
// @ts-nocheck: generated
// deno-lint-ignore-file
// deno-fmt-ignore-file

import { fetch_specifier } from "./snippets/rs_lib-aa8c88480f363a4a/helpers.js";
import { copy_bytes } from "./snippets/sys_traits-fdde735e1838e811/inline0.js";
import {
  closeSync,
  copyFileSync,
  fchmodSync,
  fdatasyncSync,
  fstatSync,
  fsyncSync,
  ftruncateSync,
  futimesSync,
  linkSync,
  lstatSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  readSync,
  realpathSync,
  renameSync,
  rmdirSync,
  rmSync,
  statSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
  writeSync,
} from "node:fs";
import { cwd, env, platform } from "node:process";

let wasm;
export function __wbg_set_wasm(val) {
  wasm = val;
}

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
  if (
    cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0
  ) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
  numBytesDecoded += len;
  if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
    cachedTextDecoder = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true,
    });
    cachedTextDecoder.decode();
    numBytesDecoded = len;
  }
  return cachedTextDecoder.decode(
    getUint8ArrayMemory0().subarray(ptr, ptr + len),
  );
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return decodeText(ptr, len);
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder();

if (!("encodeInto" in cachedTextEncoder)) {
  cachedTextEncoder.encodeInto = function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length,
    };
  };
}

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8ArrayMemory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = cachedTextEncoder.encodeInto(arg, view);

    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
  if (
    cachedDataViewMemory0 === null ||
    cachedDataViewMemory0.buffer.detached === true ||
    (cachedDataViewMemory0.buffer.detached === undefined &&
      cachedDataViewMemory0.buffer !== wasm.memory.buffer)
  ) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

function debugString(val) {
  // primitive types
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val);
  }
  if (className == "Object") {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className;
}

function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_externrefs.set(idx, obj);
  return idx;
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getArrayJsValueFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  const mem = getDataViewMemory0();
  const result = [];
  for (let i = ptr; i < ptr + 4 * len; i += 4) {
    result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
  }
  wasm.__externref_drop_slice(ptr, len);
  return result;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((state) => state.dtor(state.a, state.b));

function makeMutClosure(arg0, arg1, dtor, f) {
  const state = { a: arg0, b: arg1, cnt: 1, dtor };
  const real = (...args) => {
    // First up with a closure we increment the internal reference
    // count. This ensures that the Rust closure environment won't
    // be deallocated while we're invoking it.
    state.cnt++;
    const a = state.a;
    state.a = 0;
    try {
      return f(a, state.b, ...args);
    } finally {
      state.a = a;
      real._wbg_cb_unref();
    }
  };
  real._wbg_cb_unref = () => {
    if (--state.cnt === 0) {
      state.dtor(state.a, state.b);
      state.a = 0;
      CLOSURE_DTORS.unregister(state);
    }
  };
  CLOSURE_DTORS.register(real, state, state);
  return real;
}

function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_externrefs.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}

function passArrayJsValueToWasm0(array, malloc) {
  const ptr = malloc(array.length * 4, 4) >>> 0;
  for (let i = 0; i < array.length; i++) {
    const add = addToExternrefTable0(array[i]);
    getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
  }
  WASM_VECTOR_LEN = array.length;
  return ptr;
}
function wasm_bindgen__convert__closures_____invoke__he522cb1c3745fdd8(
  arg0,
  arg1,
  arg2,
) {
  wasm.wasm_bindgen__convert__closures_____invoke__he522cb1c3745fdd8(
    arg0,
    arg1,
    arg2,
  );
}

function wasm_bindgen__convert__closures_____invoke__h439a8085ef1830cb(
  arg0,
  arg1,
  arg2,
  arg3,
) {
  wasm.wasm_bindgen__convert__closures_____invoke__h439a8085ef1830cb(
    arg0,
    arg1,
    arg2,
    arg3,
  );
}

const DenoLoaderFinalization = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((ptr) => wasm.__wbg_denoloader_free(ptr >>> 0, 1));

export class DenoLoader {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(DenoLoader.prototype);
    obj.__wbg_ptr = ptr;
    DenoLoaderFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    DenoLoaderFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_denoloader_free(ptr, 0);
  }
  /**
   * @returns {any}
   */
  get_graph() {
    const ret = wasm.denoloader_get_graph(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {string[]} entrypoints
   * @returns {Promise<string[]>}
   */
  add_entrypoints(entrypoints) {
    const ptr0 = passArrayJsValueToWasm0(entrypoints, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.denoloader_add_entrypoints(this.__wbg_ptr, ptr0, len0);
    return ret;
  }
  /**
   * @param {string} specifier
   * @param {string | null | undefined} importer
   * @param {number} resolution_mode
   * @returns {string}
   */
  resolve_sync(specifier, importer, resolution_mode) {
    let deferred4_0;
    let deferred4_1;
    try {
      const ptr0 = passStringToWasm0(
        specifier,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      var ptr1 = isLikeNone(importer)
        ? 0
        : passStringToWasm0(
          importer,
          wasm.__wbindgen_malloc,
          wasm.__wbindgen_realloc,
        );
      var len1 = WASM_VECTOR_LEN;
      const ret = wasm.denoloader_resolve_sync(
        this.__wbg_ptr,
        ptr0,
        len0,
        ptr1,
        len1,
        resolution_mode,
      );
      var ptr3 = ret[0];
      var len3 = ret[1];
      if (ret[3]) {
        ptr3 = 0;
        len3 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred4_0 = ptr3;
      deferred4_1 = len3;
      return getStringFromWasm0(ptr3, len3);
    } finally {
      wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
  }
  /**
   * @param {string} specifier
   * @param {string | null | undefined} importer
   * @param {number} resolution_mode
   * @returns {Promise<string>}
   */
  resolve(specifier, importer, resolution_mode) {
    const ptr0 = passStringToWasm0(
      specifier,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    var ptr1 = isLikeNone(importer)
      ? 0
      : passStringToWasm0(
        importer,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
    var len1 = WASM_VECTOR_LEN;
    const ret = wasm.denoloader_resolve(
      this.__wbg_ptr,
      ptr0,
      len0,
      ptr1,
      len1,
      resolution_mode,
    );
    return ret;
  }
  /**
   * @param {string} url
   * @param {number} requested_module_type
   * @returns {Promise<any>}
   */
  load(url, requested_module_type) {
    const ptr0 = passStringToWasm0(
      url,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.denoloader_load(
      this.__wbg_ptr,
      ptr0,
      len0,
      requested_module_type,
    );
    return ret;
  }
}
if (Symbol.dispose) {
  DenoLoader.prototype[Symbol.dispose] = DenoLoader.prototype.free;
}

const DenoWorkspaceFinalization = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((ptr) =>
    wasm.__wbg_denoworkspace_free(ptr >>> 0, 1)
  );

export class DenoWorkspace {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    DenoWorkspaceFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_denoworkspace_free(ptr, 0);
  }
  /**
   * @param {any} options
   */
  constructor(options) {
    const ret = wasm.denoworkspace_new(options);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    this.__wbg_ptr = ret[0] >>> 0;
    DenoWorkspaceFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
  /**
   * @returns {Promise<DenoLoader>}
   */
  create_loader() {
    const ret = wasm.denoworkspace_create_loader(this.__wbg_ptr);
    return ret;
  }
}
if (Symbol.dispose) {
  DenoWorkspace.prototype[Symbol.dispose] = DenoWorkspace.prototype.free;
}

export function __wbg_Error_e83987f665cf5504(arg0, arg1) {
  const ret = Error(getStringFromWasm0(arg0, arg1));
  return ret;
}

export function __wbg_Number_bb48ca12f395cd08(arg0) {
  const ret = Number(arg0);
  return ret;
}

export function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
  const ret = String(arg1);
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68(arg0) {
  const v = arg0;
  const ret = typeof v === "boolean" ? v : undefined;
  return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
}

export function __wbg___wbindgen_debug_string_df47ffb5e35e6763(arg0, arg1) {
  const ret = debugString(arg1);
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg___wbindgen_in_bb933bd9e1b3bc0f(arg0, arg1) {
  const ret = arg0 in arg1;
  return ret;
}

export function __wbg___wbindgen_is_bigint_cb320707dcd35f0b(arg0) {
  const ret = typeof arg0 === "bigint";
  return ret;
}

export function __wbg___wbindgen_is_function_ee8a6c5833c90377(arg0) {
  const ret = typeof arg0 === "function";
  return ret;
}

export function __wbg___wbindgen_is_null_5e69f72e906cc57c(arg0) {
  const ret = arg0 === null;
  return ret;
}

export function __wbg___wbindgen_is_object_c818261d21f283a4(arg0) {
  const val = arg0;
  const ret = typeof val === "object" && val !== null;
  return ret;
}

export function __wbg___wbindgen_is_string_fbb76cb2940daafd(arg0) {
  const ret = typeof arg0 === "string";
  return ret;
}

export function __wbg___wbindgen_is_undefined_2d472862bd29a478(arg0) {
  const ret = arg0 === undefined;
  return ret;
}

export function __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147(arg0, arg1) {
  const ret = arg0 == arg1;
  return ret;
}

export function __wbg___wbindgen_memory_27faa6e0e73716bd() {
  const ret = wasm.memory;
  return ret;
}

export function __wbg___wbindgen_number_get_a20bf9b85341449d(arg0, arg1) {
  const obj = arg1;
  const ret = typeof obj === "number" ? obj : undefined;
  getDataViewMemory0().setFloat64(
    arg0 + 8 * 1,
    isLikeNone(ret) ? 0 : ret,
    true,
  );
  getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
}

export function __wbg___wbindgen_string_get_e4f06c90489ad01b(arg0, arg1) {
  const obj = arg1;
  const ret = typeof obj === "string" ? obj : undefined;
  var ptr1 = isLikeNone(ret)
    ? 0
    : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg___wbindgen_throw_b855445ff6a94295(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
}

export function __wbg__wbg_cb_unref_2454a539ea5790d9(arg0) {
  arg0._wbg_cb_unref();
}

export function __wbg_apply_8feec4e16df2d35b() {
  return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.apply(arg0, arg1, arg2);
    return ret;
  }, arguments);
}

export function __wbg_byteLength_bcd42e4025299788(arg0) {
  const ret = arg0.byteLength;
  return ret;
}

export function __wbg_call_525440f72fbfc0ea() {
  return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
  }, arguments);
}

export function __wbg_call_e762c39fa8ea36bf() {
  return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
  }, arguments);
}

export function __wbg_closeSync_acdb07abe6c4eb16() {
  return handleError(function (arg0) {
    closeSync(arg0);
  }, arguments);
}

export function __wbg_copyFileSync_03d05a9aca899a35() {
  return handleError(function (arg0, arg1, arg2, arg3) {
    copyFileSync(
      getStringFromWasm0(arg0, arg1),
      getStringFromWasm0(arg2, arg3),
    );
  }, arguments);
}

export function __wbg_copy_bytes_24897502cf6850c0(arg0, arg1, arg2) {
  copy_bytes(arg0, arg1, arg2 >>> 0);
}

export function __wbg_cwd_5f6d681206d33794() {
  return handleError(function (arg0) {
    const ret = cwd();
    const ptr1 = passStringToWasm0(
      ret,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  }, arguments);
}

export function __wbg_denoloader_new(arg0) {
  const ret = DenoLoader.__wrap(arg0);
  return ret;
}

export function __wbg_done_2042aa2670fb1db1(arg0) {
  const ret = arg0.done;
  return ret;
}

export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
  let deferred0_0;
  let deferred0_1;
  try {
    deferred0_0 = arg0;
    deferred0_1 = arg1;
    console.error(getStringFromWasm0(arg0, arg1));
  } finally {
    wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
  }
}

export function __wbg_error_af93cec861768235(arg0) {
  console.error(arg0);
}

export function __wbg_fchmodSync_ee1e5d099632e928() {
  return handleError(function (arg0, arg1) {
    fchmodSync(arg0, arg1 >>> 0);
  }, arguments);
}

export function __wbg_fdatasyncSync_64863eba4eba19cd() {
  return handleError(function (arg0) {
    fdatasyncSync(arg0);
  }, arguments);
}

export function __wbg_fetch_specifier_b0bd938586bac9e2(arg0, arg1, arg2, arg3) {
  let deferred0_0;
  let deferred0_1;
  try {
    deferred0_0 = arg0;
    deferred0_1 = arg1;
    const ret = fetch_specifier(getStringFromWasm0(arg0, arg1), arg2, arg3);
    return ret;
  } finally {
    wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
  }
}

export function __wbg_from_a4ad7cbddd0d7135(arg0) {
  const ret = Array.from(arg0);
  return ret;
}

export function __wbg_fstatSync_3c84501767f7e5a9() {
  return handleError(function (arg0) {
    const ret = fstatSync(arg0);
    return ret;
  }, arguments);
}

export function __wbg_fsyncSync_26a372e610fbd30f() {
  return handleError(function (arg0) {
    fsyncSync(arg0);
  }, arguments);
}

export function __wbg_ftruncateSync_4a2f31e734c53ffd() {
  return handleError(function (arg0, arg1) {
    ftruncateSync(arg0, arg1 >>> 0);
  }, arguments);
}

export function __wbg_futimesSync_2f9c9529bf2c73f5() {
  return handleError(function (arg0, arg1, arg2) {
    futimesSync(arg0, arg1, arg2);
  }, arguments);
}

export function __wbg_getRandomValues_f3b47ee8586bb9dc() {
  return handleError(function (arg0, arg1) {
    globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
  }, arguments);
}

export function __wbg_getTime_14776bfb48a1bff9(arg0) {
  const ret = arg0.getTime();
  return ret;
}

export function __wbg_get_7bed016f185add81(arg0, arg1) {
  const ret = arg0[arg1 >>> 0];
  return ret;
}

export function __wbg_get_efcb449f58ec27c2() {
  return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
  }, arguments);
}

export function __wbg_get_with_ref_key_1dc361bd10053bfe(arg0, arg1) {
  const ret = arg0[arg1];
  return ret;
}

export function __wbg_has_787fafc980c3ccdb() {
  return handleError(function (arg0, arg1) {
    const ret = Reflect.has(arg0, arg1);
    return ret;
  }, arguments);
}

export function __wbg_instanceof_ArrayBuffer_70beb1189ca63b38(arg0) {
  let result;
  try {
    result = arg0 instanceof ArrayBuffer;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}

export function __wbg_instanceof_Date_79a0f671f36947f2(arg0) {
  let result;
  try {
    result = arg0 instanceof Date;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}

export function __wbg_instanceof_Error_a944ec10920129e2(arg0) {
  let result;
  try {
    result = arg0 instanceof Error;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}

export function __wbg_instanceof_Uint8Array_20c8e73002f7af98(arg0) {
  let result;
  try {
    result = arg0 instanceof Uint8Array;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}

export function __wbg_isArray_96e0af9891d0945d(arg0) {
  const ret = Array.isArray(arg0);
  return ret;
}

export function __wbg_isBlockDevice_d742757eb2968a56(arg0) {
  const ret = arg0.isBlockDevice();
  return ret;
}

export function __wbg_isCharacterDevice_108ccc42df00d701(arg0) {
  const ret = arg0.isCharacterDevice();
  return ret;
}

export function __wbg_isDirectory_781fa396e235219d(arg0) {
  const ret = arg0.isDirectory();
  return ret;
}

export function __wbg_isFIFO_75b3aa4d1d7d2f49(arg0) {
  const ret = arg0.isFIFO();
  return ret;
}

export function __wbg_isFile_f68f6850a9099609(arg0) {
  const ret = arg0.isFile();
  return ret;
}

export function __wbg_isSafeInteger_d216eda7911dde36(arg0) {
  const ret = Number.isSafeInteger(arg0);
  return ret;
}

export function __wbg_isSocket_ed182b5b079e05b1(arg0) {
  const ret = arg0.isSocket();
  return ret;
}

export function __wbg_isSymbolicLink_541cfe7b62106b49(arg0) {
  const ret = arg0.isSymbolicLink();
  return ret;
}

export function __wbg_iterator_e5822695327a3c39() {
  const ret = Symbol.iterator;
  return ret;
}

export function __wbg_length_69bca3cb64fc8748(arg0) {
  const ret = arg0.length;
  return ret;
}

export function __wbg_length_cdd215e10d9dd507(arg0) {
  const ret = arg0.length;
  return ret;
}

export function __wbg_linkSync_635ef6b16a683c72() {
  return handleError(function (arg0, arg1, arg2, arg3) {
    linkSync(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
  }, arguments);
}

export function __wbg_lstatSync_c8bef5f22a409390() {
  return handleError(function (arg0, arg1) {
    const ret = lstatSync(getStringFromWasm0(arg0, arg1));
    return ret;
  }, arguments);
}

export function __wbg_message_1ee258909d7264fd(arg0) {
  const ret = arg0.message;
  return ret;
}

export function __wbg_mkdirSync_8088926ca64c658f() {
  return handleError(function (arg0, arg1, arg2) {
    mkdirSync(getStringFromWasm0(arg0, arg1), arg2);
  }, arguments);
}

export function __wbg_name_4810447ab1aad468(arg0) {
  const ret = arg0.name;
  return ret;
}

export function __wbg_new_1acc0b6eea89d040() {
  const ret = new Object();
  return ret;
}

export function __wbg_new_3c3d849046688a66(arg0, arg1) {
  try {
    var state0 = { a: arg0, b: arg1 };
    var cb0 = (arg0, arg1) => {
      const a = state0.a;
      state0.a = 0;
      try {
        return wasm_bindgen__convert__closures_____invoke__h439a8085ef1830cb(
          a,
          state0.b,
          arg0,
          arg1,
        );
      } finally {
        state0.a = a;
      }
    };
    const ret = new Promise(cb0);
    return ret;
  } finally {
    state0.a = state0.b = 0;
  }
}

export function __wbg_new_5a79be3ab53b8aa5(arg0) {
  const ret = new Uint8Array(arg0);
  return ret;
}

export function __wbg_new_68651c719dcda04e() {
  const ret = new Map();
  return ret;
}

export function __wbg_new_76221876a34390ff(arg0) {
  const ret = new Int32Array(arg0);
  return ret;
}

export function __wbg_new_8a6f238a6ece86ea() {
  const ret = new Error();
  return ret;
}

export function __wbg_new_e17d9f43105b08be() {
  const ret = new Array();
  return ret;
}

export function __wbg_new_e8a5bdfd3f45b6f6(arg0) {
  const ret = new SharedArrayBuffer(arg0 >>> 0);
  return ret;
}

export function __wbg_new_from_slice_92f4d78ca282a2d2(arg0, arg1) {
  const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
  return ret;
}

export function __wbg_new_no_args_ee98eee5275000a4(arg0, arg1) {
  const ret = new Function(getStringFromWasm0(arg0, arg1));
  return ret;
}

export function __wbg_next_020810e0ae8ebcb0() {
  return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
  }, arguments);
}

export function __wbg_next_2c826fe5dfec6b6a(arg0) {
  const ret = arg0.next;
  return ret;
}

export function __wbg_now_0a1ebe7ad05b54da() {
  const ret = globalThis.Date.now();
  return ret;
}

export function __wbg_openSync_2c99900a3950013a() {
  return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    const ret = openSync(
      getStringFromWasm0(arg0, arg1),
      getStringFromWasm0(arg2, arg3),
      arg4 === 0x100000001 ? undefined : arg4,
    );
    return ret;
  }, arguments);
}

export function __wbg_prototypesetcall_2a6620b6922694b2(arg0, arg1, arg2) {
  Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
}

export function __wbg_queueMicrotask_34d692c25c47d05b(arg0) {
  const ret = arg0.queueMicrotask;
  return ret;
}

export function __wbg_queueMicrotask_9d76cacb20c84d58(arg0) {
  queueMicrotask(arg0);
}

export function __wbg_readFileSync_8aa972e15cb70b43() {
  return handleError(function (arg0, arg1) {
    const ret = readFileSync(getStringFromWasm0(arg0, arg1));
    return ret;
  }, arguments);
}

export function __wbg_readSync_6b14ca2966e38d9a() {
  return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    const ret = readSync(
      arg0,
      getArrayU8FromWasm0(arg1, arg2),
      arg3 >>> 0,
      arg4 >>> 0,
      arg5 === 0 ? undefined : arg6,
    );
    return ret;
  }, arguments);
}

export function __wbg_readdirSync_18bd0712f1aabc45() {
  return handleError(function (arg0, arg1, arg2) {
    const ret = readdirSync(getStringFromWasm0(arg0, arg1), arg2);
    return ret;
  }, arguments);
}

export function __wbg_readlinkSync_fd2d4cba51a445e5() {
  return handleError(function (arg0, arg1, arg2) {
    const ret = readlinkSync(getStringFromWasm0(arg1, arg2));
    const ptr1 = passStringToWasm0(
      ret,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  }, arguments);
}

export function __wbg_realpathSync_205bd68cd6154ee1() {
  return handleError(function (arg0, arg1, arg2) {
    const ret = realpathSync(getStringFromWasm0(arg1, arg2));
    const ptr1 = passStringToWasm0(
      ret,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  }, arguments);
}

export function __wbg_renameSync_f8e2dae9e8c6b394() {
  return handleError(function (arg0, arg1, arg2, arg3) {
    renameSync(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
  }, arguments);
}

export function __wbg_resolve_caf97c30b83f7053(arg0) {
  const ret = Promise.resolve(arg0);
  return ret;
}

export function __wbg_rmSync_9c4635d446c23112() {
  return handleError(function (arg0, arg1, arg2) {
    rmSync(getStringFromWasm0(arg0, arg1), arg2);
  }, arguments);
}

export function __wbg_rmdirSync_e5b3817ad9d1df4c() {
  return handleError(function (arg0, arg1, arg2) {
    rmdirSync(getStringFromWasm0(arg0, arg1), arg2);
  }, arguments);
}

export function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
  arg0[arg1] = arg2;
}

export function __wbg_set_907fb406c34a251d(arg0, arg1, arg2) {
  const ret = arg0.set(arg1, arg2);
  return ret;
}

export function __wbg_set_c213c871859d6500(arg0, arg1, arg2) {
  arg0[arg1 >>> 0] = arg2;
}

export function __wbg_set_c2abbebe8b9ebee1() {
  return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(arg0, arg1, arg2);
    return ret;
  }, arguments);
}

export function __wbg_set_index_ae288d9699f45df6(arg0, arg1, arg2) {
  arg0[arg1 >>> 0] = arg2;
}

export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
  const ret = arg1.stack;
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_statSync_8cd412abfbdd5d1b() {
  return handleError(function (arg0, arg1) {
    const ret = statSync(getStringFromWasm0(arg0, arg1));
    return ret;
  }, arguments);
}

export function __wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e() {
  const ret = typeof global === "undefined" ? null : global;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}

export function __wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac() {
  const ret = typeof globalThis === "undefined" ? null : globalThis;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}

export function __wbg_static_accessor_NODE_PROCESS_ENV_ba18baf6ceb4ab6b() {
  const ret = env;
  return ret;
}

export function __wbg_static_accessor_NODE_PROCESS_PLATFORM_0dc8981388123d38(
  arg0,
) {
  const ret = platform;
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_static_accessor_PROCESS_GLOBAL_5ee7ad7456ba258a() {
  const ret = process;
  return ret;
}

export function __wbg_static_accessor_SELF_6fdf4b64710cc91b() {
  const ret = typeof self === "undefined" ? null : self;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}

export function __wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2() {
  const ret = typeof window === "undefined" ? null : window;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}

export function __wbg_symlinkSync_490b901a5cc59bcf() {
  return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    symlinkSync(
      getStringFromWasm0(arg0, arg1),
      getStringFromWasm0(arg2, arg3),
      arg4 === 0 ? undefined : getStringFromWasm0(arg4, arg5),
    );
  }, arguments);
}

export function __wbg_then_4f46f6544e6b4a28(arg0, arg1) {
  const ret = arg0.then(arg1);
  return ret;
}

export function __wbg_then_70d05cf780a18d77(arg0, arg1, arg2) {
  const ret = arg0.then(arg1, arg2);
  return ret;
}

export function __wbg_unlinkSync_4cde6ee852d0bba1() {
  return handleError(function (arg0, arg1) {
    unlinkSync(getStringFromWasm0(arg0, arg1));
  }, arguments);
}

export function __wbg_value_692627309814bb8c(arg0) {
  const ret = arg0.value;
  return ret;
}

export function __wbg_wait_f6114f09bcb9f2f3(arg0, arg1, arg2, arg3, arg4) {
  const ret = Atomics.wait(arg1, arg2 >>> 0, arg3, arg4);
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_writeFileSync_550b2109e6a4eedc() {
  return handleError(function (arg0, arg1, arg2, arg3) {
    writeFileSync(
      getStringFromWasm0(arg0, arg1),
      getArrayU8FromWasm0(arg2, arg3),
    );
  }, arguments);
}

export function __wbg_writeSync_6f0ade67bccb5175() {
  return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    const ret = writeSync(
      arg0,
      getArrayU8FromWasm0(arg1, arg2),
      arg3 >>> 0,
      arg4 >>> 0,
      arg5 === 0x100000001 ? undefined : arg5,
    );
    return ret;
  }, arguments);
}

export function __wbindgen_cast_2241b6af4c4b2941(arg0, arg1) {
  // Cast intrinsic for `Ref(String) -> Externref`.
  const ret = getStringFromWasm0(arg0, arg1);
  return ret;
}

export function __wbindgen_cast_25a0a844437d0e92(arg0, arg1) {
  var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
  wasm.__wbindgen_free(arg0, arg1 * 4, 4);
  // Cast intrinsic for `Vector(NamedExternref("string")) -> Externref`.
  const ret = v0;
  return ret;
}

export function __wbindgen_cast_4625c577ab2ec9ee(arg0) {
  // Cast intrinsic for `U64 -> Externref`.
  const ret = BigInt.asUintN(64, arg0);
  return ret;
}

export function __wbindgen_cast_9ae0607507abb057(arg0) {
  // Cast intrinsic for `I64 -> Externref`.
  const ret = arg0;
  return ret;
}

export function __wbindgen_cast_ba903f2e40f5fcff(arg0, arg1) {
  // Cast intrinsic for `Closure(Closure { dtor_idx: 640, function: Function { arguments: [Externref], shim_idx: 641, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
  const ret = makeMutClosure(
    arg0,
    arg1,
    wasm.wasm_bindgen__closure__destroy__h46cd663cd0254158,
    wasm_bindgen__convert__closures_____invoke__he522cb1c3745fdd8,
  );
  return ret;
}

export function __wbindgen_cast_d6cd19b81560fd6e(arg0) {
  // Cast intrinsic for `F64 -> Externref`.
  const ret = arg0;
  return ret;
}

export function __wbindgen_init_externref_table() {
  const table = wasm.__wbindgen_externrefs;
  const offset = table.grow(4);
  table.set(0, undefined);
  table.set(offset + 0, undefined);
  table.set(offset + 1, null);
  table.set(offset + 2, true);
  table.set(offset + 3, false);
}
