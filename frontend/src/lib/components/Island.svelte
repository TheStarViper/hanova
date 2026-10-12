<script lang="ts">
	import { Island } from "#lib/island.svelte.js";
	import type { Pos } from "#lib/utils.svelte.js";
	import Sprite from "./Sprite.svelte";

	interface Props {
		me: Island;
		viewportOffset: Pos;
		debugging: boolean;
		allowHover: boolean;
	}

	let { me, viewportOffset, debugging, allowHover }: Props = $props();

	let hovered: boolean = $state(false);
	let shadowOpacity = $derived(hovered && allowHover ? 0.8 : 0.4);
	let borderColor = $derived(hovered && allowHover ? "#FFC067" : undefined);
</script>

<Sprite
	left={me.pos.x}
	top={me.pos.y}
	{viewportOffset}
	width={me.sprite.width}
	{shadowOpacity}
	{borderColor}
	borderWidth={2}
	handlers={{
		click: allowHover ? me.callBoat : undefined,
		hover: () => (hovered = true),
		unhover: () => (hovered = false),
	}}
	label={me.name}>{@html me.sprite.svg}</Sprite
>
<div
	class="radius for-debugging-purposes-only"
	style:left="{me.pos.x + viewportOffset.x}px"
	style:top="{me.pos.y + viewportOffset.y}px"
	style:--radius="{me.sprite.radius}px"
	style:display={debugging ? "flex" : "none"}
></div>

<style lang="scss">
	.radius {
		position: absolute;
		transform: translate(-50%, -50%);
		pointer-events: none;

		width: calc(var(--radius) * 2);
		height: calc(var(--radius) * 2);

		border: 5px solid red;
		border-radius: 9999px;
	}
</style>
