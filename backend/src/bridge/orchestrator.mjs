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

//dynamic lib loading
function lazy(fn){
  let promise;
  return () => (promise??=fn().catch((error)=>{
    promise = undefined;
    throw error;
  }));
}

const loadCore = lazy(async () => (await import("../../build/image_core_module.js")).default());
const loadWebp = lazy(async () => (await import("../../build/webp_module.js")).default());
const loadSvg = lazy(async () => (await import("../../build/svg_module.js")).default());
const loadMagickBridge = lazy(() => import("./imagemagick-bridge.mjs"));
const loadMediaBridge = lazy(() => import("./mediabunny-bridge.mjs"));
const loadDocBridge = lazy(() => import("./pandoc-bridge.mjs"));

const MAGICK_NAMES = ["png","gif", "avif", "tiff", "ico", "jxl", "qoi", "psd", "exr", "bmp", "webp", "pdf", "eps", "ai"];
const MAGICK_OUTPUT_ONLY = ["ico", "pdf", "eps", "ai"];

function build({magickInit}={}){
  const ensureMagick = lazy(async ()=>{await magickInit?.();});

  const magick = {
    formats: Object.fromEntries(MAGICK_NAMES.map((n)=>[n,n])),
    outputonly: MAGICK_OUTPUT_ONLY,
    processors: {ico: "ico"},
    convert_bytes: async (bytes,name,quality,processor)=>{
      await ensureMagick();
      const b = await loadMagickBridge();
      return b.convert_bytes(bytes,b.MAGICK_BY_NAME[name],quality,b.MAGICK_PROCESSOR[processor]);
    },
    detect_format: async (bytes)=>{
      await ensureMagick();
      return (await loadMagickBridge()).detect_format(bytes);
    },
  };

  const media = {
    convert_media: async (bytes, to, options) => (await loadMediaBridge()).convert_media(bytes, to, options),
  };

  const docs = {
    convert_document: async (bytes, to, options) => (await loadDocBridge()).convert_document(bytes, to, options),
    inputs: DOC_INPUTS,
    outputs: DOC_OUTPUTS,
  };

  return createconverter({});
}

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
