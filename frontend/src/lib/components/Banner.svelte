<script lang="ts">
	import BannerSvg from "#lib/assets/banner.svg?raw";
	import Sprite from "./Sprite.svelte";
	import { Banner } from "#lib/banner.svelte.js";
	import { slide } from "svelte/transition";
	import { onMount } from "svelte";

	// cuz the center of the main section (where the text ought to be visually
	// centered) is not the same as the center of the svg
	const MAIN_BANNER_OFFSET_PX = 14;

	interface Props {
		me: Banner;
		handleUpload: (files: FileList | undefined | null) => void;
	}

	let { me, handleUpload }: Props = $props();

	let hide = $derived(me.text === "");

	let inputEl: HTMLInputElement;
	let textEl: HTMLDivElement;

	onMount(() => {
		textEl.addEventListener("click", () => inputEl.click());
		inputEl.addEventListener("change", () => handleUpload(inputEl.files));
	});
</script>

<input id="fileInput" type="file" bind:this={inputEl} style="display: none;" />

<Sprite
	top={me.pos.y}
	left={me.pos.x}
	width={847}
	layer={100}
	{hide}
	shadowOpacity={0.4}>{@html BannerSvg}</Sprite
>
<div
	id="banner-text-container"
	bind:this={textEl}
	class={hide ? "hide" : ""}
	style:top="{me.pos.y - MAIN_BANNER_OFFSET_PX}px"
	style:left="{me.pos.x}px"
>
	{#key me.text}
		<h2 transition:slide>{me.text}</h2>
	{/key}
</div>
<div id="banner-overlay" class={!hide ? "show" : ""}></div>

<style lang="scss">
	#banner-text-container {
		position: absolute;
		transform: translate(-50%, -50%);
		z-index: 101;

		transition: opacity 0.2s ease;

		cursor: pointer;

		&.hide {
			opacity: 0;
		}

		h2 {
			user-select: none;
			text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

			// approximate size of the main section of the banner
			max-width: 700px;
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
		opacity: 0;
		transition: opacity 0.2s ease;

		pointer-events: none;

		&.show {
			opacity: 0.4;
		}
	}

	#fileInput {
		display: none;
	}
</style>
