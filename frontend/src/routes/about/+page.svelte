<script lang="ts">
	import Compass from "$lib/components/Compass.svelte";
	import { Viewport } from "$lib/utils.svelte";
	import { onMount } from "svelte";

	let viewport = new Viewport();

	onMount(() => viewport.init());
</script>

<article>
	<h1>Hanova</h1>

	<p>
		Welcome to Hanova, a (fictional) archipelago off the coast of
		Madagascar! "Hanova" is the Malagasy word for "convert", and that's
		exactly what these islands do. Drag-and-drop your file into the water,
		and sail it to the island corresponding to your desired file format. Dig
		at the red X, and you'll unearth buried treasure: your converted file!
	</p>
</article>
<Compass {viewport} href="./" />

<style lang="scss">
	h1 {
		text-align: center;
	}

	article {
		margin: 5% auto;
		color: var(--line);
		max-width: 60ch;
	}
</style>
