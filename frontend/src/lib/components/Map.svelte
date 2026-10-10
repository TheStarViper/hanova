<script lang="ts">
	// component imports
	import Boat from "./Boat.svelte";
	import Island from "./Island.svelte";
	import Treasure from "./Treasure.svelte";
	import Banner from "./Banner.svelte";
	import Compass from "./Compass.svelte";

	// misc imports
	import { World } from "#lib/world.svelte.js";
	import type { CppManager } from "#lib/cppManager.js";
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

	let viewportOffset = $derived(world.viewport.offset);

	onMount(() => {
		world.init();
	});

	$effect(() => {
		document.body.style.cursor = world.viewport.canDrag
			? world.viewport.userIsDragging
				? "grabbing"
				: "grab"
			: "unset";
	});
</script>

<h1>Hanova</h1>

<Boat me={world.boat} {viewportOffset} />

{#each world.islands as island}
	<Island
		me={island}
		{viewportOffset}
		{debugging}
		allowHover={world.banner.hide}
	/>
{/each}
{#if debugging}
	<DebuggingGrid {viewportOffset} />
{/if}

<Treasure me={world.treasure} {viewportOffset} />
<Banner
	me={world.banner}
	handleUpload={(files: FileList | undefined | null) =>
		world.fileManager.handleUpload(files)}
/>
<Compass viewport={world.viewport} href="./about" />
<Bezier curves={world.curves} {viewportOffset} />

<style lang="scss">
	h1 {
		position: absolute;
		user-select: none;
		z-index: 20;
		right: 0.6rem;
		top: 0.3rem;
	}
</style>
