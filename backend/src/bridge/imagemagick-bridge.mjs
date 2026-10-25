// @ts-nocheck

import * as magickModule from "@imagemagick/magick-wasm";
import { ConvertError,ErrorCode,to_convert_error } from "./errors.mjs";

export const ImageError = ConvertError;
export const summarize_errors = (error)=>to_convert_error(error,ErrorCode.NativeFailure);
let ready = false;

export async function initializeImageMagickz(wasm) {
  await magickModule.initializeImageMagick(wasm);
  ready = true;
}

export const MAGICK_BY_NAME = {
  png: magickModule.MagickFormat.Png,
  gif: magickModule.MagickFormat.Gif,
  avif: magickModule.MagickFormat.Avif,
  tiff: magickModule.MagickFormat.Tiff,
  ico: magickModule.MagickFormat.Ico,
  jxl: magickModule.MagickFormat.Jxl,
  qoi: magickModule.MagickFormat.Qoi,
  psd: magickModule.MagickFormat.Psd,
  exr: magickModule.MagickFormat.Exr,
  bmp: magickModule.MagickFormat.Bmp,
  webp: magickModule.MagickFormat.WebP,
  pdf: magickModule.MagickFormat.Pdf,
  eps: magickModule.MagickFormat.Eps,
  ai: magickModule.MagickFormat.Ai,
  svg: magickModule.MagickFormat.svg
};

export const MAGICK_OUTPUT_ONLY = ["ico", "pdf", "eps", "ai"];

export const MAGICK_PROCESSORS = {
  ico: (image) => {
    if (image.width > 256 || image.height > 256) {
      image.resize(new magickModule.MagickGeometry(256, 256));
    }
  },
};

export async function convert_bytes(bytes, format, quality, processor) {
  let output;
  try {
    if(!ready){
        throw new ConvertError(
        ErrorCode.NativeFailure,
        "ImageMagick is not initialized. Call init() (Node) or initMagick() (browser) first.",
        );
    }
    magickModule.ImageMagick.read(bytes, (image) => {
      if (quality != null) image.quality = quality;
      if (processor) processor(image);
      image.write(format, (data) => {
        output = Uint8Array.from(data);
      });
    });
  } catch (error) {
    throw to_convert_error(error, ErrorCode.NativeFailure);
  }
  return output;
}

export async function detect_format(bytes) {
  if(!ready){return 'unknown';}
  try {
    let name = "unknown";
    magickModule.ImageMagick.read(bytes, (image) => {
      name = String(image.format).toLowerCase();
    });
    return name;
  } catch {
    return "unknown";
  }
}

export const FORMATS = {
  ".png": magickModule.MagickFormat.Png,
  ".jpg": magickModule.MagickFormat.Jpeg,
  ".jpeg": magickModule.MagickFormat.Jpeg,
  ".jpe": magickModule.MagickFormat.Jpeg,
  ".bmp": magickModule.MagickFormat.Bmp,
  ".webp": magickModule.MagickFormat.WebP,
  ".gif": magickModule.MagickFormat.Gif,
  ".avif": magickModule.MagickFormat.Avif,
  ".tiff": magickModule.MagickFormat.Tiff,
  ".tif": magickModule.MagickFormat.Tif,
  ".heic": magickModule.MagickFormat.Heic,
  ".heif": magickModule.MagickFormat.Heif,
  ".jxl": magickModule.MagickFormat.Jxl,
  ".ico": magickModule.MagickFormat.Ico,
  ".psd": magickModule.MagickFormat.Psd,
  ".pdf": magickModule.MagickFormat.Pdf, // FIX add document conversion
  ".eps": magickModule.MagickFormat.Eps,
  ".ai": magickModule.MagickFormat.Ai,
  ".ora": magickModule.MagickFormat.Ora,
  ".xcf": magickModule.MagickFormat.Xcf,
  ".qoi": magickModule.MagickFormat.Qoi,
  ".exr": magickModule.MagickFormat.Exr,

  // camera formats
  ".raw": magickModule.MagickFormat.Raw,
  ".dng": magickModule.MagickFormat.Dng,
  ".cr2": magickModule.MagickFormat.Cr2,
  ".cr3": magickModule.MagickFormat.Cr3,
  ".nef": magickModule.MagickFormat.Nef,
  ".arw": magickModule.MagickFormat.Arw,
  ".orf": magickModule.MagickFormat.Orf,
  ".rw2": magickModule.MagickFormat.Rw2,
  ".raf": magickModule.MagickFormat.Raf,
  ".pef": magickModule.MagickFormat.Pef,
  ".srw": magickModule.MagickFormat.Srw,
  ".x3f": magickModule.MagickFormat.X3f,
  ".3fr": magickModule.MagickFormat.ThreeFr,
  ".fff": magickModule.MagickFormat.Fff,
  ".iiq": magickModule.MagickFormat.Iiq,
  ".mos": magickModule.MagickFormat.Mos,
  ".mrw": magickModule.MagickFormat.Mrw,
};

export const {
  ImageMagick,
  Magick,
  MagickFormat,
  MagickColor,
  MagickGeometry,
  Channels,
  EvaluateOperator,
  initializeImageMagick,
} = magickModule;
