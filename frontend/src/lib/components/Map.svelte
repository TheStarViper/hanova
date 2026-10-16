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

	let viewport = $derived(world.viewport);

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

<Boat me={world.boat} {viewport} />

{#each world.islands as island}
	<Island me={island} {viewport} {debugging} allowHover={world.banner.hide} />
{/each}
{#if debugging}
	<DebuggingGrid {viewport} />
{/if}

<Treasure me={world.treasure} {viewport} />
<Banner
	me={world.banner}
	handleUpload={(files: FileList | undefined | null) =>
		world.fileManager.handleUpload(files)}
/>
<Compass viewport={world.viewport} href="./about" />
<Bezier curves={world.curves} {viewport} />

<style lang="scss">
	h1 {
		position: absolute;
		user-select: none;
		z-index: 20;
		right: 0.6rem;
		top: 0.3rem;
	}
</style>
