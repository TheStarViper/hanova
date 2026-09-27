import type { CppManager, FileFormat } from "./cppManager";

const MAX_FILENAME_CHARS = 20;
const ELLIPSIS = "...";

export class FileManager {
	file: File | undefined;
	outFormat: FileFormat | undefined;

	ok: boolean | undefined;

	blob: Blob | undefined;
	err: string | undefined;

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
			document.body.classList.remove("dragover");
			document.body.classList.add("dropped");

			const files: FileList | undefined = event.dataTransfer?.files;
			if (files === undefined) return;
			if (files.length > 1) {
				console.warn(
					"Only dropping a single file is supported rn. Defaulting to first file.",
				);
			}
			this.file = files[0];

			this.dropHook?.();
		});
	}

	async convertTo(formatName: string) {
		this.outFormat = this.cppManager.findFormat(formatName);
		if (this.outFormat === undefined) {
			throw new Error(`invalid file type ${formatName}`);
		}

		if (this.file === undefined) {
			throw new Error("tried to convert before file was set");
		}

		const inBytes = await this.file.bytes();

		// syncronous but veeeeerrryyyyyy slowwwwwww
		// [TODO] move this to a web worker or something
		const result = this.outFormat.func(inBytes);
		this.ok = result.ok;

		if (!result.ok) {
			this.err = result.error;
			return;
		}

		const outBytes = result.data;

		const blob = new Blob([outBytes], { type: this.outFormat.mimeType });

		this.blob = blob;
	}

	downloadFile() {
		if (this.blob === undefined) {
			throw new Error("can only download if conversion has finished");
		}

		const url = URL.createObjectURL(this.blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = this.outFilename;
		a.click();
		a.remove();

		URL.revokeObjectURL(url);
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
