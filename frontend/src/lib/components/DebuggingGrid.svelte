<!--
this component is so that I can see the pathfinding grid overlaid on the map,
which is helpful when deciding where to place islands
-->

<script lang="ts">
import { GRID_CELL_HEIGHT, GRID_CELL_WIDTH } from "#lib/route.js";
import { world } from "#lib/world.svelte.js";
</script>

<div
  id="devOnlyPathfindingGrid"
  style:background-size="{GRID_CELL_WIDTH*world.viewport.zoom}px {GRID_CELL_HEIGHT*world.viewport.zoom}px"
  style:background-position="{world.viewport.offset.x * world.viewport.zoom}px {world.viewport.offset.y * world.viewport.zoom}px"
  style:width="{100/world.viewport.zoom}vw"
  style:height="{100/world.viewport.zoom}vh"
  style:--line-thickness="{2*world.viewport.zoom}px"
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

	--line-thickness: 2px;

	background-image:
		// grid lines
		linear-gradient(to right, red var(--line-thickness), transparent var(--line-thickness)),
		linear-gradient(to bottom, red var(--line-thickness), transparent var(--line-thickness)),
		// cell centers
		radial-gradient(circle at 50% 50%, blue var(--line-thickness), transparent var(--line-thickness));
}
</style>
