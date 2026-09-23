<script lang="ts">
	import "$lib/assets/reset.css";
	import "$lib/assets/global.css";

	let { children } = $props();
</script>

<svelte:head></svelte:head>

{@render children()}
