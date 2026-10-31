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

export const MEDIA_INFO = {
  mp4:  { ext: "mp4",  mime: "video/mp4",        video: true,  encoders: ["aac"] },
  mov:  { ext: "mov",  mime: "video/quicktime",  video: true,  encoders: ["aac"] },
  webm: { ext: "webm", mime: "video/webm",       video: true },
  mkv:  { ext: "mkv",  mime: "video/x-matroska", video: true },
  ts:   { ext: "ts",   mime: "video/mp2t",       video: true,  encoders: ["aac"] },
  mp3:  { ext: "mp3",  mime: "audio/mpeg",       video: false, encoders: ["mp3"],  audioCodec: "mp3" },
  wav:  { ext: "wav",  mime: "audio/wav",        video: false },
  ogg:  { ext: "ogg",  mime: "audio/ogg",        video: false },
  flac: { ext: "flac", mime: "audio/flac",       video: false, encoders: ["flac"], audioCodec: "flac" },
  aac:  { ext: "aac",  mime: "audio/aac",        video: false, encoders: ["aac"],  audioCodec: "aac" },
  m4a:  { ext: "m4a",  mime: "audio/mp4",        video: false, encoders: ["aac"],  audioCodec: "aac" },
};
export const MEDIA_FORMATS = Object.keys(MEDIA_INFO);
export const MEDIA_PRESETS = ["potato", "small", "balanced", "high", "max"];

const ascii = (bytes,start,end)=>String.fromCharCode(...bytes.subarray(start,end));
const latin1 = (bytes,start,end) => new TextDecoder("latin1").decode(bytes.subarray(start,end));

export function detect_media_format(bytes) {
  if (!bytes || bytes.length < 12) return "unknown";

  // video
  if (ascii(bytes, 4, 8) === "ftyp") {
    const brand = ascii(bytes, 4, 8);
    if (brand === "qt  ") return "mov";
    if (brand === "M4A " || brand === "M4B ") return "m4a";
    return "mp4";
  }

  if (
    bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf
    && bytes[3] === 0xa3
  ) {
    return ascii(bytes, 0, Math.min(64, bytes.length)).includes("webm")
      ? "webm"
      : "mkv";
  }

  // audio
  if (ascii(bytes, 0, 4) === "OggS") return "ogg";
  if (ascii(bytes, 0, 4) === "fLaC") return "flac";
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WAVE") {
    return "wav";
  }
  if (ascii(bytes, 0, 3) === "ID3") return "mp3";
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) {
    return ((bytes[1] >> 1) & 3) === 0 ? "aac" : "mp3";
  }
  if (bytes[0] === 0x47 && bytes.length >= 189 && bytes[188] === 0x47) {
    return "ts";
  }
  return "unknown";
}

export function detect_document_format(b) {
  if (!b || b.length < 8) return "unknown";

  if (b[0] === 0x50 && b[1] === 0x4b && (b[2] === 3 || b[2] === 5)) {
    const head = latin1(b, 0, Math.min(b.length, 1024));
    if (head.includes("application/epub+zip")) return "epub";
    if (head.includes("application/vnd.oasis.opendocument.text")) return "odt";
    const tail = latin1(b, Math.max(0, b.length - 65536), b.length);
    if (tail.includes("word/document.xml")) return "docx";
    if (tail.includes("ppt/presentation.xml")) return "pptx";
    return "unknown";
  }

  const start = b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf ? 3 : 0;
  const text = latin1(b, start, Math.min(b.length, start + 1024)).trimStart();

  if (text.startsWith("%PDF")) return "pdf";
  if (text.startsWith("{\\rtf")) return "rtf";
  if (text.includes("<FictionBook")) return "fb2";
  if (/<opml[\s>]/i.test(text)) return "opml";
  if (text.startsWith("{") && text.includes('"nbformat"')) return "ipynb";
  if (/^<!doctype html|^<html/i.test(text)) return "html";
  if (/^\\documentclass|^\\begin\{document\}/.test(text)) return "tex";
  return "unknown";
}

