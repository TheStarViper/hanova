<script lang="ts">
	import TreasureSvg from "$lib/assets/treasure.svg?raw";
	import Sprite from "./Sprite.svelte";
	import { Treasure } from "$lib/treasure.svelte";

	interface Props {
		me: Treasure;
	}

	let { me }: Props = $props();
</script>

<Sprite top={me.pos.y} left={me.pos.x} width={30} layer={9} hide={me.hide}
	>{@html TreasureSvg}</Sprite
>
