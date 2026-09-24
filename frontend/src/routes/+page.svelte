<script lang="ts">
	// component imports
	import Map from "$lib/components/Map.svelte";

	// svelte internal imports
	import { onMount } from "svelte";

	// misc imports
	import { CppManager } from "$lib/cppManager";

	const cppManager = new CppManager();

	onMount(() => {
		cppManager.init();
	});
</script>

<Map />
