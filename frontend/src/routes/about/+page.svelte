<script lang="ts">
	import Compass from "#lib/components/Compass.svelte";
	import { Viewport } from "#lib/utils.svelte.js";
	import { onMount } from "svelte";

	let viewport = new Viewport();

	onMount(() => viewport.init());
</script>

<article>
	<h1>About Hanova</h1>

	<blockquote>
		Welcome to Hanova, a (fictional) archipelago off the coast of
		Madagascar!
	</blockquote>

	<p>
		"Hanova" is the Malagasy word for "convert", and that's exactly what
		these islands do. Drag-and-drop your file into the water, and sail it to
		the island corresponding to your desired file format. Dig at the red X,
		and you'll unearth buried treasure: your converted file!
	</p>

	<h2>Supported File Formats</h2>

	<section id="formats">
		<p>Image: PNG, JPEG, BMP (more coming soon!)</p>
		<p>Audio: (coming soon!)</p>
		<p>Docs: (coming soon!)</p>
		<p>3D objects: (coming soon!)</p>
		<p>Video: (coming soon!)</p>
	</section>

	<h2>Source Code</h2>

	<p>
		Check out our repo: <a href="https://github.com/TheStarViper/hanova"
			>https://github.com/TheStarViper/hanova</a
		>
	</p>

	<footer>
		Made by <a href="https://github.com/ethmarks">Ethan</a> (Svelte
		frontend) & <wbr />
		<a href="https://github.com/TheStarViper">Andrew</a> (C++ backend)
	</footer>
</article>
<Compass {viewport} href="./" />

<style lang="scss">
	h1,
	h2 {
		text-align: center;
	}

	h2 {
		font-size: 1.2rem;
	}

	article {
		margin: 5% auto;
		color: var(--line);
		max-width: 60ch;
		padding: 1rem;
		max-height: 100%;
		overflow-y: scroll;
	}

	p {
		margin-block: 0.5rem;
	}

	section#formats p {
		text-indent: 2ch hanging;
	}

	a,
	a:visited {
		color: var(--accent);
	}

	blockquote {
		width: fit-content;
		margin: 1rem auto;
		background: var(--bg-accent);
		padding: 0.6rem 1rem;
		border-radius: 0.4rem;
		outline: 4px double var(--line);
	}

	footer {
		margin-top: 3rem;
		text-align: center;
	}
</style>
