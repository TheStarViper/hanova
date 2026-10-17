<script lang="ts">
// component imports
import Banner from "./Banner.svelte";
import Boat from "./Boat.svelte";
import Compass from "./Compass.svelte";
import Island from "./Island.svelte";
import Title from "./Title.svelte";
import Treasure from "./Treasure.svelte";

// misc imports
import type { CppManager } from "#lib/cppManager.js";
import { Pos } from "#lib/utils.svelte.js";
import { World } from "#lib/world.svelte.js";
import { onMount } from "svelte";
import Bezier from "./Bezier.svelte";
import DebuggingGrid from "./DebuggingGrid.svelte";

// for various dev-only debugging visuals
const debugging = false;

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
      {debugging}
      allowHover={world.banner.hide}
    />
  {/each}
  <Treasure me={world.treasure} {viewport} />
</div>

{#if debugging}<DebuggingGrid {viewport} />{/if}
<Banner
  me={world.banner}
  handleUpload={(files: FileList | undefined | null) => world.fileManager.handleUpload(files)}
/>
<Compass viewport={world.viewport} href="./about" />

<style lang="scss">
.world-layer {
	position: absolute;
	inset: 0;
	transform-origin: 0 0;
	pointer-events: none;
}
</style>
