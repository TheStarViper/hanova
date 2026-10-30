<script lang="ts">
import BannerSvg from "#lib/assets/banner.svg";
import { decodeSounds } from "#lib/sound.js";
import { world } from "#lib/world.svelte.js";
import { onMount } from "svelte";
import { slide } from "svelte/transition";
import Sprite from "./Sprite.svelte";

// cuz the center of the main section (where the text ought to be visually
// centered) is not the same as the center of the svg
const MAIN_BANNER_OFFSET_PX = 14;

let me = world.banner;

let inputEl: HTMLInputElement;
let textEl: HTMLDivElement;

const SPRITE_WIDTH = 847;

let scale: number = $derived.by(() => {
  if (world.viewport.width >= SPRITE_WIDTH) return 1;

  return world.viewport.width / SPRITE_WIDTH * 0.95;
});

onMount(() => {
  textEl.addEventListener("click", async () => {
    if (me.uploadOnClick) inputEl.click();

    // hijacking this user interaction to decode the sounds
    decodeSounds();
  });
  inputEl.addEventListener(
    "change",
    () => world.fileManager.handleUpload(inputEl.files),
  );
});
</script>

<input id="fileInput" type="file" bind:this={inputEl} style="display: none;" />

<div id="banner-container" style:scale={scale}>
  <Sprite
    top={me.pos.y / scale}
    left={me.pos.x}
    sticky
    width={SPRITE_WIDTH}
    layer={100}
    hide={me.hide}
    shadowOpacity={0.4}
  >{@html BannerSvg}</Sprite>
  <div
    id="banner-text-container"
    bind:this={textEl}
    class={me.hide ? "hide" : ""}
    style:top="{(me.pos.y / scale) - MAIN_BANNER_OFFSET_PX}px"
    style:left="{me.pos.x}px"
    style:cursor={me.uploadOnClick ? "pointer" : "default"}
  >
    {#key me.text}
      <h2 transition:slide>{me.text}</h2>
    {/key}
  </div>
</div>
<div id="banner-overlay" class={me.hide ? "hide" : ""}></div>

<style lang="scss">
#banner-container {
	z-index: 101;
}

#banner-text-container {
	position: absolute;
	transform: translate(-50%, -50%);
	z-index: 101;

	transition: opacity 0.2s ease;

	// approximate size of the main section of the banner
	max-width: 700px;
	width: 100%;

	&.hide {
		opacity: 0;
	}

	h2 {
		user-select: none;
		color: var(--ink);
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

		text-align: center;

		transition: transform 0.2s ease;
	}
}

#banner-overlay {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 99;

	background: black;
	opacity: 0.4;
	transition: opacity 0.2s ease;

	pointer-events: none;

	&.hide {
		opacity: 0;
	}
}

#fileInput {
	display: none;
}
</style>
