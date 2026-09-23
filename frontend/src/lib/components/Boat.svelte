<script lang="ts">
	import BoatSVG from "$lib/assets/boat.svg?raw";
	import type { Pos } from "$lib/controller.svelte";
	import { Spring } from "svelte/motion";
	import Svg from "./Svg.svelte";

	interface Props {
		/** center coords, relative to <main> */
		targetPos: Pos;

		/** motion damping is only enabled when visible */
		visible: boolean;
	}

	let { targetPos, visible }: Props = $props();

	let pos = new Spring({ x: 0, y: 0 }, { stiffness: 0.08, damping: 0.6 });

	$effect(() => {
		pos.set({ x: targetPos.x, y: targetPos.y }, { instant: !visible });
	});
</script>

<Svg
	left={pos.current.x}
	top={pos.current.y}
	svgHTML={BoatSVG}
	width={96}
	{visible}
/>
