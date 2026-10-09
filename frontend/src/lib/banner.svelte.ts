import { Viewport } from "./utils.svelte";

export class Banner {
	text: string = $state("");

	get uploadOnClick(): boolean {
		return this.text.includes("Drag & drop");
	}

	constructor(public viewport: Viewport) {}

	get pos() {
		return this.viewport.center;
	}
}
