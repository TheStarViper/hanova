<script lang="ts">
	import { Controller } from "$lib/controller.svelte";
	import { onMount } from "svelte";
	import Boat from "./Boat.svelte";

	const controller = new Controller();

	let containerEl: HTMLElement;

	onMount(() => {
		controller.container.update(containerEl);
	});
</script>

<main bind:this={containerEl}>
	<h1>Hanova</h1>
	<Boat />
</main>

<style lang="scss">
	main {
		width: 100%;
		height: 100%;
		position: relative;
		outline: 2px solid var(--line);

		display: flex;
		flex-direction: column;

		&::before {
			content: "";
			position: absolute;
			inset: 0;
			outline: 1px solid var(--line);
			outline-offset: 0.4rem;
			pointer-events: none;
		}

		h1 {
			position: absolute;
			right: 0.6rem;
			top: 0.3rem;
		}
	}
</style>
