import type { Setting } from "#lib/components/Setting.svelte";
import type { Format } from "../backend";

export type TooltipKey = Format | Setting;

export interface TooltipDatum {
  title: string;
  blurb: string;
  url?: string;
}

export const TOOLTIP_DATA: Record<TooltipKey, TooltipDatum> = {
  // Images
  png: {
    title: "PNG",
    blurb:
      "Extremely popular lossless image format. Supports transparency. Near-universal compatibility, but fairly large file sizes.",
    url: "https://en.wikipedia.org/wiki/PNG",
  },
  jpg: {
    title: "JPEG",
    blurb:
      "The most common image format in the world. Lossy compression with visible artifacting, but fairly small file sizes.",
    url: "https://en.wikipedia.org/wiki/JPEG",
  },
  webp: {
    title: "WebP",
    blurb:
      "The best image format. Even higher-quality than PNG, even smaller file sizes than JPEG, supports both lossy and lossless compression, and supports animation. Decent compatibility.",
    url: "https://en.wikipedia.org/wiki/WebP",
  },
  bmp: {
    title: "BMP",
    blurb:
      "Very simple image format. Usually just raw, uncompressed pixel data plus some metadata.",
    url: "https://en.wikipedia.org/wiki/BMP_file_format",
  },
  avif: {
    title: "AVIF",
    blurb:
      "Extremely high compression-ratio image format, but slow encoding and decoding",
    url: "https://en.wikipedia.org/wiki/AVIF",
  },
  jxl: {
    title: "JPEG XL",
    blurb:
      "Image format with good compression ratio and encoding/decoding speed but very limited compatibility.",
    url: "https://en.wikipedia.org/wiki/JPEG_XL",
  },
  // heic: {
  //   title: "HEIF",
  //   blurb:
  //     "Image format with decent compression, mainly used for photos. Noteworthy for being the default image format on iPhone.",
  // },
  svg: {
    title: "SVG",
    blurb:
      "Vector image format that uses mathematical objects like circles and Bezier curves rather than pixels. Great for logos and icons, but terrible for photos.",
    url: "https://en.wikipedia.org/wiki/SVG",
  },
  gif: {
    title: "GIF",
    blurb:
      "Image format notable for supporting animation. Terrible image quality and animations have very large file sizes, but near-universal compatibility.",
    url: "https://en.wikipedia.org/wiki/GIF",
  },
  exr: {
    title: "EXR",
    blurb:
      "Image format that can store many layers and channels, mainly used for motion picture and 3d rendering work.",
    url: "https://en.wikipedia.org/wiki/OpenEXR",
  },
  eps: {
    title: "EPS",
    blurb:
      "Vector image format that used to be used in Adobe and Microsoft Office.",
    url: "https://en.wikipedia.org/wiki/Encapsulated_PostScript",
  },
  hdr: {
    title: "HDR",
    blurb:
      "Image format developed for light simulation software. High dynamic range.",
    url: "https://en.wikipedia.org/wiki/RGBE_image_format",
  },
  tga: {
    title: "TGA",
    blurb:
      "Image format mainly used for television and animation. High bit-depth and supports transparency.",
    url: "https://en.wikipedia.org/wiki/Truevision_TGA",
  },
  ico: {
    title: "ICO",
    blurb:
      "Image format used for icons on Windows, and for favicons on the web.",
    url: "https://en.wikipedia.org/wiki/ICO_(file_format)",
  },
  psd: {
    title: "PSD",
    blurb:
      "Image format used by Adobe Photoshop. Supports layers, masks, transparency, and lots of other features.",
    url: "https://en.wikipedia.org/wiki/Adobe_Photoshop#File_format",
  },
  tiff: {
    title: "TIFF",
    blurb: "Image format commonly used for scanning and faxing.",
    url: "https://en.wikipedia.org/wiki/TIFF",
  },
  qoi: {
    title: "QOI",
    blurb:
      "Image format designed for extremely fast encoding and decoding. Very limited compatibility.",
    url: "https://en.wikipedia.org/wiki/QOI_(image_format)",
  },
  ai: {
    title: "AI",
    blurb: "Vector image format used by Adobe Illustrator.",
    url:
      "https://www.adobe.com/creativecloud/file-types/image/vector/ai-file.html",
  },
  pdf: {
    title: "PDF",
    blurb: "Document format that can be used to store images",
    url: "https://en.wikipedia.org/wiki/PDF",
  },

  // Audio
  mp3: {
    title: "MP3",
    blurb:
      "The most common audio format in the world. Decent lossy quality and fairly small file sizes.",
    url: "https://en.wikipedia.org/wiki/MP3",
  },
  wav: {
    title: "WAV",
    blurb:
      "Lossless audio format with no compression. Very large file sizes, but very simple with excellent compability.",
    url: "https://en.wikipedia.org/wiki/WAV",
  },
  ogg: {
    title: "OGG",
    blurb: "Lossy audio format with great quality and decent compatibility.",
    url: "https://en.wikipedia.org/wiki/Ogg",
  },
  flac: {
    title: "FLAC",
    blurb:
      "Audio format with excellent lossless compression, but fairly large file sizes.",
    url: "https://en.wikipedia.org/wiki/FLAC",
  },
  aac: {
    title: "AAC",
    blurb:
      "Lossy audio format with good compression and excellent compatibility.",
    url: "https://en.wikipedia.org/wiki/Advanced_Audio_Coding",
  },
  m4a: {
    title: "M4A",
    blurb:
      "Lossy audio format with good compression and excellent compatibility.",
    url:
      "https://en.wikipedia.org/wiki/MP4_file_format#Filename_extensions:~:text=Audio%2Donly%20MPEG%2D4%20files%20generally%20have%20a%20%2Em4a%20%28MPEG%2D4%20Audio%29%20extension%2E",
  },
  opus: {
    title: "Opus",
    blurb:
      "The best audio format. The best quality and general-purpose compression of any extant audio codec, extremely fast encoding and decoding, and good compatibility.",
    url: "https://en.wikipedia.org/wiki/Opus_(audio_format)",
  },
  // Ffmpeg audio
  aiff: {
    title: "AIFF",
    blurb:
      "Uncompressed audio format developed by Apple. Also known as Audio Interchange File Format.",
    url: "https://en.wikipedia.org/wiki/Audio_Interchange_File_Format",
  },
  au: {
    title: "Au",
    blurb:
      "Lossy audio format developed by Sun Microsystems. Used in legacy Unix system audio. Also known as Sun Audio.",
    url: "https://en.wikipedia.org/wiki/Au_file_format",
  },
  caf: {
    title: "CAF",
    blurb:
      "Container audio format developed by Apple. Also known as Core Audio Format.",
    url: "https://en.wikipedia.org/wiki/Core_Audio_Format",
  },
  ac3: {
    title: "AC3",
    blurb:
      "Lossy audio format developed by Dolby, with many channels and surround sound. Used in DVDs and Blu-ray. Also known as Audio Codec 3..",
    url: "https://en.wikipedia.org/wiki/Dolby_Digital#Dolby_AC-3",
  },
  mp2: {
    title: "MP2",
    blurb:
      "Lossy audio format which is the predecessor of MP3. Commonly used in radio broadcasting. Also known as MPEG-1 Audio Layer II.",
    url: "https://en.wikipedia.org/wiki/MPEG-1_Audio_Layer_II",
  },
  wma: {
    title: "WMA",
    blurb:
      "Lossy audio format developed by Microsoft to compete with MP3. Also known as Windows Media Audio.",
    url: "https://en.wikipedia.org/wiki/Windows_Media_Audio",
  },
  weba: {
    title: "WebA",
    blurb:
      "Container audio format. Basically a WebM file but without the video. Also known as WebM Audio.",
    url: "https://en.wikipedia.org/wiki/WebM",
  },
  mka: {
    title: "MKA",
    blurb:
      "Container audio format. Basically an MKV file but without the video. Also known as Matroska Audio.",
    url: "https://en.wikipedia.org/wiki/Matroska",
  },
  m4r: {
    title: "M4R",
    blurb:
      "Lossy audio format using AAC codec. Used for ringtones on IOS. Also known as MPEG-4 Ringtone",
    url:
      "https://en.wikipedia.org/wiki/MP4_file_format#:~:text=The%20Apple%20iPhone%20uses%20MPEG%2D4%20audio%20for%20its%20ringtones%20but%20uses%20the%20%2Em4r%20extension%20rather%20than%20the%20%2Em4a%20extension",
  },
  alac: {
    title: "ALAC",
    blurb:
      "Lossless audio format developed by Apple. Also known as Apple Lossless Audio Codec.",
    url: "https://en.wikipedia.org/wiki/Apple_Lossless_Audio_Codec",
  },
  tta: {
    title: "TTA",
    blurb: "Lossless audio format. Also known as The True Audio.",
    url: "https://tta.sourceforge.net/en/true-audio-codec-tta/",
  },
  amr: {
    title: "AMR",
    blurb:
      "Lossy audio format designed specifically for speech. Also known as Adaptive Multi-Rate Audio Codec.",
    url: "https://en.wikipedia.org/wiki/Adaptive_Multi-Rate_audio_codec",
  },

  // Video
  mp4: {
    title: "MP4",
    blurb:
      "The most common video format in the world. Good quality and near-universal compatibility.",
    url: "https://en.wikipedia.org/wiki/MP4_file_format",
  },
  mov: {
    title: "MOV",
    blurb: "Video format used mainly in the Apple ecosystem.",
    url: "https://en.wikipedia.org/wiki/QuickTime_File_Format",
  },
  webm: {
    title: "WebM",
    blurb:
      "Video format with excellent quality. Great compatibility in browsers, but okayish compatibility in native applications.",
    url: "https://en.wikipedia.org/wiki/WebM",
  },
  mkv: {
    title: "MKV",
    blurb:
      "Video format with great quality. Low compatibility in browsers but high compatibility in native applications.",
    url: "https://en.wikipedia.org/wiki/Matroska",
  },
  ts: {
    title: "TS",
    blurb:
      "Specialized video format mainly used in broadcast television and live video streaming.",
    url: "https://en.wikipedia.org/wiki/MPEG_transport_stream",
  },

  // Documents
  docx: {
    title: "DOCX",
    blurb:
      "Document format used in Microsoft Word. Near-universal compatibility with word processing software. Also known as Office Open XML Document.",
    url: "https://www.adobe.com/acrobat/resources/document-files/docx.html",
  },
  odt: {
    title: "ODT",
    blurb:
      "Document format used in OpenOffice and LibreOffice. Great compatibility with word processing software, and meant to be an open-source vendor-agnostic alternative to DOCX. Also known as OpenDocument Format.",
    url: "https://en.wikipedia.org/wiki/OpenDocument",
  },
  epub: {
    title: "EPUB",
    blurb:
      "E-book format used by most e-readers (e.g. Amazon Kindle). Near-universal compatibility with e-reading software. Also known as Electronic Publication.",
    url: "https://en.wikipedia.org/wiki/EPUB",
  },
  pptx: {
    title: "PPTX",
    blurb:
      "Slideshow format used in Microsoft Powerpoint. Near-universal compatibility with slideshow software. Also known as Office Open XML Presentation.",
    url: "https://www.adobe.com/acrobat/resources/document-files/pptx.html",
  },
  rtf: {
    title: "RTF",
    blurb:
      "Document format used in WordPad. Great compatibility, but with word processing software. Also known as Rich Text Format.",
    url: "https://en.wikipedia.org/wiki/Rich_Text_Format",
  },
  fb2: {
    title: "FB2",
    blurb:
      "E-book format. Good compatibility with e-readers. Also known as FictionBook.",
    url: "https://en.wikipedia.org/wiki/FictionBook",
  },
  html: {
    title: "HTML",
    blurb:
      "Markup format used by web browsers. Universal compatibility with browsers. Hanova is (partially) written in it :D. Also known as Hypertext Markup Language.",
    url: "https://en.wikipedia.org/wiki/HTML",
  },
  revealjs: {
    title: "RevealJS",
    blurb:
      "Presentation format that renders to HTML. Can be displayed in all browsers, since it's just a webpage, but very little editing support.",
    url: "https://revealjs.com",
  },
  slidy: {
    title: "Slidy",
    blurb:
      "Presentation format that renders to HTML. Can be displayed in all browsers, since it's just a webpage, but very little editing support.",
    url: "https://www.w3.org/Talks/Tools/Slidy2/Overview.html",
  },
  md: {
    title: "MD",
    blurb:
      "Markup format that's easy to read and write. Extremely common and widely-used; used in READMEs, Obsidian, LLM chats, and more. Also known as Markdown.",
    url: "https://en.wikipedia.org/wiki/Markdown",
  },
  gfm: {
    title: "GFM",
    blurb:
      "Markup format that's a variant of Markdown. Basically just Markdown but with extra features like strikethrough. Also known as GitHub Flavored Markdown.",
    url: "https://en.wikipedia.org/wiki/Markdown#GitHub_Flavored_Markdown",
  },
  commonmark: {
    title: "CommonMark",
    blurb:
      "Markup format that's a variant of Markdown. Basically just a strict, standardized version of Markdown.",
    url: "https://commonmark.org/",
  },
  rst: {
    title: "RST",
    blurb:
      "Markup format used by Sphinx with more complex features than Markdown. Also known as reStructuredText.",
    url: "https://en.wikipedia.org/wiki/ReStructuredText",
  },
  org: {
    title: "Org",
    blurb:
      "Markup format used by Emacs. EXTREMELY feature-rich for note taking and organization, but fairly complex to learn. Also known as Org-mode.",
    url: "https://en.wikipedia.org/wiki/Org-mode",
  },
  textile: {
    title: "Textile",
    blurb: "Markup format that was a precursor to Markdown.",
    url: "https://textile-lang.com/",
  },
  wiki: {
    title: "MediaWiki",
    blurb: "Wiki markup format used by Wikipedia for writing wiki articles.",
    url: "https://www.mediawiki.org/wiki/Help:Formatting",
  },
  dokuwiki: {
    title: "DokuWiki",
    blurb:
      "Wiki markup format similar to MediaWiki, but simpler and easier to use.",
    url: "https://en.wikipedia.org/wiki/DokuWiki",
  },
  jira: {
    title: "Jira",
    blurb:
      "Wiki markup format formerly used by Jira before they (mostly) switched Markdown. ALso known as Confluence Wiki Markup.",
    url:
      "https://confluence.atlassian.com/doc/confluence-wiki-markup-251003035.html",
  },
  muse: {
    title: "Muse",
    blurb: "Markup format used by Emacs Muse.",
    url: "https://www.gnu.org/software/emacs-muse/",
  },
  adoc: {
    title: "Adoc",
    blurb:
      "Markup format that's slightly more powerful than Markdown while still being simple. Also known as AsciiDoc",
    url: "https://en.wikipedia.org/wiki/AsciiDoc",
  },
  xwiki: {
    title: "XWiki",
    blurb: "Wiki markup format used by the XWiki enterprise wiki software.",
    url: "https://en.wikipedia.org/wiki/XWiki",
  },
  zimwiki: {
    title: "Zim",
    blurb:
      "Wiki markup format used by the Zim personal knowledge base software.",
    url: "https://en.wikipedia.org/wiki/Zim_(software)",
  },
  tikiwiki: {
    title: "TikiWiki",
    blurb: "Wiki markup format used by the Tiki Wiki CMS Groupware software.",
    url: "https://en.wikipedia.org/wiki/Tiki_Wiki_CMS_Groupware",
  },
  twiki: {
    title: "TWiki",
    blurb: "Wiki markup format used by the Twiki wiki software.",
    url: "https://en.wikipedia.org/wiki/TWiki",
  },
  creole: {
    title: "Creole",
    blurb:
      "Wiki markup format created by combining the syntax of various other wiki markup formats.",
    url: "https://en.wikipedia.org/wiki/Creole_(markup)",
  },
  t2t: {
    title: "T2T",
    blurb:
      "Markup format that was a precursor to Markdown. Also known as txt2tags.",
    url: "https://en.wikipedia.org/wiki/Txt2tags",
  },
  tex: {
    title: "LaTeX",
    blurb:
      "Markup format used for typesetting documents based on TeX. Very widely-used in academia.",
    url: "https://en.wikipedia.org/wiki/TeX",
  },
  beamer: {
    title: "Beamer",
    blurb: "Presentation format based on LaTeX.",
    url: "https://en.wikipedia.org/wiki/Beamer_(LaTeX)",
  },
  typ: {
    title: "Typst",
    blurb: "Markup format meant as an easier-to-use alternative to LaTeX.",
    url: "https://en.wikipedia.org/wiki/Typst",
  },
  texi: {
    title: "TEXI",
    blurb:
      "Markup format used for typesetting documents. Used by GNU. Also known as Texinfo.",
    url: "https://en.wikipedia.org/wiki/Texinfo",
  },
  man: {
    title: "MAN",
    blurb: "Markup format used for Unix manual pages. Also known as Roff.",
    url: "https://en.wikipedia.org/wiki/Roff_(software)",
  },
  ms: {
    title: "MS",
    blurb: "Markup format used for typesetting documents using Roff tools.",
    url: "https://www.gnu.org/software/groff/manual/groff.html.node/ms.html",
  },
  haddock: {
    title: "Haddock",
    blurb:
      "Markup format used for generating documentation from Haskell comments.",
    url: "https://en.wikipedia.org/wiki/Haddock_(software)",
  },
  ctx: {
    title: "CTX",
    blurb:
      "Markup format used for typesetting documents. Alternative to LaTeX; also based on TeX. Also known as ConTeXt",
    url: "https://en.wikipedia.org/wiki/ConTeXt",
  },
  icml: {
    title: "ICML",
    blurb:
      "Markup format used for typesetting documents with Adobe InCopy. Also known as InCopy Markup Language.",
    url:
      "https://helpx.adobe.com/incopy/desktop/work-with-indesign/managed-files/stand-alone-documents.html",
  },
  dbk: {
    title: "DBK",
    blurb:
      "Markup format used for technical documentation. Also known as DocBook.",
    url: "https://en.wikipedia.org/wiki/DocBook",
  },
  jats: {
    title: "JATS",
    blurb:
      "Markup format used for scientific literature. Also known as Journal Article Tag Suite.",
    url: "https://en.wikipedia.org/wiki/Journal_Article_Tag_Suite",
  },
  tei: {
    title: "TEI",
    blurb:
      "Markup format used in academia to encode semantics and grammar. Also known as Text Encoding Intiative.",
    url: "https://en.wikipedia.org/wiki/Text_Encoding_Initiative",
  },
  opml: {
    title: "OPML",
    blurb:
      "Outline format used for mind maps and RSS feed lists. ALso known as Outline Processor Markup Language.",
    url: "https://en.wikipedia.org/wiki/OPML",
  },
  ipynb: {
    title: "IPYNB",
    blurb:
      "Notebook format that can contain Python and Markdown cells. Also known as Jupyter Notebook.",
    url: "https://en.wikipedia.org/wiki/Project_Jupyter#Jupyter_Notebook",
  },
  csljson: {
    title: "CSL-JSON",
    blurb:
      "Citation format used for bibliographies. Also knwon as Citation Style Language JSON.",
    url: "https://citationstyles.org/",
  },
  ris: {
    title: "RIS",
    blurb:
      "Citation format used for bibliographies. Developed by Research Information Systems.",
    url: "https://en.wikipedia.org/wiki/RIS_(file_format)",
  },
  endnote: {
    title: "EndNote",
    blurb: "Citation format used for bibliographies.",
    url: "https://en.wikipedia.org/wiki/EndNote",
  },
  txt: {
    title: "TXT",
    blurb: "Plain text format. It's just text lol.",
    url: "https://en.wikipedia.org/wiki/Text_file",
  },

  // 3d models
  blend: {
    title: "BLEND",
    blurb:
      "3D format used by Blender. Can store multiple scenes, objects, materials, textures, sounds, images, etc.",
    url: "https://en.wikipedia.org/wiki/Blender_(software)#File_format",
  },
  glb: {
    title: "glB",
    blurb:
      "3D format used to store scenes and objects. The compressed version of glTF.",
    url: "https://en.wikipedia.org/wiki/GlTF",
  },
  gltf: {
    title: "glTF",
    blurb:
      "3D format used to store scenes and objects. Also known as Graphics Library Transmission Format",
    url: "https://en.wikipedia.org/wiki/GlTF",
  },
  obj: {
    title: "OBJ",
    blurb:
      "3D format used for storing 3D geometry. Also known as Wavefront OBJ.",
    url: "https://en.wikipedia.org/wiki/Wavefront_.obj_file",
  },
  fbx: {
    title: "FBX",
    blurb: "3D format used for storing scenes. Also known as Filmbox.",
    url: "https://en.wikipedia.org/wiki/FBX",
  },
  dae: {
    title: "DAE",
    blurb: "3D format used to store assets. Also known as COLLADA.",
    url: "https://en.wikipedia.org/wiki/COLLADA",
  },
  stl: {
    title: "STL",
    blurb: "3D format used for storing 3D meshes. ",
    url: "https://en.wikipedia.org/wiki/STL_(file_format)",
  },
  ply: {
    title: "PLY",
    blurb:
      "3D format used to store data from 3D scanners. Also known as Polygon File Format.",
    url: "https://en.wikipedia.org/wiki/PLY_(file_format)",
  },
  "3ds": {
    title: "3DS",
    blurb: "3D format used to store assets. Used by Audodesk 3ds Max.",
    url: "https://en.wikipedia.org/wiki/.3ds",
  },
  "3mf": {
    title: "3MF",
    blurb:
      "3D format used for printing 3D models. Also known as 3D Manufacturing Format.",
    url: "https://en.wikipedia.org/wiki/3D_Manufacturing_Format",
  },
  off: {
    title: "OFF",
    blurb:
      "3D format used to store geometry. Also known as Object File Format.",
    url: "https://en.wikipedia.org/wiki/OFF_(file_format)",
  },
  x: {
    title: "X",
    blurb: "3D format used by DirectX.",
    url: "https://en.wikipedia.org/wiki/DirectX",
  },
  ase: {
    title: "ASE",
    blurb:
      "3D format used to store meshes. Also known as ASCII Scene Explorer.",
    url: "https://beyondunrealwiki.github.io/pages/ase-file-format.html",
  },
  lwo: {
    title: "LWO",
    blurb: "3D format used by LightWave 3D.",
    url: "https://en.wikipedia.org/wiki/LightWave_3D",
  },
  dxf: {
    title: "DXF",
    blurb:
      "3D format used for CAD, developed by Autodesk. Also known as Drawing Exchange Format.",
    url: "https://en.wikipedia.org/wiki/AutoCAD_DXF",
  },
  ac: {
    title: "AC",
    blurb: "3D format used by AC3D.",
    url: "https://en.wikipedia.org/wiki/AC3D",
  },
  ms3d: {
    title: "MS3D",
    blurb:
      "3D format used for modeling in Half-Life, Counter-Strike, and The Sims.",
    url: "http://milkshape3d.com/ms3d/",
  },

  // Settings
  qualityPresetIdx: {
    title: "Conversion Quality",
    blurb:
      "The quality used to convert the file. Lower quality decreases file size, but at the cost of quality.",
  },
  filenameTemplate: {
    title: "Filename Template",
    blurb: `The template used to generate the output filename.
    <ul>
      <li>{raw} = the original filename.</li>
      <li>{base} = the part of the original filename before the dot.</li>
      <li>{inExt} = extension of the input file.</li>
      <li>{outExt} = the extension of the output format.</li>
      </ul>
      `,
  },
};
