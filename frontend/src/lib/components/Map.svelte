<script lang="ts">
// component imports
import Banner from "./Banner.svelte";
import Bezier from "./Bezier.svelte";
import Boat from "./Boat.svelte";
import DebuggingGrid from "./DebuggingGrid.svelte";
import Island from "./Island.svelte";
import Title from "./Title.svelte";
import Tooltip from "./Tooltip.svelte";
import Treasure from "./Treasure.svelte";

// misc imports
import { Pos } from "#lib/utils.svelte.js";
import { world } from "#lib/world.svelte.js";

let worldOffset = $derived(
  Pos.mul(world.viewport.center, 1 - world.viewport.zoom),
);
</script>

<Title />

<div
  class="world-layer"
  style:transform="translate({worldOffset.x}px, {worldOffset.y}px) scale({world.viewport.zoom})"
>
  <Boat />
  <Bezier />
  <Treasure />

  {#each world.islands as island}
    <Island me={island} />
  {/each}
</div>

<Banner />
<Tooltip />
{#if world.debugging}<DebuggingGrid />{/if}

<style lang="scss">
.world-layer {
	position: absolute;
	inset: 0;
	transform-origin: 0 0;
	pointer-events: none;
}
</style>
