import { ConvertError, ErrorCode, to_convert_error } from "./errors.mjs";
export { ConvertError, simplifyerror } from "./errors.mjs";

export const IMAGE_FORMATS = [
  "png",
  "jpg",
  "bmp",
  "hdr",
  "tga",
  "webp",
  "svg",
  "gif",
  "avif",
  "tiff",
  "ico",
  "jxl",
  "qoi",
  "psd",
  "exr",
  "pdf",
  "eps",
  "ai",
];

export const VIDEO_FORMATS = [
  "mp4",
  "mov",
  "webm",
  "mkv",
  "ts",
];

export const AUDIO_FORMATS = [
  "mp3",
  "wav",
  "ogg",
  "flac",
  "aac",
  "m4a",
];

export const DOCUMENT_FORMATS = [ //add more later FIX
    "docx",
    "odt",
    "epub",
    "html",
    "md",
    "rst",
    "tex",
    "txt"
];
export const FORMATS = IMAGE_FORMATS; // so stuff doesnt break remove later tho when migrated
export const EVERYFORMAT = [
  ...IMAGE_FORMATS,
  ...VIDEO_FORMATS,
  ...AUDIO_FORMATS,
  ...DOCUMENT_FORMATS,
];

const INDEX = Object.fromEntries(EVERYFORMAT.map((f, i) => [f, i]));
const N = EVERYFORMAT.length;

const DOMAIN = {};
for (const f of IMAGE_FORMATS) DOMAIN[f] = "image";
for (const f of VIDEO_FORMATS) DOMAIN[f] = "video";
for (const f of AUDIO_FORMATS) DOMAIN[f] = "audio";
for (const f of DOCUMENT_FORMATS) DOMAIN[f] = "document";

/**@type {Record<string,string>}*/
// formats that are the same with diff extensions
export const ALIASES = {
  //image
  jpeg: "jpg",
  jpe: "jpg",
  targa: "tga",
  icb: "tga",
  vda: "tga",
  vst: "tga",
  tif: "tiff",
  epsf: "eps",
  epsi: "epsi",

  //video
  m4v: "mp4",
  matroska: "mkv",
  oga: "ogg",
  wave: "wav",

  //documents
  markdown: "md",
  mkd: "md",
  mdown: "md",
  latex: "tex",
  htm: "html",
  text: "txt",
};

const has_media_options = (o) =>
  Boolean(o.preset || o.trim || o.video || o.audio);

export function createconverter({ core, webp, svg, magick, media, docs } = {}) {
  const unwrap = (r) => {
    if (Array.isArray(r) || r instanceof Uint8Array) return r;
    if (r && r.ok === false) {
      throw new ConvertError(
        ErrorCode.NativeFailure,
        `native conversion failed: ${
          r.error ?? r.errorType ?? "unknown error"
        }`,
      );
    }

    if (r?.data instanceof Uint8Array) {
      const out = r.data.slice();
      r.delete?.();
      return out;
    }
    throw new ConvertError(
      ErrorCode.NativeFailure,
      `unexpected native result: ${Object.keys(r ?? {})}`,
    );
  };

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
          register(
            from,
            to,
            (bytes, q) => unwrap(core[STB_ENCODER[to]](bytes, q)),
            1,
          );
        }
      }
    }
  }

  // libwebp
  if (webp) {
    register(
      "png",
      "webp",
      (bytes, q) => unwrap(webp.convert_to_webp(bytes, q)),
      1,
    );
    register(
      "webp",
      "png",
      (bytes) => unwrap(webp.convert_webp_to_png(bytes)),
      1,
    );
  }

  // nanosvg
  if (svg) {
    register("svg", "png", (bytes) => unwrap(svg.convert_svg_to_png(bytes)), 1);
  }

  // magick
  if (magick) {
    const MAGICK_COST = 5;
    const READABLE = ["png", "jpg", "bmp", "tga", "hdr"];
    const has = (from, to) => table[INDEX[from]][INDEX[to]] !== null;

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
    link(VIDEO_FORMATS, AUDIO_FORMATS);
    link(AUDIO_FORMATS, AUDIO_FORMATS);
  }

  //pandoc
  if (docs) {
    const doc_step = (from,to)=>(bytes,_q,options)=> docs.convert_document(bytes,to,{...options,from});
    for (const a of docs.inputs){
        for (const b of docs.outputs){
            if (a!==b){register(a,b,doc_step(a,b),1)}
        }
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
    let format = core ? core.validate_file_format(bytes) : "unknown";
    if (format === "unknown" && media) {
      format = await media.detect_format(bytes);
    }
    if (format === "unknown" && magick) {
      format = await magick.detect_format(bytes);
    }
    if (format==='unknown'&&docs){
        format = docs.detect_format(bytes);
    }
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

    let current_index = INDEX[detected_format];
    let target_index = INDEX[target_format];

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

    if (path.length === 0 && media && 
        (DOMAIN[target_format] === "video" || 
        DOMAIN[target_format] === "audio") 
        && has_media_options(options)) { {
        path = [{
        from: target_format,
        to: target_format,
        func: media_step(target_format),
      }];
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

  // what can be read/writen
  function capabilities() {
    const out = {};
    for (
      const [kind, list] of [
        ["image", IMAGE_FORMATS],
        ["video", VIDEO_FORMATS],
        ["audio", AUDIO_FORMATS],
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
    search_path,
    capabilities,
  };
}

export function createConvert(
  { image, imageFormats = [], media, mediaFormats = [],doc,docFormats =  [], maxBytes } = {},
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
      
      throw new ConvertError(
        ErrorCode.UnsupportedOutput,
        `Unsupported output format: "${target}"`,
      );
    } catch (error) {
      throw to_convert_error(error, ErrorCode.NativeFailure);
    }
  };
}