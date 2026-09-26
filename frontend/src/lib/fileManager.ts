export class FileManager {
	public file: File | null = null;

	public init() {
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

			const files: FileList | undefined = event.dataTransfer?.files;
			if (files === undefined) return;
			if (files.length > 1) {
				console.warn(
					"Only dropping a single file is supported rn. Defaulting to first file.",
				);
			}
			this.file = files[0];
			console.log(this.file.name);
		});
	}
}
