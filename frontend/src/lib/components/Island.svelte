<script lang="ts">
	import IslandSVG from "$lib/assets/island.svg?raw";
	import type { Island } from "$lib/island";
	import Sprite from "./Sprite.svelte";

	interface Props {
		me: Island;
	}

	let { me }: Props = $props();

	let hovered: boolean = $state(false);
	let shadowOpacity = $derived(hovered ? 0.8 : 0.4);
</script>

<Sprite
	left={me.pos.x}
	top={me.pos.y}
	width={200}
	{shadowOpacity}
	handlers={{
		click: me.callBoat,
		hover: () => (hovered = true),
		unhover: () => (hovered = false),
	}}>{@html IslandSVG}</Sprite
>
