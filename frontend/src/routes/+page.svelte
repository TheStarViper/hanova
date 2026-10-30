<script lang="ts">
import About from "#lib/components/About.svelte";
import Compass from "#lib/components/Compass.svelte";
import Map from "#lib/components/Map.svelte";
import { world } from "#lib/world.svelte.js";
import { onMount } from "svelte";

let page: "map" | "about" = $state("map");

function togglePage(): void {
  page = page === "map" ? "about" : "map";
}

$effect(() => {
  document.body.style.cursor = world.viewport.canDrag && page === "map"
    ? world.viewport.userIsDragging
      ? "grabbing"
      : "grab"
    : "unset";
});

onMount(() => {
  world.init();
});
</script>

<Compass
  {togglePage}
  label={page === "map" ? "To About & Settings" : "To Islands"}
/>

{#if page === "map"}
  <Map />
{:else if page === "about"}
  <About />
{/if}
