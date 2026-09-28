<script lang="ts">
	import CompassSvg from "$lib/assets/compass.svg?raw";
	import type { Viewport } from "$lib/utils.svelte";
	import Sprite from "./Sprite.svelte";

	interface Props {
		viewport: Viewport;
	}

	let { viewport }: Props = $props();

	let hovered = $state(false);
	let borderColor = $derived(hovered ? "#3273dc" : undefined);
</script>

<a href="./about">
	<Sprite
		top={viewport.max.y - 180}
		left={120}
		width={202}
		layer={5}
		{borderColor}
		handlers={{
			hover: () => (hovered = true),
			unhover: () => (hovered = false),
		}}>{@html CompassSvg}</Sprite
	>
</a>
