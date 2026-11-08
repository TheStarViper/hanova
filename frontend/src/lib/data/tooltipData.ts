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
