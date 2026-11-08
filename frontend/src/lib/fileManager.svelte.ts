import mime from "mime";
import {
  EXT_TO_FORMAT,
  type Format,
  FORMAT_TO_MEDIATYPE,
  type MediaType,
} from "./backend";
import { decodeSounds } from "./sound";
import { world } from "./world.svelte";

const MAX_FILENAME_CHARS = 20;
const ELLIPSIS = "...";

const COMPATIBLE_MEDIA_TYPES: Record<MediaType, MediaType[]> = {
  image: ["image"],
  audio: ["audio"],
  video: ["video", "audio"],
  document: ["document"],
  model: ["model"],
};

export function isFormatCompatible(
  fileName: string | undefined,
  queryFormat: Format,
): boolean {
  // fallback to true if a file hasn't been dropped yet
  if (fileName === undefined) return true;
  const boatFormat: Format | undefined = world.fileManager.getInputFormatName(
    fileName,
  );
  // fallback to true if input format can't be detected
  if (boatFormat === undefined) return true;

  const boatMediaType = FORMAT_TO_MEDIATYPE[boatFormat];
  const queryMediaType = FORMAT_TO_MEDIATYPE[queryFormat];
  const compatibles = COMPATIBLE_MEDIA_TYPES[boatMediaType];

  const isCompatible = compatibles.includes(queryMediaType);
  return isCompatible;
}

export class FileManager {
  file: File | undefined;

  outFormat: Format | undefined;

  conversionStartTime: number | null = null;

  constructor() {}

  init() {
    document.addEventListener("dragover", (event: DragEvent) => {
      event.preventDefault();
      document.body.classList.add("dragover");
    });
    document.addEventListener("dragleave", (event: DragEvent) => {
      if (event.relatedTarget === undefined) {
        document.body.classList.remove("dragover");
      }
    });
    document.addEventListener("drop", (event: DragEvent) => {
      event.preventDefault();

      // hijacking interaction to decode sounds
      decodeSounds();

      this.handleUpload(event.dataTransfer?.files);
    });
  }

  handleUpload(files: FileList | undefined | null) {
    if (files === undefined || files === null || files.length === 0) return;

    document.body.classList.remove("dragover");
    document.body.classList.add("dropped");

    if (files.length > 1) {
      console.warn(
        "Only dropping a single file is supported rn. Defaulting to first file.",
      );
    }
    this.file = files[0];

    world.dropHook();
  }

  async convertTo(formatName: Format) {
    this.outFormat = formatName;
    if (this.outFormat === undefined) {
      throw new Error(`invalid file type ${formatName}`);
    }

    if (this.file === undefined) {
      throw new Error("tried to convert before file was set");
    }

    const inBytes = await this.file.bytes();

    this.conversionStartTime = Date.now();
    world.cppManager.startConversion({
      inBytes,
      outFormat: formatName,
      preset: world.qualityPreset,
    });
  }

  /**
   * @returns undefined if the conversion never finished, true if everything worked, and a string if there was an error
   */
  downloadFile(): undefined | true | string {
    const result = world.cppManager.response;

    if (result === null || this.outFormat === undefined) return undefined;
    if (!result.ok) return result.error;

    const outBytes = result.data;

    const blob = new Blob([outBytes], {
      type: mime.getType(this.outFormat) ?? undefined,
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = this.applyFilenameTemplate(world.filenameTemplate);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 0);

    return true;
  }

  #parseFilename(raw: string): {
    raw: string;
    base: string;
    inExt: string | undefined;
  } {
    // group 1: everything before the final dot
    // group 2: the final dot and everything after it, if it exists
    const regex = /^(.*?)(\.[^.]*)?$/;

    const match = raw.match(regex);

    if (match === null) return { raw, base: "file", inExt: "" };

    // one-indexed because regex is weird like that
    const base: string = match[1];
    const inExt: string | undefined = match[2]; // includes dot btw

    return { raw, base, inExt };
  }

  getInputFormatName(raw: string): Format | undefined {
    const { inExt } = this.#parseFilename(raw);
    if (inExt === undefined) return undefined;

    const extWithoutDot = inExt.substring(1).toLowerCase();

    return EXT_TO_FORMAT[extWithoutDot];
  }

  get displayifiedFilename(): string {
    if (this.file === undefined) {
      throw new Error("can't displayify filename until file has been dropped");
    }

    const { base, inExt } = this.#parseFilename(this.file.name);

    const maxBaseLength = MAX_FILENAME_CHARS - (inExt?.length ?? 0);

    if (base.length <= maxBaseLength) return base + inExt;

    const truncatedBase = base.substring(0, maxBaseLength - 1);

    return truncatedBase + ELLIPSIS + inExt;
  }

  applyFilenameTemplate(template: string): string {
    if (this.file === undefined) {
      throw new Error(
        "can't apply filename template until file has been dropped",
      );
    }

    const { raw, base, inExt } = this.#parseFilename(this.file.name);
    const outExt = this.outFormat;

    const EXT_FALLBACK = "???";

    const outFilename = template
      .replaceAll("{raw}", raw)
      .replaceAll("{base}", base)
      .replaceAll("{inExt}", inExt ?? EXT_FALLBACK)
      .replaceAll("{outExt}", outExt ?? EXT_FALLBACK);

    return outFilename;
  }
}
