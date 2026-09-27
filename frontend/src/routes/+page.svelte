<script lang="ts">
	import Map from "$lib/components/Map.svelte";
	import { onMount } from "svelte";
	import { CppManager } from "$lib/cppManager";

	const cppManager = new CppManager();

	onMount(() => {
		cppManager.init();
	});
</script>

<Map {cppManager} />