// key = what the app calls it 
// read/write = pandoc's name for it
// binary: zip containers, passed as files. standalone: full document, not a fragment.
export const DOC_FORMATS = {
  //office and ebook containers
  docx:  { read: "docx", write: "docx", binary: true, mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  odt:   { read: "odt",  write: "odt",  binary: true, mime: "application/vnd.oasis.opendocument.text" },
  epub:  { read: "epub", write: "epub3", binary: true, mime: "application/epub+zip" },
  pptx:  {               write: "pptx", binary: true, mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
  rtf:   { read: "rtf",  write: "rtf", mime: "application/rtf" },
  fb2:   { read: "fb2",  write: "fb2", mime: "application/x-fictionbook+xml" },

  //web and slides
  html:     { read: "html", write: "html5", standalone: true, mime: "text/html" },
  revealjs: {               write: "revealjs", standalone: true, mime: "text/html" },
  slidy:    {               write: "slidy",    standalone: true, mime: "text/html" },

  //markdown family
  md:         { read: "markdown",   write: "markdown",   mime: "text/markdown" },
  gfm:        { read: "gfm",        write: "gfm",        mime: "text/markdown" },
  commonmark: { read: "commonmark", write: "commonmark", mime: "text/markdown" },

  //lightweight
  rst:      { read: "rst",       write: "rst" },
  org:      { read: "org",       write: "org" },
  textile:  { read: "textile",   write: "textile" },
  wiki:     { read: "mediawiki", write: "mediawiki" },
  dokuwiki: { read: "dokuwiki",  write: "dokuwiki" },
  jira:     { read: "jira",      write: "jira" },
  muse:     { read: "muse",      write: "muse" },
  adoc:     {                    write: "asciidoc" },
  xwiki:    {                    write: "xwiki" },
  zimwiki:  {                    write: "zimwiki" },
  tikiwiki: { read: "tikiwiki" },
  twiki:    { read: "twiki" },
  creole:   { read: "creole" },
  t2t:      { read: "t2t" },

  //technical
  tex:     { read: "latex",  write: "latex", standalone: true, mime: "application/x-tex" },
  beamer:  {                 write: "beamer", standalone: true, mime: "application/x-tex" },
  typ:     { read: "typst",  write: "typst" },
  texi:    {                 write: "texinfo" },
  man:     { read: "man",    write: "man" },
  ms:      {                 write: "ms" },
  haddock: { read: "haddock", write: "haddock" },
  ctx:     {                 write: "context", standalone: true },
  icml:    {                 write: "icml", standalone: true },

  //xml
  dbk:  { read: "docbook", write: "docbook", standalone: true, mime: "application/xml" },
  jats: { read: "jats",    write: "jats",    standalone: true, mime: "application/xml" },
  tei:  {                  write: "tei",     standalone: true, mime: "application/xml" },
  opml: { read: "opml",    write: "opml",    mime: "text/x-opml" },

  //notebooks
  ipynb:   { read: "ipynb",   write: "ipynb",   mime: "application/x-ipynb+json" },
  csljson: { read: "csljson", write: "csljson", mime: "application/json" },
  ris:     { read: "ris" },
  endnote: { read: "endnotexml" },

  //plain text
  txt: { write: "plain" },
};

export const DOCUMENT_FORMATS = Object.keys(DOC_FORMATS);
export const DOC_INPUTS  = DOCUMENT_FORMATS.filter((f) => DOC_FORMATS[f].read);
export const DOC_OUTPUTS = DOCUMENT_FORMATS.filter((f) => DOC_FORMATS[f].write);

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
  markdn: "md",
  latex: "tex",
  htm: "html",
  text: "txt",
  asciidoc: "adoc",
  asc: "adoc",
  mediawiki: "wiki",
  docbook: "dbk",
  typst: "typ",
  bibtex: "bib",
  texinfo: "texi",
  epub3: "epub",
  epub2: "epub",
};

const has_media_options = (o) =>
  Boolean(o.preset || o.trim || o.video || o.audio);

export const format_from_filename = (name) =>{
  const ext = String(name).split(".").pop().toLowerCase();
  return ALIASES[ext]??ext;
};

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

  // nanosvg
  if (svg) {
    register("svg", "png", async (bytes) => unwrap((await use(svg)).convert_svg_to_png(bytes)), 1);
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

  const use = (engine) => (typeof engine ==="function"?engine():engine);
  
  async function detect(bytes) {
    let format = "unknown";
    if (media) {format = detect_media_format(bytes);}
    if (format ==="unknown"&&docs){format = detect_document_format(bytes);}
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

    const is_media = DOMAIN[target_format]==="video"||DOMAIN[target_format]==="audio";
    if (path.length === 0 && media && is_media&&has_media_options(options)){ 
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
        ["document", DOCUMENT_FORMATS],
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
