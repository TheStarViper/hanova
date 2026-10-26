<script lang="ts">
// component imports
import Banner from "./Banner.svelte";
import Bezier from "./Bezier.svelte";
import Boat from "./Boat.svelte";
import Compass from "./Compass.svelte";
import DebuggingGrid from "./DebuggingGrid.svelte";
import Island from "./Island.svelte";
import Title from "./Title.svelte";
import Tooltip from "./Tooltip.svelte";
import Treasure from "./Treasure.svelte";

// misc imports
import { type Format } from "#lib/backend.js";
import type { CppManager } from "#lib/cppManager.js";
import { Pos } from "#lib/utils.svelte.js";
import { World } from "#lib/world.svelte.js";
import { onMount } from "svelte";

interface Props {
  cppManager: CppManager;
}

let { cppManager }: Props = $props();

// svelte-ignore state_referenced_locally
const world = new World(cppManager);

let viewport = $derived(world.viewport);

onMount(() => {
  world.init();
});

let worldOffset = $derived(Pos.mul(viewport.center, 1 - viewport.zoom));

$effect(() => {
  document.body.style.cursor = world.viewport.canDrag
    ? world.viewport.userIsDragging
      ? "grabbing"
      : "grab"
    : "unset";
});
</script>

<Title cornered={world.titleCornered} />

<div
  class="world-layer"
  style:transform="translate({worldOffset.x}px, {worldOffset.y}px) scale({viewport.zoom})"
>
  <Boat me={world.boat} {viewport} />

  <Bezier curves={world.curves} {viewport} />

  {#each world.islands as island}
    <Island
      me={island}
      {viewport}
      debugging={world.debugging}
      allowHover={world.banner.hide}
      setTooltip={(format: Format | null) => {
        world.tooltip.target = format;
      }}
    />
  {/each}
  <Treasure me={world.treasure} {viewport} />
</div>

{#if world.debugging}<DebuggingGrid {viewport} />{/if}
<Banner
  me={world.banner}
  handleUpload={(files: FileList | undefined | null) => world.fileManager.handleUpload(files)}
/>
<Compass viewport={world.viewport} href="./about" />
<Tooltip me={world.tooltip} viewport={world.viewport} />

<style lang="scss">
.world-layer {
	position: absolute;
	inset: 0;
	transform-origin: 0 0;
	pointer-events: none;
}
</style>
