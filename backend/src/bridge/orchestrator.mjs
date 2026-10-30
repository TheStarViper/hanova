import createcore from "../../build/image_core_module.js";
import createsvg from "../../build/svg_module.js";
import createwebp from "../../build/webp_module.js";
import {
  AUDIO_FORMATS,
  createConvert,
  createconverter,
  IMAGE_FORMATS,
  VIDEO_FORMATS,
  DOCUMENT_FORMATS,
  DOC_INPUTS,
  DOC_OUTPUTS,
} from "./converter.mjs";
import * as bridge from "./imagemagick-bridge.mjs";
import * as mediabridge from "./mediabunny-bridge.mjs";
import * as docbridge from "./pandoc-bridge.mjs";

const magick = {
  convert_bytes: bridge.convert_bytes,
  detect_format: bridge.detect_format,
  formats: bridge.MAGICK_BY_NAME,
  outputonly: bridge.MAGICK_OUTPUT_ONLY,
  processors: bridge.MAGICK_PROCESSORS,
};

const media = {
  convert_media: mediabridge.convert_media,
  detect_format: mediabridge.detect_media_format,
};

const docs = {
    convert_document: docbridge.convert_document,
    detect_format: docbridge.detect_document_format,
    inputs: DOC_INPUTS,
    outputs: DOC_OUTPUTS,
};

let enginesPromise;
const engines = () => (
  enginesPromise ??= Promise.all([createcore(), createwebp(), createsvg()])
    .catch((error) => {
      enginesPromise = undefined;
      throw error;
    })
);

/**
 * @returns {Promise<(target_format: string, bytes: Buffer<ArrayBuffer>, quality: number) => Promise<Buffer<ArrayBuffer>>> }
 */

export async function converterFactory() {
  const [core, webp, svg] = await engines();
  return createconverter({ core, webp, svg, magick, media,docs }).convert_image;
}

export async function universalFactory() {
  const [core, webp, svg] = await engines();
  const c = createconverter({ core, webp, svg, magick, media,docs });
  const convert = createConvert({
    image: c.convert_image,
    imageFormats: IMAGE_FORMATS,
    media: (bytes, target, options) =>
      (
        AUDIO_FORMATS.includes(target) ? c.convert_audio : c.convert_video
      )(target, bytes, options),
    mediaFormats: [...VIDEO_FORMATS, ...AUDIO_FORMATS],
    doc: (bytes,target,options) =>
        c.convert_document(target,bytes,options),
    docFormats: DOCUMENT_FORMATS,
  });
  return { convert, ...c };
}

export {
  ALIASES,
  AUDIO_FORMATS,
  ConvertError,
  createconverter,
  FORMATS,
  IMAGE_FORMATS,
  simplifyerror,
  VIDEO_FORMATS,
  DOCUMENT_FORMATS,
  DOC_FORMATS,
  format_from_filename,
} from "./converter.mjs";
export { ErrorCode, to_convert_error } from "./errors.mjs";
export {
  MEDIA_FORMATS,
  MEDIA_INFO,
  MEDIA_PRESETS,
  probe_media,
  thumbnail_at,
} from "./mediabunny-bridge.mjs";
