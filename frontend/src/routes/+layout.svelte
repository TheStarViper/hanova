<script lang="ts">
	import "$lib/assets/reset.css";
	import "$lib/assets/global.css";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Eagle+Lake&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}
