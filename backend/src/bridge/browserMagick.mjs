import magickWasmUrl from "@imagemagick/magick-wasm/magick.wasm?url";
import { initializeImageMagickz } from "./imagemagick-bridge.mjs";

export async function initMagick() {
  const wasm = new URL(magickWasmUrl, import.meta.url);
  await initializeImageMagickz(wasm);
}
