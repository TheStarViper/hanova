<script lang="ts">
	// component imports
	import Boat from "./Boat.svelte";
	import Island from "./Island.svelte";
	import Treasure from "./Treasure.svelte";
	import Banner from "./Banner.svelte";
	import Compass from "./Compass.svelte";

	// misc imports
	import { World } from "$lib/world.svelte";
	import type { CppManager } from "$lib/cppManager";
	import { onMount } from "svelte";

	interface Props {
		cppManager: CppManager;
	}

	let { cppManager }: Props = $props();

	// svelte-ignore state_referenced_locally
	const world = new World(cppManager);

	onMount(() => {
		world.init();
	});
</script>

<h1>Hanova</h1>

<Boat me={world.boat} />

{#each world.islands as island}
	<Island me={island} />
{/each}

<Treasure me={world.treasure} />
<Banner me={world.banner} />
<Compass viewport={world.viewport} href="./about" />

<style lang="scss">
	h1 {
		position: absolute;
		user-select: none;
		z-index: 20;
		right: 0.6rem;
		top: 0.3rem;
	}
</style>
