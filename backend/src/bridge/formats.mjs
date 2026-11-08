export const MODEL_FORMATS = /** @type {const} */ ({
  blend: {read: true, mime:"application/octet-stream"},
  glb: {read:true, write: "glb2", mime: "model/gltf-binary"},
  gltf: {read:true, write: "gltf2", mime: "model/gltf+json"},
  obj: {read: true, mime: "model/obj"},
  fbx: {read: true, mime: "application/octet-stream"},
  dae: {read: true, mime: "model/vnd.collada+xml"},
  stl: {read: true, mime: "model/stl"},
  ply: {read: true, mime: "application/octet-stream"},
  "3ds": {read: true, mime: "application/octet-stream"},
  "3mf": {read: true, mime: "model/3mf"},
  off: {read:true, mime: "application/octet-stream"},
  x: {read:true, mime: "application/octet-stream"},
  ase: {read:true, mime: "application/octet-stream"},
  lwo: {read:true, mime: "application/octet-stream"},
  dxf: {read:true, mime: "application/dxf"},
  ac: {read:true, mime: "application/octet-stream"},
  ms3d: {read:true, mime: "application/octet-stream"},
});

/**
 * @typedef {keyof MODEL_FORMATS} ModelFormat
 * @type {ModelFormat[]}
 */
export const MODEL_FORMAT_NAMES = Object.keys(MODEL_FORMATS);
export const MODEL_INPUTS = MODEL_FORMAT_NAMES.filter((f)=> MODEL_FORMATS[f].read);
export const MODEL_OUTPUTS = MODEL_FORMAT_NAMES.filter((f)=> MODEL_FORMATS[f].write);
export const THREE_MODEL_OUTPUTS = ["obj","stl","ply"];


export const IMAGE_FORMATS = /** @type {const} */ ([
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
]);

export const VIDEO_FORMATS = /** @type {const} */ ([
  "mp4",
  "mov",
  "webm",
  "mkv",
  "ts",
]);

export const FFMPEG_AUDIO = /** @type {const} */ ({
  mp3: {args: ["-c:a","libmp3lame", "-f","mp3"]},
  wav: {args: ["-c:a","pcm_s16le", "-f","wav"]},
  ogg: {args: ["-c:a","libopus", "-f","ogg"]},
  flac: {args: ["-c:a","flac", "-f","flac"]},
  aac: {args: ["-c:a","aac", "-f","adts"]},
  m4a: {args: ["-c:a","aac", "-f","ipod"]},

  //ffmpeg only
  aiff:{args: ["-c:a","pcm_s16be", "-f","aiff"],mime:"audio/aiff"},
  au:  {args: ["-c:a","pcm_s16be", "-f","au"  ],mime:"audio/basic"},
  caf: {args: ["-c:a","pcm_s16le", "-f","caf" ],mime:"audio/x-caf"},
  ac3: {args: ["-c:a","ac3"      , "-f","ac3" ],mime:"audio/ac3"},
  mp2: {args: ["-c:a","mp2"      , "-f","mp2" ],mime:"audio/mpeg"},
  wma: {args: ["-c:a","wmav2"    , "-f","asf" ],mime:"audio/x-ms-wma"},
  weba:{args: ["-c:a","libopus"  , "-f","webm"],mime:"audio/webm"},
  mka: {args: ["-c:a","libopus","-f","matroska"],mime:"audio/x-matroska"},
  m4r: {args: ["-c:a","aac"      , "-f","ipod"],mime:"audio/mp4"},
  alac:{args: ["-c:a","alac"     , "-f","ipod"],mime:"audio/mp4",ext:"m4a"},
  tta: {args: ["-c:a","tta"      , "-f","tta" ],mime:"audio/x-tta"},

  //input only
  amr: {mime: "audio/amr"},
});


export const MEDIABUNNY_AUDIO = /** @type {const} */ ([
  "mp3",
  "wav",
  "ogg",
  "flac",
  "aac",
  "m4a",
  "opus",
]);

/**
 * @typedef {keyof FFMPEG_AUDIO} FfmpegAudio  
 * @typedef {(typeof MEDIABUNNY_AUDIO)[number]} MediabunnyAudio
 * @type {(Exclude<FfmpegAudio, MediabunnyAudio>[]}  
*/
export const FFMPEG_ONLY_AUDIO = Object.keys(FFMPEG_AUDIO).filter((f) => !MEDIABUNNY_AUDIO.includes(f));
export const AUDIO_FORMATS = [...MEDIABUNNY_AUDIO,...FFMPEG_ONLY_AUDIO];

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
  opus: { ext: "opus", mime: "audio/ogg",        video: false, audioCodec: "opus"},
};


for (const f of FFMPEG_ONLY_AUDIO){
  const spec = FFMPEG_AUDIO[f];
  MEDIA_INFO[f]={ext:spec.ext??f,mime:spec.mime??"audio/octet-stream",video:false,engine:"ffmpeg"};
}

export const MEDIA_FORMATS = Object.keys(MEDIA_INFO);
export const MEDIA_PRESETS = ["potato", "small", "balanced", "high", "max"];

// read/write = pandoc's name for it
// binary: zip containers passed as files. 
// standalone: full document
export const DOC_FORMATS = /** @type {const} */ ({
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
});

/** 
 * @typedef {keyof DOC_FORMATS} DocumentFormat
 * @type {DocumentFormat[]}
 */
export const DOCUMENT_FORMATS = Object.keys(DOC_FORMATS);
export const DOC_INPUTS  = DOCUMENT_FORMATS.filter((f) => DOC_FORMATS[f].read);
export const DOC_OUTPUTS = DOCUMENT_FORMATS.filter((f) => DOC_FORMATS[f].write);

export const FORMATS = IMAGE_FORMATS; // so stuff doesnt break remove later tho when migrated

/**
 * @typedef {(typeof EVERYFORMAT)[number]} Format
 */
export const EVERYFORMAT = [
  ...IMAGE_FORMATS,
  ...VIDEO_FORMATS,
  ...AUDIO_FORMATS,
  ...DOCUMENT_FORMATS,
  ...MODEL_FORMAT_NAMES,
];

/**
 * @typedef {"image" | "video" | "audio" | "document" | "model"} MediaType
 * @type {Record<Format, MediaType>}
 */
export const DOMAIN = {};
for (const f of IMAGE_FORMATS) DOMAIN[f] = "image";
for (const f of VIDEO_FORMATS) DOMAIN[f] = "video";
for (const f of AUDIO_FORMATS) DOMAIN[f] = "audio";
for (const f of DOCUMENT_FORMATS) DOMAIN[f] = "document";
for (const f of MODEL_FORMAT_NAMES) DOMAIN[f] = "model";

// formats that are the same with diff extensions
/** @type Record<string, Format> */
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
  texinfo: "texi",
  epub3: "epub",
  epub2: "epub",

  //models
  collada: "dae",
  blender: "blend",
  glb2: "glb",
  gltf2: "gltf",
};