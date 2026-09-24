<script lang="ts">
	import BoatSVG from "$lib/assets/boat.svg?raw";
	import type { Boat } from "$lib/boat";
	import Sprite from "./Sprite.svelte";

	interface Props {
		me: Boat;
	}

	let { me }: Props = $props();
</script>

<Sprite
	left={me.pos.x}
	top={me.pos.y}
	width={96}
	label="Boat"
	hide={me.hide}
	handlers={{
		click: () => {
			me.randomizePos();
		},
	}}
	layer={10}>{@html BoatSVG}</Sprite
>
