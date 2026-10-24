// this is a harness for imagemagick-bridge.mjs for running it on Node and
// using it to do file I/O

import fs from "node:fs";
import { createRequire } from "node:module";
import { initializeImageMagick } from "./imagemagick-bridge.mjs";

export async function init() {
  const require = createRequire(import.meta.url);
  const wasmPath = require.resolve("@imagemagick/magick-wasm/magick.wasm");
  const wasmBytes = fs.readFileSync(wasmPath);
  await initializeImageMagick(wasmBytes);
}
