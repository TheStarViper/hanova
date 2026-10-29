<script lang="ts">
import About from "#lib/components/About.svelte";
import Compass from "#lib/components/Compass.svelte";
import Map from "#lib/components/Map.svelte";
import { CppManager } from "#lib/cppManager.js";
import { Viewport } from "#lib/viewport.svelte.js";
import { onMount } from "svelte";

const viewport = new Viewport();
const cppManager = new CppManager();

let page: "map" | "about" = $state("map");

function togglePage(): void {
  page = page === "map" ? "about" : "map";
}

onMount(() => {
  viewport.init();
  cppManager.init();
});
</script>

<Compass
  {viewport}
  {togglePage}
  label={page === "map" ? "To About & Settings" : "To Islands"}
/>

{#if page === "map"}
  <Map {cppManager} {viewport} />
{:else if page === "about"}
  <About />
{/if}
