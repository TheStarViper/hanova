<script lang="ts">
	import { World } from "$lib/world.svelte";
	import { onMount } from "svelte";
	import Boat from "./Boat.svelte";
	import Island from "./Island.svelte";

	const world = new World();

	let viewportEl: HTMLElement;

	onMount(() => world.init(viewportEl));
</script>

<main bind:this={viewportEl}>
	<h1>Hanova</h1>
	<Boat me={world.boat} />

	{#each world.islands as island}
		<Island me={island} />
	{/each}
</main>

<style lang="scss">
	main {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;

		border: 2px solid var(--line);
		outline: 1px solid var(--line);
		outline-offset: 0.4rem;

		display: flex;
		flex-direction: column;

		h1 {
			position: absolute;
			right: 0.6rem;
			top: 0.3rem;
			user-select: none;
		}
	}
</style>
