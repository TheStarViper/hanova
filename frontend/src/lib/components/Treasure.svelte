<script lang="ts">
	import TreasureSvg from "#lib/assets/treasure.svg?raw";
	import Sprite from "./Sprite.svelte";
	import { Treasure } from "#lib/treasure.svelte.js";
	import type { Viewport } from "#lib/utils.svelte.js";

	interface Props {
		me: Treasure;
		viewport: Viewport;
	}

	let { me, viewport }: Props = $props();
</script>

<Sprite
	top={me.pos.y}
	left={me.pos.x}
	{viewport}
	width={30}
	layer={9}
	hide={me.hide}>{@html TreasureSvg}</Sprite
>
