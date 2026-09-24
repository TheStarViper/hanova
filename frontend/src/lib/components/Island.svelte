<script lang="ts">
	import IslandSVG from "$lib/assets/island.svg?raw";
	import type { Island } from "$lib/island";
	import Svg from "./Svg.svelte";

	interface Props {
		me: Island;
	}

	let { me }: Props = $props();
</script>

<Svg left={me.pos.x} top={me.pos.y} svgHTML={IslandSVG} width={200} />
