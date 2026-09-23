<script lang="ts">
	import { Controller } from "$lib/controller.svelte";
	import { onMount } from "svelte";

	const controller = new Controller();

	let containerEl: HTMLElement;

	onMount(() => {
		controller.container.update(containerEl);
	});
</script>

<main bind:this={containerEl}>
	<h1>Hanova</h1>
	<p>left: {controller.container.min.x}</p>
	<p>right: {controller.container.min.y}</p>
	<p>top: {controller.container.max.x}</p>
	<p>bottom: {controller.container.max.y}</p>
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
			text-align: right;
			margin-top: 0.3rem;
			margin-right: 0.6rem;
		}
	}
</style>
