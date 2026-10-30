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
import { type Format } from "#lib/backend.js";
import { Pos } from "#lib/utils.svelte.js";
import { World } from "#lib/world.svelte.js";

interface Props {
  world: World;
}

let { world }: Props = $props();

let worldOffset = $derived(
  Pos.mul(world.viewport.center, 1 - world.viewport.zoom),
);
</script>

<Title cornered={world.titleCornered} viewport={world.viewport} />

<div
  class="world-layer"
  style:transform="translate({worldOffset.x}px, {worldOffset.y}px) scale({world.viewport.zoom})"
>
  <Boat me={world.boat} viewport={world.viewport} />

  <Bezier curves={world.curves} viewport={world.viewport} />

  {#each world.islands as island}
    <Island
      me={island}
      viewport={world.viewport}
      debugging={world.debugging}
      allowHover={world.banner.hide}
      setTooltip={(format: Format | null) => {
        world.tooltip.target = format;
      }}
    />
  {/each}
  <Treasure me={world.treasure} viewport={world.viewport} />
</div>

{#if world.debugging}<DebuggingGrid viewport={world.viewport} />{/if}
<Banner
  me={world.banner}
  viewport={world.viewport}
  handleUpload={(files: FileList | undefined | null) => world.fileManager.handleUpload(files)}
/>
<Tooltip me={world.tooltip} viewport={world.viewport} />

<style lang="scss">
.world-layer {
	position: absolute;
	inset: 0;
	transform-origin: 0 0;
	pointer-events: none;
}
</style>
