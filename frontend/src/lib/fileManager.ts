import { type CppManager } from "./cppManager";
import type { ReturnObj } from "./cppRunner.worker";
import { decodeSounds } from "./sound";

const MAX_FILENAME_CHARS = 20;
const ELLIPSIS = "...";

export const JPEG_QUALITY = 85;
export const WEBP_QUALITY = 90;

export interface FileFormat {
	/** file extension for the file download. Does *not* include the dot */
	ext: string;

	/**
	 * {@link https://www.iana.org/assignments/media-types#image|Super useful resource for MIME types}
	 */
	mimeType: string;
}

export const FORMATS = {
	// https://en.wikipedia.org/wiki/PNG
	PNG: {
		ext: "png",
		mimeType: "image/png",
	},

	// https://en.wikipedia.org/wiki/JPEG
	JPEG: {
		ext: "jpg",
		mimeType: "image/jpeg",
	},

	// https://en.wikipedia.org/wiki/BMP_file_format
	BMP: {
		ext: "bmp",
		mimeType: "image/bmp",
	},

	// https://en.wikipedia.org/wiki/Truevision_TGA
	// Ive literally never heard of this format lol
	TGA: {
		ext: "tga",

		// apparently this mime type is unofficial and unregistered
		mimeType: "image/x-targa",
	},

	// https://en.wikipedia.org/wiki/RGBE_image_format
	HDR: {
		ext: "hdr",
		mimeType: "image/vnd.radiance",
	},

	// https://en.wikipedia.org/wiki/WebP
	// best image format!
	WebP: {
		ext: "webp",
		mimeType: "image/webp",
	},
} as const satisfies Record<string, FileFormat>;
export type FormatName = keyof typeof FORMATS;

export class FileManager {
	file: File | undefined;

	outFormatName: FormatName | undefined;
	get outFormat(): FileFormat | undefined {
		if (this.outFormatName === undefined) return undefined;
		return FORMATS[this.outFormatName];
	}

	conversionStartTime: number | null = null;

	constructor(
		public cppManager: CppManager,
		public dropHook?: () => Promise<void>,
	) {}

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

		this.dropHook?.();
	}

	async convertTo(formatName: FormatName) {
		this.outFormatName = formatName;
		if (this.outFormat === undefined) {
			throw new Error(`invalid file type ${formatName}`);
		}

		if (this.file === undefined) {
			throw new Error("tried to convert before file was set");
		}

		const inBytes = await this.file.bytes();

		this.conversionStartTime = Date.now();
		this.cppManager.startConversion({ inBytes, format: formatName });
	}

	/**
	 *
	 * @returns undefined if the conversion never finished, true if everything worked, and a string if there was an error
	 */
	downloadFile(): undefined | true | string {
		const result = this.cppManager.response;

		if (result === null) return undefined;
		if (!result.ok) return result.error;

		const outBytes = result.data;

		const blob = new Blob([outBytes], {
			type: FORMATS[this.outFormatName!].mimeType,
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

	private parseFilename(): { base: string; ext: string | undefined } {
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

	get displayifiedFilename(): string {
		const { base, ext } = this.parseFilename();

		const maxBaseLength = MAX_FILENAME_CHARS - (ext?.length ?? 0);

		if (base.length <= maxBaseLength) return base + ext;

		const truncatedBase = base.substring(0, maxBaseLength - 1);

		return truncatedBase + ELLIPSIS + ext;
	}

	get outFilename(): string {
		const { base, ext } = this.parseFilename();

		if (this.outFormat === undefined) {
			throw new Error("can't get out filename until out format is set");
		}

		return `${base}.${this.outFormat.ext}`;
	}
}
