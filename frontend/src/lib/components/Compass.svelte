<script lang="ts">
	import CompassSvg from "#lib/assets/compass.svg?raw";
	import type { Viewport } from "#lib/utils.svelte.js";
	import Sprite from "./Sprite.svelte";

	interface Props {
		viewport: Viewport;
		href: string;
	}

	let { viewport, href }: Props = $props();

	let hovered = $state(false);
	let borderColor = $derived(hovered ? "var(--accent)" : undefined);
</script>

<a {href}>
	<Sprite
		top={viewport.max.y - 180}
		left={viewport.max.x - 160}
		width={202}
		layer={5}
		{borderColor}
		handlers={{
			hover: () => (hovered = true),
			unhover: () => (hovered = false),
		}}>{@html CompassSvg}</Sprite
	>
</a>
