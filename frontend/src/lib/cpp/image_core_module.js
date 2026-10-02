// This code implements the `-sMODULARIZE` settings by taking the generated
// JS program code (INNER_JS_CODE) and wrapping it in a factory function.

// When targeting node and ES6 we use `await import ..` in the generated code
// so the outer function needs to be marked as async.
async function Module(moduleArg = {}) {
  var moduleRtn;

(function() {
  function a(c) {
    c = c.split("-")[0];
    for (c = c.split(".").slice(0, 3); c.length < 3;) {
      c.push("00");
    }
    c = c.map(e => e.padStart(2, "0"));
    return c.join("");
  }
  var b = typeof process !== "undefined" && process.versions?.node ? a(process.versions.node) : 2147483647;
  if (b < 180300) {
    throw Error(`This emscripten-generated code requires node v18.3.0 (detected v${[b / 10000 | 0, (b / 100 | 0) % 100, b % 100].join(".")})`);
  }
  if (b = typeof navigator !== "undefined" && navigator.userAgent) {
    var d = b.includes("Safari/") && !b.includes("Chrome/") && b.match(/Version\/(\d+\.?\d*\.?\d*)/) ? a(b.match(/Version\/(\d+\.?\d*\.?\d*)/)[1]) : 2147483647;
    if (d < 150000) {
      throw Error(`This emscripten-generated code requires Safari v15.0.0 (detected v${d})`);
    }
    d = b.match(/Firefox\/(\d+(?:\.\d+)?)/) ? parseFloat(b.match(/Firefox\/(\d+(?:\.\d+)?)/)[1]) : 2147483647;
    if (d < 79) {
      throw Error(`This emscripten-generated code requires Firefox v79 (detected v${d})`);
    }
    b = b.match(/Chrome\/(\d+(?:\.\d+)?)/) ? parseFloat(b.match(/Chrome\/(\d+(?:\.\d+)?)/)[1]) : 2147483647;
    if (b < 85) {
      throw Error(`This emscripten-generated code requires Chrome v85 (detected v${b})`);
    }
  }
})();
var f = moduleArg, aa = !!globalThis.window, ba = !!globalThis.WorkerGlobalScope, h = globalThis.process?.versions?.node && globalThis.process?.type != "renderer", ca = !aa && !h && !ba;
if (h) {
  let {createRequire:a} = await import("node:module");
  var require = a(import.meta.url);
}
var da = import.meta.url, q = "", fa, ha;
if (h) {
  if (!globalThis.process?.versions?.node || globalThis.process?.type == "renderer") {
    throw Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
  }
  var fs = require("node:fs");
  da.startsWith("file:") && (q = require("node:path").dirname(require("node:url").fileURLToPath(da)) + "/");
  ha = a => {
    a = v(a) ? new URL(a) : a;
    a = fs.readFileSync(a);
    w(Buffer.isBuffer(a));
    return a;
  };
  fa = async a => {
    a = v(a) ? new URL(a) : a;
    a = fs.readFileSync(a, void 0);
    w(Buffer.isBuffer(a));
    return a;
  };
  process.argv.slice(2);
} else if (!ca) {
  if (aa || ba) {
    try {
      q = (new URL(".", da)).href;
    } catch {
    }
    if (!globalThis.window && !globalThis.WorkerGlobalScope) {
      throw Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
    }
    fa = async a => {
      w(!v(a), "readAsync does not work with file:// URLs");
      a = await fetch(a, {credentials:"same-origin"});
      if (a.ok) {
        return a.arrayBuffer();
      }
      throw Error(a.status + " : " + a.url);
    };
  } else {
    throw Error("environment detection error");
  }
}
var ia = console.log.bind(console), x = console.error.bind(console);
w(!ba, "worker environment detected but not enabled at build time (add `worker` to `-sENVIRONMENT` to enable)");
w(!ca, "shell environment detected but not enabled at build time (add `shell` to `-sENVIRONMENT` to enable)");
var y;
globalThis.WebAssembly || x("no native wasm support detected");
var ja = !1;
function w(a, b) {
  a || A("Assertion failed" + (b ? ": " + b : ""));
}
var v = a => a.startsWith("file://");
function ka() {
  var a = la();
  w((a & 3) == 0);
  a == 0 && (a += 4);
  B[a >> 2] = 34821223;
  B[a + 4 >> 2] = 2310721022;
  B[0] = 1668509029;
}
function ma() {
  if (!ja) {
    var a = la();
    a == 0 && (a += 4);
    var b = B[a >> 2], d = B[a + 4 >> 2];
    b == 34821223 && d == 2310721022 || A(`Stack overflow! Stack cookie has been overwritten at ${C(a)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${C(d)} ${C(b)}`);
    B[0] != 1668509029 && A("Runtime error: The application has corrupted its heap memory area (address zero)!");
  }
}
var na = new Int16Array(1), oa = new Int8Array(na.buffer);
na[0] = 25459;
oa[0] === 115 && oa[1] === 99 || A("Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)");
function D(a) {
  Object.getOwnPropertyDescriptor(f, a) || Object.defineProperty(f, a, {configurable:!0, set() {
    A(`Attempt to set \`Module.${a}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`);
  }});
}
function E(a) {
  return () => w(!1, `call to '${a}' via reference taken before Wasm module initialization`);
}
function F(a) {
  Object.getOwnPropertyDescriptor(f, a) && A(`\`Module.${a}\` was supplied but \`${a}\` not included in INCOMING_MODULE_JS_API`);
}
function pa(a) {
  Object.getOwnPropertyDescriptor(f, a) || Object.defineProperty(f, a, {configurable:!0, get() {
    var b = `'${a}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
    a !== "FS_createPath" && a !== "FS_createDataFile" && a !== "FS_createPreloadedFile" && a !== "FS_preloadFile" && a !== "FS_unlink" && a !== "addRunDependency" && a !== "FS_createLazyFile" && a !== "FS_createDevice" && a !== "removeRunDependency" || (b += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you");
    A(b);
  }});
}
var qa, ra, I = !1;
function sa() {
  var a = J.buffer;
  K = new Int8Array(a);
  ta = new Int16Array(a);
  L = new Uint8Array(a);
  M = new Uint16Array(a);
  ua = new Int32Array(a);
  B = new Uint32Array(a);
  va = new Float32Array(a);
  wa = new Float64Array(a);
  xa = new BigInt64Array(a);
  ya = new BigUint64Array(a);
}
w(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set, "JS engine does not provide full typed array support");
function A(a) {
  f.onAbort?.(a);
  a = `Aborted(${a})`;
  x(a);
  ja = !0;
  a = new WebAssembly.RuntimeError(a);
  ra?.(a);
  throw a;
}
function za() {
  A("Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM");
}
function Aa(a) {
  return (...b) => {
    w(I, `native function \`${a}\` called before runtime initialization`);
    var d = N[a];
    w(d, `exported native function \`${a}\` not found`);
    w(b.length <= 1, `native function \`${a}\` called with ${b.length} args but expects 1`);
    return d(...b);
  };
}
var Ba;
async function Ca(a) {
  if (!y) {
    try {
      var b = await fa(a);
      return new Uint8Array(b);
    } catch {
    }
  }
  if (a == Ba && y) {
    a = new Uint8Array(y);
  } else {
    if (ha) {
      a = ha(a);
    } else {
      throw "both async and sync fetching of the wasm failed";
    }
  }
  return a;
}
async function Da(a, b) {
  try {
    var d = await Ca(a);
    return await WebAssembly.instantiate(d, b);
  } catch (c) {
    x(`failed to asynchronously prepare wasm: ${c}`), v(a) && x(`warning: Loading from a file URI (${a}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`), A(c);
  }
}
async function Ea(a) {
  var b = Ba;
  if (!y && !h) {
    try {
      var d = fetch(b, {credentials:"same-origin"});
      return await WebAssembly.instantiateStreaming(d, a);
    } catch (c) {
      x(`wasm streaming compile failed: ${c}`), x("falling back to ArrayBuffer instantiation");
    }
  }
  return Da(b, a);
}
var ta, ua, xa, K, va, wa, M, B, ya, L, Fa = a => {
  for (; a.length > 0;) {
    a.shift()(f);
  }
}, Ga = [], Ha = [], Ia = () => {
  var a = f.preRun.shift();
  Ha.push(a);
};
function C(a) {
  w(typeof a === "number", `ptrToString expects a number, got ${typeof a}`);
  return "0x" + (a >>> 0).toString(16).padStart(8, "0");
}
var O = a => {
  O.o || (O.o = {});
  O.o[a] || (O.o[a] = 1, h && (a = "warning: " + a), x(a));
}, Ja = globalThis.TextDecoder && new TextDecoder(), Ka = (a, b, d, c) => {
  d = b + d;
  if (c) {
    return d;
  }
  for (; a[b] && !(b >= d);) {
    ++b;
  }
  return b;
}, La = (a, b = 0, d, c) => {
  d = Ka(a, b, d, c);
  if (d - b > 16 && a.buffer && Ja) {
    return Ja.decode(a.subarray(b, d));
  }
  for (c = ""; b < d;) {
    var e = a[b++];
    if (e & 128) {
      var g = a[b++] & 63;
      if ((e & 224) == 192) {
        c += String.fromCharCode((e & 31) << 6 | g);
      } else {
        var m = a[b++] & 63;
        (e & 240) == 224 ? e = (e & 15) << 12 | g << 6 | m : ((e & 248) != 240 && O(`Invalid UTF-8 leading byte ${C(e)} encountered when deserializing a UTF-8 string in wasm memory to a JS string!`), e = (e & 7) << 18 | g << 12 | m << 6 | a[b++] & 63);
        e < 65536 ? c += String.fromCharCode(e) : (e -= 65536, c += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023));
      }
    } else {
      c += String.fromCharCode(e);
    }
  }
  return c;
}, P = (a, b, d) => {
  w(typeof a == "number", `UTF8ToString expects a number (got ${typeof a})`);
  return a ? La(L, a, b, d) : "";
};
class Ma {
  constructor(a) {
    this.m = a - 24;
  }
  init(a, b) {
    B[this.m + 16 >> 2] = 0;
    B[this.m + 4 >> 2] = a;
    B[this.m + 8 >> 2] = b;
  }
}
var Na = 0, Q = a => {
  for (var b = "";;) {
    var d = L[a++];
    if (!d) {
      return b;
    }
    b += String.fromCharCode(d);
  }
}, R = {}, S = {}, Oa = {}, U = class extends Error {
  constructor(a) {
    super(a);
    this.name = "BindingError";
  }
}, Pa = a => {
  throw new U(a);
};
function Qa(a, b, d = {}) {
  var c = b.name;
  if (!a) {
    throw new U(`type "${c}" must have a positive integer typeid pointer`);
  }
  if (S.hasOwnProperty(a)) {
    if (d.A) {
      return;
    }
    throw new U(`Cannot register type '${c}' twice`);
  }
  S[a] = b;
  delete Oa[a];
  R.hasOwnProperty(a) && (b = R[a], delete R[a], b.forEach(e => e()));
}
function V(a, b, d = {}) {
  return Qa(a, b, d);
}
var Ra = (a, b, d) => {
  switch(b) {
    case 1:
      return d ? c => K[c] : c => L[c];
    case 2:
      return d ? c => ta[c >> 1] : c => M[c >> 1];
    case 4:
      return d ? c => ua[c >> 2] : c => B[c >> 2];
    case 8:
      return d ? c => xa[c >> 3] : c => ya[c >> 3];
    default:
      throw new TypeError(`invalid integer width (${b}): ${a}`);
  }
}, Sa = a => {
  if (a === null) {
    return "null";
  }
  var b = typeof a;
  return b === "object" || b === "array" || b === "function" ? a.toString() : "" + a;
}, Ta = (a, b, d, c) => {
  if (b < d || b > c) {
    throw new TypeError(`Passing a number "${Sa(b)}" from JS side to C/C++ side to an argument of type "${a}", which is outside the valid range [${d}, ${c}]!`);
  }
}, Ua = [], W = [0, 1, , 1, null, 1, !0, 1, !1, 1], Va = a => {
  a > 9 && 0 === --W[a + 1] && (w(W[a] !== void 0, "decref for unallocated handle"), W[a] = void 0, Ua.push(a));
}, X = a => {
  if (!a) {
    throw new U(`Cannot use deleted val. handle = ${a}`);
  }
  w(a === 2 || W[a] !== void 0 && a % 2 === 0, `invalid handle: ${a}`);
  return W[a];
}, Y = a => {
  switch(a) {
    case void 0:
      return 2;
    case null:
      return 4;
    case !0:
      return 6;
    case !1:
      return 8;
    default:
      let b = Ua.pop() || W.length;
      W[b] = a;
      W[b + 1] = 1;
      return b;
  }
};
function Wa(a) {
  return this.g(B[a >> 2]);
}
var Xa = {name:"emscripten::val", g:a => {
  var b = X(a);
  Va(a);
  return b;
}, j:(a, b) => Y(b), l:Wa, i:null}, Ya = (a, b) => {
  switch(b) {
    case 4:
      return function(d) {
        return this.g(va[d >> 2]);
      };
    case 8:
      return function(d) {
        return this.g(wa[d >> 3]);
      };
    default:
      throw new TypeError(`invalid float width (${b}): ${a}`);
  }
}, Za = a => {
  for (; a.length;) {
    var b = a.pop();
    a.pop()(b);
  }
};
function $a(a) {
  for (var b = 1; b < a.length; ++b) {
    if (a[b] !== null && a[b].i === void 0) {
      return !0;
    }
  }
  return !1;
}
function ab(a, b, d, c, e) {
  (a < b || a > d) && e(`function ${c} called with ${a} arguments, expected ${b == d ? b : `${b} to ${d}`}`);
}
var bb = (a, b) => {
  if (void 0 === f[a].h) {
    var d = f[a];
    f[a] = function(...c) {
      if (!f[a].h.hasOwnProperty(c.length)) {
        throw new U(`Function '${b}' called with an invalid number of arguments (${c.length}) - expects one of (${f[a].h})!`);
      }
      return f[a].h[c.length].apply(this, c);
    };
    f[a].h = [];
    f[a].h[d.u] = d;
  }
}, cb = (a, b, d) => {
  if (f.hasOwnProperty(a)) {
    if (void 0 === d || void 0 !== f[a].h && void 0 !== f[a].h[d]) {
      throw new U(`Cannot register public name '${a}' twice`);
    }
    bb(a, a);
    if (f[a].h.hasOwnProperty(d)) {
      throw new U(`Cannot register multiple overloads of a function with the same number of arguments (${d})!`);
    }
    f[a].h[d] = b;
  } else {
    f[a] = b, f[a].u = d;
  }
}, db = (a, b) => {
  for (var d = [], c = 0; c < a; c++) {
    d.push(B[b + c * 4 >> 2]);
  }
  return d;
}, eb = class extends Error {
  constructor(a) {
    super(a);
    this.name = "InternalError";
  }
}, ib = [], kb = (a, b, d = !1) => {
  w(!d, "async bindings are only supported with JSPI");
  a = Q(a);
  (d = ib[b]) || (ib[b] = d = jb.get(b));
  w(jb.get(b) == d, "table mirror is out of date");
  if (typeof d != "function") {
    throw new U(`unknown function pointer with signature ${a}: ${b}`);
  }
  return d;
};
class lb extends Error {
}
var nb = a => {
  a = mb(a);
  var b = Q(a);
  Z(a);
  return b;
}, ob = (a, b) => {
  function d(g) {
    e[g] || S[g] || (Oa[g] ? Oa[g].forEach(d) : (c.push(g), e[g] = !0));
  }
  var c = [], e = {};
  b.forEach(d);
  throw new lb(`${a}: ` + c.map(nb).join([", "]));
}, pb = (a, b) => {
  function d(l) {
    l = b(l);
    if (l.length !== c.length) {
      throw new eb("Mismatched type converter count");
    }
    for (var k = 0; k < c.length; ++k) {
      V(c[k], l[k]);
    }
  }
  var c = [];
  c.forEach(l => Oa[l] = a);
  var e = Array(a.length), g = [], m = 0;
  for (let [l, k] of a.entries()) {
    S.hasOwnProperty(k) ? e[l] = S[k] : (g.push(k), R.hasOwnProperty(k) || (R[k] = []), R[k].push(() => {
      e[l] = S[k];
      ++m;
      m === g.length && d(e);
    }));
  }
  0 === g.length && d(e);
}, qb = a => {
  a = a.trim();
  var b = a.indexOf("(");
  if (b === -1) {
    return a;
  }
  w(a.endsWith(")"), "Parentheses for argument names should match.");
  return a.slice(0, b);
}, rb = (a, b, d) => {
  w(typeof d == "number", "stringToUTF8 requires a third parameter that specifies the length of the output buffer");
  var c = L;
  w(typeof a === "string", `stringToUTF8Array expects a string (got ${typeof a})`);
  if (d > 0) {
    d = b + d - 1;
    for (var e = 0; e < a.length; ++e) {
      var g = a.codePointAt(e);
      if (g <= 127) {
        if (b >= d) {
          break;
        }
        c[b++] = g;
      } else if (g <= 2047) {
        if (b + 1 >= d) {
          break;
        }
        c[b++] = 192 | g >> 6;
        c[b++] = 128 | g & 63;
      } else if (g <= 65535) {
        if (b + 2 >= d) {
          break;
        }
        c[b++] = 224 | g >> 12;
        c[b++] = 128 | g >> 6 & 63;
        c[b++] = 128 | g & 63;
      } else {
        if (b + 3 >= d) {
          break;
        }
        g > 1114111 && O(`Invalid Unicode code point ${C(g)} encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).`);
        c[b++] = 240 | g >> 18;
        c[b++] = 128 | g >> 12 & 63;
        c[b++] = 128 | g >> 6 & 63;
        c[b++] = 128 | g & 63;
        e++;
      }
    }
    c[b] = 0;
  }
}, sb = a => {
  for (var b = 0, d = 0; d < a.length; ++d) {
    var c = a.charCodeAt(d);
    c <= 127 ? b++ : c <= 2047 ? b += 2 : c >= 55296 && c <= 57343 ? (b += 4, ++d) : b += 3;
  }
  return b;
}, tb = globalThis.TextDecoder ? new TextDecoder("utf-16le") : void 0, ub = (a, b, d) => {
  w(a % 2 == 0, "pointer passed to UTF16ToString must be 2-byte aligned");
  a >>= 1;
  b = Ka(M, a, b / 2, d);
  if (b - a > 16 && tb) {
    return tb.decode(M.subarray(a, b));
  }
  for (d = ""; a < b; ++a) {
    d += String.fromCharCode(M[a]);
  }
  return d;
}, vb = (a, b, d) => {
  w(b % 2 == 0, "pointer passed to stringToUTF16 must be 2-byte aligned");
  w(typeof d == "number", "stringToUTF16 requires a third parameter that specifies the length of the output buffer");
  d ??= 2147483647;
  if (d < 2) {
    return 0;
  }
  d -= 2;
  var c = b;
  d = d < a.length * 2 ? d / 2 : a.length;
  for (var e = 0; e < d; ++e) {
    ta[b >> 1] = a.charCodeAt(e), b += 2;
  }
  ta[b >> 1] = 0;
  return b - c;
}, wb = a => a.length * 2, xb = (a, b, d) => {
  w(a % 4 == 0, "pointer passed to UTF32ToString must be 2-byte aligned");
  var c = "";
  a >>= 2;
  for (var e = 0; !(e >= b / 4); e++) {
    var g = B[a + e];
    if (!g && !d) {
      break;
    }
    c += String.fromCodePoint(g);
  }
  return c;
}, yb = (a, b, d) => {
  w(b % 4 == 0, "pointer passed to stringToUTF32 must be 4-byte aligned");
  w(typeof d == "number", "stringToUTF32 requires a third parameter that specifies the length of the output buffer");
  d ??= 2147483647;
  if (d < 4) {
    return 0;
  }
  var c = b;
  d = c + d - 4;
  for (var e = 0; e < a.length; ++e) {
    var g = a.codePointAt(e);
    g > 65535 && e++;
    ua[b >> 2] = g;
    b += 4;
    if (b + 4 > d) {
      break;
    }
  }
  ua[b >> 2] = 0;
  return b - c;
}, zb = a => {
  for (var b = 0, d = 0; d < a.length; ++d) {
    a.codePointAt(d) > 65535 && d++, b += 4;
  }
  return b;
}, Ab = [], Bb = a => {
  var b = Ab.length;
  Ab.push(a);
  return b;
}, Cb = (a, b) => {
  for (var d = Array(a), c = 0; c < a; ++c) {
    var e = c, g = B[b + c * 4 >> 2], m = S[g];
    if (void 0 === m) {
      throw a = `${`parameter ${c}`} has unknown type ${nb(g)}`, new U(a);
    }
    d[e] = m;
  }
  return d;
}, Db = (a, b, d) => {
  var c = [];
  a = a(c, d);
  c.length && (B[b >> 2] = Y(c));
  return a;
}, Eb = {}, Fb = a => {
  var b = Eb[a];
  return b === void 0 ? Q(a) : b;
}, Gb = [null, [], []], Hb = a => {
  var b = f["_" + a];
  w(b, `Cannot call unknown function ${a}, make sure it is exported`);
  return b;
}, Lb = (a, b, d, c) => {
  var e = {string:n => {
    var r = 0;
    if (n !== null && n !== void 0 && n !== 0) {
      r = sb(n) + 1;
      var u = Ib(r);
      rb(n, u, r);
      r = u;
    }
    return r;
  }, array:n => {
    var r = Ib(n.length);
    w(n.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
    K.set(n, r);
    return r;
  }};
  a = Hb(a);
  var g = [], m = 0;
  w(b !== "array", 'return type should not be "array"');
  if (c) {
    for (var l = 0; l < c.length; l++) {
      var k = e[d[l]];
      k ? (m === 0 && (m = Jb()), g[l] = k(c[l])) : g[l] = c[l];
    }
  }
  d = a(...g);
  return d = function(n) {
    m !== 0 && Kb(m);
    return b === "string" ? P(n) : b === "boolean" ? !!n : n;
  }(d);
};
w(W.length === 10);
f.print && (ia = f.print);
f.printErr && (x = f.printErr);
f.wasmBinary && (y = f.wasmBinary);
f.FS_createDataFile = za;
f.FS_createPreloadedFile = za;
F("fetchSettings");
F("logReadFiles");
F("loadSplitModule");
F("onMalloc");
F("onRealloc");
F("onFree");
F("onSbrkGrow");
w(typeof f.memoryInitializerPrefixURL == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
w(typeof f.pthreadMainPrefixURL == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
w(typeof f.cdInitializerPrefixURL == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
w(typeof f.filePackagePrefixURL == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
w(typeof f.read == "undefined", "Module.read option was removed");
w(typeof f.readAsync == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
w(typeof f.readBinary == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
w(typeof f.setWindowTitle == "undefined", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)");
w(typeof f.TOTAL_MEMORY == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
w(typeof f.ENVIRONMENT == "undefined", "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
w(typeof f.STACK_SIZE == "undefined", "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");
w(typeof f.wasmMemory == "undefined", "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");
w(typeof f.INITIAL_MEMORY == "undefined", "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
if (f.preInit) {
  for (typeof f.preInit == "function" && (f.preInit = [f.preInit]); f.preInit.length > 0;) {
    f.preInit.shift()();
  }
}
D("preInit");
f.ccall = Lb;
f.cwrap = (a, b, d, c) => (...e) => Lb(a, b, d, e, c);
"writeI53ToI64 writeI53ToI64Clamped writeI53ToI64Signaling writeI53ToU64Clamped writeI53ToU64Signaling readI53FromI64 readI53FromU64 convertI32PairToI53 convertI32PairToI53Checked convertU32PairToI53 getTempRet0 setTempRet0 zeroMemory exitJS withStackSave strError inetPton4 inetNtop4 inetPton6 inetNtop6 readSockaddr writeSockaddr readEmAsmArgs jstoi_q getExecutableName autoResumeAudioContext getDynCaller dynCall handleException keepRuntimeAlive runtimeKeepalivePush runtimeKeepalivePop callUserCallback maybeExit asyncLoad asmjsMangle mmapAlloc HandleAllocator getUniqueRunDependency addRunDependency removeRunDependency addOnInit addOnPostCtor addOnPreMain addOnExit STACK_SIZE STACK_ALIGN POINTER_SIZE ASSERTIONS convertJsFunctionToWasm getEmptyTableSlot updateTableMap getFunctionAddress addFunction removeFunction intArrayFromString intArrayToString stringToAscii stringToNewUTF8 registerKeyEventCallback maybeCStringToJsString findEventTarget getBoundingClientRect fillMouseEventData registerMouseEventCallback registerWheelEventCallback registerUiEventCallback registerFocusEventCallback fillDeviceOrientationEventData registerDeviceOrientationEventCallback fillDeviceMotionEventData registerDeviceMotionEventCallback screenOrientation fillOrientationChangeEventData registerOrientationChangeEventCallback fillFullscreenChangeEventData registerFullscreenChangeEventCallback JSEvents_requestFullscreen JSEvents_resizeCanvasForFullscreen registerRestoreOldStyle hideEverythingExceptGivenElement restoreHiddenElements setLetterbox softFullscreenResizeWebGLRenderTarget doRequestFullscreen fillPointerlockChangeEventData registerPointerlockChangeEventCallback registerPointerlockErrorEventCallback requestPointerLock fillVisibilityChangeEventData registerVisibilityChangeEventCallback registerTouchEventCallback fillGamepadEventData registerGamepadEventCallback registerBeforeUnloadEventCallback fillBatteryEventData registerBatteryEventCallback setCanvasElementSize getCanvasElementSize jsStackTrace getCallstack convertPCtoSourceLocation getEnvStrings checkWasiClock wasiRightsToMuslOFlags wasiOFlagsToMuslOFlags initRandomFill randomFill safeSetTimeout setImmediateWrapped safeRequestAnimationFrame clearImmediateWrapped registerPostMainLoop registerPreMainLoop getPromise makePromise addPromise idsToPromises makePromiseCallback findMatchingCatch incrementUncaughtExceptionCount decrementUncaughtExceptionCount Browser_asyncPrepareDataCounter isLeapYear ydayFromDate arraySum addDays getSocketFromFD getSocketAddress FS_createPreloadedFile FS_preloadFile FS_modeStringToFlags FS_getMode FS_fileDataToTypedArray FS_stdin_getChar FS_mkdirTree _setNetworkCallback heapObjectForWebGLType toTypedArrayIndex webgl_enable_ANGLE_instanced_arrays webgl_enable_OES_vertex_array_object webgl_enable_WEBGL_draw_buffers webgl_enable_WEBGL_multi_draw webgl_enable_EXT_polygon_offset_clamp webgl_enable_EXT_clip_control webgl_enable_WEBGL_polygon_mode emscriptenWebGLGet computeUnpackAlignedImageSize colorChannelsInGlTextureFormat emscriptenWebGLGetTexPixelData emscriptenWebGLGetUniform webglGetProgramUniformLocation webglGetUniformLocation webglPrepareUniformLocationsBeforeFirstUse webglGetLeftBracePos emscriptenWebGLGetVertexAttrib __glGetActiveAttribOrUniform writeGLArray registerWebGlEventCallback runAndAbortIfError ALLOC_NORMAL ALLOC_STACK allocate writeStringToMemory writeAsciiToMemory allocateUTF8 allocateUTF8OnStack demangle stackTrace getNativeTypeSize getFunctionArgsName createJsInvokerSignature getEnumValueType PureVirtualError getBasestPointer registerInheritedInstance unregisterInheritedInstance getInheritedInstance getInheritedInstanceCount getLiveInheritedInstances enumReadValueFromPointer installIndexedIterator genericPointerToWireType constNoSmartPtrRawPointerToWireType nonConstNoSmartPtrRawPointerToWireType init_RegisteredPointer RegisteredPointer RegisteredPointer_fromWireType runDestructor releaseClassHandle detachFinalizer attachFinalizer makeClassHandle init_ClassHandle ClassHandle throwInstanceAlreadyDeleted flushPendingDeletes setDelayFunction RegisteredClass shallowCopyInternalPointer downcastPointer upcastPointer validateThis char_0 char_9 makeLegalFunctionName count_emval_handles".split(" ").forEach(function(a) {
  pa(a);
});
"run out err callMain abort wasmExports writeStackCookie checkStackCookie INT53_MAX INT53_MIN bigintToI53Checked HEAP8 HEAPU8 HEAP16 HEAPU16 HEAP32 HEAPU32 HEAPF32 HEAPF64 HEAP64 HEAPU64 stackSave stackRestore stackAlloc createNamedFunction ptrToString getHeapMax growMemory ENV ERRNO_CODES DNS Protocols Sockets timers warnOnce readEmAsmArgsArray alignMemory wasmTable wasmMemory noExitRuntime addOnPreRun addOnPostRun freeTableIndexes functionsInTableMap setValue getValue PATH PATH_FS UTF8Decoder UTF8ArrayToString UTF8ToString stringToUTF8Array stringToUTF8 lengthBytesUTF8 AsciiToString UTF16Decoder UTF16ToString stringToUTF16 lengthBytesUTF16 UTF32ToString stringToUTF32 lengthBytesUTF32 stringToUTF8OnStack writeArrayToMemory JSEvents specialHTMLTargets findCanvasEventTarget currentFullscreenStrategy restoreOldWindowedStyle UNWIND_CACHE ExitStatus flush_NO_FILESYSTEM emSetImmediate emClearImmediate_deps emClearImmediate promiseMap uncaughtExceptionCount exceptionCaught ExceptionInfo Browser requestFullscreen requestFullScreen setCanvasSize getUserMedia createContext getPreloadedImageData__data wget MONTH_DAYS_REGULAR MONTH_DAYS_LEAP MONTH_DAYS_REGULAR_CUMULATIVE MONTH_DAYS_LEAP_CUMULATIVE SYSCALLS preloadPlugins FS_stdin_getChar_buffer FS_unlink FS_createPath FS_createDevice FS_readFile FS FS_root FS_mounts FS_devices FS_streams FS_nextInode FS_nameTable FS_currentPath FS_initialized FS_ignorePermissions FS_filesystems FS_syncFSRequests FS_lookupPath FS_getPath FS_hashName FS_hashAddNode FS_hashRemoveNode FS_lookupNode FS_createNode FS_destroyNode FS_isRoot FS_isMountpoint FS_isFile FS_isDir FS_isLink FS_isChrdev FS_isBlkdev FS_isFIFO FS_isSocket FS_flagsToPermissionString FS_nodePermissions FS_mayLookup FS_mayCreate FS_mayDelete FS_mayOpen FS_checkOpExists FS_nextfd FS_getStreamChecked FS_getStream FS_createStream FS_closeStream FS_dupStream FS_doSetAttr FS_chrdev_stream_ops FS_major FS_minor FS_makedev FS_registerDevice FS_getDevice FS_getMounts FS_syncfs FS_mount FS_unmount FS_lookup FS_mknod FS_statfs FS_statfsStream FS_statfsNode FS_create FS_mkdir FS_mkdev FS_symlink FS_rename FS_rmdir FS_readdir FS_readlink FS_stat FS_fstat FS_lstat FS_doChmod FS_chmod FS_lchmod FS_fchmod FS_doChown FS_chown FS_lchown FS_fchown FS_doTruncate FS_truncate FS_ftruncate FS_utime FS_open FS_close FS_isClosed FS_llseek FS_read FS_write FS_mmap FS_msync FS_ioctl FS_writeFile FS_cwd FS_chdir FS_createDefaultDirectories FS_createDefaultDevices FS_createSpecialDirectories FS_createStandardStreams FS_staticInit FS_init FS_quit FS_findObject FS_analyzePath FS_createFile FS_createDataFile FS_forceLoadFile FS_createLazyFile MEMFS TTY PIPEFS SOCKFS tempFixedLengthArray miniTempWebGLFloatBuffers miniTempWebGLIntBuffers GL AL GLUT EGL GLEW IDBStore SDL SDL_gfx print printErr jstoi_s InternalError BindingError throwInternalError throwBindingError registeredTypes awaitingDependencies typeDependencies tupleRegistrations structRegistrations sharedRegisterType whenDependentTypesAreResolved getTypeName getFunctionName heap32VectorToArray requireRegisteredType usesDestructorStack checkArgCount getRequiredArgCount createJsInvoker UnboundTypeError EmValType EmValOptionalType throwUnboundTypeError ensureOverloadTable exposePublicSymbol replacePublicSymbol embindRepr registeredInstances registeredPointers registerType integerReadValueFromPointer floatReadValueFromPointer assertIntegerRange readPointer runDestructors craftInvokerFunction embind__requireFunction finalizationRegistry detachFinalizer_deps deletionQueue delayFunction emval_freelist emval_handles emval_symbols getStringOrSymbol Emval emval_returnValue emval_lookupTypes emval_methodCallers emval_addMethodCaller".split(" ").forEach(pa);
var Mb = E("_malloc"), Z = E("_free"), mb = E("___getTypeName"), la = E("_emscripten_stack_get_end"), Nb = E("_emscripten_stack_init"), Kb = E("__emscripten_stack_restore"), Ib = E("__emscripten_stack_alloc"), Jb = E("_emscripten_stack_get_current"), J = E("wasmMemory"), jb = E("wasmTable"), Ob = {__assert_fail:(a, b, d, c) => A(`Assertion failed: ${P(a)}, at: ` + [b ? P(b) : "unknown filename", d, c ? P(c) : "unknown function"]), __cxa_throw:(a, b, d) => {
  (new Ma(a)).init(b, d);
  Na++;
  w(!1, "Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.");
}, _abort_js:() => A("native code called abort()"), _embind_register_bigint:(a, b, d, c, e) => {
  b = Q(b);
  var g = c === 0n, m = l => l;
  if (g) {
    let l = d * 8;
    m = k => BigInt.asUintN(l, k);
    e = m(e);
  }
  V(a, {name:b, g:m, j:(l, k) => {
    if (typeof k == "number") {
      k = BigInt(k);
    } else if (typeof k != "bigint") {
      throw new TypeError(`Cannot convert "${Sa(k)}" to ${b}`);
    }
    Ta(b, k, c, e);
    return k;
  }, l:Ra(b, d, !g), i:null});
}, _embind_register_bool:(a, b, d, c) => {
  b = Q(b);
  V(a, {name:b, g:function(e) {
    return !!e;
  }, j:function(e, g) {
    return g ? d : c;
  }, l:function(e) {
    return this.g(L[e]);
  }, i:null});
}, _embind_register_emval:a => V(a, Xa), _embind_register_float:(a, b, d) => {
  b = Q(b);
  V(a, {name:b, g:c => c, j:(c, e) => {
    if (typeof e != "number" && typeof e != "boolean") {
      throw new TypeError(`Cannot convert ${Sa(e)} to ${b}`);
    }
    return e;
  }, l:Ya(b, d), i:null});
}, _embind_register_function:(a, b, d, c, e, g, m) => {
  var l = db(b, d);
  a = Q(a);
  a = qb(a);
  e = kb(c, e, m);
  cb(a, function() {
    ob(`Cannot call ${a} due to unbound types`, l);
  }, b - 1);
  pb(l, k => {
    var n = [k[0], null].concat(k.slice(1));
    k = a;
    var r = a;
    var u = e, t = n.length;
    if (t < 2) {
      throw new U("argTypes array size mismatch! Must at least get return value and 'this' types!");
    }
    w(!m, "async bindings are only supported with JSPI");
    var G = n[1] !== null && !1, T = $a(n), fb = !n[0].v, ea = t - 2;
    var H = n.length - 2;
    for (var p = n.length - 1; p >= 2 && n[p].optional; --p) {
      H--;
    }
    p = n[0];
    var z = n[1];
    u = [r, Pa, u, g, Za, p.g.bind(p), z?.j.bind(z)];
    for (p = 2; p < t; ++p) {
      z = n[p], u.push(z.j.bind(z));
    }
    if (!T) {
      for (p = G ? 1 : 2; p < n.length; ++p) {
        n[p].i !== null && u.push(n[p].i);
      }
    }
    u.push(ab, H, ea);
    T = $a(n);
    ea = n.length - 2;
    p = [];
    H = ["fn"];
    G && H.push("thisWired");
    for (t = 0; t < ea; ++t) {
      p.push(`arg${t}`), H.push(`arg${t}Wired`);
    }
    p = p.join(",");
    H = H.join(",");
    p = `return function (${p}) {\n` + "checkArgCount(arguments.length, minArgs, maxArgs, humanName, throwBindingError);\n";
    T && (p += "var destructors = [];\n");
    var gb = T ? "destructors" : "null";
    z = "humanName throwBindingError invoker fn runDestructors fromRetWire toClassParamWire".split(" ");
    G && (p += `var thisWired = toClassParamWire(${gb}, this);\n`);
    for (t = 0; t < ea; ++t) {
      var hb = `toArg${t}Wire`;
      p += `var arg${t}Wired = ${hb}(${gb}, arg${t});\n`;
      z.push(hb);
    }
    p += (fb || m ? "var rv = " : "") + `invoker(${H});\n`;
    if (T) {
      p += "runDestructors(destructors);\n";
    } else {
      for (t = G ? 1 : 2; t < n.length; ++t) {
        G = t === 1 ? "thisWired" : "arg" + (t - 2) + "Wired", n[t].i !== null && (p += `${G}_dtor(${G});\n`, z.push(`${G}_dtor`));
      }
    }
    fb && (p += "var ret = fromRetWire(rv);\nreturn ret;\n");
    p += "}\n";
    z.push("checkArgCount", "minArgs", "maxArgs");
    p = `if (arguments.length !== ${z.length}){ throw new Error(humanName + "Expected ${z.length} closure arguments " + arguments.length + " given."); }\n${p}`;
    n = (new Function(z, p))(...u);
    r = Object.defineProperty(n, "name", {value:r});
    n = b - 1;
    if (!f.hasOwnProperty(k)) {
      throw new eb("Replacing nonexistent public symbol");
    }
    void 0 !== f[k].h && void 0 !== n ? f[k].h[n] = r : (f[k] = r, f[k].u = n);
    return [];
  });
}, _embind_register_integer:(a, b, d, c, e) => {
  b = Q(b);
  var g = l => l;
  if (c === 0) {
    var m = 32 - 8 * d;
    g = l => l << m >>> m;
    e = g(e);
  }
  V(a, {name:b, g, j:(l, k) => {
    if (typeof k != "number" && typeof k != "boolean") {
      throw new TypeError(`Cannot convert "${Sa(k)}" to ${b}`);
    }
    Ta(b, k, c, e);
    return k;
  }, l:Ra(b, d, c !== 0), i:null});
}, _embind_register_memory_view:(a, b, d) => {
  function c(g) {
    return new e(K.buffer, B[g + 4 >> 2], B[g >> 2]);
  }
  var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array][b];
  d = Q(d);
  V(a, {name:d, g:c, l:c}, {A:!0});
}, _embind_register_std_string:(a, b) => {
  b = Q(b);
  V(a, {name:b, g(d) {
    var c = P(d + 4, B[d >> 2], !0);
    Z(d);
    return c;
  }, j(d, c) {
    c instanceof ArrayBuffer && (c = new Uint8Array(c));
    var e = typeof c == "string";
    if (!(e || ArrayBuffer.isView(c) && c.BYTES_PER_ELEMENT == 1)) {
      throw new U("Cannot pass non-string to std::string");
    }
    var g = e ? sb(c) : c.length;
    var m = Mb(4 + g + 1), l = m + 4;
    B[m >> 2] = g;
    e ? rb(c, l, g + 1) : L.set(c, l);
    d !== null && d.push(Z, m);
    return m;
  }, l:Wa, i(d) {
    Z(d);
  }});
}, _embind_register_std_wstring:(a, b, d) => {
  d = Q(d);
  if (b === 2) {
    var c = ub;
    var e = vb;
    var g = wb;
  } else {
    w(b === 4, "only 2-byte and 4-byte strings are currently supported"), c = xb, e = yb, g = zb;
  }
  V(a, {name:d, g:m => {
    var l = c(m + 4, B[m >> 2] * b, !0);
    Z(m);
    return l;
  }, j:(m, l) => {
    if (typeof l != "string") {
      throw new U(`Cannot pass non-string to C++ string type ${d}`);
    }
    var k = g(l), n = Mb(4 + k + b);
    B[n >> 2] = k / b;
    e(l, n + 4, k + b);
    m !== null && m.push(Z, n);
    return n;
  }, l:Wa, i(m) {
    Z(m);
  }});
}, _embind_register_void:(a, b) => {
  b = Q(b);
  V(a, {v:!0, name:b, g:() => {
  }, j:() => {
  }});
}, _emval_create_invoker:(a, b, d) => {
  var c;
  [b, ...c] = Cb(a, b);
  var e = b.j.bind(b), g = c.map(k => k.l.bind(k));
  a--;
  var m = {toValue:X};
  a = g.map((k, n) => {
    var r = `argFromPtr${n}`;
    m[r] = k;
    return `${r}(args${n ? "+" + n * 8 : ""})`;
  });
  switch(d) {
    case 0:
      var l = "toValue(handle)";
      break;
    case 2:
      l = "new (toValue(handle))";
      break;
    case 3:
      l = "";
      break;
    case 1:
      m.getStringOrSymbol = Fb, l = "toValue(handle)[getStringOrSymbol(methodName)]";
  }
  l += `(${a})`;
  b.v || (m.toReturnWire = e, m.emval_returnValue = Db, l = `return emval_returnValue(toReturnWire, destructorsRef, ${l})`);
  l = `return function (handle, methodName, destructorsRef, args) {
${l}
}`;
  d = (new Function(Object.keys(m), l))(...Object.values(m));
  b = `methodCaller<(${c.map(k => k.name)}) => ${b.name}>`;
  return Bb(Object.defineProperty(d, "name", {value:b}));
}, _emval_decref:Va, _emval_get_property:(a, b) => {
  a = X(a);
  b = X(b);
  return Y(a[b]);
}, _emval_incref:a => {
  a > 9 && (W[a + 1] += 1);
}, _emval_invoke:(a, b, d, c, e) => Ab[a](b, d, c, e), _emval_new_cstring:a => Y(Fb(a)), _emval_new_object:() => Y({}), _emval_run_destructors:a => {
  var b = X(a);
  Za(b);
  Va(a);
}, _emval_set_property:(a, b, d) => {
  a = X(a);
  b = X(b);
  d = X(d);
  a[b] = d;
}, emscripten_resize_heap:a => {
  var b = L.length;
  a >>>= 0;
  w(a > b);
  if (a > 2147483648) {
    return x(`Cannot enlarge memory, requested ${a} bytes, but the limit is 2147483648 bytes!`), !1;
  }
  for (var d = 1; d <= 4; d *= 2) {
    var c = b * (1 + 0.2 / d);
    c = Math.min(c, a + 100663296);
    var e = Math, g = e.min;
    c = Math.max(a, c);
    w(65536, "alignment argument is required");
    e = g.call(e, 2147483648, Math.ceil(c / 65536) * 65536);
    a: {
      g = e;
      c = J.buffer.byteLength;
      try {
        J.grow((g - c + 65535) / 65536 | 0);
        sa();
        var m = 1;
        break a;
      } catch (l) {
        x(`growMemory: Attempted to grow heap from ${c} bytes to ${g} bytes, but got error: ${l}`);
      }
      m = void 0;
    }
    if (m) {
      return !0;
    }
  }
  x(`Failed to grow the heap from ${b} bytes to ${e} bytes, not enough memory!`);
  return !1;
}, fd_close:() => {
  A("fd_close called without SYSCALLS_REQUIRE_FILESYSTEM");
}, fd_seek:function() {
  return 70;
}, fd_write:(a, b, d, c) => {
  for (var e = 0, g = 0; g < d; g++) {
    var m = B[b >> 2], l = B[b + 4 >> 2];
    b += 8;
    for (var k = 0; k < l; k++) {
      var n = a, r = L[m + k], u = Gb[n];
      w(u);
      r === 0 || r === 10 ? ((n === 1 ? ia : x)(La(u)), u.length = 0) : u.push(r);
    }
    e += l;
  }
  B[c >> 2] = e;
  return 0;
}}, Pb, N;
N = await (async function() {
  function a(c) {
    c = N = c.exports;
    w(typeof c.malloc != "undefined", "missing Wasm export: malloc");
    w(typeof c.free != "undefined", "missing Wasm export: free");
    w(typeof c.__getTypeName != "undefined", "missing Wasm export: __getTypeName");
    w(typeof c.fflush != "undefined", "missing Wasm export: fflush");
    w(typeof c.emscripten_stack_get_end != "undefined", "missing Wasm export: emscripten_stack_get_end");
    w(typeof c.emscripten_stack_get_base != "undefined", "missing Wasm export: emscripten_stack_get_base");
    w(typeof c.strerror != "undefined", "missing Wasm export: strerror");
    w(typeof c.emscripten_stack_init != "undefined", "missing Wasm export: emscripten_stack_init");
    w(typeof c.emscripten_stack_get_free != "undefined", "missing Wasm export: emscripten_stack_get_free");
    w(typeof c._emscripten_stack_restore != "undefined", "missing Wasm export: _emscripten_stack_restore");
    w(typeof c._emscripten_stack_alloc != "undefined", "missing Wasm export: _emscripten_stack_alloc");
    w(typeof c.emscripten_stack_get_current != "undefined", "missing Wasm export: emscripten_stack_get_current");
    w(typeof c.memory != "undefined", "missing Wasm export: memory");
    w(typeof c.__indirect_function_table != "undefined", "missing Wasm export: __indirect_function_table");
    Mb = Aa("malloc");
    Z = Aa("free");
    mb = Aa("__getTypeName");
    la = c.emscripten_stack_get_end;
    Nb = c.emscripten_stack_init;
    Kb = c._emscripten_stack_restore;
    Ib = c._emscripten_stack_alloc;
    Jb = c.emscripten_stack_get_current;
    J = c.memory;
    jb = c.__indirect_function_table;
    sa();
    return N;
  }
  var b = f, d = {env:Ob, wasi_snapshot_preview1:Ob};
  if (f.instantiateWasm) {
    return new Promise((c, e) => {
      try {
        f.instantiateWasm(d, (g, m) => {
          c(a(g, m));
        });
      } catch (g) {
        x(`Module.instantiateWasm callback failed with error: ${g}`), e(g);
      }
    });
  }
  Ba ??= f.locateFile ? f.locateFile ? f.locateFile("image_core_module.wasm", q) : q + "image_core_module.wasm" : (new URL("image_core_module.wasm", import.meta.url)).href;
  return function(c) {
    w(f === b, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
    b = null;
    return a(c.instance);
  }(await Ea(d));
}());
(function() {
  function a() {
    w(!Pb);
    Pb = !0;
    f.calledRun = !0;
    if (!ja) {
      w(!I);
      I = !0;
      ma();
      N.__wasm_call_ctors();
      qa?.(f);
      f.onRuntimeInitialized?.();
      D("onRuntimeInitialized");
      w(!f._main, 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');
      ma();
      if (f.postRun) {
        for (typeof f.postRun == "function" && (f.postRun = [f.postRun]); f.postRun.length;) {
          var b = f.postRun.shift();
          Ga.push(b);
        }
      }
      D("postRun");
      Fa(Ga);
    }
  }
  Nb();
  ka();
  if (f.preRun) {
    for (typeof f.preRun == "function" && (f.preRun = [f.preRun]); f.preRun.length;) {
      Ia();
    }
  }
  D("preRun");
  Fa(Ha);
  f.setStatus ? (f.setStatus("Running..."), setTimeout(() => {
    setTimeout(() => f.setStatus(""), 1);
    a();
  }, 1)) : a();
  ma();
})();
I ? moduleRtn = f : moduleRtn = new Promise((a, b) => {
  qa = a;
  ra = b;
});
for (let a of Object.keys(f)) {
  a in moduleArg || Object.defineProperty(moduleArg, a, {configurable:!0, get() {
    A(`Access to module property ('${a}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
  }});
}
;


  return moduleRtn;
}

// Export using a UMD style export, or ES6 exports if selected
export default Module;

