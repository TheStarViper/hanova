<script lang="ts">
	import BoatSVG from "$lib/assets/boat.svg?raw";
	import type { Boat } from "$lib/controller.svelte";
	import { Spring } from "svelte/motion";
	import Svg from "./Svg.svelte";

	interface Props {
		me: Boat;
	}

	let { me }: Props = $props();

	let pos = new Spring({ x: 0, y: 0 }, { stiffness: 0.08, damping: 0.6 });

	$effect(() => {
		pos.set({ x: me.pos.x, y: me.pos.y }, { instant: me.hide });
	});
</script>

<Svg
	left={pos.current.x}
	top={pos.current.y}
	svgHTML={BoatSVG}
	width={96}
	hide={me.hide}
	handlers={{
		click: () => {
			me.randomizePos();
		},
	}}
/>
