import type { CppManager, FileFormat } from "./cppManager";

const MAX_FILENAME_CHARS = 20;
/** how many chars of a filename base to show after an ellipsis  */
const TERMINAL_TERM_CHARS = 3;
const ELLIPSIS = "...";

export class FileManager {
	file: File | null = null;
	outFormat: FileFormat | undefined;
	blob: Blob | null = null;

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
			if (event.relatedTarget === null) {
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

		if (this.file === null) {
			throw new Error("tried to convert before file was set");
		}

		const inBytes = await this.file.bytes();

		// syncronous but veeeeerrryyyyyy slowwwwwww
		// [TODO] move this to a web worker or something
		const result = this.outFormat.func(inBytes);

		console.log(result);

		const outBytes = new Uint8Array(result);

		const blob = new Blob([outBytes], { type: this.outFormat.mimeType });

		this.blob = blob;
	}

	downloadFile() {
		if (this.blob === null) {
			throw new Error("can only download if conversion has finished");
		}

		const url = URL.createObjectURL(this.blob);
		const outFilename = `${this.file?.name}.${this.outFormat?.ext}`;

		const a = document.createElement("a");
		a.href = url;
		a.download = outFilename;
		a.click();
		a.remove();

		URL.revokeObjectURL(url);
	}

	// [TODO] finish implementing this
	getTrimmedFilename(input?: string): string {
		if (input === undefined) {
			if (this.file === null) return "";
			input = this.file.name;
		}

		if (input.length <= MAX_FILENAME_CHARS) return input;

		// group 1: everything before the final dot
		// group 2: the final dot and everything after it, if it exists
		const regex = /^(.*?)(\.[^.]*)?$/;

		const match = input.match(regex);

		if (match === null) return "";

		const base: string = match[0];
		const ext: string | undefined = match[1]; // includes dot btw

		const initialTermsChars =
			MAX_FILENAME_CHARS - ext.length - TERMINAL_TERM_CHARS - ELLIPSIS.length;

		const initialTerms = base.substring(0, initialTermsChars - 1);
		const terminalTerms = base.substring(
			base.length - 1 - TERMINAL_TERM_CHARS,
			base.length - 1,
		);

		// temporary bypass
		return input;

		return initialTerms + ELLIPSIS + terminalTerms + ext;
	}
}
