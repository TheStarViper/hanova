import { createconverter } from "./converter.mjs";
import { createConvert } from "./create-convert.mjs";
import {
  IMAGE_FORMATS, VIDEO_FORMATS, AUDIO_FORMATS, DOCUMENT_FORMATS,
  MODEL_FORMAT_NAMES, DOC_INPUTS, DOC_OUTPUTS,
} from "./formats.mjs";

function lazy(fn){ //dynamic library loading
  let promise;
  return () => (promise??=fn().catch((error)=>{
    promise = undefined;
    throw error;
  }));
}

const loadCore = lazy(async () => (await import("../../build/image_core_module.js")).default());
const loadWebp = lazy(async () => (await import("../../build/webp_module.js")).default());
const loadSvgBridge = lazy(() => import("./svg-bridge.mjs"));
const loadMagickBridge = lazy(() => import("./imagemagick-bridge.mjs"));
const loadMediaBridge = lazy(() => import("./mediabunny-bridge.mjs"));
const loadDocBridge = lazy(() => import("./pandoc-bridge.mjs"));
const loadFfmpegBridge = lazy(()=>import("./ffmpeg-bridge.mjs"));
const loadAssimpBridge = lazy(()=> import("./assimp-bridge.mjs"));
const loadThreeBridge = lazy(()=>import("./three-bridge.mjs"));
const inBrowser = typeof document !=="undefined";

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
      const format = b.MAGICK_BY_NAME?.[name];
      if (format===undefined){throw new Error(`Imagemagick cant write "${name}"`);}
      return b.convert_bytes(bytes,format,quality,processor ? b.MAGICK_PROCESSORS?.[processor]:undefined);
    },
    detect_format: async (bytes)=>{
      await ensureMagick();
      return (await loadMagickBridge()).detect_format(bytes);
    },
  };

  const ffmpeg = inBrowser ? {convert_audio: async (bytes,to,options)=>(await loadFfmpegBridge()).convert_audio(bytes,to,options)} : undefined;
  const media = {
    convert_media: async (bytes, to, options) => (await loadMediaBridge()).convert_media(bytes, to, options),
  };

  const vector = inBrowser ?
    {render_svg: async (bytes,options)=>(await loadSvgBridge()).render_svg(bytes,options),
     trace_svg: async (bytes,options)=>(await loadSvgBridge()).trace_svg(bytes,options),
    }
    : undefined;

  const docs = {
    convert_document: async (bytes, to, options) => (await loadDocBridge()).convert_document(bytes, to, options),
    inputs: DOC_INPUTS,
    outputs: DOC_OUTPUTS,
  };

  const models = {
    convert_model: async (bytes,to,options)=>(await loadAssimpBridge()).convert_model(bytes,to,options),
  };

  const three = inBrowser ? { export_model: async (bytes,to,options)=>(await loadThreeBridge()).export_model(bytes,to,options)} : undefined;
  return createconverter({core: loadCore, webp: loadWebp, magick,media,docs,ffmpeg,vector,models,three});
}

/**
 * @returns {Promise<(target_format: string, bytes: Buffer<ArrayBuffer>, quality: number) => Promise<Buffer<ArrayBuffer>>> }
 */

export async function converterFactory(options) {
  return build(options).convert_image;
}

export async function universalFactory(options) {
  const c = build(options);
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
    model: (bytes,target,o) => 
      c.convert_model(target,bytes,o),
    modelFormats: MODEL_FORMAT_NAMES,
  });
  return { convert, ...c };
}

export const preload = {
  image: ()=>Promise.all([loadCore(),loadWebp(),loadSvg()]),
  media: ()=> loadMediaBridge(),
  document: ()=>loadDocBridge(),
};

export const probe_media = async (...args)=>(await loadMediaBridge()).probe_media(...args);
export const thumbnail_at = async (...args)=>(await loadMediaBridge()).thumbnail_at(...args);

export {
  ALIASES, 
  FORMATS, 
  IMAGE_FORMATS, 
  VIDEO_FORMATS, 
  AUDIO_FORMATS, 
  DOCUMENT_FORMATS,
  DOC_FORMATS, 
  MODEL_FORMATS, 
  MODEL_FORMAT_NAMES, 
  MEDIA_FORMATS, 
  MEDIA_INFO, 
  MEDIA_PRESETS,
} from "./formats.mjs";
export {createconverter} from "./converter.mjs";
export {format_from_filename} from "./utils.mjs";
export {ConvertError,simplifyerror,ErrorCode,to_convert_error} from "./errors.mjs";