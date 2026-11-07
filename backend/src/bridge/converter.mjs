import { ConvertError, ErrorCode, to_convert_error } from "./errors.mjs";
import {
  EVERYFORMAT, IMAGE_FORMATS, VIDEO_FORMATS, AUDIO_FORMATS,
  DOCUMENT_FORMATS, MODEL_FORMAT_NAMES, MODEL_INPUTS, MODEL_OUTPUTS,
  MODEL_FORMATS,DOC_INPUTS,DOC_OUTPUTS,FORMATS,DOC_FORMATS,
  MEDIA_FORMATS,MEDIA_PRESETS,MEDIABUNNY_AUDIO,
  THREE_MODEL_OUTPUTS, FFMPEG_AUDIO, MEDIA_INFO, ALIASES, DOMAIN
} from "./formats.mjs";
import { detect_model_format, detect_media_format, detect_document_format, detect_svg } from "./detector.mjs";

export {
  EVERYFORMAT, IMAGE_FORMATS, VIDEO_FORMATS, AUDIO_FORMATS,
  DOCUMENT_FORMATS, MODEL_FORMAT_NAMES, MODEL_INPUTS, MODEL_OUTPUTS,
  MODEL_FORMATS,DOC_INPUTS,DOC_OUTPUTS,FORMATS,DOC_FORMATS,
  MEDIA_FORMATS,MEDIA_PRESETS,MEDIABUNNY_AUDIO,
  THREE_MODEL_OUTPUTS, FFMPEG_AUDIO, MEDIA_INFO, ALIASES, DOMAIN
} from "./formats.mjs";
export { detect_model_format, detect_media_format, detect_document_format, detect_svg } from "./detector.mjs";
export { ConvertError, simplifyerror } from "./errors.mjs";

const INDEX = Object.fromEntries(EVERYFORMAT.map((f, i) => [f, i]));
const N = EVERYFORMAT.length;

/**@type {Record<string,string>}*/

