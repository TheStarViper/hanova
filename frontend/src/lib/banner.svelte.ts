import { Viewport } from "./utils.svelte";

export class Banner {
	text: string = $state("");
	uploadOnClick: boolean = true;

	constructor(public viewport: Viewport) {}

	get pos() {
		return this.viewport.center;
	}
}
