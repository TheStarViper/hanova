<!--
this component is so that I can see the pathfinding grid overlaid on the map,
which is helpful when deciding where to place islands
-->

<script lang="ts">
	import { GRID_CELL_WIDTH, GRID_CELL_HEIGHT } from "#lib/route.js";
	import type { Pos } from "#lib/utils.svelte.js";

	interface Props {
		viewportOffset: Pos;
	}

	let { viewportOffset }: Props = $props();
</script>

<div
	id="devOnlyPathfindingGrid"
	style:background-size="{GRID_CELL_WIDTH}px {GRID_CELL_HEIGHT}px"
	style:background-position="{viewportOffset.x}px {viewportOffset.y}px"
></div>

<style lang="scss">
	#devOnlyPathfindingGrid {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;

		width: 100vw;
		height: 100vh;

		background-image:
			linear-gradient(to right, red 2px, transparent 2px),
			linear-gradient(to bottom, red 2px, transparent 2px);
	}
</style>
