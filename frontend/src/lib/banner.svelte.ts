import { Viewport } from "./viewport.svelte";

export const INITIAL_BANNER_MESSAGE = "Drag & drop a file to start";

export class Banner {
  text: string = $state(INITIAL_BANNER_MESSAGE);

  get uploadOnClick(): boolean {
    return this.text.includes("Drag & drop");
  }

  constructor(public viewport: Viewport) {}

  get pos() {
    return this.viewport.center;
  }

  get hide() {
    return this.text === "";
  }
}