export function createconverter({ core, webp, magick, media, docs, ffmpeg,vector,models,three} = {}) {

  const table = Array.from({ length: N }, () => Array(N).fill(null));
  const has = (from, to) => table[INDEX[from]][INDEX[to]] !== null;

  function register(from, to, func, cost = 1) {
    if (INDEX[from] === undefined || INDEX[to] === undefined) {
      throw new Error(`register: unknown format ${from} -> ${to}`);
    }
    table[INDEX[from]][INDEX[to]] = { func, cost };
  }

  const STB_ENCODER = {
    png: "convert_to_png",
    jpg: "convert_to_jpeg",
    bmp: "convert_to_bmp",
    tga: "convert_to_tga",
    hdr: "convert_to_hdr",
  };

  if (core) {
    for (const from of Object.keys(STB_ENCODER)) {
      for (const to of Object.keys(STB_ENCODER)) {
        if (from !== to) {
          register(from, to, async (bytes, q) => unwrap((await use(core))[STB_ENCODER[to]](bytes, q)), 1);
        }
      }
    }
  }

  // libwebp
  if (webp) {
    register("png", "webp", async (bytes, q) => unwrap((await use(webp)).convert_to_webp(bytes, q)), 1);
    register("webp", "png", async (bytes) => unwrap((await use(webp)).convert_webp_to_png(bytes)), 1);
  }

  // svg
  if(vector){
    register("png","svg",(bytes,_q,options)=>vector.trace_svg(bytes,options),2);
    register("svg","png",(bytes,_q,options)=>vector.render_svg(bytes,options),1);
  }

  // magick
  if (magick) {
    const MAGICK_COST = 5;
    const READABLE = ["png", "jpg", "bmp", "tga", "hdr"];

    const WRITABLE = Object.keys(magick.formats).filter(
      (f) =>
        f !== "png" && INDEX[f] !== undefined
        && magick.formats[f] !== undefined,
    );

    const via = (to, proc) => (bytes, q) =>
      magick.convert_bytes(bytes, magick.formats[to], q, proc);

    for (const to of WRITABLE) {
      for (const from of READABLE) {
        if (!has(from, to)) {
          register(from, to, via(to, magick.processors?.[to]), MAGICK_COST);
        }
      }
    }

    if (magick.formats.png !== undefined) {
      for (const from of WRITABLE) {
        if (magick.outputonly?.includes(from)) continue;
        if (!has(from, "png")) register(from, "png", via("png"), MAGICK_COST);
      }
    }
  }

  // mediabunny
  const media_step = (to) => (bytes, _q, options) =>
    media.convert_media(bytes, to, options);

  if (media) {
    const link = (froms, tos) => {
      for (const a of froms) {
        for (const b of tos) if (a !== b) register(a, b, media_step(b), 1);
      }
    };
    link(VIDEO_FORMATS, VIDEO_FORMATS);
    link(VIDEO_FORMATS, MEDIABUNNY_AUDIO);
    link(MEDIABUNNY_AUDIO, MEDIABUNNY_AUDIO);
  }

  //ffmpeg
  const ffmpeg_step = (to) =>(bytes,_q,options)=>ffmpeg.convert_audio(bytes,to,options);
  if (ffmpeg){
    const FFMPEG_COST = 5;
    const writable = AUDIO_FORMATS.filter((f)=>FFMPEG_AUDIO[f]?.args);
    for (const a of [...VIDEO_FORMATS,...AUDIO_FORMATS]){
      for (const b of writable){
        if (a!==b&&!has(a,b)) {register(a,b,ffmpeg_step(b),FFMPEG_COST);}
      }
    }
  }

  //pandoc
  if (docs) {
    const doc_step = (from,to)=>(bytes,_q,options)=> docs.convert_document(bytes,to,{...options,from});
    for (const a of docs.inputs){
        for (const b of docs.outputs){
          if (a!==b){register(a,b,doc_step(a,b),1);}
        }
    }
  }

  if (models){
    const model_step = (from,to) => (bytes,_q,options)=>
      models.convert_model(bytes,to,{...options,from}); //FIX make actual function first
    for (const a of MODEL_INPUTS){
      for (const b of MODEL_OUTPUTS){
        if (a!==b){register(a,b,model_step(a,b),1);}
      }
    }
  }

  if (three){
    for (const to of THREE_MODEL_OUTPUTS){
      register("glb",to,(bytes,_q,options)=>three.export_model(bytes,to,options),2);
    }
  }

  function search_path(start, target) {
    if (start === target) return [];

    const distance = Array(N).fill(Infinity);
    const prev = Array(N).fill(null);
    const done = new Set();

    distance[start] = 0;

    while (true) {
      let cur = -1;
      for (let i = 0; i < N; i++) {
        if (
          !done.has(i) && distance[i] < Infinity
          && (cur === -1 || distance[i] < distance[cur])
        ) cur = i;
      }

      if (cur === -1) return null;
      if (cur === target) break;
      done.add(cur);

      for (let next = 0; next < N; next++) {
        const cell = table[cur][next];
        if (cell && distance[cur] + cell.cost < distance[next]) {
          distance[next] = distance[cur] + cell.cost;
          prev[next] = [cur, cell];
        }
      }
    }
    const path = [];
    for (let i = target; prev[i]; i = prev[i][0]) {
      path.unshift({
        from: EVERYFORMAT[prev[i][0]],
        to: EVERYFORMAT[i],
        func: prev[i][1].func,
      });
    }

    return path;
  }
  
  async function detect(bytes) {
    let format = "unknown";
    if (media) {format = detect_media_format(bytes);}
    if (format ==="unknown"&&docs){format = detect_document_format(bytes);}
    if (format ==="unknown") {format = detect_svg(bytes);}
    if (format ==="unknown") {format = detect_model_format(bytes);}
    if (format ==="unknown"&&core){format = (await use(core)).validate_file_format(bytes);}
    if (format ==="unknown"&&magick){format = await magick.detect_format(bytes);}
    return ALIASES[format] ?? format;
  }

  async function convert_universal(
    target_format,
    bytes,
    quality,
    options,
    domain,
  ) {
    const detected_format = options.from
    ? (ALIASES[options.from]??options.from)
    : await detect(bytes);

    target_format = ALIASES[target_format] ?? target_format;

    const current_index = INDEX[detected_format];
    const target_index = INDEX[target_format];

    if (current_index === undefined) {
      throw new ConvertError(
        ErrorCode.UnsupportedInput,
        `Unsupported Input Format: "${detected_format}"`,
      );
    }
    if (target_index === undefined) {
      throw new ConvertError(
        ErrorCode.UnsupportedOutput,
        `Unsupported Output Format: "${target_format}"`,
      );
    }
    if (domain && DOMAIN[target_format] !== domain) {
      throw new ConvertError(
        ErrorCode.UnsupportedOutput,
        `"${target_format}" is not ${
          domain === "image" ? "an" : "a"
        } ${domain} format`,
      );
    }

    if (options.signal?.aborted) {
      throw new ConvertError(ErrorCode.Cancelled, "Conversion was cancelled");
    }

    let path = search_path(current_index, target_index);
    if (!path) {
      throw new ConvertError(
        ErrorCode.NoPath,
        `No conversion path: "${detected_format}" -> "${target_format}"`,
      );
    }

    if (options.engine==="ffmpeg"&&
       ffmpeg&&
       DOMAIN[target_format]==="audio"&&
       (DOMAIN[detected_format]==="audio"||
       DOMAIN[detected_format]==="video")){
        path = [{from: detected_format, to: target_format, func: ffmpeg_step(target_format)}];
    }

    const is_media = DOMAIN[target_format]==="video"||DOMAIN[target_format]==="audio";
    if (path.length === 0 && is_media&&has_media_options(options)){ 
      const via_ffmpeg = MEDIA_INFO[target_format]?.engine ==="ffmpeg";
      if (via_ffmpeg ? ffmpeg : media){
        path = [{ from: target_format, to: target_format, func: (via_ffmpeg ? ffmpeg_step : media_step)(target_format) }];
      }
    }

    let data = bytes;
    for (const step of path) {
      if (options.signal?.aborted) {
        throw new ConvertError(ErrorCode.Cancelled, "Conversion was cancelled");
      }
      try {
        if (globalThis.process?.env?.DEBUG) {
          console.log(`Converting ${step.from} -> ${step.to}...`);
        }
        data = await step.func(data, quality, options);
      } catch (error) {
        const cause = to_convert_error(error, ErrorCode.NativeFailure);
        if (cause.code === ErrorCode.Cancelled) throw cause;
        throw new ConvertError(
          ErrorCode.StepFailed,
          `${step.from} -> ${step.to} failed: ${cause.message}`,
          { step: `${step.from} -> ${step.to}`, cause },
        );
      }
    }
    return data;
  }

  const convert_image = (target, bytes, quality) =>
    convert_universal(target, bytes, quality, {}, "image");
  const convert_video = (target, bytes, options = {}) =>
    convert_universal(target, bytes, options.quality, options, "video");
  const convert_audio = (target, bytes, options = {}) =>
    convert_universal(target, bytes, options.quality, options, "audio");
  const convert_document = (target,bytes,options={}) =>
    convert_universal(target,bytes, options.quality,options,"document");
  const convert_model = (target,bytes,options={}) =>
    convert_universal(target, bytes, options.quality, options, "model");

  // what can be read/writen
  function capabilities() {
    const out = {};
    for (
      const [kind, list] of [
        ["image", IMAGE_FORMATS],
        ["video", VIDEO_FORMATS],
        ["audio", AUDIO_FORMATS],
        ["document", DOCUMENT_FORMATS],
        ["model", MODEL_FORMAT_NAMES],
      ]
    ) {
      out[kind] = {
        inputs: list.filter((f) => table[INDEX[f]].some(Boolean)),
        outputs: list.filter((f) =>
          table.some((row) => row[INDEX[f]] !== null)
        ),
      };
    }
    return out;
  }
  return {
    convert_image,
    convert_video,
    convert_audio,
    convert_document,
    convert_model,
    search_path,
    capabilities,
  };
}


