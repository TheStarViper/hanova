<script lang="ts">
	import "#lib/assets/reset.css";
	import "#lib/assets/global.css";
	import screenshot from "#lib/assets/screenshot2.png";
	import favicon from "#lib/assets/boat.svg";

	let { children } = $props();

	const title = "Hanova";
	const desc = "A file conversion website with a nautical twist";
	const url = "https://thestarviper.github.io/hanova/";
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Eagle+Lake&display=swap"
		rel="stylesheet"
	/>

	<title>{title}</title>
	<meta name="description" content={desc} />
	<link rel="canonical" href={url} />
	<link rel="icon" href={favicon} />

	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content={title} />
	<meta property="og:image" content={screenshot} />
</svelte:head>

<main id="main">
	{@render children()}
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
	}
</style>
