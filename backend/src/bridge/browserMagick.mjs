import magickWasmUrl from "@imagemagick/magick-wasm/magick.wasm?url";
import { initializeImageMagick } from "./imagemagick-bridge.mjs";

export async function initMagick() {
  const wasm = new URL(magickWasmUrl, import.meta.url);
  await initializeImageMagick(wasm);
}
