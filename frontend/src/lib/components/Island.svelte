<script lang="ts">
	import IslandSVG from "$lib/assets/island.svg?raw";
	import type { Island } from "$lib/island";
	import Sprite from "./Sprite.svelte";

	interface Props {
		me: Island;
	}

	let { me }: Props = $props();
</script>

<Sprite left={me.pos.x} top={me.pos.y} width={200}>{@html IslandSVG}</Sprite>
