<script lang="ts">
	import { Controller } from "$lib/controller.svelte";
	import { onMount } from "svelte";
	import Boat from "./Boat.svelte";
	import Island from "./Island.svelte";

	const controller = new Controller();

	let containerEl: HTMLElement;

	onMount(() => {
		controller.container.update(containerEl);

		controller.boat.move(controller.container.center);

		controller.initIslands(16, 10);
	});
</script>

<main bind:this={containerEl}>
	<h1>Hanova</h1>
	<Boat me={controller.boat} />

	{#each controller.islands as island}
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
		}
	}
</style>