export function createConvert(
  { image, imageFormats = [], 
    media, mediaFormats = [],
    doc,docFormats =  [],
    model,modelFormats=[],
    maxBytes } = {},
) {
  return async function convert(bytes, target, options = {}) {
    try {
      if (!(bytes instanceof Uint8Array)) {
        throw new ConvertError(
          ErrorCode.UnsupportedInput,
          "Expected file as Uint8Array",
        );
      }
      if (bytes.length === 0) {
        throw new ConvertError(ErrorCode.CorruptInput, "file is empty");
      }
      const limit = options.maxBytes ?? maxBytes;
      if (limit && bytes.length > limit) {
        throw new ConvertError(
          ErrorCode.TooLarge,
          `File is ${bytes.length} bytes, limit is ${limit}`,
        );
      }

      target = ALIASES[target] ?? target;
      if (media && mediaFormats.includes(target)) {
        return await media(bytes, target, options);
      }
      if (image && imageFormats.includes(target)) {
        return await image(target, bytes, options.quality ?? 80);
      }
      if (doc && docFormats.includes(target)){
        return await doc(bytes,target,options);
      }
      if (model&& modelFormats.includes(target)){
        return await model(bytes,target,options);
      }

      throw new ConvertError(
        ErrorCode.UnsupportedOutput,
        `Unsupported output format: "${target}"`,
      );
    } catch (error) {
      throw to_convert_error(error, ErrorCode.NativeFailure);
    }
  };
}
