import { Viewport } from "./utils.svelte";

export class Banner {
	text = $state("Drag & drop a file to start");
	hide = $state(false);

	constructor(public viewport: Viewport) {}

	get pos() {
		return this.viewport.center;
	}
}
