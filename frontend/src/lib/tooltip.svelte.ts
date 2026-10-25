import type { Format } from "./fileManager";

interface TooltipDatum {
  title: string;
  blurb: string;
}

export const TOOLTIP_DATA: Record<Format, TooltipDatum> = {
  png: {
    title: "PNG",
    blurb:
      "Extremely popular lossless image format. Supports transparency. Near-universal compatibility, but fairly large file sizes.",
  },
  jpg: {
    title: "JPEG",
    blurb:
      "The most common image format in the world. Lossy compression with visible artifacting, but fairly small file sizes.",
  },
  webp: {
    title: "WebP",
    blurb:
      "The best image format. Even higher-quality than PNG, even smaller file sizes than JPEG, supports both lossy and lossless compression, and supports animation. Decent compatibility.",
  },
  bmp: {
    title: "BMP",
    blurb:
      "Very simple image format. Usually just raw, uncompressed pixel data plus some metadata.",
  },
  avif: {
    title: "AVIF",
    blurb:
      "Extremely high compression-ratio image format, but slow encoding and decoding",
  },
  jxl: {
    title: "JPEG XL",
    blurb:
      "Image format with good compression ratio and encoding/decoding speed but very limited compatibility.",
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
  },
  gif: {
    title: "GIF",
    blurb:
      "Image format notable for supporting animation. Terrible image quality and animations have very large file sizes, but near-universal compatibility.",
  },
  exr: {
    title: "EXR",
    blurb:
      "Image format that can store many layers and channels, mainly used for motion picture and 3d rendering work.",
  },
  eps: {
    title: "EPS",
    blurb:
      "Vector image format that used to be used in Adobe and Microsoft Office.",
  },
  hdr: {
    title: "HDR",
    blurb:
      "Image format developed for light simulation software. High dynamic range.",
  },
  tga: {
    title: "TGA",
    blurb:
      "Image format mainly used for television and animation. High bit-depth and supports transparency.",
  },
  ico: {
    title: "ICO",
    blurb:
      "Image format used for icons on Windows, and for favicons on the web.",
  },
  psd: {
    title: "PSD",
    blurb:
      "Image format used by Adobe Photoshop. Supports layers, masks, transparency, and lots of other features.",
  },
  tiff: {
    title: "TIFF",
    blurb: "Image format commonly used for scanning and faxing.",
  },
  qoi: {
    title: "QOI",
    blurb:
      "Image format designed for extremely fast encoding and decoding. Very limited compatibility.",
  },
};

export class Tooltip {
  target: Format | null = $state(null);
}
