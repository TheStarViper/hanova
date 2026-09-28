<script lang="ts">
	import { Island, SVG_MAPPING, WIDTH_MAPPING } from "$lib/island.svelte";
	import Sprite from "./Sprite.svelte";

	interface Props {
		me: Island;
	}

	let { me }: Props = $props();

	let hovered: boolean = $state(false);
	let shadowOpacity = $derived(hovered ? 0.8 : 0.4);
	let borderColor = $derived(hovered ? "#FFC067" : undefined);

	let svg = $derived(SVG_MAPPING[me.islandSpriteIndex]);
	let width = $derived(WIDTH_MAPPING[me.islandSpriteIndex]);
</script>

<Sprite
	left={me.pos.x}
	top={me.pos.y}
	{width}
	{shadowOpacity}
	{borderColor}
	handlers={{
		click: me.callBoat,
		hover: () => (hovered = true),
		unhover: () => (hovered = false),
	}}
	label={me.name}>{@html svg}</Sprite
>
