import { Viewport } from "./utils.svelte";

export class Banner {
	text: string = $state("");

	constructor(public viewport: Viewport) {}

	get pos() {
		return this.viewport.center;
	}
}
