<script lang="ts">
	import BoatSVG from "$lib/assets/boat.svg?raw";
	import type { Boat } from "$lib/boat";
	import Svg from "./Svg.svelte";

	interface Props {
		me: Boat;
	}

	let { me }: Props = $props();
</script>

<Svg
	left={me.pos.x}
	top={me.pos.y}
	svgHTML={BoatSVG}
	width={96}
	hide={me.hide}
	handlers={{
		click: () => {
			me.randomizePos();
		},
	}}
	layer={10}
/>
