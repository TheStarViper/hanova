<script lang="ts">
	// svelte internal imports
	import { onMount } from "svelte";

	// misc imports
	import { CppManager } from "$lib/cppManager";

	const cppManager = new CppManager();

	onMount(() => {
		cppManager.init();
	});
</script>

<h1>Hanova</h1>
<p>very much WIP rn</p>
