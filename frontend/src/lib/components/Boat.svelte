<script lang="ts">
	import BoatSvg from "#lib/assets/boat.svg?raw";
	import type { Boat } from "#lib/boat.svelte.js";
	import type { Pos } from "#lib/utils.svelte.js";
	import Sprite from "./Sprite.svelte";

	interface Props {
		me: Boat;
		viewportOffset: Pos;
	}

	let { me, viewportOffset }: Props = $props();
</script>

<Sprite
	left={me.pos.x}
	top={me.pos.y}
	{viewportOffset}
	width={96}
	label={me.name}
	hide={me.hide}
	layer={10}
	sunk={me.sunk}
>
	{@html BoatSvg}
</Sprite>
