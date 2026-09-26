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

	<h2>Drag & Drop a file to start</h2>

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

		h1,
		h2 {
			position: absolute;
			user-select: none;
			z-index: 20;
			text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
		}

		h1 {
			right: 0.6rem;
			top: 0.3rem;
		}

		h2 {
			top: 50%;
			text-align: center;
			width: 100%;
		}
	}

	:global {
		body.dropped h2 {
			transform: translateY(-3rem);
			opacity: 0;
			transition:
				opacity 0.2s ease,
				transform 0.2s ease;
		}
	}
</style>
