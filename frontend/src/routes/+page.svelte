<script lang="ts">
import Map from "#lib/components/Map.svelte";
import { CppManager } from "#lib/cppManager.js";
import { onMount } from "svelte";

const cppManager = new CppManager();

onMount(() => {
  cppManager.init();
});
</script>

<Map {cppManager} />
