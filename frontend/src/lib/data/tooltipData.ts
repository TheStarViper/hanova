import type { Format } from "../backend";

export interface TooltipDatum {
  title: string;
  blurb: string;
  url: string;
}

export const TOOLTIP_DATA: Record<Format, TooltipDatum> = {
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
};
