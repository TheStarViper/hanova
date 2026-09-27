<script lang="ts">
	import BannerSvg from "$lib/assets/banner.svg?raw";
	import Sprite from "./Sprite.svelte";
	import { Banner } from "$lib/banner.svelte";

	// cuz the center of the main section (where the text ought to be visually
	// centered) is not the same as the center of the svg
	const MAIN_BANNER_OFFSET_PX = 14;

	interface Props {
		me: Banner;
	}

	let { me }: Props = $props();
</script>

<Sprite top={me.pos.y} left={me.pos.x} width={847} layer={100} hide={me.hide}
	>{@html BannerSvg}</Sprite
>
<div
	id="banner-text-container"
	class={me.hide ? "hide" : ""}
	style:top="{me.pos.y - MAIN_BANNER_OFFSET_PX}px"
	style:left="{me.pos.x}px"
>
	<h2>{me.text}</h2>
</div>

<style lang="scss">
	#banner-text-container {
		position: absolute;
		transform: translate(-50%, -50%);
		z-index: 101;

		&.hide {
			opacity: 0;
			transition: opacity 0.2s ease;

			h2 {
				transform: translateY(-1rem);
				transition: transform 0.2s ease;
			}
		}

		h2 {
			user-select: none;
			font-size: 2.2rem;
			text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
		}
	}
</style>
