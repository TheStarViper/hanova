import mime from "mime";
import { EXT_TO_FORMAT, type Format } from "./backend";
import { decodeSounds } from "./sound";
import { world } from "./world.svelte";

const MAX_FILENAME_CHARS = 20;
const ELLIPSIS = "...";

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
    a.download = this.outFilename;
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 0);

    return true;
  }

  #parseFilename(): { base: string; ext: string | undefined } {
    if (this.file === undefined) {
      throw new Error("can only parse filename if file is defined");
    }
    const input = this.file.name;

    // group 1: everything before the final dot
    // group 2: the final dot and everything after it, if it exists
    const regex = /^(.*?)(\.[^.]*)?$/;

    const match = input.match(regex);

    if (match === null) return { base: "file", ext: "" };

    // one-indexed because regex is weird like that
    const base: string = match[1];
    const ext: string | undefined = match[2]; // includes dot btw

    return { base, ext };
  }

  getInputFormatName(): Format | undefined {
    const { ext } = this.#parseFilename();
    if (ext === undefined) return undefined;

    const extWithoutDot = ext.substring(1).toLowerCase();

    return EXT_TO_FORMAT[extWithoutDot];
  }

  get displayifiedFilename(): string {
    const { base, ext } = this.#parseFilename();

    const maxBaseLength = MAX_FILENAME_CHARS - (ext?.length ?? 0);

    if (base.length <= maxBaseLength) return base + ext;

    const truncatedBase = base.substring(0, maxBaseLength - 1);

    return truncatedBase + ELLIPSIS + ext;
  }

  get outFilename(): string {
    const { base } = this.#parseFilename();

    if (this.outFormat === undefined) {
      throw new Error("can't get out filename until out format is set");
    }

    return `${base}.${this.outFormat}`;
  }
}
