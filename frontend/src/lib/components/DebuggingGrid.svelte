<!--
this component is so that I can see the pathfinding grid overlaid on the map,
which is helpful when deciding where to place islands
-->

<script lang="ts">
import { GRID_CELL_HEIGHT, GRID_CELL_WIDTH } from "#lib/route.js";
import type { Viewport } from "#lib/viewport.svelte.js";

interface Props {
  viewport: Viewport;
}

let { viewport }: Props = $props();
</script>

<div
  id="devOnlyPathfindingGrid"
  style:background-size="{GRID_CELL_WIDTH}px {GRID_CELL_HEIGHT}px"
  style:background-position="{viewport.offset.x}px {viewport.offset.y}px"
>
</div>

<style lang="scss">
#devOnlyPathfindingGrid {
	position: absolute;
	top: 0;
	left: 0;
	pointer-events: none;

	width: 100vw;
	height: 100vh;

	background-image:
		// grid lines
		linear-gradient(to right, red 2px, transparent 2px),
		linear-gradient(to bottom, red 2px, transparent 2px),
		// cell centers
		radial-gradient(circle at 50% 50%, blue 2px, transparent 2px);
}
</style>
